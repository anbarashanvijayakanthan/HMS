import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import { useVisit, useDiagnoses, useRadiologyOrders } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard", "Patient Consultation", "Diagnosis",
  "Prescription", "Lab Order", "Radiology Order", "Follow-up Manager",
]

const MODALITIES = ["X-Ray", "CT Scan", "MRI", "Ultrasound", "2D Echo", "ECG"]

const BODY_PARTS = [
  "Chest", "Abdomen", "Pelvis", "Brain", "Spine",
  "Heart", "Knee", "Shoulder", "Neck", "Whole Body",
]

const INVESTIGATION_TYPES = [
  "ECG", "Chest X-Ray", "2D Echo", "CT Chest",
  "MRI Brain", "USG Abdomen", "X-Ray Knee", "CT Abdomen",
]

const PRIORITIES = ["Routine", "STAT", "Urgent"]

const priorityStyle = {
  Routine: "bg-gray-100 text-gray-600",
  STAT:    "bg-red-100 text-red-600",
  Urgent:  "bg-orange-100 text-orange-600",
}

let radCounter = 1 // demo-only incrementing id; real backend would assign this

function RadiologyOrder() {
  const { token } = useParams()
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const [activeLink, setActiveLink] = useState("Radiology Order")

  // ── Shared store ──
  const { visit, patient } = useVisit(token)
  const { diagnoses } = useDiagnoses(patient?.id)
  const { radiologyOrders, createRadiologyOrder } = useRadiologyOrders()

  // Form state
  const [search,        setSearch]        = useState('')
  const [modality,      setModality]      = useState('X-Ray')
  const [invType,       setInvType]       = useState('')
  const [bodyPart,      setBodyPart]      = useState('')
  const [priority,      setPriority]      = useState('Routine')
  const [contrast,      setContrast]      = useState('No')
  const [reason,        setReason]        = useState('')

  const [showInvList,  setShowInvList]  = useState(false)
  const [showBodyList, setShowBodyList] = useState(false)

  // This patient's investigations already sent to Radiology this visit
  const investigations = radiologyOrders.filter(r => r.token === token)

  const filteredInv = INVESTIGATION_TYPES.filter(i =>
    i.toLowerCase().includes(search.toLowerCase()) &&
    !investigations.find(s => s.type === i)
  )

  const handleAdd = () => {
    if (!invType || !bodyPart || !patient) return
    radCounter += 1
    createRadiologyOrder({
      id: `RO-${radCounter}`,
      patientId: patient.id,
      token,
      doctor: `Dr. ${user?.name}`,
      type: invType,
      region: bodyPart,
      modality,
      priority,
      contrast: contrast === 'Yes' ? 'With Contrast' : 'None',
      reason,
      status: "Pending",
      ordered: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    })
    setInvType(''); setBodyPart(''); setPriority('Routine')
    setContrast('No'); setReason(''); setSearch('')
  }

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")            navigate('/doctor')
    if (link === "Patient Consultation") navigate(`/doctor/consultation/${token}`)
    if (link === "Diagnosis")            navigate(`/doctor/diagnosis/${token}`)
    if (link === "Prescription")         navigate(`/doctor/prescription/${token}`)
    if (link === "Lab Order")            navigate(`/doctor/lab-order/${token}`)
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
            {" › "}Radiology Orders
          </p>
          <h2 className="text-2xl font-bold text-gray-800">Radiology Orders</h2>
          <p className="text-sm text-gray-400">
            {patient.name} · {patient.id} · Imaging & Radiology Requests
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5">

          {/* Left: Form */}
          <div className="col-span-2 flex flex-col gap-5">

            {/* Search & Add */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4">
                Search & Select Investigation
              </h3>

              <div className="flex gap-2 mb-5">
                <div className="flex-1 relative">
                  <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); setShowInvList(true) }}
                    onFocus={() => setShowInvList(true)}
                    placeholder="🔍 Search"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {showInvList && filteredInv.length > 0 && (
                    <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                      {filteredInv.slice(0, 5).map(inv => (
                        <button
                          key={inv}
                          onClick={() => {
                            setInvType(inv)
                            setSearch(inv)
                            setShowInvList(false)
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 border-b border-gray-50 last:border-0"
                        >
                          {inv}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {MODALITIES.map(m => (
                  <button
                    key={m}
                    onClick={() => setModality(m)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition border
                      ${modality === m
                        ? 'bg-gray-800 text-white border-gray-800'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">

                <div className="relative">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Investigation Type *
                  </label>
                  <input
                    value={invType}
                    onChange={e => setInvType(e.target.value)}
                    placeholder="ECG"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="relative">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Body Part / Region *
                  </label>
                  <input
                    value={bodyPart}
                    onChange={e => { setBodyPart(e.target.value); setShowBodyList(true) }}
                    onFocus={() => setShowBodyList(true)}
                    placeholder="Chest"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {showBodyList && (
                    <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                      {BODY_PARTS.filter(b =>
                        b.toLowerCase().includes(bodyPart.toLowerCase())
                      ).slice(0, 5).map(b => (
                        <button
                          key={b}
                          onClick={() => { setBodyPart(b); setShowBodyList(false) }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 border-b border-gray-50 last:border-0"
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Clinical Priority *
                  </label>
                  <div className="flex gap-1">
                    {PRIORITIES.map(p => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition border
                          ${priority === p
                            ? 'bg-gray-800 text-white border-gray-800'
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Contrast Required?
                  </label>
                  <div className="flex gap-4 mt-2">
                    {['Yes', 'No'].map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contrast"
                          value={opt}
                          checked={contrast === opt}
                          onChange={() => setContrast(opt)}
                          className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Clinical Reason
                </label>
                <input
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Reason for investigation..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleAdd}
                  disabled={!invType || !bodyPart}
                  className="bg-gray-800 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-gray-700 transition disabled:opacity-40 flex items-center gap-2"
                >
                  ↗ Send to Radiology
                </button>
              </div>
            </div>

            {/* Selected Investigations Table — now real, from the store */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4">
                Investigations Sent — This Visit
                <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                  {investigations.length}
                </span>
              </h3>

              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100 uppercase text-xs">
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Region</th>
                    <th className="pb-3 font-medium">Priority</th>
                    <th className="pb-3 font-medium">Contrast</th>
                    <th className="pb-3 font-medium">Reason</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {investigations.map((inv) => (
                    <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-800">{inv.type}</td>
                      <td className="py-3">
                        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                          {inv.region}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityStyle[inv.priority]}`}>
                          {inv.priority}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500 text-xs">{inv.contrast}</td>
                      <td className="py-3 text-gray-500 text-xs max-w-40 truncate">{inv.reason || '—'}</td>
                      <td className="py-3 text-gray-500 text-xs">{inv.status}</td>
                    </tr>
                  ))}
                  {investigations.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        No investigations sent yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Right: Patient Info */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-6">
              <h3 className="font-semibold text-gray-700 mb-4">Patient Info</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Patient",   value: patient.name },
                  { label: "Age/Sex",   value: `${patient.age} yrs / ${patient.gender?.charAt(0)}` },
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
                  onClick={() => navigate(`/doctor/lab-order/${token}`)}
                  className="w-full border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  ← Back to Lab Order
                </button>
                <button
                  onClick={() => navigate(`/doctor/followup/${token}`)}
                  className="w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  → Follow-up Manager
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default RadiologyOrder