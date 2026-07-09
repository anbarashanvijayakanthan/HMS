import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import { useNavigate } from 'react-router-dom'
import { useBills, usePatients } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Patient Management",
  "Patient Registration",
  "Appointment Management",
  "Queue Management",
  "Billing Collection",
  "Follow-up Management",
]

const MODE_STYLES = {
  Cash:      "bg-gray-100 text-gray-600",
  Card:      "bg-blue-100 text-blue-600",
  Insurance: "bg-purple-100 text-purple-600",
  UPI:       "bg-green-100 text-green-600",
}

function BillingCollection() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Billing Collection")
  const [search, setSearch] = useState('')

  const { bills } = useBills()
  const patients = usePatients()

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")              navigate('/receptionist')
    if (link === "Patient Management")     navigate('/receptionist/patients')
    if (link === "Patient Registration")   navigate('/receptionist/registration')
    if (link === "Appointment Management") navigate('/receptionist/appointments')
    if (link === "Queue Management")       navigate('/receptionist/queue')
    if (link === "Follow-up Management")   navigate('/receptionist/followup')
    if (link === "Billing Collection")     navigate('/receptionist/billing')
  }

  const enriched = bills.map(b => ({
    ...b,
    patientName: patients.find(p => p.id === b.patientId)?.name || b.patientId,
  }))

  const filtered = enriched.filter(b =>
    b.patientName.toLowerCase().includes(search.toLowerCase()) ||
    b.billId.toLowerCase().includes(search.toLowerCase())
  )

  const totalCollected = bills.filter(b => b.status === "Paid").reduce((s, b) => s + b.net, 0)
  const pendingAmount = bills.filter(b => b.status !== "Paid").reduce((s, b) => s + b.net, 0)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Billing Collection</h2>
          <p className="text-sm text-gray-400">All bills — pharmacy, consultation, lab, combined</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatsCard icon="💰" label="Total Collected" value={`₹${totalCollected.toLocaleString('en-IN')}`} />
          <StatsCard icon="⏳" label="Pending"          value={`₹${pendingAmount.toLocaleString('en-IN')}`} subColor="text-red-400" />
          <StatsCard icon="📄" label="Total Bills"      value={bills.length} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search bill or patient..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Bill #</th>
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Items</th>
                <th className="pb-3 font-medium">Net</th>
                <th className="pb-3 font-medium">Mode</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.billId} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 font-mono text-xs text-gray-500">{b.billId}</td>
                  <td className="py-3 font-medium text-gray-800">{b.patientName}</td>
                  <td className="py-3 text-gray-500">{b.items} items</td>
                  <td className="py-3 font-semibold text-gray-800">₹{b.net}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${MODE_STYLES[b.mode] || "bg-gray-100 text-gray-600"}`}>
                      {b.mode}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      b.status === "Paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400 text-sm">No bills found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default BillingCollection