import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import StatusBadge from '../../components/common/StatusBadge'

const NAV_LINKS = [
  "Dashboard",
  "Medicine Inventory",
  "Add Medicine",
  "Prescription Queue",
  "Dispense Medicine",
  "Billing",
]

const PRESCRIPTION_QUEUE = [
  { rxId: "RX-8821", patient: "Sneha Patel",     doctor: "Dr. Sharma", medicines: "3 items", time: "11:30 AM", status: "Pending",   urgency: "Critical" },
  { rxId: "RX-8820", patient: "Arjun Mehta",     doctor: "Dr. Sharma", medicines: "2 items", time: "10:45 AM", status: "Processing", urgency: "Medium"   },
  { rxId: "RX-8819", patient: "Mohammed Farhan", doctor: "Dr. Kumar",  medicines: "4 items", time: "10:20 AM", status: "Ready",      urgency: "Medium"   },
  { rxId: "RX-8818", patient: "Kavitha Rajan",   doctor: "Dr. Nair",   medicines: "1 item",  time: "09:55 AM", status: "Dispensed",  urgency: "Routine"  },
  { rxId: "RX-8817", patient: "Aladin",          doctor: "Dr. Nair",   medicines: "1 item",  time: "09:55 AM", status: "Dispensed",  urgency: "Routine"  },
  { rxId: "RX-8816", patient: "Umar",            doctor: "Dr. Kumar",  medicines: "4 items", time: "11:00 AM", status: "Dispensed",  urgency: "Routine"  },
  { rxId: "RX-8816", patient: "Umar",            doctor: "Dr. Kumar",  medicines: "4 items", time: "11:00 AM", status: "Dispensed",  urgency: "Medium"   },
  { rxId: "RX-8817", patient: "Aladin",          doctor: "Dr. Nair",   medicines: "1 item",  time: "09:55 AM", status: "Ready",      urgency: "Medium"   },
]

const LOW_STOCK_ALERTS = [
  { name: "Metoprolol 25mg", stock: 12, min: 50  },
  { name: "Amlodipine 5mg",  stock: 8,  min: 100 },
  { name: "Paracetamol 500mg", stock: 45, min: 200 },
  { name: "Aspirin 75mg",    stock: 20, min: 100 },
]

function PharmacyDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Dashboard")

  const handleNavClick = (link) => {
    setActiveLink(link)
    // route mapping — wire these up once those pages exist
    if (link === "Medicine Inventory") navigate('/pharmacy/inventory')
    if (link === "Add Medicine")       navigate('/pharmacy/add-medicine')
    if (link === "Prescription Queue") navigate('/pharmacy/prescriptions')
    if (link === "Dispense Medicine")  navigate('/pharmacy/dispense')
    if (link === "Billing")            navigate('/pharmacy/billing')
    if (link === "Dashboard")          navigate('/pharmacy')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={handleNavClick}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Pharmacy Dashboard</h2>
            <p className="text-sm text-gray-400">
              Thursday, 19 June 2025 · Pharmacist: {user?.name}
            </p>
          </div>
          <button className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
            ↻ Refresh
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="📄" label="Prescriptions Today" value={38} />
          <StatsCard icon="✅" label="Dispensed"            value={29} />
          <StatsCard icon="⏳" label="Pending"               value={9}  />
          <StatsCard icon="⚠️" label="Low Stock Items"       value={14} subColor="text-red-500" />
        </div>

        {/* Two-column layout: Queue + Alerts */}
        <div className="grid grid-cols-3 gap-4">

          {/* Prescription Queue */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Prescription Queue</h3>
              <input
                type="text"
                placeholder="Search prescription..."
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">RX ID</th>
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium">Doctor</th>
                    <th className="pb-3 font-medium">Medicines</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Urgency</th>
                  </tr>
                </thead>
                <tbody>
                  {PRESCRIPTION_QUEUE.map((rx, i) => (
                    <tr key={`${rx.rxId}-${i}`} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="py-3 font-mono text-xs text-gray-500">{rx.rxId}</td>
                      <td className="py-3 font-medium text-gray-800">{rx.patient}</td>
                      <td className="py-3 text-gray-500">{rx.doctor}</td>
                      <td className="py-3"><span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{rx.medicines}</span></td>
                      <td className="py-3 text-gray-500">{rx.time}</td>
                      <td className="py-3"><StatusBadge status={rx.status} /></td>
                      <td className="py-3"><StatusBadge status={rx.urgency} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => navigate('/pharmacy/dispense')}
                className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                ⚙ Process Prescription
              </button>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-red-500 mb-4">⚠ Low Stock Alerts</h3>
            <div className="flex flex-col gap-4">
              {LOW_STOCK_ALERTS.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-red-400">Stock: {item.stock} (Min: {item.min})</p>
                  </div>
                  <button className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 whitespace-nowrap">
                    + Reorder
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}

export default PharmacyDashboard