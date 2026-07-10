import { useState } from 'react'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  "Dashboard",
  "Patient Management",
  "Patient Registration",
  "Appointment Management",
  "Queue Management",
  "Billing Collection",
  "Follow-up Management",
]

const INVOICES = [
  {
    id: "INV-2501", patient: "Arjun Mehta",     date: "19 Jun", services: "Consultation + ECG",    total: 2500, paid: 2500, balance: 0,    status: "Paid",
    details: { token: "T-007", dept: "Cardiology", blood: "O+", age: 34, gender: "Male",   labs: [{ name: "Consultation", amt: 1500 }, { name: "ECG", amt: 1000 }] }
  },
  {
    id: "INV-2502", patient: "Kavitha Rajan",   date: "19 Jun", services: "Consultation",           total: 800,  paid: 0,    balance: 800,  status: "Pending",
    details: { token: "T-009", dept: "General",    blood: "A+", age: 29, gender: "Female", labs: [{ name: "Consultation", amt: 800 }] }
  },
  {
    id: "INV-2503", patient: "Mohammed Farhan", date: "19 Jun", services: "X-Ray + Consultation",   total: 3200, paid: 2000, balance: 1200, status: "Partial",
    details: { token: "T-008", dept: "General",    blood: "O+", age: 45, gender: "Male",   labs: [{ name: "X-Ray", amt: 2000 }, { name: "Consultation", amt: 1200 }] }
  },
  {
    id: "INV-2504", patient: "Sneha Patel",     date: "18 Jun", services: "MRI + Consultation",     total: 8500, paid: 0,    balance: 8500, status: "Overdue",
    details: { token: "T-009", dept: "Cardiology", blood: "B+", age: 31, gender: "Female", labs: [{ name: "Blood Test", amt: 300 }, { name: "Lipid", amt: 6000 }, { name: "Thyroid", amt: 1200 }] }
  },
  {
    id: "INV-2505", patient: "Rajesh Verma",    date: "18 Jun", services: "Blood Tests + Consult",  total: 2100, paid: 2100, balance: 0,    status: "Paid",
    details: { token: "T-010", dept: "Ortho",      blood: "B-", age: 56, gender: "Male",   labs: [{ name: "Blood Test", amt: 800 }, { name: "Consultation", amt: 1300 }] }
  },
]

const STATUS_STYLES = {
  Paid:    "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Partial: "bg-orange-100 text-orange-700",
  Overdue: "bg-red-100 text-red-700",
}

const PAYMENT_MODES = ["Cash", "Card", "UPI", "Net Banking", "Insurance"]

