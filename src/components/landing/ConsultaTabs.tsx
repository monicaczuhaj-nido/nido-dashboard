'use client'

import { useState } from 'react'
import ConsultaForm from './ConsultaForm'

const KARMA = "'Karma', var(--font-karma), serif"

const C = {
  olive:   '#809671',
  lav:     '#A99BC4',
  lavL:    '#D1C5E1',
  text:    '#2A2A2A',
  textMid: '#5C5C5C',
} as const

const tabs = [
  { id: 'adultos',         label: '+18 años',        sublabel: 'Individual o pareja'   },
  { id: 'infanto_juvenil', label: 'Infanto-Juvenil',  sublabel: 'Individual o familiar' },
] as const

type TipoConsulta = typeof tabs[number]['id']

export default function ConsultaTabs() {
  const [active, setActive] = useState<TipoConsulta>('adultos')

  return (
    <div>
      {/* Tab selector */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: 28,
        background: `${C.lavL}40`,
        border: `1px solid ${C.lavL}`,
        borderRadius: 100, padding: 5,
      }}>
        {tabs.map(tab => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              style={{
                flex: 1, padding: '10px 20px', borderRadius: 100,
                border: 'none', cursor: 'pointer',
                background: isActive ? C.olive : 'transparent',
                color: isActive ? '#fff' : C.textMid,
                transition: 'all 0.2s ease', textAlign: 'center',
              }}
            >
              <div style={{ fontFamily: KARMA, fontWeight: 500, fontSize: 14, letterSpacing: '0.01em' }}>
                {tab.label}
              </div>
              <div style={{
                fontFamily: KARMA, fontWeight: 300, fontSize: 11,
                letterSpacing: '0.08em',
                color: isActive ? 'rgba(255,255,255,0.7)' : C.lav,
                marginTop: 2,
              }}>
                {tab.sublabel}
              </div>
            </button>
          )
        })}
      </div>

      {/* Form card */}
      <div style={{
        background: '#fff', borderRadius: 22,
        padding: 'clamp(28px,4vw,52px)',
        boxShadow: `0 2px 48px ${C.lav}18`,
        border: `1px solid ${C.lavL}`,
      }}>
        <ConsultaForm key={active} tipo={active} />
      </div>
    </div>
  )
}
