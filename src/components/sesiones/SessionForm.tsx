'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createSession } from '@/app/(app)/sesiones/actions'
import FileUpload from './FileUpload'
import type { Patient, Appointment } from '@/types'

const schema = z.object({
  patient_id: z.string().uuid('Seleccioná un paciente'),
  appointment_id: z.string().optional(),
  session_date: z.string().min(1, 'La fecha es requerida'),
  notes: z.string().optional(),
  diagnosis: z.string().max(20, 'El código CIE-11 es demasiado largo').optional(),
  evolution: z.string().optional(),
  next_steps: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface SessionFormProps {
  patients: Patient[]
  defaultPatientId?: string
  appointments?: Appointment[]
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-red-600 text-xs mt-1">{message}</p>
}

export default function SessionForm({ patients, defaultPatientId, appointments = [] }: SessionFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patient_id: defaultPatientId ?? '',
      session_date: new Date().toISOString().split('T')[0],
    },
  })

  const selectedPatientId = watch('patient_id')

  const patientAppointments = appointments.filter(
    (a) => a.patient_id === selectedPatientId && a.status === 'scheduled'
  )

  async function onSubmit(values: FormValues) {
    setServerError(null)
    setLoading(true)

    const formData = new FormData()
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== '') formData.append(k, v)
    })

    // Attach files
    uploadedFiles.forEach((file) => formData.append('files', file))

    const result = await createSession(formData)

    if (result && !result.success) {
      setServerError(result.error)
      setLoading(false)
    }
    // On success, the server action redirects to the patient page
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'

  const textareaClass = `${inputClass} resize-none`

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
          {defaultPatientId ? (
            <>
              <input type="hidden" {...register('patient_id')} value={defaultPatientId} />
              <div className={`${inputClass} bg-gray-50 text-gray-700`}>
                {(() => {
                  const p = patients.find((p) => p.id === defaultPatientId)
                  return p ? `${p.last_name}, ${p.first_name}` : defaultPatientId
                })()}
              </div>
            </>
          ) : (
            <select {...register('patient_id')} className={inputClass}>
              <option value="">Seleccionar paciente...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.last_name}, {p.first_name}
                </option>
              ))}
            </select>
          )}
          <FieldError message={errors.patient_id?.message} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de sesión *</label>
          <input {...register('session_date')} type="date" className={inputClass} />
          <FieldError message={errors.session_date?.message} />
        </div>

        {patientAppointments.length > 0 && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vincular a turno (opcional)
            </label>
            <select {...register('appointment_id')} className={inputClass}>
              <option value="">Sin turno vinculado</option>
              {patientAppointments.map((a) => {
                const date = new Intl.DateTimeFormat('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(a.start_time))
                return (
                  <option key={a.id} value={a.id}>
                    {date} — {a.title ?? 'Turno'}
                  </option>
                )
              })}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diagnóstico CIE-11
            <span className="ml-1 text-xs text-gray-400 font-normal">(código o descripción)</span>
          </label>
          <input
            {...register('diagnosis')}
            className={inputClass}
            placeholder="Ej: 6B41 o Trastorno de ansiedad generalizada"
          />
          <FieldError message={errors.diagnosis?.message} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notas clínicas</label>
        <textarea
          {...register('notes')}
          rows={4}
          className={textareaClass}
          placeholder="Relato de la sesión, intervenciones realizadas, observaciones..."
        />
        <FieldError message={errors.notes?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Evolución</label>
        <textarea
          {...register('evolution')}
          rows={3}
          className={textareaClass}
          placeholder="Cómo evolucionó el paciente respecto a sesiones anteriores..."
        />
        <FieldError message={errors.evolution?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Próximos pasos</label>
        <textarea
          {...register('next_steps')}
          rows={2}
          className={textareaClass}
          placeholder="Tareas para el paciente, objetivos para la próxima sesión..."
        />
        <FieldError message={errors.next_steps?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Archivos adjuntos</label>
        <FileUpload onChange={setUploadedFiles} />
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {serverError}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Guardando sesión...' : 'Guardar sesión'}
        </button>
        <p className="text-xs text-gray-400">La sesión no podrá modificarse una vez guardada.</p>
      </div>
    </form>
  )
}