function BillingCollection() {
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Billing Collection")
  const [search, setSearch]         = useState('')
  const [invoices, setInvoices]     = useState(INVOICES)

  // Collect payment form
  const [collectForm, setCollectForm] = useState({
    patientId: '', amount: '', mode: '', reference: '', remarks: '',
  })
  const [collectSummary, setCollectSummary] = useState(INVOICES[2]) // Mohammed Farhan default

  // View modal
  const [viewPatient, setViewPatient] = useState(null)

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")              navigate('/receptionist')
    if (link === "Patient Management")     navigate('/receptionist/patients')
    if (link === "Patient Registration")   navigate('/receptionist/registration')
    if (link === "Appointment Management") navigate('/receptionist/appointments')
    if (link === "Queue Management")       navigate('/receptionist/queue')
    if (link === "Follow-up Management")   navigate('/receptionist/followup')
  }

  const handleCollect = () => {
    if (!collectForm.amount || !collectForm.mode) return
    alert(`Payment of ₹${collectForm.amount} collected via ${collectForm.mode}. Receipt generated!`)
    setCollectForm({ patientId: '', amount: '', mode: '', reference: '', remarks: '' })
  }

  const handleCollectInvoice = (inv) => {
    setCollectSummary(inv)
    setCollectForm(f => ({ ...f, patientId: inv.id, amount: inv.balance }))
  }

  const filtered = invoices.filter(inv =>
    inv.patient.toLowerCase().includes(search.toLowerCase()) ||
    inv.id.toLowerCase().includes(search.toLowerCase())
  )

  const avatarInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Billing Collection</h2>
            <p className="text-sm text-gray-400">Manage patient invoices and payment collection</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              ↑ Export
            </button>
            <button className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition">
              + Create Invoice
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="💲" label="Today's Collection" value="₹42,500" sub="+15% vs yesterday" subColor="text-green-500" trend="up" />
          <StatsCard icon="📄" label="Invoices Raised"    value={28} />
          <StatsCard icon="⏳" label="Pending Amount"     value="₹18,400" subColor="text-orange-500" />
          <StatsCard icon="❗" label="Overdue"            value="₹6,200"  subColor="text-red-500" />
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID or phone..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50">
            ⊟ Filter
          </button>
        </div>

        {/* Collect Payment Panel */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span>💳</span> Collect Payment
          </h3>
          <div className="flex gap-4 items-start">

            {/* Left: form */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Patient ID
                </label>
                <input
                  value={collectForm.patientId}
                  onChange={e => setCollectForm(f => ({ ...f, patientId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Amount to Collect (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={collectForm.amount}
                  onChange={e => setCollectForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="1200"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Payment Mode <span className="text-red-500">*</span>
                </label>
                <select
                  value={collectForm.mode}
                  onChange={e => setCollectForm(f => ({ ...f, mode: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  {PAYMENT_MODES.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Remarks
                </label>
                <input
                  value={collectForm.remarks}
                  onChange={e => setCollectForm(f => ({ ...f, remarks: e.target.value }))}
                  placeholder="Any additional notes"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Reference / Transaction ID
                </label>
                <input
                  value={collectForm.reference}
                  onChange={e => setCollectForm(f => ({ ...f, reference: e.target.value }))}
                  placeholder="For card / UPI"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end gap-3">
                <button
                  onClick={handleCollect}
                  className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  💳 Collect & Generate Receipt
                </button>
                <button className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50">
                  🖨 Print Invoice
                </button>
              </div>
            </div>

            {/* Right: summary */}
            {collectSummary && (
              <div className="w-56 shrink-0 bg-gray-50 rounded-xl p-4 text-sm border border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Patient</span>
                  <span className="font-semibold text-gray-800">{collectSummary.patient}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="font-semibold text-gray-800">₹{collectSummary.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-semibold text-gray-800">₹{collectSummary.paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span className="text-gray-500">Balance Due</span>
                  <span className="font-bold text-red-500">₹{collectSummary.balance.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Invoice #</th>
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Services</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Paid</th>
                <th className="pb-3 font-medium">Balance</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 font-mono text-xs text-gray-500 font-semibold">{inv.id}</td>
                  <td className="py-3 font-medium text-gray-800">{inv.patient}</td>
                  <td className="py-3 text-gray-500">{inv.date}</td>
                  <td className="py-3 text-gray-500 text-xs">{inv.services}</td>
                  <td className="py-3 text-gray-700 font-medium">₹{inv.total.toLocaleString()}</td>
                  <td className="py-3 font-semibold text-green-600">
                    {inv.paid > 0 ? `₹${inv.paid.toLocaleString()}` : '₹0'}
                  </td>
                  <td className={`py-3 font-semibold ${inv.balance > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    ₹{inv.balance.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewPatient(inv)}
                        className="text-xs text-gray-400 hover:text-blue-500 transition"
                      >
                        👁 View
                      </button>
                      <button className="text-xs text-gray-400 hover:text-gray-600 transition">
                        🖨 Print
                      </button>
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => handleCollectInvoice(inv)}
                          className="text-xs bg-gray-900 text-white px-2 py-1 rounded-md hover:bg-gray-700 transition"
                        >
                          Collect
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Patient Modal */}
        {viewPatient && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-[480px]">

              {/* Close */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setViewPatient(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Patient header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {avatarInitials(viewPatient.patient)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{viewPatient.patient}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                    <span>{viewPatient.details.age} yrs</span>
                    <span>| {viewPatient.details.gender}</span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Active</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className="text-blue-500 font-semibold">{viewPatient.details.token}</span>
                    <span className="text-blue-500">{viewPatient.details.dept}</span>
                    <span className="text-gray-500">Blood: {viewPatient.details.blood}</span>
                  </div>
                </div>
              </div>

              {/* Lab Details Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-700 text-sm">LAB DETAILS</h4>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="px-4 py-2 font-medium text-xs uppercase tracking-wide">Services</th>
                      <th className="px-4 py-2 font-medium text-xs uppercase tracking-wide text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewPatient.details.labs.map((lab, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="px-4 py-2 text-gray-700">{lab.name}</td>
                        <td className="px-4 py-2 text-gray-700 text-right">{lab.amt}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="px-4 py-2 text-gray-800">Total</td>
                      <td className="px-4 py-2 text-gray-800 text-right">
                        {viewPatient.details.labs.reduce((s, l) => s + l.amt, 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => setViewPatient(null)}
                className="w-full mt-4 border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default BillingCollection