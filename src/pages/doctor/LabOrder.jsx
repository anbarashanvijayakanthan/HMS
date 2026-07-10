import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import { useVisit, useDiagnoses, useLabOrders } from '../../store/hospitalStore'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  "Dashboard", "Patient Consultation", "Diagnosis",
  "Prescription", "Lab Order", "Radiology Order", "Follow-up Manager",
]

const ALL_TESTS = [
  { name: "Lipid Profile", category: "Biochemistry" },
  { name: "Troponin I (hs)", category: "Cardiac Markers" },
  { name: "Thyroid Profile (T3/T4/TSH)", category: "Hormones" },
  { name: "Complete Blood Count (CBC)", category: "Haematology" },
  { name: "HbA1c", category: "Biochemistry" },
  { name: "Liver Function Test (LFT)", category: "Biochemistry" },
  { name: "Renal Function Test (RFT)", category: "Biochemistry" },
  { name: "Urine Routine", category: "Microbiology" },
  { name: "Blood Culture", category: "Microbiology" },
  { name: "CRP", category: "Cardiac Markers" },
  { name: "D-Dimer", category: "Cardiac Markers" },
  { name: "PT/INR", category: "Coagulation" },
  { name: "APTT", category: "Coagulation" },
  { name: "ESR", category: "Haematology" },
  { name: "Peripheral Smear", category: "Haematology" },
  { name: "Cortisol", category: "Hormones" },
]

const CATEGORIES = [
  "All", "Haematology", "Biochemistry",
  "Microbiology", "Hormones", "Cardiac Markers", "Coagulation",
]

const PRIORITIES = ["Routine", "Urgent", "STAT"]

let loCounter = 5502 // demo-only incrementing id; real backend would assign this

