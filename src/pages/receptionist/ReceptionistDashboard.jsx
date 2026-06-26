import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import StatusBadge from '../../components/common/StatusBadge'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  "Dashboard",
  "Patient Management",
  "Patient Registration",
  "Appointment Management",
  "Queue Management",
  "Billing Collection",
  "Follow-up Management",
]

const APPOINTMENTS = [
  { patient: "Arjun Mehta",     pid: "P-1042", doctor: "Dr. Priya Sharma", time: "09:00 AM", type: "Consultation", status: "Completed"   },
  { patient: "Kavitha Rajan",   pid: "P-1043", doctor: "Dr. Ravi Kumar",   time: "09:30 AM", type: "Follow-up",    status: "In Progress" },
  { patient: "Mohammed Farhan", pid: "P-1044", doctor: "Dr. Priya Sharma", time: "10:00 AM", type: "New Patient",  status: "Waiting"     },
  { patient: "Sneha Patel",     pid: "P-1045", doctor: "Dr. Arun Nair",    time: "10:30 AM", type: "Consultation", status: "Scheduled"   },
  { patient: "Rajesh Verma",    pid: "P-1046", doctor: "Dr. Ravi Kumar",   time: "11:00 AM", type: "Review",       status: "Scheduled"   },
]

const LIVE_QUEUE = [
  { token: "T-008", name: "Mohammed Farhan", dept: "General",    wait: null,     serving: true  },
  { token: "T-009", name: "Sneha Patel",     dept: "Cardiology", wait: "14 min", serving: false },
  { token: "T-010", name: "Rajesh Verma",    dept: "Ortho",      wait: "28 min", serving: false },
  { token: "T-011", name: "Anita Desai",     dept: "General",    wait: "35 min", serving: false },
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

  const handleNavClick = (link) => {
    setActiveLink(link)
  }

  const filtered = APPOINTMENTS.filter(a =>
    a.patient.toLowerCase().includes(search.toLowerCase()) ||
    a.pid.toLowerCase().includes(search.toLowerCase()) ||
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
          <StatsCard icon="👥" label="Today's Patients"  value={47}        sub="+12% vs yesterday" subColor="text-green-500" trend="up" />
          <StatsCard icon="📅" label="Appointments"      value={23}        sub="6 pending"         subColor="text-orange-400" />
          <StatsCard icon="🔢" label="In Queue"          value={8}         sub="Avg wait 14 min"   subColor="text-gray-400" />
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

          {/* Today's Appointments */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Today's Appointments</h3>
              <button className="text-xs text-blue-500 hover:underline">View All</button>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Doctor</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3">
                      <p className="font-medium text-gray-800">{a.patient}</p>
                      <p className="text-xs text-gray-400">{a.pid}</p>
                    </td>
                    <td className="py-3 text-gray-600">{a.doctor}</td>
                    <td className="py-3 text-gray-500">{a.time}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${TYPE_STYLES[a.type] || 'bg-gray-100 text-gray-600'}`}>
                        {a.type}
                      </span>
                    </td>
                    <td className="py-3"><StatusBadge status={a.status} /></td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-gray-400 hover:text-blue-500 transition">👁 View</button>
                        <button className="text-xs text-gray-400 hover:text-blue-500 transition">✏️ Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Live Queue */}
          <div className="w-72 bg-white rounded-xl shadow-sm border border-gray-100 p-5 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Live Queue</h3>
              <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {LIVE_QUEUE.map(q => (
                <div
                  key={q.token}
                  className={`flex items-center gap-3 p-3 rounded-lg ${q.serving ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}
                >
                  <span className="text-xs font-bold text-gray-500 w-10 shrink-0">{q.token}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{q.name}</p>
                    <p className="text-xs text-gray-400">{q.dept}</p>
                  </div>
                  {q.serving
                    ? <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium shrink-0">Serving</span>
                    : <span className="text-xs text-gray-400 shrink-0">{q.wait}</span>
                  }
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default ReceptionistDashboard