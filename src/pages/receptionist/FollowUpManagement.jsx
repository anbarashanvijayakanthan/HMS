import { useState } from 'react'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
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

const FOLLOWUPS = [
  { patient: "Arjun Mehta",   pid: "P-1001", doctor: "Dr. Priya Sharma", lastVisit: "12 Jun 2025", nextFollowUp: "19 Jun 2025", type: "Cardiac Review",  status: "Due Today" },
  { patient: "Kavitha Rajan", pid: "P-1002", doctor: "Dr. Ravi Kumar",   lastVisit: "10 Jun 2025", nextFollowUp: "19 Jun 2025", type: "Post-op Check",   status: "Due Today" },
  { patient: "Sneha Patel",   pid: "P-1004", doctor: "Dr. Arun Nair",    lastVisit: "05 Jun 2025", nextFollowUp: "15 Jun 2025", type: "Neuro Review",    status: "Overdue"   },
  { patient: "Rajesh Verma",  pid: "P-1005", doctor: "Dr. Priya Sharma", lastVisit: "15 Jun 2025", nextFollowUp: "22 Jun 2025", type: "BP Monitoring",   status: "Upcoming"  },
  { patient: "Vikram Nair",   pid: "P-1007", doctor: "Dr. Arun Nair",    lastVisit: "17 Jun 2025", nextFollowUp: "24 Jun 2025", type: "Physio Review",   status: "Upcoming"  },
]

const STATUS_STYLES = {
  "Due Today": "bg-yellow-100 text-yellow-700",
  "Overdue":   "bg-red-100 text-red-600",
  "Upcoming":  "bg-blue-100 text-blue-600",
  "Completed": "bg-green-100 text-green-700",
}

const TYPE_STYLES = {
  "Cardiac Review": "bg-red-100 text-red-600",
  "Post-op Check":  "bg-purple-100 text-purple-600",
  "Neuro Review":   "bg-orange-100 text-orange-600",
  "BP Monitoring":  "bg-blue-100 text-blue-600",
  "Physio Review":  "bg-teal-100 text-teal-600",
}

const FOLLOWUP_TYPES = ["Cardiac Review", "Post-op Check", "Neuro Review", "BP Monitoring", "Physio Review", "General Follow-up", "Lab Review"]
const TIME_SLOTS     = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"]

function FollowUpManagement() {
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Follow-up Management")
  const [search, setSearch]         = useState('')
  const [followups, setFollowups]   = useState(FOLLOWUPS)

  const [form, setForm] = useState({
    patient: '', doctor: '', date: '',
    timeSlot: '', type: '', instructions: '',
    smsReminder: false, emailReminder: false,
  })
  const [formSuccess, setFormSuccess] = useState('')

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")              navigate('/receptionist')
    if (link === "Patient Management")     navigate('/receptionist/patients')
    if (link === "Patient Registration")   navigate('/receptionist/registration')
    if (link === "Appointment Management") navigate('/receptionist/appointments')
    if (link === "Queue Management")       navigate('/receptionist/queue')
    if (link === "Billing Collection")     navigate('/receptionist/billing')
  }

  const handleSchedule = () => {
    if (!form.patient || !form.doctor || !form.date || !form.type) return
    const newEntry = {
      patient: form.patient,
      pid: 'P-NEW',
      doctor: form.doctor,
      lastVisit: 'Today',
      nextFollowUp: form.date,
      type: form.type,
      status: 'Upcoming',
    }
    setFollowups(prev => [newEntry, ...prev])
    setForm({ patient: '', doctor: '', date: '', timeSlot: '', type: '', instructions: '', smsReminder: false, emailReminder: false })
    setFormSuccess('Follow-up scheduled successfully!')
    setTimeout(() => setFormSuccess(''), 3000)
  }

  const filtered = followups.filter(f =>
    f.patient.toLowerCase().includes(search.toLowerCase()) ||
    f.doctor.toLowerCase().includes(search.toLowerCase()) ||
    f.pid.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    dueToday:  followups.filter(f => f.status === 'Due Today').length,
    dueWeek:   31,
    completed: 18,
    overdue:   followups.filter(f => f.status === 'Overdue').length,
  }

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Follow-up Management</h2>
            <p className="text-sm text-gray-400">Track and schedule patient follow-up appointments</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              ↑ Export
            </button>
            <button
              onClick={() => document.getElementById('schedule-form').scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              + Schedule Follow-up
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="📅" label="Due Today"    value={stats.dueToday}  subColor="text-yellow-500" />
          <StatsCard icon="⏰" label="Due This Week" value={stats.dueWeek}  />
          <StatsCard icon="✅" label="Completed"    value={stats.completed} subColor="text-green-500" />
          <StatsCard icon="⚠️" label="Overdue"      value={stats.overdue}   subColor="text-red-500" />
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patient..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50">
            ⊟ Filter
          </button>
        </div>

        {/* Follow-ups Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Doctor</th>
                <th className="pb-3 font-medium">Last Visit</th>
                <th className="pb-3 font-medium">Next Follow-up</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3">
                    <p className="font-medium text-gray-800">{f.patient}</p>
                    <p className="text-xs text-gray-400">{f.pid}</p>
                  </td>
                  <td className="py-3 text-gray-500 text-xs">{f.doctor}</td>
                  <td className="py-3 text-gray-500 text-xs">{f.lastVisit}</td>
                  <td className="py-3 font-semibold text-gray-800 text-xs">{f.nextFollowUp}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${TYPE_STYLES[f.type] || 'bg-gray-100 text-gray-600'}`}>
                      {f.type}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[f.status]}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-gray-700 transition">
                        📅 Book
                      </button>
                      <button className="text-xs text-gray-400 hover:text-blue-500 transition">
                        📞 Call
                      </button>
                      <button className="text-xs text-gray-400 hover:text-blue-500 transition">
                        ✉️ Email
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Schedule Follow-up Form */}
        <div id="schedule-form" className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Schedule Follow-up</h3>

          <div className="flex gap-6">

            {/* Left: form fields */}
            <div className="flex-1 grid grid-cols-2 gap-4">
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
                  Follow-up Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className={inp}
                >
                  <option value="">Select</option>
                  {FOLLOWUP_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Follow-up Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className={inp}
                />
              </div>
            </div>

            {/* Right: instructions + reminders */}
            <div className="w-64 shrink-0 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Patient Instructions
                </label>
                <textarea
                  rows={4}
                  value={form.instructions}
                  onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
                  placeholder="Diet restrictions, medications, tests to bring..."
                  className={`${inp} resize-none`}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={form.smsReminder}
                  onChange={e => setForm(f => ({ ...f, smsReminder: e.target.checked }))}
                  className="w-4 h-4 accent-blue-500"
                />
                Send SMS reminder
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={form.emailReminder}
                  onChange={e => setForm(f => ({ ...f, emailReminder: e.target.checked }))}
                  className="w-4 h-4 accent-blue-500"
                />
                Send Email reminder
              </label>

              {formSuccess && (
                <p className="text-xs text-green-600 font-medium">{formSuccess}</p>
              )}

              <button
                onClick={handleSchedule}
                className="w-full bg-gray-900 text-white text-sm py-2.5 rounded-lg hover:bg-gray-700 transition font-medium flex items-center justify-center gap-2 mt-1"
              >
                📅 Schedule Follow-up
              </button>
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}

export default FollowUpManagement