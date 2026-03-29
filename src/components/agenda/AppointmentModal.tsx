'use client'

import { useState, useMemo } from 'react'
import { X } from 'lucide-react'
import type { Patient, Consultorio, Booking } from '@/types'
import { createAppointment, updateAppointmentStatus } from '@/app/(app)/agenda/actions'

interface AppointmentModalProps {
  patients: Patient[]
  consultorios: Consultorio[]
  activeBookings: Pick<Booking, 'id' | 'consultorio_id' | 'start_time' | 'end_time'>[]
  initialStart?: string
  initialEnd?: string
  existingAppointment?: {
    id: string
    title: string | null
    patientName: string
    start: string
    end: string
    status: string
    notes: string | null
  } | null
  onClose: () => void
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Programado',
  completed: 'Completado',
  cancelled: 'Cancelado',
  no_show: 'No asistió',
}

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function AppointmentModal({
  patients,
  consultorios,
  activeBookings,
  initialStart = '',
  initialEnd = '',
  existingAppointment = null,
  onClose,
}: AppointmentModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [startValue, setStartValue] = useState(initialStart)
  const [endValue, setEndValue] = useState(
    initialEnd || (initialStart
      ? toLocalDatetimeString(new Date(new Date(initialStart).getTime() + 50 * 60 * 1000))
      : '')
  )

  // Consultorios disponibles para el rango seleccionado
  const availableConsultorios = useMemo(() => {
    if (!startValue || !endValue) return consultorios
    const start = new Date(startValue).toISOString()
    const end = new Date(endValue).toISOString()
    return consultorios.filter((c) =>
      !activeBookings.some(
        (b) => b.consultorio_id === c.id &&
          new Date(b.start_time) < new Date(end) &&
          new Date(b.end_time) > new Date(start)
      )
    )
  }, [startValue, endValue, consultorios, activeBookings])

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const start = formData.get('start_time') as string
    const end = formData.get('end_time') as string
    if (start) formData.set('start_time', new Date(start).toISOString())
    if (end) formData.set('end_time', new Date(end).toISOString())

    const result = await createAppointment(formData)

    if (!result.success) {
      setError(result.error)
      setLoading(false)
      return
    }
    onClose()
  }

  async function handleStatusChange(status: string) {
    if (!existingAppointment) return
    setLoading(true)
    await updateAppointmentStatus(
      existingAppointment.id,
      status as 'scheduled' | 'completed' | 'cancelled' | 'no_show'
    )
    onClose()
  }

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

  if (existingAppointment) {
    const start = new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit',
    }).format(new Date(existingAppointment.start))

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Turno</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <div className="p-6 space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Paciente</p>
              <p className="font-medium text-gray-900">{existingAppointment.patientName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Hora</p>
              <p className="text-gray-900">{start}</p>
            </div>
            {existingAppointment.notes && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Notas</p>
                <p className="text-gray-700 text-sm">{existingAppointment.notes}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Cambiar estado</p>
              <div className="grid grid-cols-2 gap-2">
                {(['scheduled', 'completed', 'cancelled', 'no_show'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={loading || existingAppointment.status === s}
                    className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Nuevo turno</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
            <select name="patient_id" required className={inputClass}>
              <option value="">Seleccionar paciente...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título (opcional)</label>
            <input name="title" type="text" className={inputClass} placeholder="Ej: Seguimiento" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
              <input
                name="start_time"
                type="datetime-local"
                required
                value={startValue}
                onChange={(e) => setStartValue(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
              <input
                name="end_time"
                type="datetime-local"
                required
                value={endValue}
                onChange={(e) => setEndValue(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consultorio
              {startValue && endValue && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  {availableConsultorios.length} disponible{availableConsultorios.length !== 1 ? 's' : ''}
                </span>
              )}
            </label>
            <select name="consultorio_id" className={inputClass}>
              <option value="">Sin consultorio asignado</option>
              {availableConsultorios.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {startValue && endValue && availableConsultorios.length === 0 && (
              <p className="text-amber-600 text-xs mt-1">Todos los consultorios están ocupados en ese horario.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
            <textarea name="notes" rows={2} className={`${inputClass} resize-none`} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors">
              {loading ? 'Guardando...' : 'Crear turno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
