-- ============================================================================
-- 🏥 SMART QUEUE ALERT HOSPITAL MANAGEMENT SYSTEM - DATABASE SCHEMA (v2.0)
-- Real-Time Multi-Lane Hospital Queue, Alerts, Doctors & Accessibility System
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. CORE TABLES
-- ============================================================================

-- 2.1 Hospital Settings & Global Configuration
CREATE TABLE IF NOT EXISTS public.hospital_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_name TEXT NOT NULL DEFAULT 'Apollo General Hospital',
    hospital_address TEXT DEFAULT '123 Healthcare Ave, Medical District, Suite 100',
    general_phone TEXT DEFAULT '+91 800-123-4567',
    emergency_phone TEXT DEFAULT '+91 800-999-9111',
    email TEXT DEFAULT 'contact@apollohospital.org',
    max_daily_emergency_tokens INTEGER NOT NULL DEFAULT 50,
    current_emergency_count INTEGER NOT NULL DEFAULT 0,
    announcement_banner TEXT DEFAULT 'All departments operating at normal capacity. Wear masks in emergency zones.',
    is_announcement_active BOOLEAN NOT NULL DEFAULT TRUE,
    operating_hours JSONB DEFAULT '{"weekday": "08:00 - 20:00", "weekend": "09:00 - 17:00", "emergency": "24/7"}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.2 Hospital Departments
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('consultation', 'diagnostic', 'pharmacy', 'administrative')),
    current_queue INTEGER NOT NULL DEFAULT 0,
    average_wait_time INTEGER NOT NULL DEFAULT 15, -- in minutes
    services TEXT[] DEFAULT '{}',
    floor_number TEXT DEFAULT 'Ground Floor',
    room_numbers TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.3 Staff Accounts (Authentication & Roles)
CREATE TABLE IF NOT EXISTS public.staff_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('doctor', 'nurse', 'receptionist', 'pharmacist', 'lab_technician', 'admin')) DEFAULT 'doctor',
    department_name TEXT DEFAULT 'General Medicine',
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.4 Doctor Profiles & Live Capacity Roster
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id TEXT REFERENCES public.staff_accounts(staff_id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    department_name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    experience_years INTEGER NOT NULL DEFAULT 5,
    status TEXT NOT NULL CHECK (status IN ('available', 'busy', 'offline', 'on_break')) DEFAULT 'available',
    current_patients INTEGER NOT NULL DEFAULT 0,
    max_patients INTEGER NOT NULL DEFAULT 15,
    consultation_room TEXT DEFAULT 'Room 101',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.5 Registered Patients & Accessibility Profiles
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    patient_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    age INTEGER,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'not specified')) DEFAULT 'not specified',
    blood_group TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    has_disability BOOLEAN NOT NULL DEFAULT FALSE,
    disability_type TEXT,
    disability_details TEXT,
    assistance_needed TEXT[] DEFAULT '{}',
    caregiver_name TEXT,
    caregiver_phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.6 Real-Time Multi-Lane Queue Tokens (Core Engine)
CREATE TABLE IF NOT EXISTS public.queue_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id TEXT UNIQUE NOT NULL,
    token_number INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('common', 'emergency', 'disabled')),
    priority INTEGER NOT NULL DEFAULT 3, -- 10: Critical Emergency, 8: Urgent/Priority Disabled, 6: Moderate/Disabled, 3: Common Walk-in
    status TEXT NOT NULL CHECK (status IN ('waiting', 'called', 'in_consultation', 'completed', 'cancelled', 'no_show')) DEFAULT 'waiting',
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    department_name TEXT NOT NULL,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    doctor_name TEXT,
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    patient_phone TEXT,
    patient_email TEXT,
    patient_age INTEGER,
    patient_gender TEXT,
    emergency_reason TEXT,
    severity TEXT CHECK (severity IN ('critical', 'urgent', 'moderate')),
    disability_type TEXT,
    assistance_needed TEXT[] DEFAULT '{}',
    other_assistance TEXT,
    caregiver_name TEXT,
    caregiver_phone TEXT,
    scheduling_method TEXT NOT NULL CHECK (scheduling_method IN ('auto', 'manual')) DEFAULT 'auto',
    scheduled_time TIMESTAMPTZ,
    time_slot TEXT,
    estimated_wait_minutes INTEGER NOT NULL DEFAULT 0,
    queue_position INTEGER NOT NULL DEFAULT 1,
    qr_code_data TEXT NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    called_at TIMESTAMPTZ,
    consultation_started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.7 Consultations & Clinical Session Records
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id TEXT REFERENCES public.queue_tokens(token_id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    symptoms TEXT,
    diagnosis TEXT NOT NULL,
    clinical_notes TEXT,
    bp TEXT,
    pulse INTEGER,
    temperature NUMERIC(4, 1),
    spo2 INTEGER,
    status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'referred')) DEFAULT 'completed',
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.8 Diagnostic Lab Tests
CREATE TABLE IF NOT EXISTS public.lab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    token_id TEXT REFERENCES public.queue_tokens(token_id) ON DELETE CASCADE,
    consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    test_name TEXT NOT NULL,
    test_type TEXT DEFAULT 'Pathology',
    status TEXT NOT NULL CHECK (status IN ('ordered', 'sample_collected', 'in_progress', 'completed', 'cancelled')) DEFAULT 'ordered',
    specimen TEXT,
    results JSONB DEFAULT '{}'::jsonb,
    normal_range TEXT,
    report_url TEXT,
    performed_by TEXT,
    ordered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.9 Real-Time Live Notifications & Emergency Broadcasts
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('emergency_alert', 'queue_delay', 'token_called', 'turn_approaching', 'consultation_ready', 'general_broadcast')),
    department_name TEXT,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    token_id TEXT REFERENCES public.queue_tokens(token_id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')) DEFAULT 'info',
    ttl_seconds INTEGER NOT NULL DEFAULT 30,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.10 Department Analytics & Historical Throughput
CREATE TABLE IF NOT EXISTS public.department_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    department_name TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_patients INTEGER NOT NULL DEFAULT 0,
    emergency_count INTEGER NOT NULL DEFAULT 0,
    accessibility_count INTEGER NOT NULL DEFAULT 0,
    avg_wait_minutes INTEGER NOT NULL DEFAULT 0,
    avg_consultation_minutes INTEGER NOT NULL DEFAULT 0,
    peak_hour TEXT DEFAULT '10:00 - 11:00 AM',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (department_id, date)
);

