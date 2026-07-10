import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import { usePrescriptions, usePatients } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Medicine Inventory",
  "Add Medicine",
  "Prescription Queue",
  "Dispense Medicine",
  "Billing",
]

const URGENCY_STYLES = {
  Critical: "bg-red-100 text-red-700",
  Medium:   "bg-blue-100 text-blue-700",
  Routine:  "bg-green-100 text-green-700",
}

const STATUS_STYLES = {
  Pending:    "bg-orange-100 text-orange-700",
  Processing: "bg-blue-100 text-blue-700",
  Ready:      "bg-purple-100 text-purple-700",
  Dispensed:  "bg-green-100 text-green-700",
}

function PrescriptionQueue() {
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Prescription Queue")
  const [search, setSearch] = useState("")

  // ── Shared store ──
  const { prescriptions } = usePrescriptions()
  const patients = usePatients()

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")          navigate('/pharmacy')
    if (link === "Medicine Inventory") navigate('/pharmacy/inventory')
    if (link === "Add Medicine")       navigate('/pharmacy/add-medicine')
    if (link === "Dispense Medicine")  navigate('/pharmacy/dispense')
    if (link === "Billing")            navigate('/pharmacy/billing')
    if (link === "Prescription Queue") navigate('/pharmacy/prescriptions')
  }

  const enriched = prescriptions.map(rx => ({
    ...rx,
    patientName: patients.find(p => p.id === rx.patientId)?.name || rx.patientId,
  }))

  const filtered = enriched.filter(rx =>
    rx.patientName.toLowerCase().includes(search.toLowerCase()) ||
    rx.rxId.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Prescription Queue</h2>
          <p className="text-sm text-gray-400">All prescriptions awaiting dispensing</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center gap-3 mb-5">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search prescription..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="border border-gray-200 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition whitespace-nowrap">
              ▽ Filter
            </button>
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
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(rx => (
                  <tr key={rx.rxId} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 font-mono text-xs text-gray-500">{rx.rxId}</td>
                    <td className="py-3 font-medium text-gray-800">{rx.patientName}</td>
                    <td className="py-3 text-gray-500">{rx.doctor}</td>
                    <td className="py-3">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {rx.medicines.length} items
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-xs">{rx.date}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[rx.status] || "bg-gray-100 text-gray-600"}`}>
                        {rx.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${URGENCY_STYLES[rx.urgency] || "bg-gray-100 text-gray-600"}`}>
                        {rx.urgency}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {rx.status === "Dispensed" ? (
                        <span className="text-xs text-green-600 font-medium">✓ Dispensed</span>
                      ) : (
                        <button
                          onClick={() => navigate(`/pharmacy/dispense/${rx.rxId}`)}
                          className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
                        >
                          Process
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400 text-sm">
                      No prescriptions found
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

export default PrescriptionQueue