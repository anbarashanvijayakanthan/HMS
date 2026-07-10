import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import { useLabOrders, usePatients } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Lab Dashboard",
  "Test Order",
  "Sample Collection",
  "Result Entry",
  "Reports Management",
]

const PRIORITY_STYLES = {
  STAT:    "bg-red-100 text-red-600 font-semibold",
  Urgent:  "bg-orange-100 text-orange-600 font-semibold",
  Routine: "bg-gray-100 text-gray-600",
}

const STATUS_STYLES = {
  Pending:           "bg-orange-100 text-orange-600",
  Processing:        "bg-purple-100 text-purple-700",
  "Sample Collected":"bg-blue-100 text-blue-700",
  Completed:         "bg-green-100 text-green-700",
}

function PriorityBadge({ priority }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${PRIORITY_STYLES[priority] || "bg-gray-100 text-gray-600"}`}>
      {priority}
    </span>
  )
}

function LabStatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  )
}

function LabDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Lab Dashboard")
  const [search, setSearch] = useState('')

  // ── Shared store ──
  const { labOrders } = useLabOrders()
  const patients = usePatients()

  const enriched = labOrders.map(o => ({
    ...o,
    patientName: patients.find(p => p.id === o.patientId)?.name || o.patientId,
    testsText: o.tests.map(t => t.name).join(', '),
  }))

  const pendingOrders = enriched.filter(o => o.status !== "Completed")
  const filtered = pendingOrders.filter(o =>
    o.patientName.toLowerCase().includes(search.toLowerCase()) ||
    o.orderId.toLowerCase().includes(search.toLowerCase()) ||
    o.testsText.toLowerCase().includes(search.toLowerCase())
  )

  const statAlerts = enriched.filter(o => o.priority === "STAT" && o.status !== "Completed")

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Lab Dashboard")       navigate('/lab')
    if (link === "Test Order")          navigate('/lab/test-order')
    if (link === "Sample Collection")   navigate('/lab/sample-collection')
    if (link === "Result Entry")        navigate('/lab/result-entry')
    if (link === "Reports Management")  navigate('/lab/reports')
  }

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
            <h2 className="text-2xl font-bold text-gray-800">Laboratory Dashboard</h2>
            <p className="text-sm text-gray-400">
              Thursday, 19 June 2025 · Lab Tech: {user?.name}
            </p>
          </div>
        </div>

        {/* Stats Row — derived from the store */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="🧪" label="Total Orders"      value={labOrders.length} />
          <StatsCard icon="⏳" label="Pending"            value={labOrders.filter(o => o.status === "Pending").length} />
          <StatsCard icon="✅" label="Completed"          value={labOrders.filter(o => o.status === "Completed").length} />
          <StatsCard icon="⚠️" label="STAT Orders"        value={statAlerts.length} subColor="text-red-500" />
        </div>

        {/* Pending Test Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Pending Test Orders</h3>
            <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2.5 py-1 rounded-full">
              {pendingOrders.length} Pending
            </span>
          </div>

          {/* Search + Filter */}
          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              placeholder="Search order, patient or test..."
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
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Doctor</th>
                  <th className="pb-3 font-medium">Tests</th>
                  <th className="pb-3 font-medium">Priority</th>
                  <th className="pb-3 font-medium">Ordered</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr
                    key={order.orderId}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 font-mono text-xs text-gray-500">{order.orderId}</td>
                    <td className="py-3 font-medium text-gray-800">{order.patientName}</td>
                    <td className="py-3 text-gray-500">{order.doctor}</td>
                    <td className="py-3 text-gray-600 max-w-48 truncate">{order.testsText}</td>
                    <td className="py-3"><PriorityBadge priority={order.priority} /></td>
                    <td className="py-3 text-gray-500">{order.ordered}</td>
                    <td className="py-3"><LabStatusBadge status={order.status} /></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400 text-sm">
                      No pending orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* STAT / Urgent Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-orange-500">⚠</span>
            <h3 className="font-semibold text-gray-700">STAT Tests</h3>
          </div>
          <div className="flex flex-col gap-3">
            {statAlerts.map((alert) => (
              <div
                key={alert.orderId}
                className="bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{alert.patientName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{alert.testsText}</p>
                  <p className="text-xs text-orange-500 mt-0.5">Ordered: {alert.ordered}</p>
                </div>
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                  STAT
                </span>
              </div>
            ))}
            {statAlerts.length === 0 && (
              <p className="text-sm text-gray-400">No STAT orders right now</p>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}

export default LabDashboard