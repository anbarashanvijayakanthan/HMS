import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import { useLabOrders, usePatients, useLabResults } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Lab Dashboard",
  "Result Entry",
  "Reports Management",
]

const DELIVERY_FILTERS = ["All", "Sent", "Pending"]

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

function ReportViewModal({ report, onClose }) {
  if (!report) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">Report {report.reportId}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="flex flex-col gap-2 text-sm mb-4">
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-400">Patient</span>
            <span className="font-medium text-gray-800">{report.patient}</span>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-400">Doctor</span>
            <span className="font-medium text-gray-800">{report.doctor}</span>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-400">Generated</span>
            <span className="font-medium text-gray-800">{report.generated}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <div className="flex gap-2">
              <AbnormalBadge abnormal={report.abnormal} />
              <DeliveryBadge status={report.delivery} />
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400 font-medium mb-2">Results</p>
          <div className="flex flex-col gap-1.5">
            {(report.entries || []).map((e, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                <span className="text-gray-700">{e.param}</span>
                <span className="flex items-center gap-2">
                  <span className={`font-semibold ${e.flag === "H" ? "text-red-600" : e.flag === "L" ? "text-blue-600" : "text-gray-800"}`}>
                    {e.value || "—"} {e.unit}
                  </span>
                  {e.flag && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${e.flag === "H" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                      {e.flag}
                    </span>
                  )}
                </span>
              </div>
            ))}
            {(!report.entries || report.entries.length === 0) && (
              <p className="text-xs text-gray-400">No detailed entries recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportsManagement() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Reports Management")
  const [search, setSearch] = useState('')
  const [deliveryFilter, setDeliveryFilter] = useState('All')
  const [showFilter, setShowFilter] = useState(false)
  const [viewReport, setViewReport] = useState(null)

  const patients = usePatients()
  const { labResults, updateDelivery } = useLabResults()

  const reports = Object.entries(labResults).map(([orderId, result]) => {
    const patient = patients.find(p => p.id === result.patientId)
    return {
      reportId: orderId,
      patient: patient?.name || result.patientId,
      tests: result.testsText,
      generated: result.generatedAt,
      doctor: result.doctor,
      abnormal: result.abnormal,
      delivery: result.delivery,
      entries: result.entries,
    }
  })

  const handleNavClick = (link) => {
  setActiveLink(link)
  if (link === "Lab Dashboard")       navigate('/lab')
  if (link === "Result Entry")        navigate('/lab/result-entry')
  if (link === "Reports Management")  navigate('/lab/reports')
}

  const filtered = reports.filter(r => {
    const q = search.trim().toLowerCase()
    const matchSearch = !q ||
      r.patient.toLowerCase().includes(q) ||
      r.reportId.toLowerCase().includes(q) ||
      r.tests.toLowerCase().includes(q) ||
      (r.doctor || '').toLowerCase().includes(q)
    const matchDelivery = deliveryFilter === "All" || r.delivery === deliveryFilter
    return matchSearch && matchDelivery
  })

  const sentCount = reports.filter(r => r.delivery === "Sent").length
  const pendingCount = reports.filter(r => r.delivery === "Pending").length
  const abnormalCount = reports.filter(r => r.abnormal).length

  const [justSent, setJustSent] = useState(null) // reportId that was just sent, for inline confirmation

  const handleSend = (reportId) => {
    updateDelivery(reportId, "Sent")
    setJustSent(reportId)
    setTimeout(() => setJustSent(null), 3000) // confirmation fades after 3s
}


  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={handleNavClick}
      />

      <main className="flex-1 p-6 overflow-auto">

        <div className="text-xs text-gray-400 mb-4">
          <span>Lab Technician</span>
          <span className="mx-1.5">›</span>
          <span className="text-gray-600 font-medium">Reports Management</span>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reports Management</h2>
          <p className="text-sm text-gray-400">View, download and send lab reports</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="📄" label="Reports Total"    value={reports.length} />
          <StatsCard icon="📤" label="Sent to Doctors"  value={sentCount} />
          <StatsCard icon="⏳" label="Pending Delivery" value={pendingCount}  />
          <StatsCard icon="🔴" label="Flagged Abnormal" value={abnormalCount} subColor="text-red-500" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center gap-3 mb-5 relative">
            <input
              type="text"
              placeholder="Search patient, report, test or doctor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative">
              <button
                onClick={() => setShowFilter(v => !v)}
                className={`flex items-center gap-1.5 text-sm border px-3 py-2 rounded-lg transition ${
                  deliveryFilter !== "All"
                    ? "border-blue-400 text-blue-600 bg-blue-50"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                ⚙ Filter{deliveryFilter !== "All" ? `: ${deliveryFilter}` : ""}
              </button>
              {showFilter && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                  {DELIVERY_FILTERS.map(f => (
                    <button
                      key={f}
                      onClick={() => { setDeliveryFilter(f); setShowFilter(false) }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                        deliveryFilter === f ? "text-blue-600 font-medium" : "text-gray-600"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

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
                  <tr key={r.reportId} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 font-mono text-xs text-gray-500">{r.reportId}</td>
                    <td className="py-3 font-semibold text-gray-800">{r.patient}</td>
                    <td className="py-3 text-gray-500 text-xs max-w-36 truncate">{r.tests}</td>
                    <td className="py-3 text-gray-500 text-xs whitespace-nowrap">{r.generated}</td>
                    <td className="py-3 text-gray-500">{r.doctor}</td>
                    <td className="py-3"><AbnormalBadge abnormal={r.abnormal} /></td>
                    <td className="py-3"><DeliveryBadge status={r.delivery} /></td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setViewReport(r)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition"
                        >
                          👁 View
                        </button>
                        {r.delivery === "Pending" ? (
                          <button
                            onClick={() => handleSend(r.reportId)}
                            className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition"
                          >
                            ➤ Send
                          </button>
                        ) : justSent === r.reportId ? (
                            <span className="text-xs text-green-600 font-medium animate-pulse">✓ Sent to doctor</span>
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
                      {reports.length === 0
                        ? "No reports yet — complete a result entry first"
                        : "No reports match your search/filter"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      <ReportViewModal report={viewReport} onClose={() => setViewReport(null)} />
    </div>
  )
}

export default ReportsManagement