-- ============================================================================
-- 🏥 SMART QUEUE ALERT HOSPITAL MANAGEMENT SYSTEM - SEED DATA (v2.0)
-- 10 Departments, 18 Specialized Doctors, Demo Staff Accounts, Settings
-- ============================================================================

-- 1. Insert Hospital Settings
INSERT INTO public.hospital_settings (
    hospital_name,
    hospital_address,
    general_phone,
    emergency_phone,
    email,
    max_daily_emergency_tokens,
    current_emergency_count,
    announcement_banner,
    is_announcement_active
) VALUES (
    'Apollo General Hospital',
    '123 Healthcare Ave, Medical District, Suite 100',
    '+91 800-123-4567',
    '+91 800-999-9111',
    'contact@apollohospital.org',
    50,
    0,
    'All departments operating at normal capacity. Wear masks in emergency zones.',
    TRUE
) ON CONFLICT DO NOTHING;

-- 2. Insert 10 Hospital Departments
INSERT INTO public.departments (name, code, type, current_queue, average_wait_time, services, floor_number, room_numbers)
VALUES
    ('General Medicine', 'GEN', 'consultation', 12, 15, ARRAY['General Checkup', 'Consultation', 'Health Screening'], 'Ground Floor', ARRAY['Room 101', 'Room 102', 'Room 103']),
    ('Orthopedics', 'ORTH', 'consultation', 5, 25, ARRAY['Bone Consultation', 'Joint Treatment', 'Sports Medicine'], '1st Floor', ARRAY['Room 201', 'Room 202', 'Room 203']),
    ('Cardiology', 'CARD', 'consultation', 8, 35, ARRAY['Heart Consultation', 'ECG', 'Cardiac Treatment'], '2nd Floor', ARRAY['Room 301', 'Room 302', 'Room 303']),
    ('Neurology', 'NEUR', 'consultation', 3, 40, ARRAY['Brain Consultation', 'Neurological Treatment', 'Stroke Care'], '3rd Floor', ARRAY['Room 401', 'Room 402']),
    ('Pediatrics', 'PED', 'consultation', 7, 20, ARRAY['Child Care', 'Vaccination', 'Pediatric Surgery'], '1st Floor', ARRAY['Room 105', 'Room 106']),
    ('Laboratory', 'LAB', 'diagnostic', 15, 10, ARRAY['Blood Tests', 'Urine Tests', 'Biochemistry', 'Serology'], 'Basement 1', ARRAY['Lab 1', 'Lab 2', 'Sample Room']),
    ('Pharmacy', 'PHARM', 'pharmacy', 8, 5, ARRAY['Prescription Dispensing', 'OTC Medicines', 'Medical Supplies'], 'Ground Floor', ARRAY['Counter 1', 'Counter 2', 'Counter 3']),
    ('Radiology', 'RAD', 'diagnostic', 6, 20, ARRAY['X-Ray', 'CT Scan', 'MRI', 'Ultrasound'], 'Basement 1', ARRAY['X-Ray Room', 'MRI Suite', 'CT Room']),
    ('Emergency', 'EMG', 'consultation', 2, 5, ARRAY['Emergency Care', 'Trauma Treatment', 'Critical Care', 'Resuscitation'], 'Ground Floor (North Wing)', ARRAY['Trauma Bay 1', 'Trauma Bay 2', 'ICU Link']),
    ('Reception', 'REC', 'administrative', 0, 3, ARRAY['Registration', 'Appointments', 'Information', 'Billing', 'Queue Inquiries'], 'Main Lobby', ARRAY['Helpdesk 1', 'Helpdesk 2'])
ON CONFLICT (name) DO UPDATE SET
    services = EXCLUDED.services,
    average_wait_time = EXCLUDED.average_wait_time;

-- 3. Insert Demo Staff Accounts
-- Note: password_hash uses standard demo hash or bcrypt '$2a$10$e7xXF9g1u5H6P4uYj4q7IeB9A9WJmR3e9fE6mGq4Q0y4rF' (password: admin123)
INSERT INTO public.staff_accounts (staff_id, email, full_name, role, department_name, password_hash)
VALUES
    ('DOC001', 'dr.sharma@apollohospital.org', 'Dr. Ravi Sharma', 'doctor', 'General Medicine', 'admin123'),
    ('DOC002', 'dr.rajesh@apollohospital.org', 'Dr. Rajesh Kumar', 'doctor', 'Orthopedics', 'admin123'),
    ('DOC003', 'dr.sunita@apollohospital.org', 'Dr. Sunita Mehta', 'doctor', 'Cardiology', 'admin123'),
    ('DOC-EMG-01', 'dr.kiran@apollohospital.org', 'Dr. Kiran Emergency', 'doctor', 'Emergency', 'admin123'),
    ('STAFF-ADMIN-01', 'admin@apollohospital.org', 'System Administrator', 'admin', 'Reception', 'admin123'),
    ('REC001', 'receptionist@apollohospital.org', 'Pooja Receptionist', 'receptionist', 'Reception', 'admin123')
ON CONFLICT (staff_id) DO NOTHING;

-- 4. Insert 18 Specialized Doctors
INSERT INTO public.doctors (staff_id, name, department_name, specialization, experience_years, status, current_patients, max_patients, consultation_room)
VALUES
    -- General Medicine
    ('DOC001', 'Dr. Ravi Sharma', 'General Medicine', 'Internal Medicine', 25, 'available', 6, 15, 'Room 101'),
    (NULL, 'Dr. Anjali Nair', 'General Medicine', 'Family Medicine', 12, 'available', 4, 12, 'Room 102'),
    (NULL, 'Dr. Suresh Iyer', 'General Medicine', 'Preventive Care', 8, 'available', 2, 10, 'Room 103'),

    -- Orthopedics
    ('DOC002', 'Dr. Rajesh Kumar', 'Orthopedics', 'Joint Surgery', 15, 'available', 3, 8, 'Room 201'),
    (NULL, 'Dr. Priya Singh', 'Orthopedics', 'Sports Medicine', 10, 'busy', 6, 6, 'Room 202'),
    (NULL, 'Dr. Amit Shah', 'Orthopedics', 'Spine Surgery', 12, 'available', 2, 5, 'Room 203'),

    -- Cardiology
    ('DOC003', 'Dr. Sunita Mehta', 'Cardiology', 'Heart Surgery', 20, 'available', 4, 10, 'Room 301'),
    (NULL, 'Dr. Vikram Patel', 'Cardiology', 'Interventional Cardiology', 18, 'available', 3, 8, 'Room 302'),
    (NULL, 'Dr. Kavita Reddy', 'Cardiology', 'Pediatric Cardiology', 14, 'offline', 0, 6, 'Room 303'),

    -- Neurology
    (NULL, 'Dr. Ashok Gupta', 'Neurology', 'Brain Surgery', 22, 'busy', 5, 5, 'Room 401'),
    (NULL, 'Dr. Meera Joshi', 'Neurology', 'Stroke Treatment', 16, 'available', 2, 7, 'Room 402'),

    -- Pediatrics
    (NULL, 'Dr. Rekha Varma', 'Pediatrics', 'Child Care', 16, 'available', 5, 12, 'Room 105'),
    (NULL, 'Dr. Mohit Khanna', 'Pediatrics', 'Pediatric Surgery', 11, 'available', 2, 6, 'Room 106'),

    -- Laboratory
    (NULL, 'Dr. Kavya Technician', 'Laboratory', 'Lab Technology', 8, 'available', 10, 20, 'Lab 1'),
    (NULL, 'Dr. Rahul Pathologist', 'Laboratory', 'Pathology', 12, 'available', 5, 15, 'Lab 2'),

    -- Pharmacy
    (NULL, 'Dr. Sita Pharmacist', 'Pharmacy', 'Clinical Pharmacy', 10, 'available', 5, 20, 'Counter 1'),
    (NULL, 'Dr. Ram Chemist', 'Pharmacy', 'Pharmaceutical Sciences', 15, 'available', 3, 15, 'Counter 2'),

    -- Radiology
    (NULL, 'Dr. Priya Radiologist', 'Radiology', 'Medical Imaging', 14, 'available', 4, 8, 'MRI Suite'),
    (NULL, 'Dr. Arjun Scanner', 'Radiology', 'Diagnostic Radiology', 11, 'available', 2, 6, 'CT Room'),

    -- Emergency
    ('DOC-EMG-01', 'Dr. Kiran Emergency', 'Emergency', 'Emergency Medicine', 18, 'available', 1, 5, 'Trauma Bay 1'),
    (NULL, 'Dr. Deepak Trauma', 'Emergency', 'Trauma Surgery', 20, 'available', 1, 3, 'Trauma Bay 2'),

    -- Reception
    (NULL, 'Reception Staff', 'Reception', 'Administrative', 5, 'available', 0, 50, 'Main Helpdesk')
ON CONFLICT DO NOTHING;
