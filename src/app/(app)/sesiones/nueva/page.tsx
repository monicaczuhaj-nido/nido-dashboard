import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import SessionForm from '@/components/sesiones/SessionForm'

interface PageProps {
  searchParams: Promise<{ patient_id?: string }>
}

export default async function NuevaSesionPage({ searchParams }: PageProps) {
  const { patient_id } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: professional } = await supabase
    .from('professionals')
    .select('id')
    .eq('profile_id', user!.id)
    .single()

  // Only fetch the specific patient if pre-selected (avoids loading entire table)
  const [{ data: defaultPatient }, { data: appointments }] = await Promise.all([
    patient_id
      ? supabase
          .from('patients')
          .select('id, first_name, last_name')
          .eq('id', patient_id)
          .single()
      : Promise.resolve({ data: null }),
    supabase
      .from('appointments')
      .select('*')
      .eq('professional_id', professional?.id ?? '')
      .eq('status', 'scheduled')
      .order('start_time'),
  ])

  const backHref = patient_id ? `/pacientes/${patient_id}` : '/pacientes'

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeft size={14} />
          Volver
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Nueva sesión</h1>
        <p className="text-gray-500 text-sm mt-1">
          Las sesiones son inmutables una vez guardadas. Revisá bien antes de confirmar.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <SessionForm
          defaultPatient={defaultPatient ?? undefined}
          appointments={appointments ?? []}
        />
      </div>
    </div>
  )
}
