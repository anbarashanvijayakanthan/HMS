import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Fake users for now — later replace with real API call
const FAKE_USERS = [
  { id: 1, name: 'Priya Sharma', role: 'doctor',       token: 'fake-token-doctor' },
  { id: 2, name: 'Sarah',        role: 'receptionist', token: 'fake-token-rec'    },
  { id: 3, name: 'Meena Pillai', role: 'nurse',        token: 'fake-token-nurse'  },
  { id: 4, name: 'Raj Mehta',    role: 'pharmacy',     token: 'fake-token-pharma' },
  { id: 5, name: 'Vijay Srinivas',role: 'lab',         token: 'fake-token-lab'    },
  { id: 6, name: 'Super Admin', role: 'admin', token: 'fake-token-admin' },
  { id: 7, name: 'Anil Kumar', role: 'ipmanager', token: 'fake-token-ipmanager' }

]

const ROLE_ROUTES = {
  doctor:       '/doctor',
  receptionist: '/receptionist',
  nurse:        '/nurse',
  pharmacy:     '/pharmacy',
  lab:          '/lab',
  admin: '/admin',
  ipmanager: '/ip'

}

function Login() {
  const [role, setRole]     = useState('doctor')
  const [error, setError]   = useState('')
  const { login }           = useAuth()
  const navigate            = useNavigate()

  const handleLogin = () => {
    const user = FAKE_USERS.find(u => u.role === role)
    if (user) {
      login(user, user.token)
      navigate(ROLE_ROUTES[role])
    } else {
      setError('Invalid role')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">

        {/* Logo */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-blue-600">MediCare HMS</h1>
          <p className="text-sm text-gray-400">Hospital Management System</p>
        </div>

        {/* Role Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Login as
          </label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
            <option value="nurse">Nurse</option>
            <option value="pharmacy">Pharmacist</option>
            <option value="lab">Lab Technician</option>
            <option value="ipmanager">IP Manager</option>
            <option value="admin">Admin</option>

          </select>
        </div>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Login
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          * Using mock login — backend connect later
        </p>
      </div>
    </div>
  )
}

export default Login