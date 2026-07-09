import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import StatusBadge from '../../components/common/StatusBadge'
import { useNavigate } from 'react-router-dom'
import { useAppointments, usePatients, useAddPatient } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Patient Management",
  "Patient Registration",
  "Appointment Management",
  "Queue Management",
  "Billing Collection",
  "Follow-up Management",
]

const TYPES = ["Consultation", "Follow-up", "New Patient", "Review"]
let apptCounter = 3

function AppointmentManagement() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Appointment Management")
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const { appointments, createAppointment, updateStatus } = useAppointments()
  const patients = usePatients()

  const [form, setForm] = useState({ patientId: '', doctor: '', time: '', type: 'Consultation' })

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")              navigate('/receptionist')
    if (link === "Patient Management")     navigate('/receptionist/patients')
    if (link === "Patient Registration")   navigate('/receptionist/registration')
    if (link === "Queue Management")       navigate('/receptionist/queue')
    if (link === "Billing Collection")     navigate('/receptionist/billing')
    if (link === "Follow-up Management")   navigate('/receptionist/followup')
    if (link === "Appointment Management") navigate('/receptionist/appointments')
  }

  const enriched = appointments.map(a => ({
    ...a,
    patientName: patients.find(p => p.id === a.patientId)?.name || a.patientId,
  }))

  const filtered = enriched.filter(a =>
    a.patientName.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor.toLowerCase().includes(search.toLowerCase())
  )

  const handleBook = () => {
    if (!form.patientId || !form.doctor || !form.time) return
    apptCounter += 1
    createAppointment({
      id: `APT-${String(apptCounter).padStart(3, '0')}`,
      patientId: form.patientId,
      doctor: form.doctor,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: form.time,
      type: form.type,
      status: "Scheduled",
    })
    setForm({ patientId: '', doctor: '', time: '', type: 'Consultation' })
    setShowModal(false)
  }

  const scheduledCount = appointments.filter(a => a.status === "Scheduled").length
  const completedCount = appointments.filter(a => a.status === "Completed").length

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Appointment Management</h2>
            <p className="text-sm text-gray-400">All scheduled appointments</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            + Book Appointment
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatsCard icon="📅" label="Total Appointments" value={appointments.length} />
          <StatsCard icon="⏳" label="Scheduled"           value={scheduledCount} />
          <StatsCard icon="✅" label="Completed"           value={completedCount} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient or doctor..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Doctor</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 font-medium text-gray-800">{a.patientName}</td>
                  <td className="py-3 text-gray-600">{a.doctor}</td>
                  <td className="py-3 text-gray-500 text-xs">{a.date}</td>
                  <td className="py-3 text-gray-500">{a.time}</td>
                  <td className="py-3 text-gray-500">{a.type}</td>
                  <td className="py-3"><StatusBadge status={a.status} /></td>
                  <td className="py-3">
                    {a.status === "Scheduled" && (
                      <button
                        onClick={() => updateStatus(a.id, "Completed")}
                        className="text-xs text-blue-500 hover:underline"
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-400 text-sm">No appointments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">Book Appointment</h3>

            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Patient</label>
                <select
                  value={form.patientId}
                  onChange={e => setForm(p => ({ ...p, patientId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select patient</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Doctor</label>
                <input
                  value={form.doctor}
                  onChange={e => setForm(p => ({ ...p, doctor: e.target.value }))}
                  placeholder="Dr. Priya Sharma"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Time</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowModal(false)} className="border border-gray-200 text-gray-500 text-sm py-2.5 rounded-lg hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleBook} className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 rounded-lg transition">
                Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentManagement