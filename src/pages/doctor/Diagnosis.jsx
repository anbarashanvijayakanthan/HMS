import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import { useVisit, useDiagnoses } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard", "Patient Consultation", "Diagnosis",
  "Prescription", "Lab Order", "Radiology Order", "Follow-up Manager",
]

// Mock ICD-10 suggestions — search index, not patient data, stays local
const ICD10_LIST = [
  { code: "I10",   name: "Essential Hypertension" },
  { code: "I49.9", name: "Cardiac Arrhythmia, unspecified" },
  { code: "J06.9", name: "Acute Upper Respiratory Infection" },
  { code: "M79.3", name: "Panniculitis" },
  { code: "K21.0", name: "GERD with Oesophagitis" },
  { code: "E11",   name: "Type 2 Diabetes Mellitus" },
  { code: "J18.9", name: "Pneumonia, unspecified" },
  { code: "N18.3", name: "Chronic Kidney Disease, Stage 3" },
]

function Diagnosis() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeLink, setActiveLink] = useState("Diagnosis")

  // ── Shared store ──
  const { visit, patient } = useVisit(token)
  const { diagnoses, addDiagnosis } = useDiagnoses(patient?.id)

  // Search state
  const [search, setSearch]       = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selected, setSelected]   = useState(null)

  // Form state
  const [nature, setNature]   = useState('PROVISIONAL')
  const [notes, setNotes]     = useState('')

  const handleSearch = (val) => {
    setSearch(val)
    setSelected(null)
    if (val.length < 2) { setSuggestions([]); return }
    const q = val.toLowerCase()
    setSuggestions(
      ICD10_LIST.filter(i =>
        i.code.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)
      )
    )
  }

  const handleSelect = (item) => {
    setSelected(item)
    setSearch(`${item.code} — ${item.name}`)
    setSuggestions([])
  }

  const handleSave = () => {
    if (!selected || !patient) return
    addDiagnosis({
      code: selected.code,
      name: selected.name,
      nature: nature === 'CONFIRM' ? 'Confirmed' : 'Provisional',
    })
    setSelected(null)
    setSearch('')
    setNotes('')
    setNature('PROVISIONAL')
  }

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")            navigate('/doctor')
    if (link === "Patient Consultation") navigate(`/doctor/consultation/${token}`)
    if (link === "Prescription")         navigate(`/doctor/prescription/${token}`)
    if (link === "Lab Order")            navigate(`/doctor/lab-order/${token}`)
    if (link === "Radiology Order")      navigate(`/doctor/radiology-order/${token}`)
    if (link === "Follow-up Manager")    navigate(`/doctor/followup/${token}`)
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Breadcrumb + Title */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-1">
            <span className="cursor-pointer hover:text-blue-500" onClick={() => navigate('/doctor')}>Doctor</span>
            {" › "}Diagnosis
          </p>
          <h2 className="text-2xl font-bold text-gray-800">Diagnosis</h2>
          <p className="text-sm text-gray-400">
            {patient.name} · {patient.id} · {visit.department}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5">

          {/* Left: Form + List */}
          <div className="col-span-2 flex flex-col gap-5">

            {/* Add Diagnosis Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-5">Add Diagnosis</h3>

              {/* ICD-10 Search */}
              <div className="mb-4 relative">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Search ICD-10 Code or Diagnosis Name
                </label>
                <input
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="e.g. Hypertension or I10..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {suggestions.map(item => (
                      <button
                        key={item.code}
                        onClick={() => handleSelect(item)}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 flex items-center gap-3 border-b border-gray-50 last:border-0"
                      >
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {item.code}
                        </span>
                        <span className="text-gray-700">{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Diagnosis Nature Toggle */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Diagnosis Nature *
                </label>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden w-fit">
                  {['PROVISIONAL', 'CONFIRM'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setNature(opt)}
                      className={`px-8 py-2 text-sm font-medium transition
                        ${nature === opt
                          ? 'bg-gray-800 text-white'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical Notes */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Clinical Notes
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Detailed clinical findings, reasoning, differentials..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={!selected}
                  className="bg-gray-800 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  ✓ Save Diagnosis
                </button>
              </div>
            </div>

            {/* Diagnosis List — now persisted per-patient in the store */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4">
                Diagnosis List — This Patient
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">ICD-10</th>
                    <th className="pb-3 font-medium">Diagnosis</th>
                    <th className="pb-3 font-medium">Diagnosis Nature</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnoses.map((d, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3">
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {d.code}
                        </span>
                      </td>
                      <td className="py-3 text-gray-700">{d.name}</td>
                      <td className="py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full
                          ${d.nature === 'Confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {d.nature}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {diagnoses.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-400">
                        No diagnoses added yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Patient Summary */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-6">
              <h3 className="font-semibold text-gray-700 mb-4">Patient Summary</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Name",      value: patient.name },
                  { label: "Age/Sex",   value: `${patient.age}${patient.gender?.charAt(0)}` },
                  { label: "Department",value: visit.department },
                  { label: "Allergies", value: patient.allergies.length > 0 ? patient.allergies.join(', ') : "None" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                    <span className="text-gray-400">{row.label}</span>
                    <span className={`font-medium ${row.label === 'Allergies' && row.value !== 'None' ? 'text-red-500' : 'text-gray-700'}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(`/doctor/prescription/${token}`)}
                className="w-full mt-5 bg-blue-600 text-white text-sm py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                → Go to Prescription
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Diagnosis