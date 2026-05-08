'use client'

import { useRouter } from 'next/navigation'
import { DEFAULT_ESTADOS } from './estados'

const ESTADOS = [
  { value: 'nueva',         label: 'Nuevas',          bg: '#EBE0F5', color: '#7B5FA0', activeBg: '#7B5FA0' },
  { value: 'en_evaluacion', label: 'En evaluación',   bg: '#FEF3C7', color: '#92400E', activeBg: '#D97706' },
  { value: 'contactada',    label: 'Contactadas',      bg: '#DEEEE8', color: '#2F5F54', activeBg: '#2F5F54' },
  { value: 'descartada',    label: 'Descartadas',      bg: '#F3F4F6', color: '#6B7280', activeBg: '#6B7280' },
  { value: 'derivado',      label: 'Derivadas',        bg: '#E0F0FF', color: '#1D4ED8', activeBg: '#1D4ED8' },
] as const

interface Props {
  activeEstados: string[]
}

export default function ConsultasFiltros({ activeEstados }: Props) {
  const router = useRouter()

  function toggle(valor: string) {
    const next = activeEstados.includes(valor)
      ? activeEstados.filter(e => e !== valor)
      : [...activeEstados, valor]

    if (next.length === 0) return

    const isDefault =
      next.length === DEFAULT_ESTADOS.length &&
      DEFAULT_ESTADOS.every(e => next.includes(e))

    router.push(isDefault ? '/consultas' : `/consultas?estados=${next.join(',')}`)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-400 mr-1">Filtrar:</span>
      {ESTADOS.map(({ value, label, bg, color, activeBg }) => {
        const isActive = activeEstados.includes(value)
        return (
          <button
            key={value}
            onClick={() => toggle(value)}
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              border: `1.5px solid ${isActive ? activeBg : 'transparent'}`,
              background: isActive ? activeBg : bg,
              color: isActive ? '#fff' : color,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
