import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import StatusBadge from '../../components/common/StatusBadge'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  "Dashboard",
  "Patient Consultation",
  "Diagnosis",
  "Prescription",
  "Lab Order",
  "Radiology Order",
  "Follow-up Manager",
]

const PATIENT_QUEUE = [
  {
    token: "T-007",
    name: "Rajan",
    age: "28F",
    vitals: "Done",
    priority: "Normal",
    complaint: "Persistent cough, 3 days",
    status: "Waiting",
  },
  {
    token: "T-009",
    name: "Sneha Patel",
    age: "31F",
    vitals: "Done",
    priority: "Normal",
    complaint: "Chest pain, palpitations",
    status: "Ready",
  },
  {
    token: "T-010",
    name: "Rajesh Verma",
    age: "56M",
    vitals: "Pending",
    priority: "Urgent",
    complaint: "Hypertension follow-up",
    status: "Waiting",
  },
  {
    token: "T-012",
    name: "Rao",
    age: "67M",
    vitals: "Done",
    priority: "Normal",
    complaint: "Knee pain, post-op review",
    status: "Waiting",
  },
]

function DoctorDashboard() {
  const { user } = useAuth()
  const [activeLink, setActiveLink] = useState("Dashboard")
const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={setActiveLink}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h2>
            <p className="text-sm text-gray-400">
              Thursday, 19 June 2025 · Dr. {user?.name} · Cardiology
            </p>
          </div>
          <button className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
            ↻ Refresh
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <StatsCard icon="👤" label="Today's Patients"   value={12} />
          <StatsCard icon="✅" label="Consultations Done" value={6}  />
          <StatsCard icon="⏳" label="Pending"            value={4}  />
          <StatsCard icon="📅" label="Follow-ups Due"     value={3}  />
          <StatsCard icon="⚠️" label="Critical Cases"     value={3}  />
        </div>

        {/* Patient Queue Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">
            Today's Patient Queue
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Token</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Age</th>
                  <th className="pb-3 font-medium">Vitals</th>
                  <th className="pb-3 font-medium">Priority</th>
                  <th className="pb-3 font-medium">Chief Complaint</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {PATIENT_QUEUE.map(p => (
                  <tr
                    key={p.token}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 font-mono text-xs text-gray-500">{p.token}</td>
                    <td className="py-3 font-medium text-blue-600 cursor-pointer hover:underline">{p.name}</td>
                    <td className="py-3 text-gray-500">{p.age}</td>
                    <td className="py-3"><StatusBadge status={p.vitals} /></td>
                    <td className="py-3"><StatusBadge status={p.priority} /></td>
                    <td className="py-3 text-gray-600 max-w-48">{p.complaint}</td>
                    <td className="py-3"><StatusBadge status={p.status} /></td>
                    <td className="py-3">
                    <button
                    onClick={() => navigate(`/doctor/consultation/${p.token}`)}
                    className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
                    >
                    Open Case
                    </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  )
}

export default DoctorDashboard