'use server'

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { z } from 'zod'

function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

const baseSchema = {
  nombre:           z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  telefono:         z.string().min(6, 'Ingresá un número de contacto válido'),
  edad:             z.string().optional(),
  lugar_residencia: z.string().min(2, 'Ingresá tu lugar de residencia'),
  tipo_terapia:     z.string().min(1, 'Seleccioná el tipo de terapia'),
  motivo:           z.string().min(10, 'Por favor describí brevemente el motivo de consulta'),
}

const consultaAdultosSchema = z.object({
  ...baseSchema,
  tipo_consulta: z.literal('adultos'),
  edad: z.string().min(1, 'Ingresá tu edad'),
})

const consultaInfantoSchema = z.object({
  ...baseSchema,
  tipo_consulta: z.literal('infanto_juvenil'),
  edad: z.string().optional(),
})

const consultaSchema = z.discriminatedUnion('tipo_consulta', [
  consultaAdultosSchema,
  consultaInfantoSchema,
])

export async function submitConsultaAction(formData: FormData) {
  const raw = {
    nombre:           formData.get('nombre') as string,
    telefono:         formData.get('telefono') as string,
    edad:             (formData.get('edad') as string) || undefined,
    lugar_residencia: formData.get('lugar_residencia') as string,
    tipo_terapia:     formData.get('tipo_terapia') as string,
    tipo_consulta:    formData.get('tipo_consulta') as string,
    motivo:           formData.get('motivo') as string,
  }

  const result = consultaSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('consultas').insert(result.data)

  if (error) {
    console.error(`Supabase insert consulta failed [${error.code}]: ${error.message}`)
    return { error: 'Hubo un error al enviar tu consulta. Por favor intentá de nuevo.' }
  }

  return { success: true }
}
