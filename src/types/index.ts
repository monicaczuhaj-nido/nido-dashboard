import type { Database } from './supabase'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Professional = Database['public']['Tables']['professionals']['Row']
export type Consultorio = Database['public']['Tables']['consultorios']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Patient = Database['public']['Tables']['patients']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']
export type Session = Database['public']['Tables']['sessions']['Row']
export type SessionFile = Database['public']['Tables']['session_files']['Row']

export type BookingWithProfessional = Booking & {
  professionals: Pick<Professional, 'id' | 'color'> & {
    profiles: Pick<Profile, 'full_name'>
  }
}

export type AppointmentWithPatient = Appointment & {
  patients: Pick<Patient, 'id' | 'first_name' | 'last_name'>
}

export type SessionWithFiles = Session & {
  session_files: SessionFile[]
  patients: Pick<Patient, 'first_name' | 'last_name'>
}

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }
