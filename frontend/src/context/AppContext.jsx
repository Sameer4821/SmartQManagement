import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../api/supabaseClient';

// ── Initial department data ─────────────────────────────────────────────────
export const initialDepartments = [
  {
    name: "General Medicine", type: "consultation", currentQueue: 12, averageWaitTime: 15,
    services: ["General Checkup", "Consultation", "Health Screening"],
    doctors: [
      { id: "gen1", staff_id: "DOC001", name: "Dr. Ravi Sharma", specialization: "Internal Medicine", experience: 25, status: "available", currentPatients: 6, maxPatients: 15 },
      { id: "gen2", name: "Dr. Anjali Nair", specialization: "Family Medicine", experience: 12, status: "available", currentPatients: 4, maxPatients: 12 },
      { id: "gen3", name: "Dr. Suresh Iyer", specialization: "Preventive Care", experience: 8, status: "available", currentPatients: 2, maxPatients: 10 },
    ]
  },
  {
    name: "Orthopedics", type: "consultation", currentQueue: 5, averageWaitTime: 25,
    services: ["Bone Consultation", "Joint Treatment", "Sports Medicine"],
    doctors: [
      { id: "orth1", staff_id: "DOC002", name: "Dr. Rajesh Kumar", specialization: "Joint Surgery", experience: 15, status: "available", currentPatients: 3, maxPatients: 8 },
      { id: "orth2", name: "Dr. Priya Singh", specialization: "Sports Medicine", experience: 10, status: "busy", currentPatients: 6, maxPatients: 6 },
      { id: "orth3", name: "Dr. Amit Shah", specialization: "Spine Surgery", experience: 12, status: "available", currentPatients: 2, maxPatients: 5 },
    ]
  },
  {
    name: "Cardiology", type: "consultation", currentQueue: 8, averageWaitTime: 35,
    services: ["Heart Consultation", "ECG", "Cardiac Treatment"],
    doctors: [
      { id: "card1", staff_id: "DOC003", name: "Dr. Sunita Mehta", specialization: "Heart Surgery", experience: 20, status: "available", currentPatients: 4, maxPatients: 10 },
      { id: "card2", name: "Dr. Vikram Patel", specialization: "Interventional Cardiology", experience: 18, status: "available", currentPatients: 3, maxPatients: 8 },
      { id: "card3", name: "Dr. Kavita Reddy", specialization: "Pediatric Cardiology", experience: 14, status: "offline", currentPatients: 0, maxPatients: 6 },
    ]
  },
  {
    name: "Neurology", type: "consultation", currentQueue: 3, averageWaitTime: 40,
    services: ["Brain Consultation", "Neurological Treatment", "Stroke Care"],
    doctors: [
      { id: "neuro1", name: "Dr. Ashok Gupta", specialization: "Brain Surgery", experience: 22, status: "busy", currentPatients: 5, maxPatients: 5 },
      { id: "neuro2", name: "Dr. Meera Joshi", specialization: "Stroke Treatment", experience: 16, status: "available", currentPatients: 2, maxPatients: 7 },
    ]
  },
  {
    name: "Pediatrics", type: "consultation", currentQueue: 7, averageWaitTime: 20,
    services: ["Child Care", "Vaccination", "Pediatric Surgery"],
    doctors: [
      { id: "ped1", name: "Dr. Rekha Varma", specialization: "Child Care", experience: 16, status: "available", currentPatients: 5, maxPatients: 12 },
      { id: "ped2", name: "Dr. Mohit Khanna", specialization: "Pediatric Surgery", experience: 11, status: "available", currentPatients: 2, maxPatients: 6 },
    ]
  },
  {
    name: "Laboratory", type: "diagnostic", currentQueue: 15, averageWaitTime: 10,
    services: ["Blood Tests", "Urine Tests", "X-Ray", "MRI", "CT Scan"],
    doctors: [
      { id: "lab1", name: "Dr. Kavya Technician", specialization: "Lab Technology", experience: 8, status: "available", currentPatients: 10, maxPatients: 20 },
      { id: "lab2", name: "Dr. Rahul Pathologist", specialization: "Pathology", experience: 12, status: "available", currentPatients: 5, maxPatients: 15 },
    ]
  },
  {
    name: "Pharmacy", type: "pharmacy", currentQueue: 8, averageWaitTime: 5,
    services: ["Prescription Dispensing", "OTC Medicines", "Medical Supplies"],
    doctors: [
      { id: "pharm1", name: "Dr. Sita Pharmacist", specialization: "Clinical Pharmacy", experience: 10, status: "available", currentPatients: 5, maxPatients: 20 },
      { id: "pharm2", name: "Dr. Ram Chemist", specialization: "Pharmaceutical Sciences", experience: 15, status: "available", currentPatients: 3, maxPatients: 15 },
    ]
  },
  {
    name: "Radiology", type: "diagnostic", currentQueue: 6, averageWaitTime: 20,
    services: ["X-Ray", "CT Scan", "MRI", "Ultrasound"],
    doctors: [
      { id: "rad1", name: "Dr. Priya Radiologist", specialization: "Medical Imaging", experience: 14, status: "available", currentPatients: 4, maxPatients: 8 },
      { id: "rad2", name: "Dr. Arjun Scanner", specialization: "Diagnostic Radiology", experience: 11, status: "available", currentPatients: 2, maxPatients: 6 },
    ]
  },
  {
    name: "Emergency", type: "consultation", currentQueue: 2, averageWaitTime: 5,
    services: ["Emergency Care", "Trauma Treatment", "Critical Care"],
    doctors: [
      { id: "emg1", staff_id: "DOC-EMG-01", name: "Dr. Kiran Emergency", specialization: "Emergency Medicine", experience: 18, status: "available", currentPatients: 1, maxPatients: 5 },
      { id: "emg2", name: "Dr. Deepak Trauma", specialization: "Trauma Surgery", experience: 20, status: "available", currentPatients: 1, maxPatients: 3 },
    ]
  },
  {
    name: "Reception", type: "administrative", currentQueue: 0, averageWaitTime: 3,
    services: ["Registration", "Appointments", "Information", "Billing"],
    doctors: [
      { id: "rec1", staff_id: "REC001", name: "Reception Staff", specialization: "Administrative", experience: 5, status: "available", currentPatients: 0, maxPatients: 50 },
    ]
  },
];

