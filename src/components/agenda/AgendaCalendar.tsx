'use client'

import { useState, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core'
import type { Patient, AppointmentWithPatient, Consultorio, Booking } from '@/types'
import AppointmentModal from './AppointmentModal'

interface AgendaCalendarProps {
  appointments: AppointmentWithPatient[]
  patients: Patient[]
  consultorios: Consultorio[]
  activeBookings: Pick<Booking, 'id' | 'consultorio_id' | 'start_time' | 'end_time'>[]
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: '#9B7FC0',  // brand purple
  completed: '#7A9E77',  // brand sage green
  cancelled: '#dc2626',
  no_show: '#9ca3af',
}

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function AgendaCalendar({ appointments, patients, consultorios, activeBookings }: AgendaCalendarProps) {
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

  const events: EventInput[] = appointments.map((apt) => ({
    id: apt.id,
    title: apt.patients
      ? `${apt.patients.first_name} ${apt.patients.last_name}`
      : (apt.title ?? 'Sin título'),
    start: apt.start_time,
    end: apt.end_time,
    backgroundColor: STATUS_COLORS[apt.status] ?? STATUS_COLORS.scheduled,
    borderColor: STATUS_COLORS[apt.status] ?? STATUS_COLORS.scheduled,
    extendedProps: { appointment: apt },
  }))

  const handleSelect = useCallback((selectInfo: DateSelectArg) => {
    setSelectedStart(toLocalDatetimeString(selectInfo.start))
    setSelectedEnd(toLocalDatetimeString(selectInfo.end))
    setSelectedAppointment(null)
    setModalOpen(true)
  }, [])

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
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
    </>
  )
}
