import { createClient } from '@/lib/supabase/server'
import ConsultorioCalendar from '@/components/consultorios/ConsultorioCalendar'
import type { BookingWithProfessional } from '@/types'

export default async function ConsultoriosPage() {
  const supabase = await createClient()

  const [{ data: consultorios }, { data: bookings }, { data: professionals }] =
    await Promise.all([
      supabase.from('consultorios').select('*').order('name'),
      supabase
        .from('bookings')
        .select(
          'id, consultorio_id, professional_id, title, start_time, end_time, status, created_at, professionals(id, color, profiles(full_name))'
        )
        .eq('status', 'active')
        .order('start_time'),
      supabase
        .from('professionals')
        .select('id, profile_id, specialty, license_number, color, created_at, profiles(full_name)')
        .order('created_at'),
    ])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Consultorios</h1>
        <p className="text-gray-500 text-sm mt-1">
          Hacé clic en un horario libre para reservar. Clic en una reserva para cancelarla.
        </p>
      </div>

      <ConsultorioCalendar
        consultorios={consultorios ?? []}
        bookings={(bookings ?? []) as unknown as BookingWithProfessional[]}
        professionals={
          (professionals ?? []) as (typeof professionals extends (infer T)[] | null ? T : never)[]
        }
      />
    </div>
  )
}
