'use client'

import { useState, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core'
import type { ResourceInput } from '@fullcalendar/resource'
import type { Consultorio, BookingWithProfessional, Professional } from '@/types'
import BookingModal from './BookingModal'

interface ConsultorioCalendarProps {
  consultorios: Consultorio[]
  bookings: BookingWithProfessional[]
  professionals: (Professional & { profiles: { full_name: string } })[]
  patients: { id: string; first_name: string; last_name: string }[]
}

interface ModalState {
  open: boolean
  consultorio: Consultorio | null
  initialStart: string
  initialEnd: string
  existingBooking: {
    id: string
    consultorio_id: string
    professional_id: string
    title: string | null
    start_time: string
    end_time: string
  } | null
}

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function ConsultorioCalendar({
  consultorios,
  bookings,
  professionals,
  patients,
}: ConsultorioCalendarProps) {
  const [modal, setModal] = useState<ModalState>({
    open: false,
    consultorio: null,
    initialStart: '',
    initialEnd: '',
    existingBooking: null,
  })

  const resources: ResourceInput[] = consultorios.map((c) => ({
    id: c.id,
    title: c.name,
    eventColor: c.color,
  }))

  const events: EventInput[] = bookings
    .filter((b) => b.status === 'active')
    .map((b) => ({
      id: b.id,
      resourceId: b.consultorio_id,
      title: b.title ?? b.professionals.profiles.full_name,
      start: b.start_time,
      end: b.end_time,
      backgroundColor: b.professionals.color,
      borderColor: b.professionals.color,
      extendedProps: { booking: b },
    }))

  const handleSelect = useCallback(
    (selectInfo: DateSelectArg) => {
      const consultorio = consultorios.find((c) => c.id === selectInfo.resource?.id) ?? null
      setModal({
        open: true,
        consultorio,
        initialStart: toLocalDatetimeString(selectInfo.start),
        initialEnd: toLocalDatetimeString(selectInfo.end),
        existingBooking: null,
      })
    },
    [consultorios]
  )

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const b = clickInfo.event.extendedProps.booking as BookingWithProfessional
    setModal({
      open: true,
      consultorio: consultorios.find((c) => c.id === b.consultorio_id) ?? null,
      initialStart: '',
      initialEnd: '',
      existingBooking: {
        id: b.id,
        consultorio_id: b.consultorio_id,
        professional_id: b.professional_id,
        title: b.title,
        start_time: b.start_time,
        end_time: b.end_time,
      },
    })
  }, [consultorios])

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <FullCalendar
          plugins={[resourceTimeGridPlugin, interactionPlugin]}
          initialView="resourceTimeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'resourceTimeGridWeek,resourceTimeGridDay',
          }}
          buttonText={{ today: 'Hoy', week: 'Semana', day: 'Día' }}
          locale="es"
          resources={resources}
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
          snapDuration="00:15:00"
          nowIndicator={true}
          weekends={false}
          eventContent={(arg) => (
            <div className="p-1 overflow-hidden">
              <div className="text-xs font-medium truncate">{arg.event.title}</div>
              <div className="text-xs opacity-80">
                {new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' }).format(arg.event.start!)}
                {' – '}
                {new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' }).format(arg.event.end!)}
              </div>
            </div>
          )}
        />
      </div>

      {modal.open && (
        <BookingModal
          consultorio={modal.consultorio}
          consultorios={consultorios}
          professionals={professionals}
          patients={patients}
          initialStart={modal.initialStart}
          initialEnd={modal.initialEnd}
          existingBooking={modal.existingBooking}
          onClose={() => setModal((s) => ({ ...s, open: false }))}
        />
      )}
    </>
  )
}
