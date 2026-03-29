import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Plus, FileText, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatDateTime } from '@/lib/utils'
import PatientForm from '@/components/pacientes/PatientForm'
import type { SessionWithFiles } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PatientDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: patient }, { data: sessions }, { data: appointments }] = await Promise.all([
    supabase.from('patients').select('*').eq('id', id).single(),
    supabase
      .from('sessions')
      .select('id, patient_id, professional_id, appointment_id, session_date, notes, diagnosis, evolution, next_steps, created_at, session_files(id, file_name, file_path, file_type, file_size, created_at), patients(first_name, last_name)')
      .eq('patient_id', id)
      .order('session_date', { ascending: false }),
    supabase
      .from('appointments')
      .select('id, title, start_time, end_time, status')
      .eq('patient_id', id)
      .order('start_time', { ascending: false })
      .limit(5),
  ])

  if (!patient) notFound()

  // eslint-disable-next-line react-hooks/purity
  const now = Date.now()
  const age = patient.date_of_birth
    ? Math.floor(
        (now - new Date(patient.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      )
    : null

  const statusLabels: Record<string, string> = {
    scheduled: 'Programado',
    completed: 'Completado',
    cancelled: 'Cancelado',
    no_show: 'No asistió',
  }

  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/pacientes"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeft size={14} />
          Volver a pacientes
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {patient.last_name}, {patient.first_name}
            </h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              {patient.dni && <span>DNI {patient.dni}</span>}
              {age !== null && <span>{age} años</span>}
              {patient.phone && <span>{patient.phone}</span>}
            </div>
          </div>
          <Link
            href={`/sesiones/nueva?patient_id=${patient.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            Nueva sesión
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Datos del paciente */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-medium text-gray-900 mb-4">Datos personales</h2>
            <dl className="space-y-3">
              {[
                { label: 'Email', value: patient.email },
                { label: 'Teléfono', value: patient.phone },
                { label: 'Nacimiento', value: patient.date_of_birth ? formatDate(patient.date_of_birth) : null },
                { label: 'Dirección', value: patient.address },
                { label: 'Contacto emergencia', value: patient.emergency_contact },
              ].map(({ label, value }) =>
                value ? (
                  <div key={label}>
                    <dt className="text-xs text-gray-400 uppercase tracking-wide">{label}</dt>
                    <dd className="text-sm text-gray-700 mt-0.5">{value}</dd>
                  </div>
                ) : null
              )}
              {patient.notes && (
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide">Notas</dt>
                  <dd className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">{patient.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Últimos turnos */}
          {appointments && appointments.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={14} className="text-gray-400" />
                <h2 className="font-medium text-gray-900 text-sm">Últimos turnos</h2>
              </div>
              <div className="space-y-2">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500">
                      {formatDate(apt.start_time)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[apt.status]}`}>
                      {statusLabels[apt.status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Historia clínica */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-gray-400" />
                <h2 className="font-medium text-gray-900">Historia clínica</h2>
              </div>
              <span className="text-xs text-gray-400">{sessions?.length ?? 0} sesión{sessions?.length !== 1 ? 'es' : ''}</span>
            </div>

            {!sessions || sessions.length === 0 ? (
              <p className="text-gray-400 text-sm">No hay sesiones registradas aún.</p>
            ) : (
              <div className="space-y-4">
                {(sessions as unknown as SessionWithFiles[]).map((session) => (
                  <div key={session.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900 text-sm">
                        {formatDate(session.session_date)}
                      </span>
                      {session.diagnosis && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-mono">
                          {session.diagnosis}
                        </span>
                      )}
                    </div>

                    {session.notes && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Notas clínicas</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{session.notes}</p>
                      </div>
                    )}

                    {session.evolution && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Evolución</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{session.evolution}</p>
                      </div>
                    )}

                    {session.next_steps && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Próximos pasos</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{session.next_steps}</p>
                      </div>
                    )}

                    {session.session_files && session.session_files.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Archivos</p>
                        <div className="flex flex-wrap gap-2">
                          {session.session_files.map((file) => (
                            <a
                              key={file.id}
                              href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/session-files/${file.file_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-600 transition-colors"
                            >
                              <FileText size={12} />
                              {file.file_name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-300 mt-3">{formatDateTime(session.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Editar datos */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-medium text-gray-900 mb-4">Editar datos del paciente</h2>
            <PatientForm patient={patient} mode="edit" />
          </div>
        </div>
      </div>
    </div>
  )
}
