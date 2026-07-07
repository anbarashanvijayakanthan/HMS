// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import ProtectedRoute from './routes/ProtectedRoute'
import VitalsHistory from './pages/nurse/VitalsHistory'
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard'
import DispenseMedicine from './pages/pharmacy/DispenseMedicine'
import Billing from './pages/pharmacy/Billing'
import MedicineInventory from './pages/pharmacy/MedicineInventory'
import AddMedicine from './pages/pharmacy/AddMedicine'
import PrescriptionQueue from './pages/pharmacy/PrescriptionQueue'

// Receptionist pages
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard'
import PatientManagement from './pages/receptionist/PatientManagement'
import PatientDetail from './pages/receptionist/PatientDetail'
import PatientRegistration from './pages/receptionist/PatientRegistration'

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import PatientConsultation from './pages/doctor/PatientConsultation'
import Diagnosis from './pages/doctor/Diagnosis'
import Prescription from './pages/doctor/Prescription'
import LabOrder from './pages/doctor/LabOrder'
import RadiologyOrder from './pages/doctor/RadiologyOrder'
import FollowUpManager from './pages/doctor/FollowUpManager'

// Nurse pages
import NurseDashboard from './pages/nurse/NurseDashboard'
import PatientQueue from './pages/nurse/PatientQueue'
import VitalsEntry from './pages/nurse/VitalsEntry'

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

        {/* Receptionist module */}
        <Route path="/receptionist" element={
          <ProtectedRoute allowedRole="receptionist">
            <ReceptionistDashboard />
          </ProtectedRoute>
        } />
        <Route path="/receptionist/patients" element={
          <ProtectedRoute allowedRole="receptionist">
            <PatientManagement />
          </ProtectedRoute>
        } />
        <Route path="/receptionist/patient/:id" element={
          <ProtectedRoute allowedRole="receptionist">
            <PatientDetail />
          </ProtectedRoute>
        } />
        <Route path="/receptionist/registration" element={
          <ProtectedRoute allowedRole="receptionist">
            <PatientRegistration />
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
        <Route path="/doctor/diagnosis/:token" element={
          <ProtectedRoute allowedRole="doctor">
            <Diagnosis />
          </ProtectedRoute>
        }/>
        <Route path="/doctor/prescription/:token" element={
          <ProtectedRoute allowedRole="doctor">
            <Prescription />
          </ProtectedRoute>
        }/>
        <Route path="/doctor/lab-order/:token" element={
          <ProtectedRoute allowedRole="doctor">
            <LabOrder />
          </ProtectedRoute>
        }/>
        <Route path="/doctor/radiology-order/:token" element={
          <ProtectedRoute allowedRole="doctor">
            <RadiologyOrder />
          </ProtectedRoute>
        }/>
        <Route path="/doctor/followup/:token" element={
          <ProtectedRoute allowedRole="doctor">
            <FollowUpManager />
          </ProtectedRoute>
        }/>

        {/* Nurse module */}
        <Route path="/nurse" element={
          <ProtectedRoute allowedRole="nurse">
            <NurseDashboard />
          </ProtectedRoute>
        } />
        <Route path="/nurse/patient-queue" element={
          <ProtectedRoute allowedRole="nurse">
            <PatientQueue />
          </ProtectedRoute>
        } />
        <Route path="/nurse/vitals-entry" element={
          <ProtectedRoute allowedRole="nurse">
            <VitalsEntry />
          </ProtectedRoute>
        } />
        <Route path="/nurse/vitals-history" element={
          <ProtectedRoute allowedRole="nurse">
            <VitalsHistory />
          </ProtectedRoute>
        } />

        {/* Pharmacy module */}
        <Route path="/pharmacy" element={
          <ProtectedRoute allowedRole="pharmacy">
            <PharmacyDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/pharmacy/dispense/:rxId" element={
          <ProtectedRoute allowedRole="pharmacy">
            <DispenseMedicine />
          </ProtectedRoute>
        }/>
        <Route path="/pharmacy/dispense" element={
          <ProtectedRoute allowedRole="pharmacy">
            <DispenseMedicine />
          </ProtectedRoute>
        }/>
        <Route path="/pharmacy/billing" element={
          <ProtectedRoute allowedRole="pharmacy">
            <Billing />
          </ProtectedRoute>
        }/>
        <Route path="/pharmacy/inventory" element={
          <ProtectedRoute allowedRole="pharmacy">
            <MedicineInventory />
          </ProtectedRoute>
        }/>
        <Route path="/pharmacy/add-medicine" element={
          <ProtectedRoute allowedRole="pharmacy">
            <AddMedicine />
          </ProtectedRoute>
        }/>
        <Route path="/pharmacy/prescriptions" element={
          <ProtectedRoute allowedRole="pharmacy">
            <PrescriptionQueue />
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

      </Routes>
    </BrowserRouter>
  )
}

export default App