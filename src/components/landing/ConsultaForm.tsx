'use client'

import { useState, useRef } from 'react'
import { submitConsultaAction } from '@/app/actions'

const KARMA = "'Karma', var(--font-karma), serif"

const C = {
  olive:  '#809671',
  sage:   '#A2B9A9',
  lav:    '#A99BC4',
  lavL:   '#D1C5E1',
  text:   '#2A2A2A',
  textMid:'#5C5C5C',
} as const

const tipoTerapiaOpciones = {
  adultos: ['Terapia individual', 'Terapia de pareja'],
  infanto_juvenil: ['Terapia individual Infanto-Juvenil', 'Terapia familiar'],
}

const nombreLabel = {
  adultos: 'Nombre completo',
  infanto_juvenil: 'Nombre completo del progenitor/tutor',
}

interface Props {
  tipo: 'adultos' | 'infanto_juvenil'
}

export default function ConsultaForm({ tipo }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')
    const result = await submitConsultaAction(new FormData(e.currentTarget))
    if (result?.error) {
      setErrorMsg(result.error)
      setState('error')
    } else {
      setState('success')
      formRef.current?.reset()
    }
  }

  if (state === 'success') {
    return (
      <div style={{
        background: '#F7F4FA', border: `1px solid ${C.lavL}`,
        borderRadius: 16, padding: '48px 40px', textAlign: 'center',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: C.olive, color: '#fff', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          ✓
        </div>
        <h3 style={{ fontFamily: KARMA, fontSize: 28, fontWeight: 400, color: C.text, margin: '0 0 12px' }}>
          ¡Recibimos tu consulta!
        </h3>
        <p style={{ fontFamily: KARMA, fontSize: 15, fontWeight: 300, color: C.textMid, lineHeight: 1.85, margin: 0 }}>
          Un profesional de nuestro equipo se va a comunicar con vos en las próximas{' '}
          <strong style={{ fontWeight: 500, color: C.olive }}>24 horas</strong>{' '}
          para coordinar una primera entrevista de orientación.
        </p>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    borderRadius: 10, border: `1.5px solid ${C.lavL}`,
    background: '#FDFCFE',
    fontFamily: KARMA, fontSize: 15, color: C.text,
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: KARMA,
    fontSize: 11, fontWeight: 500, color: C.lav,
    marginBottom: 6, letterSpacing: '0.12em', textTransform: 'uppercase',
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = C.lav)
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = C.lavL)

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input type="hidden" name="tipo_consulta" value={tipo} />

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>

        {/* Nombre */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label htmlFor={`nombre-${tipo}`} style={labelStyle}>
            {nombreLabel[tipo]} *
          </label>
          <input
            id={`nombre-${tipo}`} name="nombre" type="text" required
            placeholder="Tu nombre y apellido"
            style={inputStyle} onFocus={onFocus} onBlur={onBlur}
          />
        </div>

        {/* Edad */}
        <div>
          <label htmlFor={`edad-${tipo}`} style={labelStyle}>
            Edad{tipo === 'adultos' ? ' *' : ''}
          </label>
          <input
            id={`edad-${tipo}`} name="edad" type="text"
            required={tipo === 'adultos'}
            placeholder={tipo === 'infanto_juvenil' ? 'Edad del consultante (opcional)' : 'Tu edad'}
            style={inputStyle} onFocus={onFocus} onBlur={onBlur}
          />
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor={`telefono-${tipo}`} style={labelStyle}>
            Número de contacto *
          </label>
          <input
            id={`telefono-${tipo}`} name="telefono" type="tel" required
            placeholder="Incluir característica (ej: 376 4123456)"
            style={inputStyle} onFocus={onFocus} onBlur={onBlur}
          />
        </div>

        {/* Lugar de residencia */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label htmlFor={`lugar-${tipo}`} style={labelStyle}>
            Lugar de residencia *
          </label>
          <input
            id={`lugar-${tipo}`} name="lugar_residencia" type="text" required
            placeholder="Ciudad / barrio"
            style={inputStyle} onFocus={onFocus} onBlur={onBlur}
          />
        </div>

        {/* Tipo de terapia */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>
            {tipo === 'adultos' ? 'Buscás realizar *' : 'Buscan realizar *'}
          </label>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {tipoTerapiaOpciones[tipo].map(opcion => (
              <label key={opcion} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 18px',
                border: `1.5px solid ${C.lavL}`,
                borderRadius: 10, cursor: 'pointer',
                fontFamily: KARMA, fontSize: 14, color: C.text,
                flex: 1, minWidth: 180,
              }}>
                <input
                  type="radio" name="tipo_terapia" value={opcion} required
                  style={{ accentColor: C.olive, width: 16, height: 16, flexShrink: 0 }}
                />
                {opcion}
              </label>
            ))}
          </div>
        </div>

        {/* Motivo */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label htmlFor={`motivo-${tipo}`} style={labelStyle}>
            {tipo === 'adultos' ? 'Motivo de consulta *' : 'Describí brevemente el motivo de consulta *'}
          </label>
          <textarea
            id={`motivo-${tipo}`} name="motivo" required
            rows={4}
            placeholder="Contanos brevemente qué te trae al centro…"
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
            onFocus={onFocus} onBlur={onBlur}
          />
        </div>
      </div>

      {state === 'error' && (
        <div style={{
          marginTop: 16, padding: '12px 16px',
          background: '#FEF2F2', border: '1px solid #FECACA',
          borderRadius: 8, fontFamily: KARMA, fontSize: 14, color: '#B91C1C',
        }}>
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        style={{
          marginTop: 28, width: '100%', padding: '15px 32px',
          background: state === 'loading' ? C.sage : C.olive, color: '#fff',
          fontFamily: KARMA, fontWeight: 500, fontSize: 15,
          borderRadius: 100, border: 'none',
          cursor: state === 'loading' ? 'not-allowed' : 'pointer',
          letterSpacing: '0.04em', transition: 'background 0.15s',
        }}
      >
        {state === 'loading' ? 'Enviando…' : 'Enviar consulta'}
      </button>

      <p style={{
        marginTop: 14, fontFamily: KARMA, fontSize: 12,
        color: '#9A9A9A', textAlign: 'center', lineHeight: 1.6,
      }}>
        Tus datos son confidenciales y no se comparten con terceros.
      </p>
    </form>
  )
}
