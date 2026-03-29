export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          role: 'admin' | 'professional' | 'receptionist'
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          role?: 'admin' | 'professional' | 'receptionist'
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          full_name?: string
          role?: 'admin' | 'professional' | 'receptionist'
          avatar_url?: string | null
        }
        Relationships: []
      }
      professionals: {
        Row: {
          id: string
          profile_id: string
          specialty: string | null
          license_number: string | null
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          specialty?: string | null
          license_number?: string | null
          color?: string
          created_at?: string
        }
        Update: {
          specialty?: string | null
          license_number?: string | null
          color?: string
        }
        Relationships: [
          {
            foreignKeyName: 'professionals_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      consultorios: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string
          created_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          color?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          consultorio_id: string
          professional_id: string
          title: string | null
          start_time: string
          end_time: string
          status: 'active' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          consultorio_id: string
          professional_id: string
          title?: string | null
          start_time: string
          end_time: string
          status?: 'active' | 'cancelled'
          created_at?: string
        }
        Update: {
          title?: string | null
          start_time?: string
          end_time?: string
          status?: 'active' | 'cancelled'
        }
        Relationships: [
          {
            foreignKeyName: 'bookings_consultorio_id_fkey'
            columns: ['consultorio_id']
            isOneToOne: false
            referencedRelation: 'consultorios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bookings_professional_id_fkey'
            columns: ['professional_id']
            isOneToOne: false
            referencedRelation: 'professionals'
            referencedColumns: ['id']
          }
        ]
      }
      patients: {
        Row: {
          id: string
          first_name: string
          last_name: string
          dni: string | null
          email: string | null
          phone: string | null
          date_of_birth: string | null
          address: string | null
          emergency_contact: string | null
          notes: string | null
          professional_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          dni?: string | null
          email?: string | null
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          emergency_contact?: string | null
          notes?: string | null
          professional_id?: string | null
          created_at?: string
        }
        Update: {
          first_name?: string
          last_name?: string
          dni?: string | null
          email?: string | null
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          emergency_contact?: string | null
          notes?: string | null
          professional_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'patients_professional_id_fkey'
            columns: ['professional_id']
            isOneToOne: false
            referencedRelation: 'professionals'
            referencedColumns: ['id']
          }
        ]
      }
      appointments: {
        Row: {
          id: string
          professional_id: string
          patient_id: string
          title: string | null
          start_time: string
          end_time: string
          status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          professional_id: string
          patient_id: string
          title?: string | null
          start_time: string
          end_time: string
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          created_at?: string
        }
        Update: {
          title?: string | null
          start_time?: string
          end_time?: string
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'appointments_professional_id_fkey'
            columns: ['professional_id']
            isOneToOne: false
            referencedRelation: 'professionals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'appointments_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          }
        ]
      }
      sessions: {
        Row: {
          id: string
          patient_id: string
          professional_id: string
          appointment_id: string | null
          session_date: string
          notes: string | null
          diagnosis: string | null
          evolution: string | null
          next_steps: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          professional_id: string
          appointment_id?: string | null
          session_date: string
          notes?: string | null
          diagnosis?: string | null
          evolution?: string | null
          next_steps?: string | null
          created_at?: string
        }
        Update: {
          // Sessions are immutable — no fields can be updated
          [key: string]: never
        }
        Relationships: [
          {
            foreignKeyName: 'sessions_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'sessions_professional_id_fkey'
            columns: ['professional_id']
            isOneToOne: false
            referencedRelation: 'professionals'
            referencedColumns: ['id']
          }
        ]
      }
      session_files: {
        Row: {
          id: string
          session_id: string
          file_name: string
          file_path: string
          file_type: string | null
          file_size: number | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          file_name: string
          file_path: string
          file_type?: string | null
          file_size?: number | null
          created_at?: string
        }
        Update: {
          // session_files are immutable
          [key: string]: never
        }
        Relationships: [
          {
            foreignKeyName: 'session_files_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'sessions'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
