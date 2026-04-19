'use client'

import { useState, useCallback, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core'
import type { Patient, AppointmentWithPatient, Consultorio, Booking, Professional, Profile } from '@/types'
import AppointmentModal from './AppointmentModal'
import BookingModal from '@/components/consultorios/BookingModal'

interface AgendaCalendarProps {
  appointments: AppointmentWithPatient[]
  patients: Patient[]
  consultorios: Consultorio[]
  activeBookings: Pick<Booking, 'id' | 'consultorio_id' | 'start_time' | 'end_time'>[]
  professionalBookings: { id: string; consultorio_id: string; professional_id: string; title: string | null; start_time: string; end_time: string; consultorios: { name: string } | null }[]
  professionals: (Professional & { profiles: Pick<Profile, 'full_name'> })[]
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: '#9B7FC0',  // brand purple (lavender)
  completed: '#7A9E77',  // sage green – indigo-600
  cancelled: '#dc2626',
  no_show: '#9ca3af',
}

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function AgendaCalendar({ appointments, patients, consultorios, activeBookings, professionalBookings, professionals }: AgendaCalendarProps) {
  const initialDate = useMemo(() => {
    const today = new Date()
    const day = today.getDay()
    if (day === 0 || day === 6) {
      const next = new Date(today)
      next.setDate(today.getDate() + (day === 6 ? 2 : 1))
      return next
    }
    return today
  }, [])

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStart, setSelectedStart] = useState('')
  const [selectedEnd, setSelectedEnd] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState<{
    id: string
    title: string | null
    patientName: string
    start: string
    end: string
    status: string
    notes: string | null
  } | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<{
    id: string
    consultorio_id: string
    professional_id: string
    title: string | null
    start_time: string
    end_time: string
  } | null>(null)

  // Normalize timestamps to epoch ms to avoid ISO string format differences (e.g. +00:00 vs Z)
  const norm = (t: string) => new Date(t).getTime()
  const appointmentTimes = new Set(appointments.map((apt) => `${norm(apt.start_time)}|${norm(apt.end_time)}`))

  const bookingEvents: EventInput[] = professionalBookings
    .filter((b) => !appointmentTimes.has(`${norm(b.start_time)}|${norm(b.end_time)}`))
    .map((b) => ({
      id: `booking-${b.id}`,
      title: b.title ?? b.consultorios?.name ?? 'Consultorio reservado',
      start: b.start_time,
      end: b.end_time,
      backgroundColor: '#6B7280',
      borderColor: '#6B7280',
      extendedProps: {
        isBooking: true,
        booking: {
          id: b.id,
          consultorio_id: b.consultorio_id,
          professional_id: b.professional_id,
          title: b.title,
          start_time: b.start_time,
          end_time: b.end_time,
        },
      },
    }))

  const events: EventInput[] = [
    ...appointments.map((apt) => ({
      id: apt.id,
      title: apt.patients
        ? `${apt.patients.first_name} ${apt.patients.last_name}`
        : (apt.title ?? 'Sin título'),
      start: apt.start_time,
      end: apt.end_time,
      backgroundColor: STATUS_COLORS[apt.status] ?? STATUS_COLORS.scheduled,
      borderColor: STATUS_COLORS[apt.status] ?? STATUS_COLORS.scheduled,
      extendedProps: { appointment: apt },
    })),
    ...bookingEvents,
  ]

  const handleSelect = useCallback((selectInfo: DateSelectArg) => {
    setSelectedStart(toLocalDatetimeString(selectInfo.start))
    setSelectedEnd(toLocalDatetimeString(selectInfo.end))
    setSelectedAppointment(null)
    setModalOpen(true)
  }, [])

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    if (clickInfo.event.extendedProps.isBooking) {
      setSelectedBooking(clickInfo.event.extendedProps.booking)
      return
    }
    const apt = clickInfo.event.extendedProps.appointment as AppointmentWithPatient
    setSelectedAppointment({
      id: apt.id,
      title: apt.title,
      patientName: apt.patients
        ? `${apt.patients.first_name} ${apt.patients.last_name}`
        : (apt.title ?? ''),
      start: apt.start_time,
      end: apt.end_time,
      status: apt.status,
      notes: apt.notes,
    })
    setSelectedStart('')
    setSelectedEnd('')
    setModalOpen(true)
  }, [])

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          initialDate={initialDate}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          buttonText={{ today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día' }}
          locale="es"
          events={events}
          selectable={true}
          selectMirror={true}
          select={handleSelect}
          eventClick={handleEventClick}
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          height="auto"
          slotDuration="00:30:00"
          nowIndicator={true}
          weekends={false}
        />
      </div>

      {modalOpen && (
        <AppointmentModal
          patients={patients}
          consultorios={consultorios}
          activeBookings={activeBookings}
          initialStart={selectedStart}
          initialEnd={selectedEnd}
          existingAppointment={selectedAppointment}
          onClose={() => setModalOpen(false)}
        />
      )}

      {selectedBooking && (
        <BookingModal
          consultorio={consultorios.find((c) => c.id === selectedBooking.consultorio_id) ?? null}
          consultorios={consultorios}
          professionals={professionals}
          patients={patients.map((p) => ({ id: p.id, first_name: p.first_name, last_name: p.last_name }))}
          existingBooking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  )
}
