import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import { useLabOrders, usePatients, useLabResults } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Lab Dashboard",
  "Test Order",
  "Sample Collection",
  "Result Entry",
  "Reports Management",
]

// Parameter templates — these are lab-config (what fields a given test
// needs), not patient data, so they stay local rather than in the store.
const TEST_PARAM_TEMPLATES = {
  "Complete Blood Count (CBC)": [
    { id: "hb",   name: "Haemoglobin (Hb)", unit: "g/dL", ref: "12.8–16.8 (F)", defaultValue: "" },
    { id: "wbc",  name: "WBC Count",         unit: "/µL",  ref: "4000–11000",    defaultValue: "" },
    { id: "plt",  name: "Platelet Count",    unit: "/µL",  ref: "150000–400000", defaultValue: "" },
    { id: "neut", name: "Neutrophils",       unit: "%",    ref: "40–70",         defaultValue: "" },
    { id: "mcv",  name: "MCV",               unit: "fL",   ref: "80–100",        defaultValue: "" },
  ],
  "Lipid Profile": [
    { id: "tc",  name: "Total Cholesterol", unit: "mg/dL", ref: "< 200",    defaultValue: "" },
    { id: "ldl", name: "LDL Cholesterol",   unit: "mg/dL", ref: "< 130",    defaultValue: "" },
    { id: "hdl", name: "HDL Cholesterol",   unit: "mg/dL", ref: "> 50 (F)", defaultValue: "" },
    { id: "tg",  name: "Triglycerides",     unit: "mg/dL", ref: "< 150",    defaultValue: "" },
  ],
  "Troponin I (hs)": [
    { id: "trop", name: "Troponin I (hs)", unit: "ng/L", ref: "< 14 (F)", defaultValue: "" },
  ],
}
// Any test not listed above gets one generic result field.
const GENERIC_PARAM = (testName) => ([
  { id: "value", name: testName, unit: "", ref: "—", defaultValue: "" },
])

function FlagPicker({ value, onChange }) {
  const opts = ["", "L", "H"]
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-14 border border-gray-200 rounded px-1 py-1 text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {opts.map(o => <option key={o} value={o}>{o || "—"}</option>)}
    </select>
  )
}

function ResultEntry() {
  const { user } = useAuth()
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Result Entry")

  // ── Shared store ──
  const { labOrders } = useLabOrders()
  const patients = usePatients()
  const { saveResult } = useLabResults()

  // Prefer a specific order from the URL; otherwise grab the first order
  // that's ready for results (sample collected but not yet completed).
const order = orderId ? labOrders.find(o => o.orderId === orderId) : null
  // values keyed by `${testName}::${paramId}` -> { value, flag }
  const [values, setValues] = useState({})
  const [saved, setSaved] = useState(false)

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Lab Dashboard")       navigate('/lab')
    if (link === "Test Order")          navigate('/lab/test-order')
    if (link === "Sample Collection")   navigate('/lab/sample-collection')
    if (link === "Reports Management")  navigate('/lab/reports')
    if (link === "Result Entry")        navigate('/lab/result-entry')
  }

