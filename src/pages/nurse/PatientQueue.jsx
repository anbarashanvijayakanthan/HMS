import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import StatusBadge from '../../components/common/StatusBadge'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  "Dashboard",
  "Patient Queue",
  "Vitals Entry",
  "Vitals History",
]

const STATUS_ORDER = ["Waiting", "With Nurse", "Ready for Doctor", "With Doctor", "Done"]

const INITIAL_PATIENTS = [
  { token: "T-001", name: "Arjun Mehta",      department: "Cardiology", checkIn: "08:45 AM", status: "Done",             lastUpdated: "10:20 AM" },
  { token: "T-007", name: "Kavitha Rajan",    department: "General",    checkIn: "09:20 AM", status: "With Doctor",      lastUpdated: "11:05 AM" },
  { token: "T-008", name: "Mohammed Farhan",  department: "General",    checkIn: "09:30 AM", status: "With Nurse",       lastUpdated: "11:10 AM" },
  { token: "T-009", name: "Sneha Patel",      department: "Cardiology", checkIn: "09:45 AM", status: "Ready for Doctor", lastUpdated: "11:08 AM" },
  { token: "T-010", name: "Rajesh Verma",     department: "Ortho",      checkIn: "10:00 AM", status: "Waiting",          lastUpdated: "10:00 AM" },
  { token: "T-011", name: "Anita Desai",      department: "General",    checkIn: "10:10 AM", status: "With Nurse",       lastUpdated: "11:00 AM" },
  { token: "T-012", name: "Vikram Nair",      department: "Neuro",      checkIn: "10:20 AM", status: "Waiting",          lastUpdated: "10:20 AM" },
  { token: "T-013", name: "Priya Krishnan",   department: "General",    checkIn: "10:35 AM", status: "Waiting",          lastUpdated: "10:35 AM" },
  { token: "T-002", name: "Riya Shah",        department: "General",    checkIn: "08:50 AM", status: "Done",             lastUpdated: "10:30 AM" },
  { token: "T-003", name: "Suresh Kumar",     department: "Ortho",      checkIn: "09:00 AM", status: "Done",             lastUpdated: "10:45 AM" },
]

const COLUMN_CONFIG = {
  "Waiting":          { label: "WAITING",           color: "border-yellow-400 bg-yellow-50",  headerColor: "text-yellow-600", countColor: "text-yellow-600" },
  "With Nurse":       { label: "WITH NURSE",         color: "border-blue-400 bg-blue-50",     headerColor: "text-blue-600",   countColor: "text-blue-600"   },
  "Ready for Doctor": { label: "READY FOR DOCTOR",   color: "border-purple-400 bg-purple-50", headerColor: "text-purple-600", countColor: "text-purple-600" },
  "With Doctor":      { label: "WITH DOCTOR",        color: "border-teal-400 bg-teal-50",     headerColor: "text-teal-600",   countColor: "text-teal-600"   },
  "Done":             { label: "DONE",               color: "border-green-400 bg-green-50",   headerColor: "text-green-600",  countColor: "text-green-600"  },
}

const STATUS_BADGE_STYLES = {
  "Done":             "bg-green-100 text-green-700",
  "With Doctor":      "bg-teal-100 text-teal-700",
  "With Nurse":       "bg-blue-100 text-blue-700",
  "Ready for Doctor": "bg-purple-100 text-purple-700",
  "Waiting":          "bg-yellow-100 text-yellow-700",
}

const DEPT_STYLES = {
  Cardiology: "bg-red-50 text-red-600",
  General:    "bg-gray-100 text-gray-600",
  Ortho:      "bg-blue-50 text-blue-600",
  Neuro:      "bg-purple-50 text-purple-600",
}

function PatientQueue() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [activeLink, setActiveLink] = useState("Patient Queue")
  const [patients, setPatients]     = useState(INITIAL_PATIENTS)
  const [search, setSearch]         = useState('')

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")      navigate('/nurse')
    if (link === "Vitals Entry")   navigate('/nurse/vitals-entry')
    if (link === "Vitals History") navigate('/nurse/vitals-history')
  }

  // Move patient to next status
  const handleMove = (token) => {
    setPatients(prev => prev.map(p => {
      if (p.token !== token) return p
      const idx = STATUS_ORDER.indexOf(p.status)
      if (idx < STATUS_ORDER.length - 1) {
        return { ...p, status: STATUS_ORDER[idx + 1], lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
      }
      return p
    }))
  }

  // Change status from table dropdown
  const handleStatusChange = (token, newStatus) => {
    setPatients(prev => prev.map(p =>
      p.token === token
        ? { ...p, status: newStatus, lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
        : p
    ))
  }

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.token.toLowerCase().includes(search.toLowerCase()) ||
    p.department.toLowerCase().includes(search.toLowerCase())
  )

  const byStatus = (status) => patients.filter(p => p.status === status)

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
            <h2 className="text-2xl font-bold text-gray-800">Patient Status Tracking</h2>
            <p className="text-sm text-gray-400">Real-time status board — all patients today</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>
            <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {STATUS_ORDER.map(status => {
            const col     = COLUMN_CONFIG[status]
            const colPats = byStatus(status)
            return (
              <div
                key={status}
                className={`rounded-xl border-2 ${col.color} p-3 min-h-48`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold tracking-wide ${col.headerColor}`}>
                    {col.label}
                  </span>
                  <span className={`text-sm font-bold ${col.countColor}`}>
                    {colPats.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2">
                  {colPats.map(p => {
                    const nextIdx = STATUS_ORDER.indexOf(p.status) + 1
                    const nextStatus = STATUS_ORDER[nextIdx]
                    return (
                      <div key={p.token} className="bg-white rounded-lg p-3 shadow-sm border border-white">
                        <p className="font-semibold text-gray-800 text-sm leading-tight">{p.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.token} · {p.department}</p>
                        {status !== "Done" && nextStatus && (
                          <button
                            onClick={() => handleMove(p.token)}
                            className="mt-2 flex items-center gap-1 text-xs text-gray-600 border border-gray-200 px-2 py-1 rounded-md hover:bg-gray-50 transition"
                          >
                            Move →
                          </button>
                        )}
                        {status === "Done" && (
                          <span className="mt-2 inline-block text-xs text-green-600 font-medium">✓ Completed</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Search */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Patient ID or Name
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search patient..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50">
              ⊟ Filter
            </button>
          </div>
        </div>

        {/* All Patients Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">All Patients Today</h3>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Token</th>
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Check-in</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Last Updated</th>
                <th className="pb-3 font-medium">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.token} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 font-mono text-xs text-gray-500 font-semibold">{p.token}</td>
                  <td className="py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${DEPT_STYLES[p.department] || 'bg-gray-100 text-gray-600'}`}>
                      {p.department}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">{p.checkIn}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGE_STYLES[p.status] || 'bg-gray-100 text-gray-600'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400 text-xs">{p.lastUpdated}</td>
                  <td className="py-3">
                    <select
                      value={p.status}
                      onChange={e => handleStatusChange(p.token, e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {STATUS_ORDER.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  )
}

export default PatientQueue