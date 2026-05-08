'use client'

import { useState } from 'react'
import { updateEstadoAction } from '../actions'

const estados = [
  { value: 'nueva',         label: 'Nueva'          },
  { value: 'en_evaluacion', label: 'En evaluación'  },
  { value: 'contactada',    label: 'Contactada'     },
  { value: 'descartada',    label: 'Descartada'     },
  { value: 'derivado',      label: 'Derivado'       },
] as const

type Estado = typeof estados[number]['value']

interface Props {
  consultaId: string
  currentEstado: Estado
}

export default function EstadoSelector({ consultaId, currentEstado }: Props) {
  const [estado, setEstado] = useState<Estado>(currentEstado)
  const [saving, setSaving] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Estado
    setEstado(next)
    setSaving(true)
    await updateEstadoAction(consultaId, next)
    setSaving(false)
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-400">Estado:</label>
      <select
        value={estado}
        onChange={handleChange}
        disabled={saving}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
        style={{ color: '#374151' }}
      >
        {estados.map(e => (
          <option key={e.value} value={e.value}>{e.label}</option>
        ))}
      </select>
      {saving && <span className="text-xs text-gray-400">Guardando…</span>}
    </div>
  )
}
