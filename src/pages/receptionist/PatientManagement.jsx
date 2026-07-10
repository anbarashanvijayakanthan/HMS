import { useState } from 'react'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import { useNavigate } from 'react-router-dom'
import { usePatients, useQueue } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Patient Management",
  "Patient Registration",
  "Appointment Management",
  "Queue Management",
  "Billing Collection",
  "Follow-up Management",
]

const ITEMS_PER_PAGE = 7

const DEPT_STYLES = {
  Cardiology: "bg-red-50 text-red-600",
  General:    "bg-gray-100 text-gray-600",
  Ortho:      "bg-blue-50 text-blue-600",
  Neuro:      "bg-purple-50 text-purple-600",
  Emergency:  "bg-red-50 text-red-600",
}

function PatientManagement() {
  const navigate   = useNavigate()
  const [activeLink, setActiveLink] = useState("Patient Management")
  const [search, setSearch]         = useState('')
  const [page, setPage]             = useState(1)

  // ── Shared store ──
  const patients = usePatients()
  const { queue } = useQueue()

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")              navigate('/receptionist')
    if (link === "Patient Registration")   navigate('/receptionist/registration')
    if (link === "Appointment Management") navigate('/receptionist/appointments')
    if (link === "Queue Management")       navigate('/receptionist/queue')
    if (link === "Billing Collection")     navigate('/receptionist/billing')
    if (link === "Follow-up Management")   navigate('/receptionist/followup')
    if (link === "Patient Management")     navigate('/receptionist/patients')
  }

  // Enrich each patient with today's visit info, if they have one
  const enriched = patients.map(p => {
    const todayVisit = queue.find(v => v.patientId === p.id)
    return {
      ...p,
      lastVisit: todayVisit ? todayVisit.checkIn : "—",
      status: todayVisit ? (todayVisit.status === "Done" ? "Active" : "In Progress") : "Inactive",
    }
  })

  const filtered = enriched.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Patient Management</h2>
            <p className="text-sm text-gray-400">Search, view and manage all registered patients</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              ↑ Export
            </button>
            <button
              onClick={() => navigate('/receptionist/registration')}
              className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              + Register New
            </button>
          </div>
        </div>

        {/* Stats — now derived from real data */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="👥" label="Total Patients"    value={patients.length} />
          <StatsCard icon="👤" label="In Queue Today"    value={queue.length} />
          <StatsCard icon="💗" label="Active Cases"      value={enriched.filter(p => p.status === "In Progress").length} />
          <StatsCard icon="⏱️" label="Completed Today"   value={enriched.filter(p => p.status === "Active").length} />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          <div className="flex gap-2 mb-5">
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by name, ID or phone..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50">
              ⊟ Filter
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Patient ID</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Age / Gender</th>
                <th className="pb-3 font-medium">Phone</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Check-in Today</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 font-mono text-xs text-gray-500 font-semibold">{p.id}</td>
                  <td className="py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="py-3 text-gray-500">{p.age}/{p.gender?.charAt(0)}</td>
                  <td className="py-3 text-gray-500">{p.phone}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${DEPT_STYLES[p.department] || 'bg-gray-100 text-gray-600'}`}>
                      {p.department}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">{p.lastVisit}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.status === 'Active' ? 'bg-green-100 text-green-700'
                      : p.status === 'In Progress' ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-500'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/receptionist/patient/${p.id}`)}
                        className="text-xs text-gray-400 hover:text-blue-500 transition"
                      >
                        👁 View
                      </button>
                      <button className="text-xs text-gray-400 hover:text-blue-500 transition">
                        📅 Appt
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 text-sm">
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Showing {filtered.length === 0 ? 0 : ((page - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} patients
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PatientManagement