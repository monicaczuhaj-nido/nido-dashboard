import { z } from 'zod'

export const patientSchema = z.object({
  first_name: z.string().min(1, 'El nombre es requerido'),
  last_name: z.string().min(1, 'El apellido es requerido'),
  dni: z.string().optional(),
  email: z.union([z.string().email('Email inválido'), z.literal('')]).optional(),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  address: z.string().optional(),
  emergency_contact: z.string().optional(),
  notes: z.string().optional(),
})
