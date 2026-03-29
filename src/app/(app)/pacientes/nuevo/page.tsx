import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import PatientForm from '@/components/pacientes/PatientForm'

export default function NuevoPacientePage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/pacientes"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeft size={14} />
          Volver a pacientes
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Nuevo paciente</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <PatientForm mode="create" />
      </div>
    </div>
  )
}
