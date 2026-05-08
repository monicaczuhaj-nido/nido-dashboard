'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

interface Patient {
  id: string
  first_name: string
  last_name: string
  dni: string | null
}

interface Props {
  /** For native FormData forms — renders a hidden input with this name */
  name?: string
  /** Controlled value (patient id) — for react-hook-form via setValue */
  value?: string
  onChange?: (id: string) => void
  placeholder?: string
  required?: boolean
  className?: string
}

export default function PatientCombobox({
  name,
  value,
  onChange,
  placeholder = 'Buscar paciente...',
  required,
  className = '',
}: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Patient[]>([])
  const [selected, setSelected] = useState<Patient | null>(null)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch whenever query changes (debounced 150 ms)
  useEffect(() => {
    const t = setTimeout(async () => {
      const res = await fetch(`/api/patients/search?q=${encodeURIComponent(query)}`)
      if (res.ok) setResults(await res.json())
    }, 150)
    return () => clearTimeout(t)
  }, [query])

  function select(p: Patient) {
    setSelected(p)
    setQuery('')
    setOpen(false)
    onChange?.(p.id)
  }

  function clear() {
    setSelected(null)
    setQuery('')
    onChange?.('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const inputBase =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div className={`relative ${className}`}>
      {name && (
        <input
          type="hidden"
          name={name}
          value={selected?.id ?? value ?? ''}
          required={required}
        />
      )}

      {selected ? (
        <div className={`${inputBase} flex items-center`}>
          <span className="flex-1 text-gray-900">
            {selected.last_name}, {selected.first_name}
          </span>
          <button
            type="button"
            onClick={clear}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={placeholder}
            className={`${inputBase} pl-8`}
          />
        </div>
      )}

      {open && !selected && results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-52 overflow-y-auto">
          {results.map((p) => (
            <li
              key={p.id}
              onMouseDown={() => select(p)}
              className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
            >
              <span className="text-gray-900">
                {p.last_name}, {p.first_name}
              </span>
              {p.dni && (
                <span className="text-gray-400 text-xs ml-3">DNI {p.dni}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