function LabOrder() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Lab Order")

  // ── Shared store ──
  const { visit, patient } = useVisit(token)
  const { diagnoses } = useDiagnoses(patient?.id)
  const { createLabOrder } = useLabOrders()

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedTests, setSelectedTests] = useState([])
  const [urgency, setUrgency] = useState('')
  const [fasting, setFasting] = useState('No')
  const [labNotes, setLabNotes] = useState('')
  const [sent, setSent] = useState(false)
  const { user } = useAuth()
  const filtered = ALL_TESTS.filter(t => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase())
    const notAdded = !selectedTests.find(s => s.name === t.name)
    return matchCat && matchSearch && notAdded
  })

  const addTest = (test) => {
    setSelectedTests(prev => [...prev, { name: test.name, priority: "Routine" }])
  }

  const removeTest = (name) => {
    setSelectedTests(prev => prev.filter(t => t.name !== name))
  }

  const updatePriority = (name, priority) => {
    setSelectedTests(prev =>
      prev.map(t => t.name === name ? { ...t, priority } : t)
    )
  }

  const handleSendToLab = () => {
    if (!patient || selectedTests.length === 0) return
    loCounter += 1
    createLabOrder({
      orderId: `LO-${loCounter}`,
      patientId: patient.id,
      token,
      doctor: `Dr. ${user?.name}`,
      tests: selectedTests.map(t => ({ name: t.name, priority: t.priority })),
      priority: urgency || "Routine",
      ordered: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: "Pending",
      fasting: fasting === "Yes" ? "Yes — 12 hours" : "No",
    })
    setSent(true)
  }

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard") navigate('/doctor')
    if (link === "Patient Consultation") navigate(`/doctor/consultation/${token}`)
    if (link === "Diagnosis") navigate(`/doctor/diagnosis/${token}`)
    if (link === "Prescription") navigate(`/doctor/prescription/${token}`)
    if (link === "Radiology Order") navigate(`/doctor/radiology-order/${token}`)
    if (link === "Follow-up Manager") navigate(`/doctor/followup/${token}`)
  }

  const priorityStyle = {
    Routine: "bg-gray-100 text-gray-600",
    Urgent: "bg-orange-100 text-orange-600",
    STAT: "bg-red-100 text-red-600",
  }

  if (!patient || !visit) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />
        <main className="flex-1 p-6">
          <p className="text-gray-500">No patient found for token "{token}".</p>
        </main>
      </div>
    )
  }

  const diagnosisText = diagnoses.length > 0
    ? diagnoses.map(d => d.name).join(', ')
    : "No diagnosis recorded"

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Breadcrumb + Title */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-1">
            <span className="cursor-pointer hover:text-blue-500"
              onClick={() => navigate('/doctor')}>Doctor</span>
            {" › "}Lab Orders
          </p>
          <h2 className="text-2xl font-bold text-gray-800">Lab Orders</h2>
          <p className="text-sm text-gray-400">
            {patient.name} · {patient.id} · Order lab investigations
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5">

          {/* Left: Main */}
          <div className="col-span-2 flex flex-col gap-5">

            {/* Search & Add Tests */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Search & Add Tests</h3>

              <div className="flex gap-2 mb-4">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="e.g. CBC, LFT, Lipid Profile..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition">
                  🔍 Search
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition
                      ${activeCategory === cat
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {(search || activeCategory !== 'All') && filtered.length > 0 && (
                <div className="border border-gray-100 rounded-lg overflow-hidden mb-2">
                  {filtered.slice(0, 6).map(t => (
                    <button
                      key={t.name}
                      onClick={() => addTest(t)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 flex items-center justify-between border-b border-gray-50 last:border-0"
                    >
                      <div>
                        <span className="text-gray-700">{t.name}</span>
                        <span className="ml-2 text-xs text-gray-400">{t.category}</span>
                      </div>
                      <span className="text-blue-500 text-xs font-medium">+ Add</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Tests */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4">
                Selected Tests
                <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                  {selectedTests.length}
                </span>
              </h3>

              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">Test Name</th>
                    <th className="pb-3 font-medium">Priority</th>
                    <th className="pb-3 font-medium w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTests.map((t, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 text-gray-700">{t.name}</td>
                      <td className="py-3">
                        <select
                          value={t.priority}
                          onChange={e => updatePriority(t.name, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${priorityStyle[t.priority]}`}
                        >
                          {PRIORITIES.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => removeTest(t.name)}
                          className="text-red-400 hover:text-red-600 text-lg leading-none"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                  {selectedTests.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-400">
                        No tests selected yet — search above to add
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Clinical Urgency + Fasting + Notes */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Clinical Urgency *
                </label>
                <div className="flex gap-2">
                  {PRIORITIES.map(p => (
                    <button
                      key={p}
                      onClick={() => setUrgency(p)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition border
                        ${urgency === p
                          ? 'bg-gray-800 text-white border-gray-800'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Fasting Required?
                </label>
                <div className="flex gap-4">
                  {['Yes', 'No'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="fasting"
                        checked={fasting === opt}
                        onChange={() => setFasting(opt)}
                        className="accent-blue-600"
                      />
                      <span className="text-sm text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Clinical Notes for Lab
                </label>
                <textarea
                  value={labNotes}
                  onChange={e => setLabNotes(e.target.value)}
                  placeholder="Clinical context, reason for tests, specific instructions..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {sent && (
                <p className="text-sm text-green-600 mb-3">✓ Lab order sent.</p>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleSendToLab}
                  disabled={selectedTests.length === 0}
                  className="bg-gray-800 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-gray-700 transition disabled:opacity-40 flex items-center gap-2"
                >
                  ↗ Send to Lab
                </button>
              </div>
            </div>

          </div>

          {/* Right: Patient Info */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-6">
              <h3 className="font-semibold text-gray-700 mb-4">Patient Info</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Patient", value: patient.name },
                  { label: "Age/Sex", value: `${patient.age} yrs / ${patient.gender?.charAt(0)}` },
                  { label: "Diagnosis", value: diagnosisText },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                    <span className="text-gray-400">{row.label}</span>
                    <span className="font-medium text-gray-700 text-right max-w-32">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/doctor/prescription/${token}`)}
                  className="w-full border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  ← Back to Prescription
                </button>
                <button
                  onClick={() => navigate(`/doctor/radiology-order/${token}`)}
                  className="w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  → Radiology Order
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default LabOrder