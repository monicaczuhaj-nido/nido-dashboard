'use client'

import { useState } from 'react'
import { assignProfessionalAction } from '../actions'
import { UserCheck } from 'lucide-react'

interface Professional {
  id: string
  specialty: string | null
  profiles: { full_name: string } | null
}

interface Props {
  consultaId: string
  professionals: Professional[]
  currentProfessionalId: string | null
  isDerived: boolean
}

export default function AsignarProfesional({ consultaId, professionals, currentProfessionalId, isDerived }: Props) {
  const [selectedId, setSelectedId] = useState(currentProfessionalId ?? '')
  const [loading, setLoading] = useState(false)
  const [derived, setDerived] = useState(isDerived)
  const [error, setError] = useState('')

  const currentProfessional = professionals.find(p => p.id === (currentProfessionalId ?? selectedId))

  async function handleAssign() {
    if (!selectedId) return
    setLoading(true)
    setError('')
    const result = await assignProfessionalAction(consultaId, selectedId)
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      setDerived(true)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <UserCheck size={14} className="text-gray-400" />
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Derivación</span>
      </div>

      <div className="p-5">
        {derived && currentProfessional ? (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Derivado a</p>
              <p className="font-medium text-gray-900">{currentProfessional.profiles?.full_name}</p>
              {currentProfessional.specialty && (
                <p className="text-xs text-gray-400 mt-0.5">{currentProfessional.specialty}</p>
              )}
            </div>
            <button
              onClick={() => setDerived(false)}
              className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2"
            >
              Reasignar
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Seleccioná un profesional para derivar esta consulta. El estado cambiará a <strong>Derivado</strong> automáticamente.
            </p>
            <div className="flex gap-3 flex-wrap">
              <select
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
                className="flex-1 min-w-0 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 bg-white"
                style={{ color: selectedId ? '#111827' : '#9CA3AF' }}
              >
                <option value="">— Seleccioná un profesional —</option>
                {professionals.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.profiles?.full_name ?? 'Sin nombre'}
                    {p.specialty ? ` · ${p.specialty}` : ''}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                disabled={!selectedId || loading}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-40 transition-colors shrink-0"
                style={{ background: '#2F5F54' }}
              >
                {loading ? 'Derivando…' : 'Derivar'}
              </button>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
