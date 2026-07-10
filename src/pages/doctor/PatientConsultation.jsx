import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import { useVisit, useVitals, useQueue } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard", "Patient Consultation", "Diagnosis",
  "Prescription", "Lab Order", "Radiology Order", "Follow-up Manager",
]

function PatientConsultation() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeLink, setActiveLink] = useState("Patient Consultation")
  const [notes, setNotes] = useState('')

  // ── Shared store ──
  const { visit, patient } = useVisit(token)
  const { vitals } = useVitals(token)
  const { setStatus } = useQueue()

  // When the doctor opens a case that's "Ready for Doctor", move it to
  // "With Doctor" automatically — same status everyone else already sees.
  useEffect(() => {
    if (visit && visit.status === "Ready for Doctor") {
      setStatus(token, "With Doctor")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")            navigate('/doctor')
    if (link === "Diagnosis")            navigate(`/doctor/diagnosis/${token}`)
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
          <button onClick={() => navigate('/doctor')} className="text-sm text-gray-400 hover:text-gray-600 mb-4">
            ← Back to Dashboard
          </button>
          <p className="text-gray-500">No patient found for token "{token}".</p>
        </main>
      </div>
    )
  }

  // Build the vitals display grid from whatever the nurse actually recorded
  const vitalsDisplay = vitals ? {
    BP:     `${vitals.bpSys || '—'}/${vitals.bpDia || '—'}`,
    Pulse:  `${vitals.pulse || '—'} bpm`,
    Temp:   `${vitals.temp || '—'}°F`,
    SpO2:   `${vitals.spo2 || '—'}%`,
    Weight: `${vitals.weight || '—'} kg`,
    Glucose:`${vitals.glucose || '—'} mg/dL`,
  } : null

  const historyText = [
    patient.chronic && patient.chronic !== "None" ? `Chronic: ${patient.chronic}.` : null,
    patient.allergies.length > 0 ? `Allergies: ${patient.allergies.join(', ')}.` : "No known allergies.",
  ].filter(Boolean).join(' ')

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate('/doctor')}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                ← Back to Dashboard
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Patient Consultation</h2>
            <p className="text-sm text-gray-400">
              Token {token} · Dr. {user?.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">

          {/* Left: Patient Info + Vitals */}
          <div className="col-span-1 flex flex-col gap-4">

            {/* Patient Info Card */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-3">Patient Info</h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name</span>
                  <span className="font-medium text-gray-800">{patient.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Age / Sex</span>
                  <span className="font-medium text-gray-800">{patient.age}{patient.gender?.charAt(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Patient ID</span>
                  <span className="font-mono text-xs text-gray-500">{patient.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Token</span>
                  <span className="font-mono text-xs text-gray-500">{token}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Department</span>
                  <span className="font-medium text-gray-800">{visit.department}</span>
                </div>
              </div>
            </div>

            {/* Vitals Card — real data from Nurse's Vitals Entry */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-3">Vitals</h3>
              {vitalsDisplay ? (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(vitalsDisplay).map(([key, val]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 uppercase">{key}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No vitals recorded yet for this visit.</p>
              )}
              {vitals?.critical && (
                <p className="text-xs text-red-500 font-medium mt-3">⚠ Flagged critical by nurse</p>
              )}
            </div>

            {/* History */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-2">Medical History</h3>
              <p className="text-sm text-gray-600">{historyText}</p>
            </div>
          </div>

          {/* Right: Consultation Notes */}
          <div className="col-span-2 flex flex-col gap-4">

            {/* Chief Complaint */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-2">Chief Complaint</h3>
              <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                {visit.complaint}
              </p>
            </div>

            {/* Consultation Notes — still local; no shared entity for free-text notes yet */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-1">
              <h3 className="font-semibold text-gray-700 mb-3">Consultation Notes</h3>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Type your observations, findings, and plan here..."
                className="w-full h-48 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/doctor/diagnosis/${token}`)}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                → Go to Diagnosis
              </button>
              <button
                onClick={() => navigate(`/doctor/prescription/${token}`)}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition"
              >
                💊 Write Prescription
              </button>
              <button
                onClick={() => navigate(`/doctor/lab-order/${token}`)}
                className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
              >
                🧪 Order Lab Tests
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PatientConsultation