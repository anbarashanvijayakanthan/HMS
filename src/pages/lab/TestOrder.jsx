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

const FILTERS = ["All", "Pending", "Processing", "Sample Collected", "Completed"]

function TestOrder() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Test Order")
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState("All")

  // ── Shared store ──
  const { labOrders, updateStatus } = useLabOrders()
  const patients = usePatients()

  const enriched = labOrders.map(o => ({
    ...o,
    patientName: patients.find(p => p.id === o.patientId)?.name || o.patientId,
  }))

  const filtered = enriched.filter(o => {
    const matchSearch =
      o.patientName.toLowerCase().includes(search.toLowerCase()) ||
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.patientId.toLowerCase().includes(search.toLowerCase())
    const matchFilter = activeFilter === "All" || o.status === activeFilter
    return matchSearch && matchFilter
  })

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
            <h2 className="text-2xl font-bold text-gray-800">Test Orders</h2>
            <p className="text-sm text-gray-400">View and manage all lab test orders</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="🧾" label="Total Orders"  value={labOrders.length} />
          <StatsCard icon="⏳" label="Pending"        value={labOrders.filter(o => o.status === "Pending").length} />
          <StatsCard icon="🔬" label="Processing"     value={labOrders.filter(o => o.status === "Processing").length} />
          <StatsCard icon="✅" label="Completed"      value={labOrders.filter(o => o.status === "Completed").length} />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          {/* Search + Filter tabs */}
          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              placeholder="Search by order ID, patient or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition">
              ⚙ Filter
            </button>
          </div>

          {/* Status filter pills */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
                  activeFilter === f
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {f}
              </button>
            ))}
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
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr
                    key={order.orderId}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 font-mono text-xs text-gray-500">{order.orderId}</td>
                    <td className="py-3">
                      <p className="font-medium text-gray-800">{order.patientName}</p>
                      <p className="text-xs text-gray-400">{order.patientId}</p>
                    </td>
                    <td className="py-3 text-gray-500">{order.doctor}</td>
                    <td className="py-3 text-gray-600">
                      <div className="flex flex-wrap gap-1">
                        {order.tests.map(t => (
                          <span key={t.name} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded">
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3"><PriorityBadge priority={order.priority} /></td>
                    <td className="py-3 text-gray-500">{order.ordered}</td>
                    <td className="py-3">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.orderId, e.target.value)}
                        className="text-xs font-medium border-0 bg-transparent cursor-pointer focus:outline-none"
                      >
                        {FILTERS.filter(f => f !== "All").map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-blue-600 hover:underline">View</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400 text-sm">
                      No orders found
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

export default TestOrder