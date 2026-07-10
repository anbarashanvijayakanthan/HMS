import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import { useLabOrders, usePatients } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Lab Dashboard",
  "Test Order",
  "Sample Collection",
  "Result Entry",
  "Reports Management",
]

// Sample tube requirements are derived from which tests were ordered —
// this mapping is lab-config, not patient data, so it stays local.
const TEST_TO_SAMPLE = {
  "Complete Blood Count (CBC)": { id: "purple", color: "#9B59B6", cap: "Purple Cap (EDTA)", volume: "3 mL" },
  "ESR":                        { id: "purple", color: "#9B59B6", cap: "Purple Cap (EDTA)", volume: "3 mL" },
  "Peripheral Smear":           { id: "purple", color: "#9B59B6", cap: "Purple Cap (EDTA)", volume: "3 mL" },
}
const DEFAULT_SAMPLE = { id: "red", color: "#E74C3C", cap: "Red Cap SST (Serum)", volume: "5 mL" }

function buildSamples(tests) {
  const buckets = {}
  tests.forEach(t => {
    const sample = TEST_TO_SAMPLE[t.name] || DEFAULT_SAMPLE
    if (!buckets[sample.id]) {
      buckets[sample.id] = { ...sample, forTests: [] }
    }
    buckets[sample.id].forTests.push(t.name)
  })
  return Object.values(buckets)
}

