import { createClient } from '@/lib/supabase/server'
import { Users, CalendarDays, FileText, DoorOpen } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: patientCount },
    { count: appointmentCount },
    { count: sessionCount },
    { data: todayAppointments },
  ] = await Promise.all([
    supabase.from('patients').select('*', { count: 'exact', head: true }),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'scheduled'),
    supabase.from('sessions').select('*', { count: 'exact', head: true }),
    supabase
      .from('appointments')
      .select('id, title, start_time, end_time, status, patients(first_name, last_name)')
      .gte('start_time', new Date().toISOString().split('T')[0] + 'T00:00:00')
      .lte('start_time', new Date().toISOString().split('T')[0] + 'T23:59:59')
      .order('start_time')
      .limit(10),
  ])

  const stats = [
    { label: 'Pacientes', value: patientCount ?? 0, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Turnos pendientes', value: appointmentCount ?? 0, icon: CalendarDays, color: 'bg-indigo-100 text-indigo-600' },
    { label: 'Sesiones registradas', value: sessionCount ?? 0, icon: FileText, color: 'bg-green-100 text-green-600' },
    { label: 'Consultorios', value: 3, icon: DoorOpen, color: 'bg-amber-100 text-amber-600' },
  ]

  const today = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1 capitalize">{today}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-medium text-gray-900 mb-4">Turnos de hoy</h2>
        {!todayAppointments || todayAppointments.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay turnos programados para hoy.</p>
        ) : (
          <div className="space-y-2">
            {todayAppointments.map((apt) => {
              const patient = apt.patients as { first_name: string; last_name: string } | null
              const start = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' }).format(new Date(apt.start_time))
              const end = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' }).format(new Date(apt.end_time))

              const statusColors: Record<string, string> = {
                scheduled: 'bg-blue-100 text-blue-700',
                completed: 'bg-green-100 text-green-700',
                cancelled: 'bg-red-100 text-red-700',
                no_show: 'bg-gray-100 text-gray-700',
              }

              const statusLabels: Record<string, string> = {
                scheduled: 'Programado',
                completed: 'Completado',
                cancelled: 'Cancelado',
                no_show: 'No asistió',
              }

              return (
                <div key={apt.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                  <div className="text-sm text-gray-500 w-24 flex-shrink-0">
                    {start} – {end}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {patient ? `${patient.first_name} ${patient.last_name}` : apt.title ?? 'Sin título'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[apt.status] ?? statusColors.scheduled}`}>
                    {statusLabels[apt.status] ?? apt.status}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
