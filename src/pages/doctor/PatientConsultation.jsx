import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'

const NAV_LINKS = [
  "Dashboard", "Patient Consultation", "Diagnosis",
  "Prescription", "Lab Order", "Radiology Order", "Follow-up Manager",
]

// Mock patient data — replace with API later
const MOCK_PATIENTS = {
  "T-009": {
    name: "Sneha Patel", age: "31F", id: "P-1043",
    complaint: "Chest pain, palpitations",
    vitals: { bp: "120/80", pulse: "88 bpm", temp: "98.6°F", spo2: "98%", weight: "62 kg" },
    history: "No known allergies. Hypertension (controlled).",
  },
  "T-010": {
    name: "Rajesh Verma", age: "56M", id: "P-1044",
    complaint: "Hypertension follow-up",
    vitals: { bp: "150/95", pulse: "92 bpm", temp: "98.4°F", spo2: "96%", weight: "78 kg" },
    history: "Hypertension 5 years. On Amlodipine 5mg.",
  },
}

function PatientConsultation() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeLink, setActiveLink] = useState("Patient Consultation")
  const [notes, setNotes] = useState('')

  const patient = MOCK_PATIENTS[token] || {
    name: "Unknown Patient", age: "--", id: "--",
    complaint: "--",
    vitals: { bp: "--", pulse: "--", temp: "--", spo2: "--", weight: "--" },
    history: "--",
  }

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard") navigate('/doctor')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={handleNavClick}
      />

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
                  <span className="font-medium text-gray-800">{patient.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Patient ID</span>
                  <span className="font-mono text-xs text-gray-500">{patient.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Token</span>
                  <span className="font-mono text-xs text-gray-500">{token}</span>
                </div>
              </div>
            </div>

            {/* Vitals Card */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-3">Vitals</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(patient.vitals).map(([key, val]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase">{key}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-2">Medical History</h3>
              <p className="text-sm text-gray-600">{patient.history}</p>
            </div>
          </div>

          {/* Right: Consultation Notes */}
          <div className="col-span-2 flex flex-col gap-4">

            {/* Chief Complaint */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-2">Chief Complaint</h3>
              <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                {patient.complaint}
              </p>
            </div>

            {/* Consultation Notes */}
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