import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import { useLabOrders, usePatients, useLabResults } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Lab Dashboard",
  "Test Order",
  "Sample Collection",
  "Result Entry",
  "Reports Management",
]

function DeliveryBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
      status === "Sent" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-500"
    }`}>
      {status}
    </span>
  )
}

function AbnormalBadge({ abnormal }) {
  return abnormal ? (
    <span className="bg-red-50 text-red-500 border border-red-200 text-xs font-medium px-2.5 py-1 rounded-full">
      Abnormal Values
    </span>
  ) : (
    <span className="bg-green-50 text-green-600 border border-green-200 text-xs font-medium px-2.5 py-1 rounded-full">
      All Normal
    </span>
  )
}

function ReportsManagement() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Reports Management")
  const [search, setSearch] = useState('')

  // ── Shared store ──
  const { labOrders } = useLabOrders()
  const patients = usePatients()
  const { labResults, updateDelivery } = useLabResults()

  // A "report" only exists once a result has been saved for that order
  const reports = Object.entries(labResults).map(([orderId, result]) => {
    const order = labOrders.find(o => o.orderId === orderId)
    const patient = patients.find(p => p.id === result.patientId)
    return {
      reportId: orderId,
      patient: patient?.name || result.patientId,
      tests: result.testsText,
      generated: result.generatedAt,
      doctor: result.doctor,
      abnormal: result.abnormal,
      delivery: result.delivery,
    }
  })

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Lab Dashboard")       navigate('/lab')
    if (link === "Test Order")          navigate('/lab/test-order')
    if (link === "Sample Collection")   navigate('/lab/sample-collection')
    if (link === "Result Entry")        navigate('/lab/result-entry')
    if (link === "Reports Management")  navigate('/lab/reports')
  }

  const filtered = reports.filter(r =>
    r.patient.toLowerCase().includes(search.toLowerCase()) ||
    r.reportId.toLowerCase().includes(search.toLowerCase()) ||
    r.tests.toLowerCase().includes(search.toLowerCase())
  )

  const sentCount = reports.filter(r => r.delivery === "Sent").length
  const pendingCount = reports.filter(r => r.delivery === "Pending").length
  const abnormalCount = reports.filter(r => r.abnormal).length

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={handleNavClick}
      />

      <main className="flex-1 p-6 overflow-auto">

        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-4">
          <span>Lab Technician</span>
          <span className="mx-1.5">›</span>
          <span className="text-gray-600 font-medium">Reports Management</span>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reports Management</h2>
          <p className="text-sm text-gray-400">View, download and send lab reports</p>
        </div>

        {/* Stats Row — derived from real saved results */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="📄" label="Reports Total"    value={reports.length} />
          <StatsCard icon="📤" label="Sent to Doctors"  value={sentCount} />
          <StatsCard icon="⏳" label="Pending Delivery" value={pendingCount}  />
          <StatsCard icon="🔴" label="Flagged Abnormal" value={abnormalCount} subColor="text-red-500" />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          {/* Search + Filter */}
          <div className="flex items-center gap-3 mb-5">
            <input
              type="text"
              placeholder="Search patient or report..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition">
              ⚙ Filter
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100 text-xs uppercase tracking-wide">
                  <th className="pb-3 font-medium">Report ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Tests</th>
                  <th className="pb-3 font-medium">Generated</th>
                  <th className="pb-3 font-medium">Doctor</th>
                  <th className="pb-3 font-medium">Abnormal Values</th>
                  <th className="pb-3 font-medium">Delivery</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr
                    key={r.reportId}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 font-mono text-xs text-gray-500">{r.reportId}</td>
                    <td className="py-3 font-semibold text-gray-800">{r.patient}</td>
                    <td className="py-3 text-gray-500 text-xs max-w-36 truncate">{r.tests}</td>
                    <td className="py-3 text-gray-500 text-xs whitespace-nowrap">{r.generated}</td>
                    <td className="py-3 text-gray-500">{r.doctor}</td>
                    <td className="py-3"><AbnormalBadge abnormal={r.abnormal} /></td>
                    <td className="py-3"><DeliveryBadge status={r.delivery} /></td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition">
                          👁 View
                        </button>
                        {r.delivery === "Pending" ? (
                          <button
                            onClick={() => updateDelivery(r.reportId, "Sent")}
                            className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition"
                          >
                            ➤ Send
                          </button>
                        ) : (
                          <span className="text-xs text-green-600 font-medium">✓ Sent</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400 text-sm">
                      No reports yet — complete a result entry first
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

export default ReportsManagement