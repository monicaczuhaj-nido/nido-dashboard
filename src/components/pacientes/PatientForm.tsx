'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createPatient, updatePatient } from '@/app/(app)/pacientes/actions'
import { patientSchema } from '@/lib/schemas'
import type { Patient } from '@/types'

type FormValues = z.infer<typeof patientSchema>

interface PatientFormProps {
  patient?: Patient
  mode: 'create' | 'edit'
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-red-600 text-xs mt-1">{message}</p>
}

export default function PatientForm({ patient, mode }: PatientFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient
      ? {
          first_name: patient.first_name,
          last_name: patient.last_name,
          dni: patient.dni ?? '',
          email: patient.email ?? '',
          phone: patient.phone ?? '',
          date_of_birth: patient.date_of_birth ?? '',
          address: patient.address ?? '',
          emergency_contact: patient.emergency_contact ?? '',
          notes: patient.notes ?? '',
        }
      : {},
  })

  async function onSubmit(values: FormValues) {
    setServerError(null)
    setLoading(true)

    const formData = new FormData()
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== '') formData.append(k, v)
    })

    let result
    if (mode === 'create') {
      result = await createPatient(formData)
    } else {
      result = await updatePatient(patient!.id, formData)
    }

    if (result && !result.success) {
      setServerError(result.error)
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input {...register('first_name')} className={inputClass} placeholder="Ana" />
          <FieldError message={errors.first_name?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
          <input {...register('last_name')} className={inputClass} placeholder="García" />
          <FieldError message={errors.last_name?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
          <input {...register('dni')} className={inputClass} placeholder="12.345.678" />
          <FieldError message={errors.dni?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
          <input {...register('date_of_birth')} type="date" className={inputClass} />
          <FieldError message={errors.date_of_birth?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input {...register('email')} type="email" className={inputClass} placeholder="ana@email.com" />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input {...register('phone')} className={inputClass} placeholder="+54 9 11 1234-5678" />
          <FieldError message={errors.phone?.message} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <input {...register('address')} className={inputClass} placeholder="Av. Corrientes 1234, CABA" />
          <FieldError message={errors.address?.message} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Contacto de emergencia</label>
          <input {...register('emergency_contact')} className={inputClass} placeholder="María García — +54 9 11 8765-4321" />
          <FieldError message={errors.emergency_contact?.message} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas iniciales</label>
          <textarea
            {...register('notes')}
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Motivo de consulta, antecedentes relevantes..."
          />
          <FieldError message={errors.notes?.message} />
        </div>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading
          ? mode === 'create' ? 'Creando...' : 'Guardando...'
          : mode === 'create' ? 'Crear paciente' : 'Guardar cambios'}
      </button>
    </form>
  )
}
