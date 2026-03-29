'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { ActionResult } from '@/types'

const appointmentSchema = z.object({
  patient_id: z.string().uuid('Paciente inválido'),
  title: z.string().optional(),
  start_time: z.string().min(1, 'La hora de inicio es requerida'),
  end_time: z.string().min(1, 'La hora de fin es requerida'),
  notes: z.string().optional(),
  consultorio_id: z.string().uuid().optional(),
}).refine((data) => new Date(data.end_time) > new Date(data.start_time), {
  message: 'La hora de fin debe ser posterior a la hora de inicio',
})

export async function createAppointment(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { data: professional } = await supabase
    .from('professionals')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (!professional) return { success: false, error: 'Perfil de profesional no encontrado' }

  const raw = {
    patient_id: formData.get('patient_id') as string,
    title: formData.get('title') as string || undefined,
    start_time: formData.get('start_time') as string,
    end_time: formData.get('end_time') as string,
    notes: formData.get('notes') as string || undefined,
    consultorio_id: formData.get('consultorio_id') as string || undefined,
  }

  const result = appointmentSchema.safeParse(raw)
  if (!result.success) return { success: false, error: result.error.issues[0].message }

  const { consultorio_id, ...appointmentData } = result.data

  // Check consultorio availability if one was selected
  if (consultorio_id) {
    const { data: overlaps } = await supabase
      .from('bookings')
      .select('id')
      .eq('consultorio_id', consultorio_id)
      .eq('status', 'active')
      .lt('start_time', appointmentData.end_time)
      .gt('end_time', appointmentData.start_time)

    if (overlaps && overlaps.length > 0) {
      return { success: false, error: 'El consultorio ya tiene una reserva en ese horario' }
    }
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert({ ...appointmentData, professional_id: professional.id })
    .select('id')
    .single()

  if (error) return { success: false, error: 'Error al crear el turno' }

  // Create booking if consultorio was selected
  if (consultorio_id) {
    const patient = await supabase
      .from('patients')
      .select('first_name, last_name')
      .eq('id', appointmentData.patient_id)
      .single()

    const patientName = patient.data
      ? `${patient.data.first_name} ${patient.data.last_name}`
      : 'Turno'

    await supabase.from('bookings').insert({
      consultorio_id,
      professional_id: professional.id,
      title: patientName,
      start_time: appointmentData.start_time,
      end_time: appointmentData.end_time,
    })
  }

  revalidatePath('/agenda')
  revalidatePath('/consultorios')
  return { success: true, data: { id: data.id } }
}

export async function updateAppointmentStatus(
  id: string,
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)

  if (error) return { success: false, error: 'Error al actualizar el turno' }

  revalidatePath('/agenda')
  return { success: true }
}

export async function deleteAppointment(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', id)

  if (error) return { success: false, error: 'Error al cancelar el turno' }

  revalidatePath('/agenda')
  return { success: true }
}
