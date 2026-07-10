import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import { useVisit, useDiagnoses, useMedicines, usePrescriptions } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard", "Patient Consultation", "Diagnosis",
  "Prescription", "Lab Order", "Radiology Order", "Follow-up Manager",
]

const FREQUENCIES = ["Once daily", "Twice daily", "Three times daily", "At bedtime", "As needed"]

let rxCounter = 8822 // demo-only incrementing id; real backend would assign this

function Prescription() {
  const { token } = useParams()
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const [activeLink, setActiveLink] = useState("Prescription")

  // ── Shared store ──
  const { visit, patient } = useVisit(token)
  const { diagnoses } = useDiagnoses(patient?.id)
  const { medicines } = useMedicines()
  const { createPrescription } = usePrescriptions()

  // Add medicine form
  const [medSearch,  setMedSearch]  = useState('')
  const [medSuggestions, setMedSuggestions] = useState([])
  const [selectedMed, setSelectedMed] = useState('')
  const [dose,       setDose]       = useState('5mg')
  const [frequency,  setFrequency]  = useState('Once daily')
  const [duration,   setDuration]   = useState('30 days')
  const [instructions, setInstructions] = useState('')

  // Medicines added to THIS prescription (local until "Send to Pharmacy")
  const [rxMedicines, setRxMedicines] = useState([])

  // Doctor's advice
  const [diet,     setDiet]     = useState('')
  const [activity, setActivity] = useState('')
  const [general,  setGeneral]  = useState('')
  const [sent, setSent] = useState(false)

  const isAllergic = (name) =>
    patient?.allergies?.some(a => name.toLowerCase().includes(a.toLowerCase()))

  const handleMedSearch = (val) => {
    setMedSearch(val)
    setSelectedMed('')
    if (val.length < 2) { setMedSuggestions([]); return }
    setMedSuggestions(
      medicines
        .map(m => m.name)
        .filter(name => name.toLowerCase().includes(val.toLowerCase()))
    )
  }

  const handleMedSelect = (med) => {
    setSelectedMed(med)
    setMedSearch(med)
    setMedSuggestions([])
  }

  const handleAdd = () => {
    if (!selectedMed) return
    setRxMedicines(prev => [...prev, { name: selectedMed, dose, frequency, duration, instructions }])
    setMedSearch(''); setSelectedMed(''); setDose('5mg')
    setFrequency('Once daily'); setDuration('30 days'); setInstructions('')
  }

  const handleSendToPharmacy = () => {
    if (!patient || rxMedicines.length === 0) return

    // Look up batch/price from the real inventory for each medicine
    const enrichedMedicines = rxMedicines.map(m => {
      const stockItem = medicines.find(inv => inv.name.toLowerCase().includes(m.name.toLowerCase()) || m.name.toLowerCase().includes(inv.name.toLowerCase()))
      return {
        ...m,
        batch: stockItem?.batch || "N/A",
        price: stockItem?.price ?? 0,
      }
    })

    rxCounter += 1
    createPrescription({
      rxId: `RX-${rxCounter}`,
      patientId: patient.id,
      token,
      doctor: `Dr. ${user?.name}`,
      date: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: "Pending",
      urgency: "Medium",
      medicines: enrichedMedicines,
    })
    setSent(true)
  }

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")            navigate('/doctor')
    if (link === "Patient Consultation") navigate(`/doctor/consultation/${token}`)
    if (link === "Diagnosis")            navigate(`/doctor/diagnosis/${token}`)
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
            <span className="cursor-pointer hover:text-blue-500"
              onClick={() => navigate('/doctor')}>Doctor</span>
            {" › "}Prescription
          </p>
          <h2 className="text-2xl font-bold text-gray-800">Prescription</h2>
          <p className="text-sm text-gray-400">
            {patient.name} · {patient.id} · {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5">

          {/* Left: Main content */}
          <div className="col-span-2 flex flex-col gap-5">

            {/* Add Medicine — search now hits the real inventory */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                🔗 Add Medicine
              </h3>

              <div className="grid grid-cols-4 gap-3 mb-3 items-end">

                <div className="col-span-1 relative">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Medicine Name *
                  </label>
                  <input
                    value={medSearch}
                    onChange={e => handleMedSearch(e.target.value)}
                    placeholder="Search drug..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {medSuggestions.length > 0 && (
                    <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                      {medSuggestions.map(m => (
                        <button
                          key={m}
                          onClick={() => handleMedSelect(m)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 border-b border-gray-50 last:border-0
                            ${isAllergic(m) ? 'text-red-500' : 'text-gray-700'}`}
                        >
                          {m}
                          {isAllergic(m) && <span className="ml-2 text-xs">⚠ Allergic</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Dose *
                  </label>
                  <input
                    value={dose}
                    onChange={e => setDose(e.target.value)}
                    placeholder="5mg"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Frequency *
                  </label>
                  <select
                    value={frequency}
                    onChange={e => setFrequency(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Duration *
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      placeholder="30 days"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAdd}
                      disabled={!selectedMed}
                      className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-40 whitespace-nowrap"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Prescribed Medicines Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Prescribed Medicines</h3>

              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium w-6">#</th>
                    <th className="pb-3 font-medium">Medicine</th>
                    <th className="pb-3 font-medium">Dose</th>
                    <th className="pb-3 font-medium">Frequency</th>
                    <th className="pb-3 font-medium">Duration</th>
                    <th className="pb-3 font-medium">Instructions</th>
                    <th className="pb-3 font-medium">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {rxMedicines.map((m, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 text-gray-400">{i + 1}</td>
                      <td className="py-3 font-medium text-gray-800">{m.name}</td>
                      <td className="py-3 text-gray-600">{m.dose}</td>
                      <td className="py-3">
                        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                          {m.frequency}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{m.duration}</td>
                      <td className="py-3">
                        {isAllergic(m.name) ? (
                          <span className="text-red-500 text-xs font-semibold flex items-center gap-1">
                            ⚠ ALLERGIC TO {m.name.toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs">{m.instructions || '—'}</span>
                        )}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => setRxMedicines(prev => prev.filter((_, idx) => idx !== i))}
                          className="text-xs text-red-400 hover:underline"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                  {rxMedicines.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-gray-400 text-sm">
                        No medicines added yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {sent && (
                <p className="text-sm text-green-600 mt-3">✓ Prescription sent to Pharmacy.</p>
              )}

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSendToPharmacy}
                  disabled={rxMedicines.length === 0}
                  className="bg-gray-800 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-700 transition disabled:opacity-40 flex items-center gap-2"
                >
                  ↗ Send to Pharmacy
                </button>
              </div>
            </div>

            {/* Doctor's Advice — still local, no shared entity for this yet */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Doctor's Advice</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Diet Instructions
                  </label>
                  <textarea
                    value={diet}
                    onChange={e => setDiet(e.target.value)}
                    placeholder="Low sodium diet, avoid oily food..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Activity Instructions
                  </label>
                  <textarea
                    value={activity}
                    onChange={e => setActivity(e.target.value)}
                    placeholder="Moderate exercise 30 min daily..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  General Instructions
                </label>
                <textarea
                  value={general}
                  onChange={e => setGeneral(e.target.value)}
                  placeholder="Monitor BP daily, return immediately if chest pain worsens..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => navigate('/doctor')}
                  className="bg-gray-800 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                >
                  ✓ Complete Consultation
                </button>
              </div>
            </div>

          </div>

          {/* Right: Current Diagnosis — now from the store */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-6">
              <h3 className="font-semibold text-gray-700 mb-4">Current Diagnosis</h3>
              <div className="flex flex-col gap-3">
                {diagnoses.map((d, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="font-mono text-xs bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded shrink-0">
                      {d.code}
                    </span>
                    <span className="text-sm text-gray-700">{d.name}</span>
                  </div>
                ))}
                {diagnoses.length === 0 && (
                  <p className="text-sm text-gray-400">No diagnosis recorded yet</p>
                )}
              </div>

              <button
                onClick={() => navigate(`/doctor/diagnosis/${token}`)}
                className="w-full mt-4 border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50 transition"
              >
                ← Back to Diagnosis
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Prescription