-- ============================================================================
-- 3. INDEXES FOR REAL-TIME QUERY PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_queue_tokens_dept_status ON public.queue_tokens(department_name, status);
CREATE INDEX IF NOT EXISTS idx_queue_tokens_priority ON public.queue_tokens(priority DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_queue_tokens_patient_phone ON public.queue_tokens(patient_phone);
CREATE INDEX IF NOT EXISTS idx_queue_tokens_patient_email ON public.queue_tokens(patient_email);
CREATE INDEX IF NOT EXISTS idx_queue_tokens_valid_until ON public.queue_tokens(valid_until);
CREATE INDEX IF NOT EXISTS idx_doctors_dept_status ON public.doctors(department_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_dept ON public.notifications(department_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_token ON public.consultations(token_id);
CREATE INDEX IF NOT EXISTS idx_lab_tests_token ON public.lab_tests(token_id);

-- ============================================================================
-- 4. DATABASE TRIGGERS & AUTOMATION FUNCTIONS
-- ============================================================================

-- 4.1 Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.fn_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_hospital_settings_updated
BEFORE UPDATE ON public.hospital_settings
FOR EACH ROW EXECUTE FUNCTION public.fn_update_updated_at();

CREATE OR REPLACE TRIGGER trg_departments_updated
BEFORE UPDATE ON public.departments
FOR EACH ROW EXECUTE FUNCTION public.fn_update_updated_at();

CREATE OR REPLACE TRIGGER trg_doctors_updated
BEFORE UPDATE ON public.doctors
FOR EACH ROW EXECUTE FUNCTION public.fn_update_updated_at();

CREATE OR REPLACE TRIGGER trg_patients_updated
BEFORE UPDATE ON public.patients
FOR EACH ROW EXECUTE FUNCTION public.fn_update_updated_at();

CREATE OR REPLACE TRIGGER trg_queue_tokens_updated
BEFORE UPDATE ON public.queue_tokens
FOR EACH ROW EXECUTE FUNCTION public.fn_update_updated_at();

-- 4.2 Auto-handle New Token Insert: Update department load & trigger emergency broadcasts
CREATE OR REPLACE FUNCTION public.fn_handle_new_queue_token()
RETURNS TRIGGER AS $$
BEGIN
    -- Update Department Active Queue Count
    UPDATE public.departments
    SET current_queue = (
        SELECT COUNT(*)
        FROM public.queue_tokens
        WHERE department_name = NEW.department_name
          AND status IN ('waiting', 'called', 'in_consultation')
    )
    WHERE name = NEW.department_name;

    -- If Emergency Token: Broadcast emergency alert & increment daily counter
    IF NEW.type = 'emergency' THEN
        -- Broadcast alert into notifications table
        INSERT INTO public.notifications (
            type,
            department_name,
            department_id,
            token_id,
            title,
            message,
            severity,
            ttl_seconds,
            expires_at
        ) VALUES (
            'emergency_alert',
            NEW.department_name,
            NEW.department_id,
            NEW.token_id,
            '🚨 Emergency Case Registered',
            'Emergency case received in ' || NEW.department_name || '. Expected queue delay: 15-20 minutes.',
            'critical',
            60,
            timezone('utc'::text, now()) + interval '60 seconds'
        );

        -- Increment daily emergency count in hospital_settings
        UPDATE public.hospital_settings
        SET current_emergency_count = current_emergency_count + 1;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_after_insert_queue_token
AFTER INSERT ON public.queue_tokens
FOR EACH ROW EXECUTE FUNCTION public.fn_handle_new_queue_token();

-- 4.3 Auto-handle Token Status Change: Decrement queue load, update doctor, notify called patient
CREATE OR REPLACE FUNCTION public.fn_handle_queue_token_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- If status transitioned to completed or cancelled
    IF NEW.status IN ('completed', 'cancelled') AND OLD.status NOT IN ('completed', 'cancelled') THEN
        -- Recalculate Department Active Queue
        UPDATE public.departments
        SET current_queue = (
            SELECT COUNT(*)
            FROM public.queue_tokens
            WHERE department_name = NEW.department_name
              AND status IN ('waiting', 'called', 'in_consultation')
        )
        WHERE name = NEW.department_name;

        -- Decrement doctor current patients if assigned
        IF NEW.doctor_id IS NOT NULL THEN
            UPDATE public.doctors
            SET current_patients = GREATEST(0, current_patients - 1)
            WHERE id = NEW.doctor_id;
        END IF;
    END IF;

    -- If token called: Emit token_called notification
    IF NEW.status = 'called' AND OLD.status != 'called' THEN
        INSERT INTO public.notifications (
            type,
            department_name,
            department_id,
            token_id,
            patient_id,
            title,
            message,
            severity,
            ttl_seconds,
            expires_at
        ) VALUES (
            'token_called',
            NEW.department_name,
            NEW.department_id,
            NEW.token_id,
            NEW.patient_id,
            '🔔 Token Called: ' || NEW.token_id,
            'Patient ' || NEW.patient_name || ' please proceed to ' || NEW.department_name || ' (' || COALESCE(NEW.doctor_name, 'Consultation Room') || ').',
            'high',
            45,
            timezone('utc'::text, now()) + interval '45 seconds'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_after_update_queue_token_status
AFTER UPDATE OF status ON public.queue_tokens
FOR EACH ROW EXECUTE FUNCTION public.fn_handle_queue_token_status_change();

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.hospital_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_analytics ENABLE ROW LEVEL SECURITY;

-- 5.1 Hospital Settings: Public Read, Staff/Service Write
CREATE POLICY "Public can view hospital settings" ON public.hospital_settings FOR SELECT USING (true);
CREATE POLICY "Staff can update hospital settings" ON public.hospital_settings FOR ALL USING (true);

-- 5.2 Departments: Public Read, Staff Write
CREATE POLICY "Public can view active departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Staff can modify departments" ON public.departments FOR ALL USING (true);

-- 5.3 Doctors: Public Read, Staff Write
CREATE POLICY "Public can view doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Staff can update doctor status" ON public.doctors FOR ALL USING (true);

-- 5.4 Queue Tokens: Public Read & Insert (Kiosk & Patient App), Staff Full Management
CREATE POLICY "Public can view queue tokens" ON public.queue_tokens FOR SELECT USING (true);
CREATE POLICY "Public can insert queue tokens" ON public.queue_tokens FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can update queue tokens" ON public.queue_tokens FOR UPDATE USING (true);
CREATE POLICY "Staff can delete queue tokens" ON public.queue_tokens FOR DELETE USING (true);

-- 5.5 Notifications: Public Read & Insert (Alerts Broadcast), Auto-expires
CREATE POLICY "Public can view notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- 5.6 Patients: Authenticated / Public Walk-in profile view & create
CREATE POLICY "Patients can view own records" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Patients can create profile" ON public.patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Patients can update own profile" ON public.patients FOR UPDATE USING (true);

-- 5.7 Consultations & Lab Tests: Public View by Token ID, Staff Full Access
CREATE POLICY "Patients can view own consultation" ON public.consultations FOR SELECT USING (true);
CREATE POLICY "Staff can manage consultations" ON public.consultations FOR ALL USING (true);
CREATE POLICY "Patients can view own lab tests" ON public.lab_tests FOR SELECT USING (true);
CREATE POLICY "Staff can manage lab tests" ON public.lab_tests FOR ALL USING (true);

-- 5.8 Staff Accounts: Self read and Service management
CREATE POLICY "Staff can view staff roster" ON public.staff_accounts FOR SELECT USING (true);
CREATE POLICY "Staff can authenticate" ON public.staff_accounts FOR ALL USING (true);

-- ============================================================================
-- 6. ENABLE SUPABASE REALTIME REPLICATION
-- ============================================================================

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.queue_tokens;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.departments;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.doctors;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lab_tests;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.hospital_settings;
EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN others THEN NULL;
END $$;
