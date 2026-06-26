// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import ProtectedRoute from './routes/ProtectedRoute'

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import PatientConsultation from './pages/doctor/PatientConsultation'

// Lab pages
import LabDashboard from './pages/lab/LabDashboard'
import TestOrder from './pages/lab/TestOrder'
import SampleCollection from './pages/lab/SampleCollection'
import ResultEntry from './pages/lab/ResultEntry'
import ReportsManagement from './pages/lab/ReportsManagement'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

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
<Route path="/lab/sample-collection" element={
  <ProtectedRoute allowedRole="lab">
    <SampleCollection />
  </ProtectedRoute>
}/>
<Route path="/lab/result-entry" element={
  <ProtectedRoute allowedRole="lab">
    <ResultEntry />
  </ProtectedRoute>
}/>
<Route path="/lab/reports" element={
  <ProtectedRoute allowedRole="lab">
    <ReportsManagement />
  </ProtectedRoute>
}/>
        {/* Lab module */}
        <Route path="/lab" element={
          <ProtectedRoute allowedRole="lab">
            <LabDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/lab/test-order" element={
          <ProtectedRoute allowedRole="lab">
            <TestOrder />
          </ProtectedRoute>
        }/>

      </Routes>
    </BrowserRouter>
  )
}

export default App