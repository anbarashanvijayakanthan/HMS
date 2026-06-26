import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import ProtectedRoute from './routes/ProtectedRoute'
import VitalsHistory from './pages/nurse/VitalsHistory'

// Doctor pages
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import PatientConsultation from './pages/doctor/PatientConsultation'
import NurseDashboard from './pages/nurse/NurseDashboard'
import PatientQueue from './pages/nurse/PatientQueue'
import VitalsEntry from './pages/nurse/VitalsEntry'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route path="/receptionist" element={
          <ProtectedRoute allowedRole="receptionist">
            <ReceptionistDashboard />
          </ProtectedRoute>
        } />

        {/* Doctor module */}
        <Route path="/doctor" element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/doctor/consultation/:token" element={
          <ProtectedRoute allowedRole="doctor">
            <PatientConsultation />
          </ProtectedRoute>
        }/>

      <Route path="/nurse/patient-queue" element={
        <ProtectedRoute allowedRole="nurse"><PatientQueue /></ProtectedRoute>
      } />

      <Route path="/nurse" element={<ProtectedRoute allowedRole="nurse"><NurseDashboard /></ProtectedRoute>} />
      <Route path="/nurse/vitals-entry" element={<ProtectedRoute allowedRole="nurse"><VitalsEntry /></ProtectedRoute>} />
      <Route path="/nurse/vitals-history" element={
        <ProtectedRoute allowedRole="nurse"><VitalsHistory /></ProtectedRoute>
      } />
      </Routes>
    </BrowserRouter>
  )
}

export default App