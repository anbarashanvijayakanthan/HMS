import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'

const NAV_LINKS = [
  "Lab Dashboard",
  "Test Order",
  "Sample Collection",
  "Result Entry",
  "Reports Management",
]

const ORDER = {
  orderId:  "LO-5501",
  patient:  "Sneha Patel",
  patientId:"P-1004",
  age:      "31 yrs / F",
  priority: "Urgent",
  doctor:   "Dr. Priya Sharma",
  fasting:  "Yes — 12 hours",
  tests: [
    "Complete Blood Count (CBC)",
    "Lipid Profile (Total, HDL, LDL, TG)",
    "Troponin I High Sensitivity",
    "Thyroid Profile (T3, T4, TSH)",
  ],
  samples: [
    {
      id: "purple",
      color: "#9B59B6",
      cap: "Purple Cap (EDTA)",
      forTests: "For: CBC",
      volume: "Volume: 3 mL",
    },
    {
      id: "red",
      color: "#E74C3C",
      cap: "Red Cap SST (Serum)",
      forTests: "For: Lipid Profile, Troponin I (hs), TSH",
      volume: "Volume: 5 mL",
    },
  ],
}

function SampleCollection() {
  const { user } = useAuth()
  const [activeLink, setActiveLink] = useState("Sample Collection")

  const [barcodes, setBarcodes] = useState({ purple: '', red: '' })
  const [collected, setCollected] = useState({ purple: false, red: false })
  const [collectionDate, setCollectionDate] = useState('')
  const [collectionTime, setCollectionTime] = useState('')
  const [collectedBy, setCollectedBy] = useState('')

  const handleCollect = (id) => {
    if (barcodes[id].trim()) {
      setCollected(prev => ({ ...prev, [id]: true }))
    }
  }

  const allCollected = ORDER.samples.every(s => collected[s.id])

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={setActiveLink}
      />

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
            Order {ORDER.orderId} · {ORDER.patient}
          </p>
        </div>

        <div className="flex gap-5">

          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-5">

            {/* Patient Info Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold shrink-0">
                {ORDER.patient.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {ORDER.patient} · {ORDER.patientId} · {ORDER.age}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Order: {ORDER.orderId} · Priority:{" "}
                  <span className="text-orange-500 font-semibold">{ORDER.priority}</span>
                  {" · "}Doctor: {ORDER.doctor}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Fasting: <span className="font-medium text-gray-700">{ORDER.fasting}</span>
                </p>
              </div>
            </div>

            {/* Samples Required */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-4">Samples Required</h3>
              <div className="flex flex-col gap-4">
                {ORDER.samples.map(sample => (
                  <div
                    key={sample.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition ${
                      collected[sample.id]
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    {/* Color dot */}
                    <div
                      className="w-4 h-4 rounded-full shrink-0 mt-0.5"
                      style={{ backgroundColor: sample.color }}
                    />

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{sample.cap}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{sample.forTests}</p>
                      <p className="text-xs text-gray-400">{sample.volume}</p>
                    </div>

                    {/* Barcode input */}
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
                          value={barcodes[sample.id]}
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
                  value={collectedBy}
                  onChange={e => setCollectedBy(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Print Labels */}
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
                {ORDER.tests.map((test, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-300">🧪</span>
                    {test}
                  </div>
                ))}
              </div>
            </div>

            {/* Label Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Label Preview</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-3 font-mono text-xs text-gray-700">
                <p className="font-bold uppercase tracking-wider">{ORDER.patient} · {ORDER.patientId}</p>
                <p className="text-gray-500 mt-1">31F · {ORDER.doctor}</p>
                <p className="text-gray-500">{ORDER.orderId} · 19 Jun 2025</p>
                {/* Barcode simulation */}
                <div className="mt-3 h-8 bg-gray-800 rounded" />
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-4 w-20 bg-gray-800 rounded" />
                  <span className="text-gray-500">{ORDER.orderId}</span>
                </div>
              </div>
            </div>

            {/* Confirm Collection */}
            <button
              disabled={!allCollected}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition ${
                allCollected
                  ? 'bg-gray-800 text-white hover:bg-gray-700 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              ✓ Confirm Collection
            </button>
            {!allCollected && (
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