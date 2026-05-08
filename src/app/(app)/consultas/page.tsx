import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Inbox } from 'lucide-react'
import ConsultasFiltros from './ConsultasFiltros'
import { DEFAULT_ESTADOS } from './estados'
import Pagination from '@/components/ui/Pagination'

const PAGE_SIZE = 25

const estadoConfig = {
  nueva:          { label: 'Nueva',          bg: '#EBE0F5', color: '#7B5FA0' },
  en_evaluacion:  { label: 'En evaluación',  bg: '#FEF3C7', color: '#92400E' },
  contactada:     { label: 'Contactada',     bg: '#DEEEE8', color: '#2F5F54' },
  descartada:     { label: 'Descartada',     bg: '#F3F4F6', color: '#9CA3AF' },
  derivado:       { label: 'Derivado',       bg: '#E0F0FF', color: '#1D4ED8' },
} as const

type Estado = keyof typeof estadoConfig

interface PageProps {
  searchParams: Promise<{ estados?: string; page?: string }>
}

function pageHref(estados: string[], page: number) {
  const params = new URLSearchParams()
  const isDefault =
    estados.length === DEFAULT_ESTADOS.length &&
    DEFAULT_ESTADOS.every((e) => estados.includes(e))
  if (!isDefault) params.set('estados', estados.join(','))
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `/consultas?${qs}` : '/consultas'
}

export default async function ConsultasPage({ searchParams }: PageProps) {
  const { estados, page: pageParam } = await searchParams

  const activeEstados: string[] = estados
    ? estados.split(',').filter(Boolean)
    : DEFAULT_ESTADOS

  const page = Math.max(1, parseInt(pageParam ?? '1'))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  // Lightweight query — only the estado column — for the counts strip
  const { data: allEstados } = await supabase
    .from('consultas')
    .select('estado')

  // Paginated + filtered query
  const { data: consultas, count: filteredCount } = await supabase
    .from('consultas')
    .select('id, created_at, nombre, telefono, tipo_consulta, motivo, estado', { count: 'exact' })
    .in('estado', activeEstados as Estado[])
    .order('created_at', { ascending: false })
    .range(from, to)

  const total = filteredCount ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const counts = Object.fromEntries(
    Object.keys(estadoConfig).map((key) => [
      key,
      allEstados?.filter((c) => c.estado === key).length ?? 0,
    ])
  ) as Record<Estado, number>

  const grandTotal = allEstados?.length ?? 0

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Consultas entrantes</h1>
        <p className="text-gray-500 text-sm mt-1">
          {grandTotal} consulta{grandTotal !== 1 ? 's' : ''} en total
        </p>
      </div>

      {/* Stats strip — always shows all estados */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        {(Object.entries(estadoConfig) as [Estado, typeof estadoConfig[Estado]][]).map(([key, cfg]) => (
          <div key={key} className="rounded-xl border border-gray-100 bg-white p-4">
            <div className="text-2xl font-semibold text-gray-900">{counts[key]}</div>
            <div className="text-xs mt-1" style={{ color: cfg.color }}>{cfg.label}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="mb-4">
        <ConsultasFiltros activeEstados={activeEstados} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!consultas || consultas.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">
              {grandTotal === 0
                ? 'Todavía no hay consultas registradas.'
                : 'No hay consultas con los filtros seleccionados.'}
            </p>
            {grandTotal > 0 && total === 0 && (
              <p className="text-gray-300 text-xs mt-1">Probá activando más filtros.</p>
            )}
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Persona</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Motivo</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Fecha</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {consultas.map((c) => {
                  const cfg = estadoConfig[c.estado as Estado] ?? estadoConfig.nueva
                  return (
                    <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{c.nombre}</div>
                        <div className="text-xs text-gray-400">{c.telefono ?? '—'}</div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="text-gray-600 line-clamp-1 text-sm">{c.motivo}</div>
                        {c.tipo_consulta === 'infanto_juvenil' && (
                          <span style={{
                            display: 'inline-block', marginTop: 3,
                            padding: '1px 8px', borderRadius: 20,
                            fontSize: 11, fontWeight: 500,
                            background: '#EBE0F5', color: '#7B5FA0',
                          }}>
                            Infanto-Juvenil
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 500,
                          background: cfg.bg,
                          color: cfg.color,
                        }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                        {formatDate(c.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/consultas/${c.id}`}
                          className="text-sm font-medium"
                          style={{ color: '#6B9488' }}
                        >
                          Ver detalle
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={PAGE_SIZE}
              hrefPrev={pageHref(activeEstados, page - 1)}
              hrefNext={pageHref(activeEstados, page + 1)}
            />
          </>
        )}
      </div>
    </div>
  )
}
