import { createClient } from '@/lib/supabase/server'
import AgendaCalendar from '@/components/agenda/AgendaCalendar'
import type { AppointmentWithPatient, Booking, Professional, Profile } from '@/types'

export default async function AgendaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: professional } = await supabase
    .from('professionals')
    .select('id')
    .eq('profile_id', user!.id)
    .single()

  const [{ data: appointments }, { data: patients }, { data: consultorios }, { data: activeBookings }, { data: professionalBookings }, { data: professionals }] =
    await Promise.all([
      supabase
        .from('appointments')
        .select('id, professional_id, patient_id, title, start_time, end_time, status, notes, created_at, patients(id, first_name, last_name)')
        .eq('professional_id', professional?.id ?? '')
        .neq('status', 'cancelled')
        .order('start_time'),
      supabase
        .from('patients')
        .select('*')
        .order('last_name'),
      supabase
        .from('consultorios')
        .select('*')
        .order('name'),
      supabase
        .from('bookings')
        .select('id, consultorio_id, start_time, end_time')
        .eq('status', 'active'),
      supabase
        .from('bookings')
        .select('id, consultorio_id, professional_id, title, start_time, end_time, consultorios(name)')
        .eq('professional_id', professional?.id ?? '')
        .eq('status', 'active')
        .order('start_time'),
      supabase
        .from('professionals')
        .select('id, profile_id, specialty, license_number, color, created_at, profiles(full_name)')
        .order('created_at'),
    ])

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Mi agenda</h1>
        <p className="text-gray-500 text-sm mt-1">
          Hacé clic en un horario para crear un turno. Clic en un turno para ver detalles.
        </p>
      </div>

      <AgendaCalendar
        appointments={(appointments ?? []) as AppointmentWithPatient[]}
        patients={patients ?? []}
        consultorios={consultorios ?? []}
        activeBookings={(activeBookings ?? []) as Pick<Booking, 'id' | 'consultorio_id' | 'start_time' | 'end_time'>[]}
        professionalBookings={(professionalBookings ?? []) as { id: string; consultorio_id: string; professional_id: string; title: string | null; start_time: string; end_time: string; consultorios: { name: string } | null }[]}
        professionals={(professionals ?? []) as (Professional & { profiles: Pick<Profile, 'full_name'> })[]}
      />
    </div>
  )
}
