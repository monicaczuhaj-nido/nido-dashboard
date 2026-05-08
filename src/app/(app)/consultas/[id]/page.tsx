import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import EstadoSelector from './EstadoSelector'
import ComentarioForm from './ComentarioForm'
import AsignarProfesional from './AsignarProfesional'

export const estadoConfig = {
  nueva:          { label: 'Nueva',          bg: '#EBE0F5', color: '#7B5FA0' },
  en_evaluacion:  { label: 'En evaluación',  bg: '#FEF3C7', color: '#92400E' },
  contactada:     { label: 'Contactada',     bg: '#DEEEE8', color: '#2F5F54' },
  descartada:     { label: 'Descartada',     bg: '#F3F4F6', color: '#6B7280' },
  derivado:       { label: 'Derivado',       bg: '#E0F0FF', color: '#1D4ED8' },
} as const

type Estado = keyof typeof estadoConfig

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ConsultaDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: consulta }, { data: comentarios }, { data: professionals }] = await Promise.all([
    supabase.from('consultas').select('*').eq('id', id).single(),
    supabase
      .from('consulta_comentarios')
      .select('*')
      .eq('consulta_id', id)
      .order('created_at', { ascending: true }),
    supabase
      .from('professionals')
      .select('id, specialty, profiles(full_name)')
      .order('id'),
  ])

  if (!consulta) notFound()

  const cfg = estadoConfig[consulta.estado as Estado] ?? estadoConfig.nueva

  const tipoConsultaLabel: Record<string, string> = {
    adultos:          '+18 años',
    infanto_juvenil:  'Infanto-Juvenil',
  }

  const fields = [
    { label: 'Tipo de consulta',    value: tipoConsultaLabel[consulta.tipo_consulta ?? 'adultos'] ?? consulta.tipo_consulta },
    { label: 'Tipo de terapia',     value: consulta.tipo_terapia ?? '—' },
    { label: 'Edad',                value: consulta.edad ?? '—' },
    { label: 'Teléfono',            value: consulta.telefono ?? '—' },
    { label: 'Lugar de residencia', value: consulta.lugar_residencia ?? '—' },
    { label: 'Motivo de consulta',  value: consulta.motivo },
    { label: 'Fecha de consulta',   value: formatDate(consulta.created_at) },
  ]

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <Link
        href="/consultas"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft size={14} />
        Volver a consultas
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{consulta.nombre}</h1>
          <span style={{
            display: 'inline-block', marginTop: 8,
            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
            background: cfg.bg, color: cfg.color,
          }}>
            {cfg.label}
          </span>
        </div>
        <EstadoSelector consultaId={id} currentEstado={consulta.estado as Estado} />
      </div>

      {/* Datos */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Datos de la consulta</span>
        </div>
        <div className="divide-y divide-gray-100">
          {fields.map((f) => (
            <div key={f.label} className="px-5 py-3 flex gap-4">
              <span className="text-sm text-gray-400 w-40 shrink-0">{f.label}</span>
              <span className="text-sm text-gray-900">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Derivación */}
      <AsignarProfesional
        consultaId={id}
        professionals={(professionals ?? []).map(p => ({
          id: p.id,
          specialty: p.specialty,
          profiles: Array.isArray(p.profiles) ? p.profiles[0] ?? null : p.profiles,
        }))}
        currentProfessionalId={consulta.professional_id ?? null}
        isDerived={consulta.estado === 'derivado'}
      />

      {/* Comments */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Comentarios del equipo
          {comentarios && comentarios.length > 0 && (
            <span className="ml-2 text-xs font-normal text-gray-400">({comentarios.length})</span>
          )}
        </h2>

        {(!comentarios || comentarios.length === 0) ? (
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 text-center">
            <p className="text-sm text-gray-400">Todavía no hay comentarios. Sé el primero en dejar una nota.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {comentarios.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-200 px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ background: '#8AAE9F' }}
                    >
                      {c.autor_nombre.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{c.autor_nombre}</span>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(c.created_at)}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{c.contenido}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add comment */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Agregar comentario</h3>
        <ComentarioForm consultaId={id} />
      </div>
    </div>
  )
}
