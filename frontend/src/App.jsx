import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

import Header from './components/Header';
import PatientPortalPage from './pages/PatientPortalPage';
import PatientRegistrationPage from './pages/PatientRegistrationPage';
import MedicalServicesDashboardPage from './pages/MedicalServicesDashboardPage';
import CommonUserFlowPage from './pages/CommonUserFlowPage';
import EmergencyUserFlowPage from './pages/EmergencyUserFlowPage';
import DisabledUserFlowPage from './pages/DisabledUserFlowPage';
import TokenDisplayPage from './pages/TokenDisplayPage';
import StaffLoginPage from './pages/StaffLoginPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import DepartmentStatsPage from './pages/DepartmentStatsPage';
import PatientHistoryPage from './pages/PatientHistoryPage';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: 'Inter, sans-serif',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(30,58,138,.14)',
              },
              success: { duration: 3000 },
              error: { duration: 5000 },
            }}
          />
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Header />
            <main style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
              <Routes>
                {/* Patient routes */}
                <Route path="/" element={<PatientPortalPage />} />
                <Route path="/register" element={<PatientRegistrationPage />} />
                <Route path="/dashboard" element={<MedicalServicesDashboardPage />} />
                <Route path="/flow/common" element={<CommonUserFlowPage />} />
                <Route path="/flow/emergency" element={<EmergencyUserFlowPage />} />
                <Route path="/flow/disabled" element={<DisabledUserFlowPage />} />
                <Route path="/queue/common" element={<CommonUserFlowPage />} />
                <Route path="/queue/emergency" element={<EmergencyUserFlowPage />} />
                <Route path="/queue/disabled" element={<DisabledUserFlowPage />} />
                <Route path="/token" element={<TokenDisplayPage />} />
                <Route path="/department-stats" element={<DepartmentStatsPage />} />
                <Route path="/history" element={<PatientHistoryPage />} />

                {/* Staff routes */}
                <Route path="/staff/login" element={<StaffLoginPage />} />
                <Route path="/staff/dashboard" element={<StaffDashboardPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
