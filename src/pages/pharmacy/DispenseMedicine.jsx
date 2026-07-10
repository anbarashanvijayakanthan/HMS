import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import { usePrescriptions, usePatients, useMedicines, useBills } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Medicine Inventory",
  "Add Medicine",
  "Prescription Queue",
  "Dispense Medicine",
  "Billing",
]

let billCounter = 4502 // demo-only incrementing id

function DispenseMedicine() {
  const { rxId: paramRxId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeLink, setActiveLink] = useState("Dispense Medicine")
  const [paymentMode, setPaymentMode] = useState("cash")
  const [amountReceived, setAmountReceived] = useState("")
  const [paid, setPaid] = useState(false)

  // ── Shared store ──
  const { prescriptions, updateStatus } = usePrescriptions()
  const patients = usePatients()
  const { decrementStock } = useMedicines()
  const { addBill } = useBills()

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")          navigate('/pharmacy')
    if (link === "Medicine Inventory") navigate('/pharmacy/inventory')
    if (link === "Add Medicine")       navigate('/pharmacy/add-medicine')
    if (link === "Prescription Queue") navigate('/pharmacy/prescriptions')
    if (link === "Billing")            navigate('/pharmacy/billing')
  }

  // Fall back to the first pending prescription if no rxId in the URL
  // (same pattern used across the app: SampleCollection, ResultEntry, etc.)
  const rx = paramRxId
    ? prescriptions.find(p => p.rxId === paramRxId)
    : prescriptions.find(p => p.status === "Pending") || prescriptions[0]

  if (!rx) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />
        <main className="flex-1 p-6">
          <p className="text-gray-500">No prescriptions waiting to be dispensed.</p>
        </main>
      </div>
    )
  }

  const patient = patients.find(p => p.id === rx.patientId)

  const subtotal = rx.medicines.reduce((sum, m) => sum + (m.price || 0), 0)
  const gst = +(subtotal * 0.12).toFixed(2)
  const total = +(subtotal + gst).toFixed(2)

  const handlePay = () => {
    if (paid) return

    // Decrement stock for each dispensed medicine (1 unit each — a real
    // system would parse "3 strips x 10 tabs" into an exact quantity)
    rx.medicines.forEach(m => decrementStock(m.name, 1))

    // Mark this prescription as dispensed so it drops out of the pending queue
    updateStatus(rx.rxId, "Dispensed")

    // Raise a bill
    billCounter += 1
    addBill({
      billId: `PB-${billCounter}`,
      patientId: rx.patientId,
      items: rx.medicines.length,
      gross: subtotal,
      discount: 0,
      net: total,
      mode: paymentMode === "cash" ? "Cash" : paymentMode === "upi" ? "UPI" : paymentMode === "card" ? "Card" : "Insurance",
      status: "Paid",
    })

    setPaid(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dispense Medicine</h2>
          <p className="text-sm text-gray-400">Prescription {rx.rxId} · {patient?.name || rx.patientId}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">

          {/* Left: Medicines to Dispense */}
          <div className="col-span-2 flex flex-col gap-4">

            {/* Patient banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold">
                {patient?.name?.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {patient?.name} · {patient?.id} · {patient?.age} yrs / {patient?.gender?.charAt(0)}
                </p>
                <p className="text-xs text-gray-500">
                  Allergies: <span className="text-red-500 font-medium">{patient?.allergies?.length ? patient.allergies.join(', ') : "None"}</span> · Prescribed by {rx.doctor} · {rx.date}
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
                          Dose: {m.dose} · Batch: {m.batch}
                        </p>
                        <p className="text-xs text-gray-400">
                          Price: <span className="font-medium text-gray-700">₹{m.price}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
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
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Billing + Payment */}
          <div className="col-span-1 flex flex-col gap-4">

            {/* Billing Summary — real prices from inventory */}
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

              {paid ? (
                <p className="text-sm text-green-600 font-medium py-3 text-center bg-green-50 rounded-lg">
                  ✓ Paid · Stock updated · Bill raised
                </p>
              ) : (
                <button
                  onClick={handlePay}
                  className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition mb-3"
                >
                  Pay ₹{total}
                </button>
              )}

              {paid && (
                <button
                  onClick={() => navigate('/pharmacy/prescriptions')}
                  className="w-full mt-3 border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  ← Back to Prescription Queue
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DispenseMedicine