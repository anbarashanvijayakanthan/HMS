import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import { useState } from 'react'
import { usePatient, useVisit, useQueue } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Patient Management",
  "Patient Registration",
  "Appointment Management",
  "Queue Management",
  "Billing Collection",
  "Follow-up Management",
]

function PatientDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [activeLink, setActiveLink] = useState("Patient Management")

  // ── Shared store ──
  const patient = usePatient(id)
  const { queue } = useQueue()

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")          navigate('/receptionist')
    if (link === "Patient Management") navigate('/receptionist/patients')
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />
        <main className="flex-1 p-6">
          <p className="text-gray-500">No patient found for ID "{id}".</p>
        </main>
      </div>
    )
  }

  // This patient's visit today, if any — real, from the shared queue
  const todayVisit = queue.find(v => v.patientId === patient.id)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <button onClick={() => navigate('/receptionist/patients')} className="hover:text-blue-500 transition">
            Patient Management
          </button>
          <span>›</span>
          <span className="text-gray-600 font-medium">{patient.name}</span>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
          <div className="flex items-center gap-6">

            <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-2xl shrink-0">
              {patient.name.charAt(0)}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{patient.name}</h2>
              <div className="grid grid-cols-3 gap-y-2 gap-x-8 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span>👤</span> {patient.gender}, {patient.age} yrs
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>🩸</span> {patient.blood}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📞</span> {patient.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>✉️</span> {patient.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📍</span> {patient.address}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>🏥</span> {patient.department}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                📅 Book Appointment
              </button>
              <button className="border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                ✏️ Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Bottom cards */}
        <div className="grid grid-cols-2 gap-5">

          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Personal Information</h3>
            <div className="flex flex-col gap-2.5 text-sm">
              {[
                ["Full Name",    patient.name],
                ["Address",     patient.address],
                ["Age",         `${patient.age} years`],
                ["Blood Group", patient.blood],
                ["Department",  patient.department],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-blue-500 font-medium">{label}</span>
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Visit — real, replaces the old fake "Recent Visits" list */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Today's Visit</h3>
            {todayVisit ? (
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Token</span>
                  <span className="font-mono text-xs text-gray-600">{todayVisit.token}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Check-in</span>
                  <span className="text-gray-700">{todayVisit.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {todayVisit.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Complaint</span>
                  <span className="text-gray-700 text-right max-w-40">{todayVisit.complaint}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No visit today.</p>
            )}
          </div>

          {/* Medical Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Medical Summary</h3>
            <div className="flex flex-col gap-2.5 text-sm">
              {[
                ["Allergies",   patient.allergies?.length ? patient.allergies.join(', ') : "None"],
                ["Chronic",     patient.chronic],
                ["Blood Group", patient.blood],
                ["Height",      patient.height],
                ["Weight",      patient.weight],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-blue-500 font-medium">{label}</span>
                  <span className={label === "Allergies" && value !== "None" ? "text-red-500 font-medium" : "text-gray-700"}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Appointment — placeholder, no appointments entity in the store yet */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Next Appointment</h3>
            <div className="text-center py-4">
              <p className="text-sm text-gray-400 mb-3">Appointments aren't tracked in the shared store yet</p>
              <button className="text-sm text-blue-500 hover:text-blue-600 transition font-medium">
                + Schedule Appointment
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default PatientDetail