if (!orderId) {
    const ready = labOrders.filter(o => o.status === "Sample Collected")
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Result Entry</h2>
            <p className="text-sm text-gray-400">Select an order to enter results for</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Tests</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {ready.map(o => {
                  const pat = patients.find(p => p.id === o.patientId)
                  return (
                    <tr key={o.orderId} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="py-3 font-mono text-xs text-gray-500">{o.orderId}</td>
                      <td className="py-3 font-medium text-gray-800">{pat?.name || o.patientId}</td>
                      <td className="py-3 text-gray-500">{o.tests.map(t => t.name).join(', ')}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => navigate(`/lab/result-entry/${o.orderId}`)}
                          className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
                        >
                          Enter Results
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {ready.length === 0 && (
                  <tr><td colSpan={4} className="py-8 text-center text-gray-400 text-sm">No orders ready for result entry — samples must be collected first</td></tr>
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

  const setParamValue = (testName, paramId, field, val) => {
    const key = `${testName}::${paramId}`
    setValues(prev => ({
      ...prev,
      [key]: { ...(prev[key] || { value: "", flag: "" }), [field]: val },
    }))
    setSaved(false)
  }

  const handleSave = () => {
    // Compile everything entered into one result record
    const entries = []
    order.tests.forEach(t => {
      const params = TEST_PARAM_TEMPLATES[t.name] || GENERIC_PARAM(t.name)
      params.forEach(p => {
        const key = `${t.name}::${p.id}`
        const v = values[key] || { value: "", flag: "" }
        entries.push({ test: t.name, param: p.name, unit: p.unit, ref: p.ref, value: v.value, flag: v.flag })
      })
    })

    const abnormal = entries.some(e => e.flag === "H" || e.flag === "L")

    saveResult(order.orderId, {
      patientId: order.patientId,
      testsText: order.tests.map(t => t.name).join(', '),
      doctor: order.doctor,
      entries,
      abnormal,
      generatedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      savedBy: user?.name || "Lab Tech",
      delivery: "Pending",
    })
    setSaved(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-4">
          <span>Lab Technician</span>
          <span className="mx-1.5">›</span>
          <span className="text-gray-600 font-medium">Result Entry</span>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Result Entry</h2>
          <p className="text-sm text-gray-400">
            {order.orderId} · {patient?.name || order.patientId} · {order.tests.map(t => t.name).join(' + ')}
          </p>
        </div>

        {saved && (
          <p className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg px-4 py-2.5 mb-5">
            ✓ Results saved. Order status updated to "Completed".
          </p>
        )}

        <div className="flex gap-5">

          {/* Left Column — Test Tables, one per test on this order */}
          <div className="flex-1 flex flex-col gap-5 min-w-0">
            {order.tests.map(t => {
              const params = TEST_PARAM_TEMPLATES[t.name] || GENERIC_PARAM(t.name)
              return (
                <div key={t.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">{t.name}</h3>
                    <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
                      {t.priority}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-100 text-xs uppercase tracking-wide">
                          <th className="pb-3 font-medium">Parameter</th>
                          <th className="pb-3 font-medium">Value</th>
                          <th className="pb-3 font-medium">Unit</th>
                          <th className="pb-3 font-medium">Reference Range</th>
                          <th className="pb-3 font-medium">Flag</th>
                        </tr>
                      </thead>
                      <tbody>
                        {params.map(p => {
                          const key = `${t.name}::${p.id}`
                          const current = values[key] || { value: "", flag: "" }
                          return (
                            <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                              <td className="py-3 text-gray-700 font-medium">{p.name}</td>
                              <td className="py-3">
                                <input
                                  value={current.value}
                                  onChange={e => setParamValue(t.name, p.id, "value", e.target.value)}
                                  placeholder="Enter value"
                                  className="w-24 border border-gray-200 rounded px-2 py-1 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              <td className="py-3 text-gray-400 text-xs">{p.unit}</td>
                              <td className="py-3 text-gray-400 text-xs">{p.ref}</td>
                              <td className="py-3">
                                <FlagPicker value={current.flag} onChange={v => setParamValue(t.name, p.id, "flag", v)} />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column */}
          <div className="w-72 shrink-0 flex flex-col gap-5">

            {/* Patient & Order Info — real data now */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Patient & Order Info</h3>
              <div className="flex flex-col gap-2.5 text-sm">
                {[
                  { label: "Patient",  value: patient?.name || order.patientId },
                  { label: "Age/Sex",  value: patient ? `${patient.age} yrs / ${patient.gender?.charAt(0)}` : "—" },
                  { label: "Order ID", value: order.orderId },
                  { label: "Priority", value: order.priority, urgent: true },
                  { label: "Doctor",   value: order.doctor },
                ].map(row => (
                  <div key={row.label} className="flex justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-400">{row.label}</span>
                    <span className={`font-medium ${row.urgent ? 'text-orange-500' : 'text-gray-800'}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Note on flags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-orange-500">⚠</span>
                <h3 className="font-semibold text-gray-700">Flag Guide</h3>
              </div>
              <p className="text-xs text-gray-500">
                Mark a parameter <span className="font-semibold text-red-600">H</span> (high) or{" "}
                <span className="font-semibold text-blue-600">L</span> (low) if outside the reference range.
                Any flagged parameter marks this report "Abnormal" in Reports Management.
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full bg-gray-800 text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-700 transition"
            >
              Save Results
            </button>

          </div>
        </div>
      </main>
    </div>
  )
}

export default ResultEntry