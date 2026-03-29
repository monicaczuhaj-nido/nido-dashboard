'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { ActionResult } from '@/types'

const sessionSchema = z.object({
  patient_id: z.string().uuid('Paciente inválido'),
  appointment_id: z.string().uuid().optional(),
  session_date: z.string().min(1, 'La fecha es requerida'),
  notes: z.string().optional(),
  diagnosis: z.string().optional(),
  evolution: z.string().optional(),
  next_steps: z.string().optional(),
})

export async function createSession(formData: FormData): Promise<ActionResult<{ id: string }>> {
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
    appointment_id: (formData.get('appointment_id') as string) || undefined,
    session_date: formData.get('session_date') as string,
    notes: (formData.get('notes') as string) || undefined,
    diagnosis: (formData.get('diagnosis') as string) || undefined,
    evolution: (formData.get('evolution') as string) || undefined,
    next_steps: (formData.get('next_steps') as string) || undefined,
  }

  const result = sessionSchema.safeParse(raw)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert({ ...result.data, professional_id: professional.id })
    .select('id')
    .single()

  if (error) return { success: false, error: 'Error al crear la sesión' }

  const sessionId = data.id

  // Handle file uploads
  const files = formData.getAll('files') as File[]
  const validFiles = files.filter((f) => f instanceof File && f.size > 0)

  for (const file of validFiles) {
    const ext = file.name.split('.').pop()
    const path = `${result.data.patient_id}/${sessionId}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('session-files')
      .upload(path, file)

    if (!uploadError) {
      await supabase.from('session_files').insert({
        session_id: sessionId,
        file_name: file.name,
        file_path: path,
        file_type: file.type || (ext ?? null),
        file_size: file.size,
      })
    }
  }

  revalidatePath(`/pacientes/${result.data.patient_id}`)
  redirect(`/pacientes/${result.data.patient_id}`)
}