export const initialState = {
  currentView: "portal",
  language: "en",
  accessibilityMode: "normal",
  patientInfo: null,
  currentToken: null,
  tokens: [],
  departments: initialDepartments,
  emergencyCount: 0,
  maxEmergencyPerDay: 50,
  notifications: [],
  theme: "medical",
  consultationData: undefined,
  staffInfo: null,
};

// ── Context ─────────────────────────────────────────────────────────────────
export const AppContext = createContext({
  state: initialState,
  setState: () => {},
  sendEmergencyNotification: () => {},
  addNotification: () => {},
  calculateOptimalTime: () => ({ time: new Date(), waitTime: 15, position: 1 }),
  addVisitToToken: () => {},
  addLabTestToToken: () => {},
  completeConsultation: () => {},
  setAIRecommendation: () => {},
});

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('hospital-app-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialState,
          ...parsed,
          departments: initialDepartments,
          notifications: [],
          tokens: (parsed.tokens || []).map(t => ({
            ...t,
            timestamp: new Date(t.timestamp),
            validUntil: new Date(t.validUntil),
            createdAt: t.createdAt ? new Date(t.createdAt) : new Date(t.timestamp),
          })),
        };
      }
    } catch (e) { /* ignore */ }
    return initialState;
  });

  // Persist state to localStorage
  useEffect(() => {
    try {
      const toSave = {
        tokens: state.tokens,
        emergencyCount: state.emergencyCount,
        language: state.language,
        theme: state.theme,
        accessibilityMode: state.accessibilityMode,
        patientInfo: state.patientInfo,
      };
      localStorage.setItem('hospital-app-state', JSON.stringify(toSave));
    } catch (e) { /* ignore */ }
  }, [state.tokens, state.emergencyCount, state.language, state.theme, state.accessibilityMode, state.patientInfo]);

  // Sync theme to DOM classes
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [state.theme]);

  // Auto-clear notifications older than 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const fresh = prev.notifications.filter(n => Date.now() - new Date(n.timestamp).getTime() < 30000);
        return fresh.length === prev.notifications.length ? prev : { ...prev, notifications: fresh };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Helper to construct complete frontend token object from Supabase row
  const formatSupabaseTokenRow = (row) => {
    const tokenId = row.token_id || row.id;
    const deptName = row.department_name || row.department || 'General Medicine';
    return {
      id: tokenId,
      token_id: tokenId,
      tokenNumber: row.token_number || 1,
      type: row.type || (tokenId?.startsWith('EME') ? 'emergency' : tokenId?.startsWith('ACE') ? 'disabled' : 'common'),
      primaryDepartment: deptName,
      department_name: deptName,
      doctor_id: row.doctor_id || null,
      doctor_name: row.doctor_name || null,
      status: row.status || 'waiting',
      priority: row.priority || (row.type === 'emergency' ? 10 : row.type === 'disabled' ? 8 : 3),
      timestamp: new Date(row.created_at || Date.now()),
      validUntil: new Date(row.valid_until || Date.now() + 24 * 3600000),
      completed_at: row.completed_at || null,
      emergency_reason: row.emergency_reason || null,
      severity: row.severity || null,
      disabilityType: row.disability_type || null,
      assistanceNeeded: row.assistance_needed || [],
      caregiverName: row.caregiver_name || null,
      caregiverPhone: row.caregiver_phone || null,
      schedulingMethod: row.scheduling_method || 'auto',
      scheduledTime: row.scheduled_time ? new Date(row.scheduled_time) : null,
      timeSlot: row.time_slot || null,
      estimatedWaitTime: row.estimated_wait_minutes || 15,
      positionInQueue: row.queue_position || 1,
      qrCode: row.qr_code_data || tokenId,
      patient: {
        name: row.patient_name || 'Patient',
        email: row.patient_email || '',
        phone: row.patient_phone || '',
        age: row.patient_age || '',
        gender: row.patient_gender || 'not specified',
        patientId: row.patient_id || `PAT-${tokenId}`
      },
      visits: [],
      labTests: [],
      departmentAccess: [deptName]
    };
  };

  // Supabase real-time queue subscription
  useEffect(() => {
    // 1. Initial fetch from queue_tokens or queue
    const fetchQueue = async () => {
      let { data, error } = await supabase
        .from('queue_tokens')
        .select('*')
        .neq('status', 'completed')
        .neq('status', 'cancelled')
        .order('created_at', { ascending: true });

      if (error) {
        const fallback = await supabase
          .from('queue')
          .select('*')
          .neq('status', 'completed')
          .neq('status', 'cancelled')
          .order('created_at', { ascending: true });
        data = fallback.data;
      }

      if (data) {
        setState(prev => {
          const freshTokens = data.map(formatSupabaseTokenRow);
          return { ...prev, tokens: freshTokens };
        });
      }
    };

    fetchQueue();

    // 2. Real-time channels for queue_tokens and queue
    const queueChannel = supabase.channel('realtime:queue_tokens')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queue_tokens' }, payload => {
        handleRealtimeQueueEvent(payload);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queue' }, payload => {
        handleRealtimeQueueEvent(payload);
      })
      .subscribe();

    // 3. Real-time notifications channel
    const notifChannel = supabase.channel('realtime:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
        if (payload.new) {
          addNotification({
            id: payload.new.id,
            title: payload.new.title,
            message: payload.new.message,
            type: payload.new.type,
            department: payload.new.department_name,
            timestamp: new Date(payload.new.created_at || Date.now())
          });
        }
      })
      .subscribe();

    function handleRealtimeQueueEvent(payload) {
      if (payload.eventType === 'INSERT' && payload.new) {
        const tokenObj = formatSupabaseTokenRow(payload.new);
        setState(prev => {
          if (prev.tokens.some(t => t.id === tokenObj.id)) return prev;
          return {
            ...prev,
            tokens: [...prev.tokens, tokenObj]
          };
        });
      } else if (payload.eventType === 'UPDATE' && payload.new) {
        const row = payload.new;
        const tokenId = row.token_id || row.id;
        setState(prev => ({
          ...prev,
          tokens: prev.tokens.map(t => t.id === tokenId ? {
            ...t,
            status: row.status,
            completed_at: row.completed_at || t.completed_at
          } : t)
        }));
      } else if (payload.eventType === 'DELETE' && payload.old) {
        const tokenId = payload.old.token_id || payload.old.id;
        setState(prev => ({
          ...prev,
          tokens: prev.tokens.filter(t => t.id !== tokenId)
        }));
      }
    }

    return () => {
      supabase.removeChannel(queueChannel);
      supabase.removeChannel(notifChannel);
    };
  }, []);

  // ── Helper methods ────────────────────────────────────────────────────────
  const addNotification = useCallback((notification) => {
    setState(prev => ({
      ...prev,
      notifications: [
        { ...notification, id: notification.id || Date.now().toString(), timestamp: notification.timestamp || new Date() },
        ...prev.notifications
      ].slice(0, 10)
    }));
  }, []);

  const sendEmergencyNotification = useCallback((department) => {
    const affected = state.tokens.filter(t =>
      (t.primaryDepartment === department || t.department_name === department) &&
      t.type === 'common' &&
      (t.status === 'waiting' || t.status === 'active')
    );
    if (affected.length > 0) {
      addNotification({
        title: '🚨 Emergency Delay Alert',
        message: `Emergency case registered in ${department}. Expected delay: 15-20 minutes. Thank you for your patience.`,
        type: 'emergency_alert',
        department,
      });
    }
  }, [state.tokens, addNotification]);

  const calculateOptimalTime = useCallback((department, assignedDoctor) => {
    const dept = state.departments.find(d => d.name === department);
    if (!dept) return { time: new Date(), waitTime: 15, position: 1 };

    const now = new Date();
    const currentHour = now.getHours();
    const departmentTokens = state.tokens.filter(t =>
      (t.primaryDepartment === department || t.department_name === department) &&
      (t.status === 'waiting' || t.status === 'active')
    );
    let waitTimeMinutes = dept.averageWaitTime || 15;
    let queuePosition = departmentTokens.length + 1;
    const doctorCount = Math.max(1, dept.doctors?.length || 1);

    if (assignedDoctor) {
      const doctor = dept.doctors?.find(d => d.id === assignedDoctor || d.staff_id === assignedDoctor);
      if (doctor?.status === 'available') {
        const doctorTokens = departmentTokens.filter(t => t.doctor_id === assignedDoctor || t.assignedDoctor === assignedDoctor);
        queuePosition = doctorTokens.length + 1;
        waitTimeMinutes = Math.ceil((doctorTokens.length * waitTimeMinutes) / doctorCount);
      }
    }

    if (currentHour >= 10 && currentHour <= 12) waitTimeMinutes *= 1.5;
    else if (currentHour >= 14 && currentHour <= 16) waitTimeMinutes *= 1.3;

    const optimalTime = new Date(now.getTime() + Math.max(5, waitTimeMinutes) * 60000);
    const roundedMinutes = Math.ceil(optimalTime.getMinutes() / 15) * 15;
    optimalTime.setMinutes(roundedMinutes, 0, 0);

    return {
      time: optimalTime,
      waitTime: Math.max(5, Math.round(waitTimeMinutes)),
      position: Math.max(1, queuePosition)
    };
  }, [state.departments, state.tokens]);

  const addVisitToToken = (tokenId, visit) => {
    const newVisit = { ...visit, id: `visit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` };
    setState(prev => ({
      ...prev,
      tokens: prev.tokens.map(t => t.id === tokenId ? { ...t, visits: [...(t.visits || []), newVisit] } : t)
    }));
  };

  const addLabTestToToken = (tokenId, labTest) => {
    const newLabTest = { ...labTest, id: `lab-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` };
    setState(prev => ({
      ...prev,
      tokens: prev.tokens.map(t => t.id === tokenId ? { ...t, labTests: [...(t.labTests || []), newLabTest] } : t)
    }));
  };

  const completeConsultation = (consultationData) => {
    setState(prev => ({ ...prev, consultationData, currentView: 'consultation-completed' }));
  };

  const setAIRecommendation = (recommendation) => {
    setState(prev => ({ ...prev, aiRecommendation: recommendation }));
  };

  const toggleTheme = useCallback(() => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  }, []);

  return (
    <AppContext.Provider value={{
      state, setState, toggleTheme,
      sendEmergencyNotification, addNotification, calculateOptimalTime,
      addVisitToToken, addLabTestToToken,
      completeConsultation, setAIRecommendation,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
