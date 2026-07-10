import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import StatusBadge from '../../components/common/StatusBadge'
import { useNavigate } from 'react-router-dom'
import { useQueue, useAllVitals } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Patient Queue",
  "Vitals Entry",
  "Vitals History",
]

const DEPT_STYLES = {
  Cardiology: "bg-red-100 text-red-700",
  General:    "bg-gray-100 text-gray-600",
  Ortho:      "bg-blue-100 text-blue-700",
  Neuro:      "bg-purple-100 text-purple-700",
  Emergency:  "bg-red-100 text-red-700",
}

const CRITICAL_ALERTS = [
  { name: "Anita Desai", detail: "SpO2: 88% — Below threshold", time: "5 min ago" },
  { name: "Vikram Nair", detail: "BP: 180/110 — Hypertensive Crisis", time: "12 min ago" },
]

const RECENT_ACTIVITY = [
  { time: "09:45 AM", text: "Vitals recorded for T-009 (Sneha Patel)", type: "green" },
  { time: "09:45 AM", text: "Critical alert raised for Anita",          type: "red"   },
  { time: "09:45 AM", text: "Vitals recorded for T-008 (Mohammed Farhan)", type: "green" },
  { time: "09:45 AM", text: "Patient T-009 marked as Ready for Doctor", type: "blue"  },
  { time: "09:45 AM", text: "New patient T-012 (Vikram Nair) added to queue", type: "blue" },
]

const DOT_COLORS = { green: "bg-green-500", red: "bg-red-500", blue: "bg-blue-500" }

function NurseDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Dashboard")
  const [search, setSearch] = useState("")

  // ── Shared store ──
  const { queue } = useQueue()
  const vitalsMap = useAllVitals()

  // Nurse cares about everything that isn't already Done
  const activeQueue = queue
    .filter(v => v.status !== "Done")
    .filter(v => {
      const name = v.patient?.name || ""
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        v.token.toLowerCase().includes(search.toLowerCase())
      )
    })

  const vitalsRecordedCount = Object.keys(vitalsMap).length
  const criticalCount = Object.values(vitalsMap).filter(v => v.critical).length

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Vitals Entry")   navigate('/nurse/vitals-entry')
    if (link === "Patient Queue")  navigate('/nurse/patient-queue')
    if (link === "Vitals History") navigate('/nurse/vitals-history')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Nurse Dashboard</h2>
            <p className="text-sm text-gray-400">
              Thursday, 19 June 2025 · Shift: 08:00–16:00 · Sister {user?.name}
            </p>
          </div>
          <button
            onClick={() => { setActiveLink("Vitals Entry"); navigate('/nurse/vitals-entry') }}
            className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            <span>❤️</span> Record Vitals
          </button>
        </div>

        {/* Stats — now partly derived from the store */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="👥" label="Patients Seen"   value={queue.length} sub={`${activeQueue.length} in progress`} subColor="text-orange-500" trend="up" />
          <StatsCard icon="💚" label="Vitals Recorded" value={vitalsRecordedCount} />
          <StatsCard icon="⏳" label="Queue Waiting"   value={queue.filter(v => v.status === "Waiting").length}  />
          <StatsCard icon="⚠️" label="Critical Alerts" value={criticalCount}  subColor="text-red-500" />
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

        {/* Two-column layout: queue + right panel */}
        <div className="flex gap-4">

          {/* Active Patient Queue — now from the shared store */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Active Patient Queue</h3>
              <button className="text-xs text-gray-400 border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-50">
                ↻ Refresh
              </button>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Token</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Department</th>
                  <th className="pb-3 font-medium">Check-in</th>
                  <th className="pb-3 font-medium">Vitals</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeQueue.map(v => (
                  <tr key={v.token} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 font-mono text-xs text-gray-500 font-semibold">{v.token}</td>
                    <td className="py-3 font-medium text-gray-800">{v.patient?.name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${DEPT_STYLES[v.department] || "bg-gray-100 text-gray-600"}`}>
                        {v.department}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-xs">{v.checkIn}</td>
                    <td className="py-3"><StatusBadge status={vitalsMap[v.token] ? "Done" : "Pending"} /></td>
                    <td className="py-3"><StatusBadge status={v.status} /></td>
                    <td className="py-3">
                      <button
                        onClick={() => navigate(`/nurse/vitals-entry?token=${v.token}`)}
                        className="flex items-center gap-1.5 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
                      >
                        ❤️ Record
                      </button>
                    </td>
                  </tr>
                ))}
                {activeQueue.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400 text-sm">
                      No active patients right now
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Right Panel — unchanged for now */}
          <div className="w-80 flex flex-col gap-4 shrink-0">

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                <span>⚠️</span> Critical Alerts
              </h3>
              <div className="flex flex-col gap-3">
                {CRITICAL_ALERTS.map((alert, i) => (
                  <div key={i} className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <p className="font-semibold text-red-700 text-sm">{alert.name}</p>
                    <p className="text-red-600 text-xs mt-0.5">{alert.detail}</p>
                    <p className="text-gray-400 text-xs mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>🕐</span> Recent Activity
              </h3>
              <div className="flex flex-col gap-3">
                {RECENT_ACTIVITY.map((act, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-xs text-gray-400 shrink-0 w-16 pt-0.5">{act.time}</span>
                    <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${DOT_COLORS[act.type]}`} />
                    <p className={`text-xs leading-relaxed ${act.type === 'red' ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      {act.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

export default NurseDashboard