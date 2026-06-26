import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'

const NAV_LINKS = [
  "Dashboard",
  "Medicine Inventory",
  "Add Medicine",
  "Prescription Queue",
  "Dispense Medicine",
  "Billing",
]

// Mock prescription data — replace with API later
const MOCK_PRESCRIPTIONS = {
  "RX-8821": {
    patient: "Sneha Patel",
    patientId: "P-1004",
    age: "31 yrs / F",
    allergies: "Aspirin",
    prescribedBy: "Dr. Priya Sharma",
    date: "19 Jun 2025, 11:30 AM",
    medicines: [
      {
        name: "Metoprolol Succinate 25mg",
        qty: "3 strips × 10 tabs",
        batch: "MT-2025-04",
        inStock: 12,
        price: 255,
        dose: "1 tablet",
        frequency: "Once daily",
        duration: "7 days",
        foodInstruction: "After food",
        timing: ["Morning"],
      },
      {
        name: "Atorvastatin 10mg",
        qty: "1 strip × 10 tabs",
        batch: "AT-2025-05",
        inStock: 240,
        price: 285,
        dose: "1 tablet",
        frequency: "Once daily",
        duration: "30 days",
        foodInstruction: "After food",
        timing: ["Night"],
      },
    ],
  },
}

function DispenseMedicine() {
  const { rxId: paramRxId } = useParams()
  const rxId = paramRxId || "RX-8821" // default for demo/screenshot match
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeLink, setActiveLink] = useState("Dispense Medicine")
  const [paymentMode, setPaymentMode] = useState("cash")
  const [amountReceived, setAmountReceived] = useState("")

  const rx = MOCK_PRESCRIPTIONS[rxId]

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")          navigate('/pharmacy')
    if (link === "Medicine Inventory") navigate('/pharmacy/inventory')
    if (link === "Add Medicine")       navigate('/pharmacy/add-medicine')
    if (link === "Prescription Queue") navigate('/pharmacy/prescriptions')
    if (link === "Billing")            navigate('/pharmacy/billing')
  }

  if (!rx) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />
        <main className="flex-1 p-6">
          <p className="text-gray-500">Prescription {rxId} not found.</p>
        </main>
      </div>
    )
  }

  const subtotal = rx.medicines.reduce((sum, m) => sum + m.price, 0)
  const gst = +(subtotal * 0.12).toFixed(2)
  const insuranceDeduction = 0
  const total = +(subtotal + gst - insuranceDeduction).toFixed(2)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dispense Medicine</h2>
          <p className="text-sm text-gray-400">Prescription {rxId} · {rx.patient}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">

          {/* Left: Medicines to Dispense */}
          <div className="col-span-2 flex flex-col gap-4">

            {/* Patient banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold">
                {rx.patient.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {rx.patient} · {rx.patientId} · {rx.age}
                </p>
                <p className="text-xs text-gray-500">
                  Allergies: <span className="text-red-500 font-medium">{rx.allergies}</span> · Prescribed by {rx.prescribedBy} · {rx.date}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-4">Medicines to Dispense</h3>

              <div className="flex flex-col gap-5">
                {rx.medicines.map((m, i) => (
                  <div key={i} className={i > 0 ? "pt-5 border-t border-gray-100" : ""}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{m.name}</p>
                        <p className="text-xs text-gray-400">
                          Qty: {m.qty} | Batch: {m.batch}
                        </p>
                        <p className="text-xs text-gray-400">
                          In Stock: <span className="text-orange-500 font-medium">{m.inStock}</span> · Price: <span className="font-medium text-gray-700">₹{m.price}</span>
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button className="bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-lg hover:bg-green-200 transition">
                          Add
                        </button>
                        <button className="border border-gray-200 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
                          Adjust Quantity
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Dose</p>
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">{m.dose}</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Frequency</p>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md">{m.frequency}</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Duration</p>
                        <span className="text-gray-700 text-xs">{m.duration}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">Food Instruction</p>
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md mr-2">{m.foodInstruction}</span>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-gray-400 mb-1">Timing</p>
                      <div className="flex gap-3 text-xs text-gray-600">
                        {["Morning", "Afternoon", "Evening", "Night", "Bedtime"].map(t => (
                          <label key={t} className="flex items-center gap-1">
                            <input type="checkbox" readOnly checked={m.timing.includes(t)} />
                            {t}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Billing + Payment */}
          <div className="col-span-1 flex flex-col gap-4">

            {/* Billing Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Billing Summary</h3>
              <div className="flex flex-col gap-2 text-sm">
                {rx.medicines.map((m, i) => (
                  <div key={i} className="flex justify-between text-gray-600">
                    <span>{m.name}</span>
                    <span>₹{m.price}</span>
                  </div>
                ))}
                <div className="flex justify-between text-gray-600 pt-2 border-t border-gray-100">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (12%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Insurance Deduction</span>
                  <span>-₹{insuranceDeduction}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t border-gray-100 text-base">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Payment Method</h3>

              <div className="flex gap-4 mb-3 text-sm">
                {["cash", "upi", "card", "insurance"].map(mode => (
                  <label key={mode} className="flex items-center gap-1.5 capitalize text-gray-600">
                    <input
                      type="radio"
                      name="paymentMode"
                      checked={paymentMode === mode}
                      onChange={() => setPaymentMode(mode)}
                    />
                    {mode}
                  </label>
                ))}
              </div>

              {paymentMode === "card" && (
                <div className="flex flex-col gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs text-gray-500">
                    <input type="checkbox" />
                    Save Card Details
                  </label>
                </div>
              )}

              <button className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition mb-3">
                Pay
              </button>

              <div className="mb-1">
                <p className="text-xs text-gray-400 mb-1">Amount Received (₹)</p>
                <input
                  type="number"
                  value={amountReceived}
                  onChange={e => setAmountReceived(e.target.value)}
                  placeholder={total}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-green-600 mb-4">
                Change: ₹{amountReceived ? (amountReceived - total).toFixed(2) : "0.00"}
              </p>

              <div className="flex gap-2">
                <button className="flex-1 bg-green-100 text-green-700 text-xs py-2 rounded-lg hover:bg-green-200 transition">
                  ✓ Send WhatsApp Receipt
                </button>
                <button className="flex-1 border border-gray-200 text-xs py-2 rounded-lg hover:bg-gray-50 transition">
                  🖨 Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DispenseMedicine