import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import StatusBadge from '../../components/common/StatusBadge'
import { useNavigate } from 'react-router-dom'
import { useQueue, useAllVitals, useLabResults, usePatients } from '../../store/hospitalStore'

const NAV_LINKS = ["Dashboard"]

const DOCTOR_RELEVANT_STATUSES = ["Waiting", "Ready for Doctor", "With Doctor"]

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
            <span className="font-medium text-gray-800">{report.patientName}</span>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-400">Tests</span>
            <span className="font-medium text-gray-800 text-right max-w-64">{report.testsText}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Generated</span>
            <span className="font-medium text-gray-800">{report.generatedAt}</span>
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

function DoctorDashboard() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [activeLink, setActiveLink] = useState("Dashboard")

  // ── Shared store ──
  const { queue } = useQueue()
  const vitalsMap = useAllVitals()
  const { labResults } = useLabResults()
  console.log('LAB RESULTS:', labResults)
  const patients = usePatients()

  const doctorQueue = queue.filter(v => DOCTOR_RELEVANT_STATUSES.includes(v.status))
  const doneToday    = queue.filter(v => v.status === "Done").length
  const pendingCount = doctorQueue.length
  const criticalCount = queue.filter(v => v.priority === "Critical").length

  const [refreshing, setRefreshing] = useState(false)
  const [viewReport, setViewReport] = useState(null)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 600)
  }

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard") navigate('/doctor')
  }

  // Match the same "Dr. X" formatting LabOrder.jsx uses when it creates the order,
  // so reports actually match up with whoever ordered them.
  const doctorName = user?.name?.trim().startsWith('Dr.') ? user.name : `Dr. ${user?.name}`
  console.log('LOOKING FOR DOCTOR NAME:', doctorName)

  const myReports = Object.entries(labResults)
    .map(([orderId, result]) => ({ reportId: orderId, ...result }))
    .filter(r => r.doctor === doctorName && r.delivery === "Sent")
    .map(r => ({
      ...r,
      patientName: patients.find(p => p.id === r.patientId)?.name || r.patientId,
    }))
    // newest reports first isn't tracked with a real timestamp, so just reverse insertion order
    .reverse()

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
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <span className={refreshing ? "inline-block animate-spin" : ""}>↻</span> Refresh
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <StatsCard icon="👤" label="Today's Patients"   value={queue.length} />
          <StatsCard icon="✅" label="Consultations Done" value={doneToday}  />
          <StatsCard icon="⏳" label="Pending"            value={pendingCount}  />
          <StatsCard icon="📅" label="Follow-ups Due"     value={3}  />
          <StatsCard icon="⚠️" label="Critical Cases"     value={criticalCount}  />
          <StatsCard icon="🧪" label="New Lab Reports"    value={myReports.length} subColor="text-blue-500" />
        </div>

        {/* New Lab Reports — populated as soon as the lab hits Send */}
        {myReports.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-500">🧪</span>
              <h3 className="font-semibold text-gray-700">New Lab Reports</h3>
              <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {myReports.length}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {myReports.map(r => (
                <div
                  key={r.reportId}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 border ${
                    r.abnormal ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{r.patientName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.testsText}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Generated: {r.generatedAt}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {r.abnormal && (
                      <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                        Abnormal
                      </span>
                    )}
                    <button
                      onClick={() => setViewReport(r)}
                      className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

      <ReportViewModal report={viewReport} onClose={() => setViewReport(null)} />
    </div>
  )
}

export default DoctorDashboard