import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function PacientesPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('patients')
    .select('id, first_name, last_name, dni, email, phone, date_of_birth, created_at')
    .order('last_name')

  if (q && q.trim()) {
    query = query.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,dni.ilike.%${q}%,email.ilike.%${q}%`
    )
  }

  const { data: patients } = await query

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pacientes</h1>
          <p className="text-gray-500 text-sm mt-1">{patients?.length ?? 0} paciente{patients?.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/pacientes/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          Nuevo paciente
        </Link>
      </div>

      <div className="mb-4">
        <form method="GET" className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="q"
            type="search"
            defaultValue={q ?? ''}
            placeholder="Buscar por nombre, DNI o email..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!patients || patients.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-sm">
              {q ? 'No se encontraron pacientes con esa búsqueda.' : 'Aún no hay pacientes cargados.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Paciente</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">DNI</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Contacto</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Alta</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {p.last_name}, {p.first_name}
                    </div>
                    {p.date_of_birth && (
                      <div className="text-xs text-gray-400">{formatDate(p.date_of_birth)}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.dni ?? '—'}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="text-gray-500">{p.email ?? '—'}</div>
                    {p.phone && <div className="text-gray-400 text-xs">{p.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{formatDate(p.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/pacientes/${p.id}`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      Ver ficha
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
