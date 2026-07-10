import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import StatusBadge from '../../components/common/StatusBadge'
import { useNavigate } from 'react-router-dom'
import { useQueue, useAppointments, usePatients } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Patient Management",
  "Patient Registration",
  "Appointment Management",
  "Queue Management",
  "Billing Collection",
  "Follow-up Management",
]

const TYPE_STYLES = {
  Consultation: "bg-blue-50 text-blue-600",
  "Follow-up":  "bg-purple-50 text-purple-600",
  "New Patient":"bg-orange-50 text-orange-600",
  Review:       "bg-gray-100 text-gray-600",
  Scheduled:    "bg-gray-100 text-gray-600",
}

const QUICK_ACTIONS = [
  { label: "Register Patient",   icon: "👤", color: "text-blue-500",   bg: "bg-blue-50"   },
  { label: "Book Appointment",   icon: "📅", color: "text-purple-500", bg: "bg-purple-50" },
  { label: "Add to Queue",       icon: "📋", color: "text-orange-500", bg: "bg-orange-50" },
  { label: "Collect Bill",       icon: "💳", color: "text-green-500",  bg: "bg-green-50"  },
]

function ReceptionistDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Dashboard")
  const [search, setSearch] = useState('')

  // ── Shared store ──
  const { queue } = useQueue()
  const { appointments } = useAppointments()
  const patients = usePatients()

  const liveQueue = queue.filter(v => v.status !== "Done").slice(0, 5)

  const enrichedAppointments = appointments.map(a => ({
    ...a,
    patientName: patients.find(p => p.id === a.patientId)?.name || a.patientId,
  }))

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Patient Management")     navigate('/receptionist/patients')
    if (link === "Patient Registration")   navigate('/receptionist/registration')
    if (link === "Appointment Management") navigate('/receptionist/appointments')
    if (link === "Queue Management")       navigate('/receptionist/queue')
    if (link === "Billing Collection")     navigate('/receptionist/billing')
    if (link === "Follow-up Management")   navigate('/receptionist/followup')
  }

  const filtered = enrichedAppointments.filter(a =>
    a.patientName.toLowerCase().includes(search.toLowerCase()) ||
    a.patientId.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={handleNavClick}
      />

      <main className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Receptionist Dashboard</h2>
            <p className="text-sm text-gray-400">
              Thursday, 19 June 2025 · Good morning, {user?.name}
            </p>
          </div>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
            ↻ Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="👥" label="Today's Patients"  value={queue.length} sub="+12% vs yesterday" subColor="text-green-500" trend="up" />
          <StatsCard icon="📅" label="Appointments"      value={appointments.length} sub={`${appointments.filter(a => a.status === "Scheduled").length} pending`} subColor="text-orange-400" />
          <StatsCard icon="🔢" label="In Queue"          value={liveQueue.length} sub="Avg wait 14 min" subColor="text-gray-400" />
          <StatsCard icon="💲" label="Billing Pending"   value="₹18,400"   sub="5 unpaid invoices" subColor="text-red-400" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action.label}
              className={`${action.bg} rounded-xl p-5 flex flex-col items-center gap-2 border border-transparent hover:border-gray-200 transition`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className={`text-sm font-semibold ${action.color}`}>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID or phone..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50">
            ⊟ Filter
          </button>
        </div>

        {/* Bottom: Appointments + Live Queue */}
        <div className="flex gap-4">

          {/* Today's Appointments — now from the shared store */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Today's Appointments</h3>
              <button
                onClick={() => navigate('/receptionist/appointments')}
                className="text-xs text-blue-500 hover:underline"
              >
                View All
              </button>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Doctor</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3">
                      <p className="font-medium text-gray-800">{a.patientName}</p>
                      <p className="text-xs text-gray-400">{a.patientId}</p>
                    </td>
                    <td className="py-3 text-gray-600">{a.doctor}</td>
                    <td className="py-3 text-gray-500">{a.time}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${TYPE_STYLES[a.type] || 'bg-gray-100 text-gray-600'}`}>
                        {a.type}
                      </span>
                    </td>
                    <td className="py-3"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Live Queue — from the shared store */}
          <div className="w-72 bg-white rounded-xl shadow-sm border border-gray-100 p-5 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Live Queue</h3>
              <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {liveQueue.map(v => {
                const serving = v.status === "With Doctor"
                return (
                  <div
                    key={v.token}
                    className={`flex items-center gap-3 p-3 rounded-lg ${serving ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}
                  >
                    <span className="text-xs font-bold text-gray-500 w-10 shrink-0">{v.token}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{v.patient?.name}</p>
                      <p className="text-xs text-gray-400">{v.department}</p>
                    </div>
                    {serving
                      ? <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium shrink-0">Serving</span>
                      : <span className="text-xs text-gray-400 shrink-0">{v.status}</span>
                    }
                  </div>
                )
              })}
              {liveQueue.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No one in queue</p>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default ReceptionistDashboard