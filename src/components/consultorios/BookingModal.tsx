'use client'

import { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import type { Professional, Consultorio } from '@/types'
import { createBooking, updateBooking, cancelBooking } from '@/app/(app)/consultorios/actions'

interface ExistingBooking {
  id: string
  consultorio_id: string
  professional_id: string
  title: string | null
  start_time: string
  end_time: string
}

interface BookingModalProps {
  consultorio: Consultorio | null
  consultorios: Consultorio[]
  professionals: (Professional & { profiles: { full_name: string } })[]
  patients: { id: string; first_name: string; last_name: string }[]
  initialStart?: string
  initialEnd?: string
  existingBooking?: ExistingBooking | null
  onClose: () => void
}

function toLocalDatetimeString(isoString: string): string {
  const d = new Date(isoString)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function BookingModal({
  consultorio,
  consultorios,
  professionals,
  patients,
  initialStart = '',
  initialEnd = '',
  existingBooking = null,
  onClose,
}: BookingModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isEdit = !!existingBooking

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const start = formData.get('start_time') as string
    const end = formData.get('end_time') as string
    if (start) formData.set('start_time', new Date(start).toISOString())
    if (end) formData.set('end_time', new Date(end).toISOString())

    const result = isEdit
      ? await updateBooking(existingBooking.id, formData)
      : await createBooking(formData)

    if (!result.success) {
      setError(result.error)
      setLoading(false)
      return
    }
    onClose()
  }

  async function handleCancel() {
    if (!existingBooking) return
    if (!confirm('¿Cancelar esta reserva?')) return
    setLoading(true)
    await cancelBooking(existingBooking.id)
    onClose()
  }

  const defaultConsultorioId = existingBooking?.consultorio_id ?? consultorio?.id ?? ''
  const defaultStart = existingBooking ? toLocalDatetimeString(existingBooking.start_time) : initialStart
  const defaultEnd = existingBooking ? toLocalDatetimeString(existingBooking.end_time) : initialEnd

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {isEdit ? 'Editar reserva' : `Reservar ${consultorio?.name}`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Consultorio</label>
            <select
              name="consultorio_id"
              required
              defaultValue={defaultConsultorioId}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Seleccionar consultorio...</option>
              {consultorios.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profesional</label>
            <select
              name="professional_id"
              required
              defaultValue={existingBooking?.professional_id ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Seleccionar profesional...</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.profiles.full_name}{p.specialty ? ` — ${p.specialty}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paciente (opcional)</label>
            <select
              name="patient_id"
              defaultValue=""
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Sin paciente asignado</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.last_name}, {p.first_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título (opcional)</label>
            <input
              name="title"
              type="text"
              defaultValue={existingBooking?.title ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Sesión individual"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
              <input
                name="start_time"
                type="datetime-local"
                required
                defaultValue={defaultStart}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
              <input
                name="end_time"
                type="datetime-local"
                required
                defaultValue={defaultEnd}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {isEdit && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 size={14} />
                Cancelar reserva
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cerrar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors"
              >
                {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Reservar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
