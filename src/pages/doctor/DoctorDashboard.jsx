import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import StatusBadge from '../../components/common/StatusBadge'
import { useNavigate } from 'react-router-dom'
import { useQueue, useAllVitals } from '../../store/hospitalStore'

// Dashboard has no specific patient selected yet — the other links need a
// token in the URL to work, so we don't show them here. They appear once
// a doctor clicks "Open Case" on a patient and lands on a token-based page.
const NAV_LINKS = ["Dashboard"]

// Statuses a doctor actually needs to see today
const DOCTOR_RELEVANT_STATUSES = ["Waiting", "Ready for Doctor", "With Doctor"]

function DoctorDashboard() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [activeLink, setActiveLink] = useState("Dashboard")

  // ── Shared store ──
  const { queue } = useQueue()
  const vitalsMap = useAllVitals()

  const doctorQueue = queue.filter(v => DOCTOR_RELEVANT_STATUSES.includes(v.status))
  const doneToday    = queue.filter(v => v.status === "Done").length
  const pendingCount = doctorQueue.length
  const criticalCount = queue.filter(v => v.priority === "Critical").length

  // NOTE: Every other sidebar link (Diagnosis, Prescription, Lab Order, etc.)
  // needs a :token in its route, and the Dashboard has no "current patient"
  // selected — it's a list of many. Routing there blind would just land on
  // "No patient found for token undefined". So those links stay inert here;
  // the real path in is "Open Case" on a row below, which carries the token.
  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard") navigate('/doctor')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

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

        {/* Stats Row — derived from the store */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <StatsCard icon="👤" label="Today's Patients"   value={queue.length} />
          <StatsCard icon="✅" label="Consultations Done" value={doneToday}  />
          <StatsCard icon="⏳" label="Pending"            value={pendingCount}  />
          <StatsCard icon="📅" label="Follow-ups Due"     value={3}  />
          <StatsCard icon="⚠️" label="Critical Cases"     value={criticalCount}  />
        </div>

        {/* Patient Queue Table — now from the shared store */}
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
                {doctorQueue.map(v => (
                  <tr key={v.token} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 font-mono text-xs text-gray-500">{v.token}</td>
                    <td className="py-3 font-medium text-blue-600 cursor-pointer hover:underline">
                      {v.patient?.name}
                    </td>
                    <td className="py-3 text-gray-500">
                      {v.patient?.age}{v.patient?.gender?.charAt(0)}
                    </td>
                    <td className="py-3"><StatusBadge status={vitalsMap[v.token] ? "Done" : "Pending"} /></td>
                    <td className="py-3"><StatusBadge status={v.priority} /></td>
                    <td className="py-3 text-gray-600 max-w-48">{v.complaint}</td>
                    <td className="py-3"><StatusBadge status={v.status} /></td>
                    <td className="py-3">
                      <button
                        onClick={() => navigate(`/doctor/consultation/${v.token}`)}
                        className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
                      >
                        Open Case
                      </button>
                    </td>
                  </tr>
                ))}
                {doctorQueue.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400 text-sm">
                      No patients waiting right now
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  )
}

export default DoctorDashboard