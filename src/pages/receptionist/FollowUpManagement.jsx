import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import { useNavigate } from 'react-router-dom'
import { useFollowUps, usePatients } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Patient Management",
  "Patient Registration",
  "Appointment Management",
  "Queue Management",
  "Billing Collection",
  "Follow-up Management",
]

function FollowUpManagement() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Follow-up Management")

  const { followUps, updateStatus } = useFollowUps()
  const patients = usePatients()

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")              navigate('/receptionist')
    if (link === "Patient Management")     navigate('/receptionist/patients')
    if (link === "Patient Registration")   navigate('/receptionist/registration')
    if (link === "Appointment Management") navigate('/receptionist/appointments')
    if (link === "Queue Management")       navigate('/receptionist/queue')
    if (link === "Billing Collection")     navigate('/receptionist/billing')
    if (link === "Follow-up Management")   navigate('/receptionist/followup')
  }

  const enriched = followUps.map(f => ({
    ...f,
    patientName: patients.find(p => p.id === f.patientId)?.name || f.patientId,
  }))

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Follow-up Management</h2>
          <p className="text-sm text-gray-400">Follow-ups scheduled by doctors, tracked front-desk side</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatsCard icon="📅" label="Total Follow-ups" value={followUps.length} />
          <StatsCard icon="⏳" label="Scheduled" value={followUps.filter(f => f.status === "Scheduled").length} />
          <StatsCard icon="🔁" label="Rescheduled" value={followUps.filter(f => f.status === "Rescheduled").length} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Doctor</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Purpose</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {enriched.map(f => (
                <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 font-medium text-gray-800">{f.patientName}</td>
                  <td className="py-3 text-gray-500">{f.doctor}</td>
                  <td className="py-3 text-gray-700">{f.date}</td>
                  <td className="py-3 text-gray-600">{f.purpose}</td>
                  <td className="py-3 text-gray-500 text-xs">{f.status}</td>
                  <td className="py-3">
                    <button
                      onClick={() => updateStatus(f.id, "Rescheduled")}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Reschedule
                    </button>
                  </td>
                </tr>
              ))}
              {enriched.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400 text-sm">No follow-ups scheduled yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default FollowUpManagement