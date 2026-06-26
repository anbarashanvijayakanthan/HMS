import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import StatusBadge from '../../components/common/StatusBadge'

const NAV_LINKS = [
  "Lab Dashboard",
  "Test Order",
  "Sample Collection",
  "Result Entry",
  "Reports Management",
]

const PENDING_ORDERS = [
  {
    orderId: "LO-5581",
    patient: "Sneha Patel",
    doctor: "Dr. Sharma",
    tests: "CBC, Lipid, Troponin, T3",
    priority: "STAT",
    ordered: "11:35 AM",
    status: "Pending",
  },
  {
    orderId: "LO-5580",
    patient: "Arjun Mehta",
    doctor: "Dr. Sharma",
    tests: "CBC, CRP, ESR",
    priority: "Urgent",
    ordered: "10:50 AM",
    status: "Processing",
  },
  {
    orderId: "LO-5499",
    patient: "Mohammed Farhan",
    doctor: "Dr. Kumar",
    tests: "LFT, RFT, HbA1c",
    priority: "Routine",
    ordered: "10:20 AM",
    status: "Sample Collected",
  },
  {
    orderId: "LO-5495",
    patient: "Anita Desai",
    doctor: "Dr. Kumar",
    tests: "D-Dimer, PT/INR, APTT",
    priority: "Routine",
    ordered: "09:00 AM",
    status: "Pending",
  },
]

const STAT_ALERTS = [
  {
    patient: "Sneha Patel",
    tests: "Troponin I (hs)",
    waiting: "Waiting: 35 min",
  },
  {
    patient: "Anita Desai",
    tests: "D-Dimer, PT/INR",
    waiting: "Waiting: 45 min",
  },
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
  const [activeLink, setActiveLink] = useState("Lab Dashboard")
  const [search, setSearch] = useState('')

  const filtered = PENDING_ORDERS.filter(o =>
    o.patient.toLowerCase().includes(search.toLowerCase()) ||
    o.orderId.toLowerCase().includes(search.toLowerCase()) ||
    o.tests.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={setActiveLink}
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

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="🧪" label="Tests Today"        value={64} />
          <StatsCard icon="⏳" label="Pending"            value={18} />
          <StatsCard icon="✅" label="Completed"          value={46} />
          <StatsCard icon="📄" label="Reports Generated"  value={41} />
        </div>

        {/* Pending Test Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Pending Test Orders</h3>
            <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2.5 py-1 rounded-full">
              18 Pending
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
                    <td className="py-3 font-medium text-gray-800">{order.patient}</td>
                    <td className="py-3 text-gray-500">{order.doctor}</td>
                    <td className="py-3 text-gray-600 max-w-48 truncate">{order.tests}</td>
                    <td className="py-3"><PriorityBadge priority={order.priority} /></td>
                    <td className="py-3 text-gray-500">{order.ordered}</td>
                    <td className="py-3"><LabStatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* STAT / Urgent Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-orange-500">⚠</span>
            <h3 className="font-semibold text-gray-700">STAT / Urgent Tests</h3>
          </div>
          <div className="flex flex-col gap-3">
            {STAT_ALERTS.map((alert, i) => (
              <div
                key={i}
                className="bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{alert.patient}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{alert.tests}</p>
                  <p className="text-xs text-orange-500 mt-0.5">{alert.waiting}</p>
                </div>
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                  STAT
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}

export default LabDashboard