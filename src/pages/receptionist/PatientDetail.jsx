import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import { useState } from 'react'

const NAV_LINKS = [
  "Dashboard",
  "Patient Management",
  "Patient Registration",
  "Appointment Management",
  "Queue Management",
  "Billing Collection",
  "Follow-up Management",
]

// Mock patient detail data keyed by ID
const PATIENT_DETAILS = {
  "P-1001": {
    name: "Arjun Mehta",
    gender: "Male",
    dob: "12 Mar 1991 (34 Y)",
    phone: "9876543210",
    email: "arjun.mehta@gmail.com",
    blood: "O+",
    location: "Chennai, Tamil Nadu",
    address: "Chennai",
    age: "34 years",
    aadhar: "9876 5432 1210",
    department: "Cardiology",
    allergies: "None",
    chronic: "None",
    height: "178 cm",
    weight: "75 kg",
    recentVisits: [
      { date: "19 Jun 26", doctor: "Dr. Priya Sharma", dept: "Cardiology" },
      { date: "12 Jun 26", doctor: "Dr. Priya Sharma", dept: "Cardiology" },
      { date: "08 Jun 26", doctor: "Dr. Priya Sharma", dept: "Cardiology" },
      { date: "01 Jun 26", doctor: "Dr. Priya Sharma", dept: "Cardiology" },
    ],
    nextAppointment: {
      day: "24",
      month: "JUN",
      doctor: "Dr. Priya Sharma",
      reason: "BP Monitoring Orders",
      time: "10:30 AM",
    }
  },
  "P-1006": {
    name: "Ananya Krishnan",
    gender: "Female",
    dob: "15 Mar 1993 (32 Y)",
    phone: "9988776655",
    email: "ananyaKrishnan@gmail.com",
    blood: "B+",
    location: "Vellore, Tamil Nadu",
    address: "Vellore",
    age: "34 years",
    aadhar: "9876 5432 1210",
    department: "Cardiology",
    allergies: "Penicillin, Pollen",
    chronic: "Hypertension",
    height: "175 cm",
    weight: "72 kg",
    recentVisits: [
      { date: "19 Jun 26", doctor: "Dr. Ananya Krishnan", dept: "Cardiology" },
      { date: "12 Jun 26", doctor: "Dr. Ananya Krishnan", dept: "Cardiology" },
      { date: "08 Jun 26", doctor: "Dr. Ananya Krishnan", dept: "Cardiology" },
      { date: "01 Jun 26", doctor: "Dr. Ananya Krishnan", dept: "Cardiology" },
    ],
    nextAppointment: {
      day: "24",
      month: "JUN",
      doctor: "Dr. Ananya Krishnan",
      reason: "BP Monitoring Orders",
      time: "10:30 AM",
    }
  },
}

// Fallback for any patient not in detail mock
const DEFAULT_PATIENT = (id) => ({
  name: "Patient " + id,
  gender: "—",
  dob: "—",
  phone: "—",
  email: "—",
  blood: "—",
  location: "—",
  address: "—",
  age: "—",
  aadhar: "—",
  department: "—",
  allergies: "None",
  chronic: "None",
  height: "—",
  weight: "—",
  recentVisits: [],
  nextAppointment: null,
})

function PatientDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [activeLink, setActiveLink] = useState("Patient Management")

  const patient = PATIENT_DETAILS[id] || DEFAULT_PATIENT(id)

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")          navigate('/receptionist')
    if (link === "Patient Management") navigate('/receptionist/patients')
  }

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

            {/* Avatar */}
            <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-2xl shrink-0">
              {patient.name.charAt(0)}
            </div>

            {/* Name + details grid */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{patient.name}</h2>
              <div className="grid grid-cols-3 gap-y-2 gap-x-8 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span>👤</span> {patient.gender}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📅</span> {patient.dob}
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
                  <span>📍</span> {patient.location}
                </div>
              </div>
            </div>

            {/* Action buttons */}
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

        {/* Bottom 4 cards */}
        <div className="grid grid-cols-2 gap-5">

          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Personal Information</h3>
            <div className="flex flex-col gap-2.5 text-sm">
              {[
                ["Full Name",    patient.name],
                ["Address",     patient.address],
                ["Age",         patient.age],
                ["Blood Group", patient.blood],
                ["Aadhar No",   patient.aadhar],
                ["Department",  patient.department],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-blue-500 font-medium">{label}</span>
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Visits */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Recent Visits</h3>
            <div className="flex flex-col gap-3">
              {patient.recentVisits.map((v, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 w-20 shrink-0">{v.date}</span>
                  <span className="text-gray-700 flex-1">{v.doctor}</span>
                  <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {v.dept}
                  </span>
                  <button className="ml-3 text-xs text-gray-400 hover:text-blue-500 transition flex items-center gap-1">
                    👁 View
                  </button>
                </div>
              ))}
              {patient.recentVisits.length === 0 && (
                <p className="text-sm text-gray-400">No visits recorded yet.</p>
              )}
            </div>
          </div>

          {/* Medical Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Medical Summary</h3>
            <div className="flex flex-col gap-2.5 text-sm">
              {[
                ["Allergies",   patient.allergies],
                ["Chronic",     patient.chronic],
                ["Age",         patient.age],
                ["Blood Group", patient.blood],
                ["Height",      patient.height],
                ["Weight",      patient.weight],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-blue-500 font-medium">{label}</span>
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Appointment */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Next Appointment</h3>
            {patient.nextAppointment ? (
              <>
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-center bg-blue-50 rounded-xl px-4 py-3 shrink-0">
                    <p className="text-2xl font-bold text-gray-800">{patient.nextAppointment.day}</p>
                    <p className="text-xs text-blue-500 font-semibold">{patient.nextAppointment.month}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{patient.nextAppointment.doctor}</p>
                    <p className="text-sm text-gray-400 mt-0.5">Reason: {patient.nextAppointment.reason}</p>
                    <p className="text-sm text-gray-400">{patient.nextAppointment.time}</p>
                  </div>
                </div>
                <button className="w-full text-center text-sm text-blue-500 hover:text-blue-600 transition font-medium">
                  + Schedule New Follow-up
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400 mb-3">No upcoming appointment</p>
                <button className="text-sm text-blue-500 hover:text-blue-600 transition font-medium">
                  + Schedule Appointment
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}

export default PatientDetail