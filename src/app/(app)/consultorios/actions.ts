'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { ActionResult } from '@/types'

const bookingSchema = z.object({
  consultorio_id: z.string().uuid(),
  professional_id: z.string().uuid(),
  title: z.string().optional(),
  start_time: z.string().min(1, 'La hora de inicio es requerida'),
  end_time: z.string().min(1, 'La hora de fin es requerida'),
}).refine((data) => new Date(data.end_time) > new Date(data.start_time), {
  message: 'La hora de fin debe ser posterior a la hora de inicio',
})

async function checkOverlap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  consultorios_id: string,
  start_time: string,
  end_time: string,
  excludeId?: string
): Promise<boolean> {
  let query = supabase
    .from('bookings')
    .select('id')
    .eq('consultorio_id', consultorios_id)
    .eq('status', 'active')
    .lt('start_time', end_time)
    .gt('end_time', start_time)

  if (excludeId) query = query.neq('id', excludeId)

  const { data } = await query
  return (data?.length ?? 0) > 0
}

export async function createBooking(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const raw = {
    consultorio_id: formData.get('consultorio_id') as string,
    professional_id: formData.get('professional_id') as string,
    title: formData.get('title') as string || undefined,
    start_time: formData.get('start_time') as string,
    end_time: formData.get('end_time') as string,
  }

  const result = bookingSchema.safeParse(raw)
  if (!result.success) return { success: false, error: result.error.issues[0].message }

  const supabase = await createClient()

  if (await checkOverlap(supabase, result.data.consultorio_id, result.data.start_time, result.data.end_time)) {
    return { success: false, error: 'El consultorio ya tiene una reserva en ese horario' }
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert(result.data)
    .select('id')
    .single()

  if (error) return { success: false, error: 'Error al crear la reserva' }

  revalidatePath('/consultorios')
  revalidatePath('/agenda')
  return { success: true, data: { id: data.id } }
}

export async function updateBooking(id: string, formData: FormData): Promise<ActionResult> {
  const raw = {
    consultorio_id: formData.get('consultorio_id') as string,
    professional_id: formData.get('professional_id') as string,
    title: formData.get('title') as string || undefined,
    start_time: formData.get('start_time') as string,
    end_time: formData.get('end_time') as string,
  }

  const result = bookingSchema.safeParse(raw)
  if (!result.success) return { success: false, error: result.error.issues[0].message }

  const supabase = await createClient()

  if (await checkOverlap(supabase, result.data.consultorio_id, result.data.start_time, result.data.end_time, id)) {
    return { success: false, error: 'El consultorio ya tiene una reserva en ese horario' }
  }

  const { error } = await supabase
    .from('bookings')
    .update(result.data)
    .eq('id', id)

  if (error) return { success: false, error: 'Error al actualizar la reserva' }

  revalidatePath('/consultorios')
  revalidatePath('/agenda')
  return { success: true }
}

export async function cancelBooking(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', id)

  if (error) return { success: false, error: 'Error al cancelar la reserva' }

  revalidatePath('/consultorios')
  revalidatePath('/agenda')
  return { success: true }
}
