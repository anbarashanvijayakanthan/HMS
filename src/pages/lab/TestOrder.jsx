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
const STATUS_ORDER = ["Pending", "Processing", "Sample Collected", "Completed"]
const PRIORITY_FILTERS = ["All", "STAT", "Urgent", "Routine"]

function OrderViewModal({ order, onClose }) {
  if (!order) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">Order {order.orderId}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="flex flex-col gap-2 text-sm mb-4">
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-400">Patient</span>
            <span className="font-medium text-gray-800">{order.patientName}</span>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-400">Doctor</span>
            <span className="font-medium text-gray-800">{order.doctor}</span>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-400">Priority</span>
            <PriorityBadge priority={order.priority} />
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-400">Ordered</span>
            <span className="font-medium text-gray-800">{order.ordered}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <LabStatusBadge status={order.status} />
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400 font-medium mb-2">Tests Ordered</p>
          <div className="flex flex-col gap-1.5">
            {order.tests.map(t => (
              <div key={t.name} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-sm text-gray-700">{t.name}</span>
                <span className="text-xs text-gray-400">{t.priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TestOrder() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Test Order")
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [showFilter, setShowFilter] = useState(false)
  const [viewOrder, setViewOrder] = useState(null)

  const { labOrders, updateStatus } = useLabOrders()
  const patients = usePatients()

  const enriched = labOrders.map(o => ({
    ...o,
    patientName: patients.find(p => p.id === o.patientId)?.name || o.patientId,
    testsText: o.tests.map(t => t.name).join(', '),
  }))

  const filtered = enriched.filter(o => {
    const q = search.trim().toLowerCase()
    const matchSearch = !q ||
      o.patientName.toLowerCase().includes(q) ||
      o.orderId.toLowerCase().includes(q) ||
      o.patientId.toLowerCase().includes(q) ||
      o.testsText.toLowerCase().includes(q) ||
      (o.doctor || '').toLowerCase().includes(q) ||
      o.priority.toLowerCase().includes(q)
    const matchStatusFilter = activeFilter === "All" || o.status === activeFilter
    const matchPriorityFilter = priorityFilter === "All" || o.priority === priorityFilter
    return matchSearch && matchStatusFilter && matchPriorityFilter
  })

  // Completed orders always sink to the bottom of the list
  const sorted = [...filtered].sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status))

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

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Test Orders</h2>
            <p className="text-sm text-gray-400">View and manage all lab test orders</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="🧾" label="Total Orders"  value={labOrders.length} />
          <StatsCard icon="⏳" label="Pending"        value={labOrders.filter(o => o.status === "Pending").length} />
          <StatsCard icon="🔬" label="Processing"     value={labOrders.filter(o => o.status === "Processing").length} />
          <StatsCard icon="✅" label="Completed"      value={labOrders.filter(o => o.status === "Completed").length} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center gap-3 mb-4 relative">
            <input
              type="text"
              placeholder="Search by order ID, patient, test, doctor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative">
              <button
                onClick={() => setShowFilter(v => !v)}
                className={`flex items-center gap-1.5 text-sm border px-3 py-2 rounded-lg transition ${
                  priorityFilter !== "All"
                    ? "border-blue-400 text-blue-600 bg-blue-50"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                ⚙ Filter{priorityFilter !== "All" ? `: ${priorityFilter}` : ""}
              </button>
              {showFilter && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                  {PRIORITY_FILTERS.map(f => (
                    <button
                      key={f}
                      onClick={() => { setPriorityFilter(f); setShowFilter(false) }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                        priorityFilter === f ? "text-blue-600 font-medium" : "text-gray-600"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

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
                {sorted.map(order => (
                  <tr key={order.orderId} className="border-b border-gray-50 hover:bg-gray-50 transition">
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
                        <button
                          onClick={() => setViewOrder(order)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
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

      <OrderViewModal order={viewOrder} onClose={() => setViewOrder(null)} />
    </div>
  )
}

export default TestOrder