-- ============================================================
-- CENTRO DE PSICOLOGÍA — Schema completo
-- Ejecutar en: Supabase > SQL Editor > New query > Run
-- ============================================================

-- 1. Profiles (se crea automáticamente al registrarse)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'professional' CHECK (role IN ('admin','professional','receptionist')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Professionals
CREATE TABLE IF NOT EXISTS professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  specialty TEXT,
  license_number TEXT,
  color TEXT NOT NULL DEFAULT '#4f46e5',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Consultorios
CREATE TABLE IF NOT EXISTS consultorios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bookings (reservas de consultorios)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultorio_id UUID NOT NULL REFERENCES consultorios(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  title TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Patients
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dni TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  emergency_contact TEXT,
  notes TEXT,
  professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  title TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled','no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Sessions (historia clínica — inmutable)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  session_date DATE NOT NULL,
  notes TEXT,
  diagnosis TEXT,
  evolution TEXT,
  next_steps TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Session files
CREATE TABLE IF NOT EXISTS session_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Trigger: crear profile automáticamente al registrarse
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_files ENABLE ROW LEVEL SECURITY;

-- Políticas: usuarios autenticados pueden ver/modificar todo
CREATE POLICY "Authenticated users" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users" ON professionals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users" ON consultorios FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users" ON bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users" ON patients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users" ON appointments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users" ON sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users" ON session_files FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- Storage bucket para archivos de sesiones
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('session-files', 'session-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'session-files');

CREATE POLICY "Authenticated users can read" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'session-files');

-- ============================================================
-- Datos iniciales: 3 consultorios
-- ============================================================
INSERT INTO consultorios (name, description, color) VALUES
  ('Consultorio 1', 'Planta baja', '#3b82f6'),
  ('Consultorio 2', 'Primer piso', '#10b981'),
  ('Consultorio 3', 'Primer piso', '#f59e0b')
ON CONFLICT DO NOTHING;
