'use client'

import { useState, useRef } from 'react'
import { addComentarioAction } from '../actions'

interface Props {
  consultaId: string
}

export default function ComentarioForm({ consultaId }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const ref = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await addComentarioAction(consultaId, formData)
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      ref.current?.reset()
    }
  }

  return (
    <form ref={ref} onSubmit={handleSubmit}>
      <textarea
        name="contenido"
        required
        rows={3}
        placeholder="Dejá una nota interna sobre esta consulta…"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 resize-none"
        style={{ fontFamily: 'inherit' }}
      />
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
      <div className="flex justify-end mt-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 transition-colors"
          style={{ background: '#2F5F54' }}
        >
          {loading ? 'Guardando…' : 'Agregar comentario'}
        </button>
      </div>
    </form>
  )
}
