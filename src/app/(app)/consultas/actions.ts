'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const estadoValues = ['nueva', 'en_evaluacion', 'contactada', 'descartada', 'derivado'] as const
type Estado = typeof estadoValues[number]

export async function updateEstadoAction(consultaId: string, estado: Estado) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('consultas')
    .update({ estado })
    .eq('id', consultaId)

  if (error) return { error: error.message }
  revalidatePath(`/consultas/${consultaId}`)
  revalidatePath('/consultas')
  return { success: true }
}

export async function assignProfessionalAction(consultaId: string, professionalId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('consultas')
    .update({ professional_id: professionalId, estado: 'derivado' })
    .eq('id', consultaId)

  if (error) return { error: error.message }
  revalidatePath(`/consultas/${consultaId}`)
  revalidatePath('/consultas')
  return { success: true }
}

const comentarioSchema = z.object({
  contenido: z.string().min(1, 'El comentario no puede estar vacío').max(2000),
})

export async function addComentarioAction(consultaId: string, formData: FormData) {
  const raw = { contenido: formData.get('contenido') as string }
  const result = comentarioSchema.safeParse(raw)
  if (!result.success) return { error: result.error.issues[0].message }

  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'No autenticado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { error } = await supabase.from('consulta_comentarios').insert({
    consulta_id: consultaId,
    user_id: user.id,
    contenido: result.data.contenido,
    autor_nombre: profile?.full_name ?? user.email ?? 'Profesional',
  })

  if (error) return { error: error.message }
  revalidatePath(`/consultas/${consultaId}`)
  return { success: true }
}