function SampleCollection() {
  const { user } = useAuth()
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Sample Collection")

  // ── Shared store ──
  const { labOrders, updateStatus } = useLabOrders()
  const patients = usePatients()

const order = orderId ? labOrders.find(o => o.orderId === orderId) : null

  const [barcodes, setBarcodes] = useState({})
  const [collected, setCollected] = useState({})
  const [collectionDate, setCollectionDate] = useState('')
  const [collectionTime, setCollectionTime] = useState('')
  const [collectedBy, setCollectedBy] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Lab Dashboard")       navigate('/lab')
    if (link === "Test Order")          navigate('/lab/test-order')
    if (link === "Result Entry")        navigate('/lab/result-entry')
    if (link === "Reports Management")  navigate('/lab/reports')
    if (link === "Sample Collection")   navigate('/lab/sample-collection')
  }

 if (!orderId) {
    const pending = labOrders.filter(o => o.status === "Pending")
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Sample Collection</h2>
            <p className="text-sm text-gray-400">Select an order to collect samples for</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Tests</th>
                  <th className="pb-3 font-medium">Priority</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {pending.map(o => {
                  const pat = patients.find(p => p.id === o.patientId)
                  return (
                    <tr key={o.orderId} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="py-3 font-mono text-xs text-gray-500">{o.orderId}</td>
                      <td className="py-3 font-medium text-gray-800">{pat?.name || o.patientId}</td>
                      <td className="py-3 text-gray-500">{o.tests.map(t => t.name).join(', ')}</td>
                      <td className="py-3 text-gray-500">{o.priority}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => navigate(`/lab/sample-collection/${o.orderId}`)}
                          className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
                        >
                          Collect
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {pending.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400 text-sm">No orders waiting for sample collection</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />
        <main className="flex-1 p-6">
          <p className="text-gray-500">No order found for that ID.</p>
        </main>
      </div>
    )
  }
  const patient = patients.find(p => p.id === order.patientId)
  const samples = buildSamples(order.tests)

  const handleCollect = (id) => {
    if (barcodes[id]?.trim()) {
      setCollected(prev => ({ ...prev, [id]: true }))
    }
  }

  const allCollected = samples.every(s => collected[s.id])

  const handleConfirm = () => {
    if (!allCollected) return
    updateStatus(order.orderId, "Sample Collected")
    setConfirmed(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-4">
          <span>Lab Technician</span>
          <span className="mx-1.5">›</span>
          <span className="text-gray-600 font-medium">Sample Collection</span>
        </div>

        {/* Page Title */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-800">Sample Collection</h2>
          <p className="text-sm text-gray-400">
            Order {order.orderId} · {patient?.name || order.patientId}
          </p>
        </div>

        <div className="flex gap-5">

          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-5">

            {/* Patient Info Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold shrink-0">
                {patient?.name?.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {patient?.name} · {patient?.id} · {patient?.age} yrs / {patient?.gender?.charAt(0)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Order: {order.orderId} · Priority:{" "}
                  <span className="text-orange-500 font-semibold">{order.priority}</span>
                  {" · "}Doctor: {order.doctor}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Fasting: <span className="font-medium text-gray-700">{order.fasting}</span>
                </p>
              </div>
            </div>

            {confirmed && (
              <p className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg px-4 py-2.5">
                ✓ Collection confirmed. Order status updated to "Sample Collected".
              </p>
            )}

            {/* Samples Required */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-4">Samples Required</h3>
              <div className="flex flex-col gap-4">
                {samples.map(sample => (
                  <div
                    key={sample.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition ${
                      collected[sample.id]
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full shrink-0 mt-0.5"
                      style={{ backgroundColor: sample.color }}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{sample.cap}</p>
                      <p className="text-xs text-gray-500 mt-0.5">For: {sample.forTests.join(', ')}</p>
                      <p className="text-xs text-gray-400">Volume: {sample.volume}</p>
                    </div>

                    {collected[sample.id] ? (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <span>✓</span>
                        <span>Collected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Scan barcode or enter ID..."
                          value={barcodes[sample.id] || ''}
                          onChange={e => setBarcodes(prev => ({ ...prev, [sample.id]: e.target.value }))}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-xs w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleCollect(sample.id)}
                          className="flex items-center gap-1.5 bg-green-50 text-green-600 border border-green-200 text-xs px-3 py-2 rounded-lg hover:bg-green-100 transition font-medium"
                        >
                          ✓ Collect
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Collection Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-4">Collection Details</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                    Collection Date <span className="text-red-500">**</span>
                  </label>
                  <input
                    type="date"
                    value={collectionDate}
                    onChange={e => setCollectionDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                    Collection Time <span className="text-red-500">**</span>
                  </label>
                  <input
                    type="time"
                    value={collectionTime}
                    onChange={e => setCollectionTime(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                  Collected By <span className="text-red-500">**</span>
                </label>
                <input
                  type="text"
                  value={collectedBy || user?.name || ''}
                  onChange={e => setCollectedBy(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button className="mt-5 w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition">
                🖨 Print Labels
              </button>
            </div>

          </div>

          {/* Right Column */}
          <div className="w-72 flex flex-col gap-5 shrink-0">

            {/* Tests on This Order */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Tests on This Order</h3>
              <div className="flex flex-col gap-3">
                {order.tests.map((test, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-300">🧪</span>
                    {test.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Label Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Label Preview</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-3 font-mono text-xs text-gray-700">
                <p className="font-bold uppercase tracking-wider">{patient?.name} · {patient?.id}</p>
                <p className="text-gray-500 mt-1">{patient?.age}{patient?.gender?.charAt(0)} · {order.doctor}</p>
                <p className="text-gray-500">{order.orderId} · {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                <div className="mt-3 h-8 bg-gray-800 rounded" />
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-4 w-20 bg-gray-800 rounded" />
                  <span className="text-gray-500">{order.orderId}</span>
                </div>
              </div>
            </div>

            {/* Confirm Collection */}
            <button
              onClick={handleConfirm}
              disabled={!allCollected || confirmed}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition ${
                allCollected && !confirmed
                  ? 'bg-gray-800 text-white hover:bg-gray-700 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {confirmed ? '✓ Collection Confirmed' : '✓ Confirm Collection'}
            </button>
            {!allCollected && !confirmed && (
              <p className="text-xs text-gray-400 text-center -mt-3">
                Collect all samples to confirm
              </p>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}

export default SampleCollection