import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import StatusBadge from '../../components/common/StatusBadge'
import { usePrescriptions, useMedicines, usePatients } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Medicine Inventory",
  "Add Medicine",
  "Prescription Queue",
  "Dispense Medicine",
  "Billing",
]

function PharmacyDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Dashboard")

  // ── Shared store ──
  const { prescriptions } = usePrescriptions()
  const { medicines } = useMedicines()
  const patients = usePatients()

  const lowStock = medicines.filter(m => m.stock < m.reorderLevel)
  const pendingCount = prescriptions.filter(rx => rx.status === "Pending").length
  const dispensedCount = prescriptions.filter(rx => rx.status === "Dispensed").length

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Medicine Inventory") navigate('/pharmacy/inventory')
    if (link === "Add Medicine")       navigate('/pharmacy/add-medicine')
    if (link === "Prescription Queue") navigate('/pharmacy/prescriptions')
    if (link === "Dispense Medicine")  navigate('/pharmacy/dispense')
    if (link === "Billing")            navigate('/pharmacy/billing')
    if (link === "Dashboard")          navigate('/pharmacy')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

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

        {/* Stats Row — derived from the store */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="📄" label="Prescriptions Today" value={prescriptions.length} />
          <StatsCard icon="✅" label="Dispensed"            value={dispensedCount}  />
          <StatsCard icon="⏳" label="Pending"               value={pendingCount}  />
          <StatsCard icon="⚠️" label="Low Stock Items"       value={lowStock.length} subColor="text-red-500" />
        </div>

        <div className="grid grid-cols-3 gap-4">

          {/* Prescription Queue — now real prescriptions from Doctors */}
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
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Urgency</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map(rx => {
                    const patient = patients.find(p => p.id === rx.patientId)
                    return (
                      <tr key={rx.rxId} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="py-3 font-mono text-xs text-gray-500">{rx.rxId}</td>
                        <td className="py-3 font-medium text-gray-800">{patient?.name || rx.patientId}</td>
                        <td className="py-3 text-gray-500">{rx.doctor}</td>
                        <td className="py-3"><span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{rx.medicines.length} items</span></td>
                        <td className="py-3 text-gray-500 text-xs">{rx.date}</td>
                        <td className="py-3"><StatusBadge status={rx.status} /></td>
                        <td className="py-3"><StatusBadge status={rx.urgency} /></td>
                      </tr>
                    )
                  })}
                  {prescriptions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400 text-sm">
                        No prescriptions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => navigate('/pharmacy/prescriptions')}
                className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                ⚙ View All Prescriptions
              </button>
            </div>
          </div>

          {/* Low Stock Alerts — now real inventory */}
          <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-red-500 mb-4">⚠ Low Stock Alerts</h3>
            <div className="flex flex-col gap-4">
              {lowStock.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-red-400">Stock: {item.stock} (Min: {item.reorderLevel})</p>
                  </div>
                  <button className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 whitespace-nowrap">
                    + Reorder
                  </button>
                </div>
              ))}
              {lowStock.length === 0 && (
                <p className="text-sm text-gray-400">All stock levels healthy</p>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}

export default PharmacyDashboard