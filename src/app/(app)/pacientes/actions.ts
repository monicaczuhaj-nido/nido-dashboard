'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { patientSchema } from '@/lib/schemas'
import type { ActionResult } from '@/types'

export async function createPatient(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const raw = Object.fromEntries(
    Array.from(formData.entries()).map(([k, v]) => [k, v === '' ? undefined : v])
  )

  const result = patientSchema.safeParse(raw)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { data: professional } = await supabase
    .from('professionals')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  const { data, error } = await supabase
    .from('patients')
    .insert({ ...result.data, professional_id: professional?.id ?? null })
    .select('id')
    .single()

  if (error) return { success: false, error: 'Error al crear el paciente' }

  revalidatePath('/pacientes')
  redirect(`/pacientes/${data.id}`)
}

export async function updatePatient(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(
    Array.from(formData.entries()).map(([k, v]) => [k, v === '' ? undefined : v])
  )

  const result = patientSchema.safeParse(raw)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('patients')
    .update(result.data)
    .eq('id', id)

  if (error) return { success: false, error: 'Error al actualizar el paciente' }

  revalidatePath(`/pacientes/${id}`)
  revalidatePath('/pacientes')
  return { success: true }
}
