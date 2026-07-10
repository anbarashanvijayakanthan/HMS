import { useState } from 'react'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import StatusBadge from '../../components/common/StatusBadge'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  "Dashboard",
  "Patient Management",
  "Patient Registration",
  "Appointment Management",
  "Queue Management",
  "Billing Collection",
  "Follow-up Management",
]

const INITIAL_APPOINTMENTS = [
  { id: "APT-8891", patient: "Arjun Mehta",     doctor: "Dr. Priya Sharma", date: "19 Jun", time: "09:00", type: "Consultation", status: "Completed"   },
  { id: "APT-8892", patient: "Kavitha Rajan",   doctor: "Dr. Ravi Kumar",   date: "19 Jun", time: "09:30", type: "Follow-up",    status: "In Progress" },
  { id: "APT-8893", patient: "Mohammed Farhan", doctor: "Dr. Priya Sharma", date: "19 Jun", time: "10:00", type: "New Patient",  status: "Waiting"     },
  { id: "APT-8894", patient: "Sneha Patel",     doctor: "Dr. Arun Nair",    date: "19 Jun", time: "10:30", type: "Consultation", status: "Scheduled"   },
  { id: "APT-8895", patient: "Rajesh Verma",    doctor: "Dr. Ravi Kumar",   date: "19 Jun", time: "11:00", type: "Review",       status: "Scheduled"   },
  { id: "APT-8896", patient: "Anita Desai",     doctor: "Dr. Arun Nair",    date: "19 Jun", time: "11:30", type: "Consultation", status: "Cancelled"   },
]

const TYPE_STYLES = {
  Consultation: "bg-blue-50 text-blue-600",
  "Follow-up":  "bg-purple-50 text-purple-600",
  "New Patient":"bg-orange-50 text-orange-600",
  Review:       "bg-gray-100 text-gray-600",
}

const APPOINTMENT_TYPES = ["Consultation", "Follow-up", "New Patient", "Review", "Emergency"]
const DEPARTMENTS       = ["Cardiology", "General", "Ortho", "Neuro", "Dermatology", "Gynecology", "Pediatrics"]
const TIME_SLOTS        = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"]

function AppointmentManagement() {
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Appointment Management")
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS)
  const [search, setSearch] = useState('')

  // Booking form state
  const [form, setForm] = useState({
    patient: '', department: '', doctor: '',
    date: '', timeSlot: '', type: '', fee: '',
  })
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")              navigate('/receptionist')
    if (link === "Patient Management")     navigate('/receptionist/patients')
    if (link === "Patient Registration")   navigate('/receptionist/registration')
    if (link === "Queue Management")       navigate('/receptionist/queue')
    if (link === "Billing Collection")     navigate('/receptionist/billing')
    if (link === "Follow-up Management")   navigate('/receptionist/followup')
  }

  const handleCancel = (id) => {
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status: "Cancelled" } : a)
    )
  }

  const handleBook = () => {
    if (!form.patient || !form.department || !form.doctor || !form.date || !form.timeSlot || !form.type) {
      setFormError('Please fill all required fields.')
      return
    }
    const newAppt = {
      id: `APT-${8897 + appointments.length}`,
      patient: form.patient,
      doctor: form.doctor,
      date: form.date,
      time: form.timeSlot,
      type: form.type,
      status: "Scheduled",
    }
    setAppointments(prev => [newAppt, ...prev])
    setForm({ patient: '', department: '', doctor: '', date: '', timeSlot: '', type: '', fee: '' })
    setFormError('')
    setFormSuccess('Appointment booked successfully!')
    setTimeout(() => setFormSuccess(''), 3000)
  }

  const filtered = appointments.filter(a =>
    a.patient.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor.toLowerCase().includes(search.toLowerCase()) ||
    a.id.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total:     appointments.length,
    completed: appointments.filter(a => a.status === "Completed").length,
    upcoming:  appointments.filter(a => a.status === "Scheduled").length,
    cancelled: appointments.filter(a => a.status === "Cancelled").length,
  }

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Appointment Management</h2>
            <p className="text-sm text-gray-400">Schedule and manage all patient appointments</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="📅" label="Total Today"  value={stats.total}     />
          <StatsCard icon="✅" label="Completed"    value={stats.completed} />
          <StatsCard icon="⏳" label="Upcoming"     value={stats.upcoming}  />
          <StatsCard icon="❌" label="Cancelled"    value={stats.cancelled} subColor="text-red-500" />
        </div>

        {/* Two column: table + booking form */}
        <div className="flex gap-5 items-start">

          {/* Appointments Table */}
          <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5">

            <div className="flex gap-2 mb-5">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search patient or doctor..."
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50">
                ⊟ Filter
              </button>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Appt ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Doctor</th>
                  <th className="pb-3 font-medium">Date & Time</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 font-mono text-xs text-gray-500 font-semibold">{a.id}</td>
                    <td className="py-3 font-medium text-gray-800">{a.patient}</td>
                    <td className="py-3 text-gray-500">{a.doctor}</td>
                    <td className="py-3 text-gray-500">{a.date} · {a.time}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${TYPE_STYLES[a.type] || 'bg-gray-100 text-gray-600'}`}>
                        {a.type}
                      </span>
                    </td>
                    <td className="py-3"><StatusBadge status={a.status} /></td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-gray-400 hover:text-blue-500 transition">
                          👁 View
                        </button>
                        {a.status !== "Cancelled" && a.status !== "Completed" && (
                          <button
                            onClick={() => handleCancel(a.id)}
                            className="text-xs text-red-400 hover:text-red-600 transition"
                          >
                            ✕ Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Book Appointment Form */}
          <div className="w-72 shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span>+</span> Book Appointment
            </h3>

            <div className="flex flex-col gap-3">

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Patient ID or Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.patient}
                  onChange={e => setForm(f => ({ ...f, patient: e.target.value }))}
                  placeholder="Search patient..."
                  className={inp}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.department}
                  onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                  className={inp}
                >
                  <option value="">Select</option>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Doctor <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.doctor}
                  onChange={e => setForm(f => ({ ...f, doctor: e.target.value }))}
                  className={inp}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className={inp}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Time Slot <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.timeSlot}
                  onChange={e => setForm(f => ({ ...f, timeSlot: e.target.value }))}
                  className={inp}
                >
                  <option value="">Select</option>
                  {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Appointment Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className={inp}
                >
                  <option value="">Select</option>
                  {APPOINTMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Consultation Fee
                </label>
                <input
                  type="number"
                  value={form.fee}
                  onChange={e => setForm(f => ({ ...f, fee: e.target.value }))}
                  className={inp}
                />
              </div>

              {formError && (
                <p className="text-xs text-red-500">{formError}</p>
              )}
              {formSuccess && (
                <p className="text-xs text-green-600 font-medium">{formSuccess}</p>
              )}

              <button
                onClick={handleBook}
                className="w-full bg-gray-900 text-white text-sm py-2.5 rounded-lg hover:bg-gray-700 transition font-medium flex items-center justify-center gap-2 mt-1"
              >
                📅 Book Appointment
              </button>

            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default AppointmentManagement