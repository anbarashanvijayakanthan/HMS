import { useState, useEffect } from 'react'
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

const INITIAL_QUEUE = [
  { token: "T-009", name: "Sneha Patel",    dept: "Cardiology", counter: "Counter 1", wait: 14, priority: false, blood: "B+", age: 31, gender: "Female", status: "Active"  },
  { token: "T-010", name: "Rajesh Verma",   dept: "Ortho",      counter: "Counter 3", wait: 28, priority: false, blood: "O+", age: 56, gender: "Male",   status: "Active"  },
  { token: "T-011", name: "Anita Desai",    dept: "General",    counter: "Counter 2", wait: 36, priority: true,  blood: "A+", age: 42, gender: "Female", status: "Active"  },
  { token: "T-012", name: "Vikram Nair",    dept: "Neurology",  counter: "Counter 1", wait: 42, priority: false, blood: "B-", age: 38, gender: "Male",   status: "Active"  },
  { token: "T-013", name: "Priya Krishnan", dept: "General",    counter: "Counter 3", wait: 58, priority: false, blood: "O-", age: 27, gender: "Female", status: "Active"  },
]

const AVATAR_COLORS = [
  "bg-pink-400", "bg-blue-400", "bg-green-400",
  "bg-purple-400", "bg-orange-400", "bg-teal-400",
]

function QueueManagement() {
  const navigate = useNavigate()
  const [activeLink, setActiveLink]   = useState("Queue Management")
  const [queue, setQueue]             = useState(INITIAL_QUEUE)
  const [nowServing, setNowServing]   = useState(INITIAL_QUEUE[0])
  const [servedToday, setServedToday] = useState(39)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', dept: '', counter: 'Counter 1', priority: false })

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")              navigate('/receptionist')
    if (link === "Patient Management")     navigate('/receptionist/patients')
    if (link === "Patient Registration")   navigate('/receptionist/registration')
    if (link === "Appointment Management") navigate('/receptionist/appointments')
    if (link === "Billing Collection")     navigate('/receptionist/billing')
    if (link === "Follow-up Management")   navigate('/receptionist/followup')
  }

  const handleCallNext = () => {
    if (queue.length === 0) return
    const next = queue[0]
    setNowServing(next)
  }

  const handleMakeServed = () => {
    setQueue(prev => prev.filter(p => p.token !== nowServing?.token))
    setServedToday(s => s + 1)
    const remaining = queue.filter(p => p.token !== nowServing?.token)
    setNowServing(remaining[0] || null)
  }

  const handleRecall = () => {
    // Re-announce current token — just a UI feedback here
    alert(`Recalling ${nowServing?.token} — ${nowServing?.name}`)
  }

  const handleCall = (token) => {
    const patient = queue.find(p => p.token === token)
    if (patient) setNowServing(patient)
  }

  const handleRemove = (token) => {
    setQueue(prev => prev.filter(p => p.token !== token))
    if (nowServing?.token === token) {
      const remaining = queue.filter(p => p.token !== token)
      setNowServing(remaining[0] || null)
    }
  }

  const handleAddToQueue = () => {
    if (!addForm.name || !addForm.dept) return
    const newToken = `T-0${14 + queue.length}`
    const newPatient = {
      token: newToken,
      name: addForm.name,
      dept: addForm.dept,
      counter: addForm.counter,
      wait: (queue.length + 1) * 8,
      priority: addForm.priority,
      blood: '—',
      age: 0,
      gender: '—',
      status: 'Active',
    }
    setQueue(prev => addForm.priority ? [newPatient, ...prev] : [...prev, newPatient])
    setAddForm({ name: '', dept: '', counter: 'Counter 1', priority: false })
    setShowAddModal(false)
    if (!nowServing) setNowServing(newPatient)
  }

  const avgWait = queue.length > 0
    ? Math.round(queue.reduce((sum, p) => sum + p.wait, 0) / queue.length)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Queue Management</h2>
            <p className="text-sm text-gray-400">Real-time patient queue · Auto-refreshes every 30 s</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live
            </span>
            <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              ↻ Refresh
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              + Add to Queue
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="👥" label="Total in Queue" value={queue.length} />
          <StatsCard icon="📢" label="Now Serving"    value={nowServing?.token || '—'} />
          <StatsCard icon="⏱️" label="Avg Wait Time"  value={`${avgWait} min`} />
          <StatsCard icon="✅" label="Served Today"   value={servedToday} sub="+7 vs yesterday" subColor="text-green-500" trend="up" />
        </div>

        {/* Now Serving Card */}
        {nowServing && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 ${AVATAR_COLORS[0]}`}>
                {nowServing.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800">{nowServing.name}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  {nowServing.age > 0 && <span>{nowServing.age} yrs</span>}
                  {nowServing.gender !== '—' && <span>| {nowServing.gender}</span>}
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Active</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm">
                  <span className="text-blue-500 font-semibold">{nowServing.token}</span>
                  <span className="text-blue-500">{nowServing.dept}</span>
                  {nowServing.blood !== '—' && <span className="text-gray-500">Blood: {nowServing.blood}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleCallNext}
                  className="border border-green-500 text-green-600 text-sm px-5 py-2 rounded-lg hover:bg-green-50 transition font-medium"
                >
                  Call Next
                </button>
                <button
                  onClick={handleRecall}
                  className="border border-orange-400 text-orange-500 text-sm px-5 py-2 rounded-lg hover:bg-orange-50 transition font-medium"
                >
                  Recall
                </button>
                <button
                  onClick={handleMakeServed}
                  className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Make Served
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Queue List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Queue List</h3>

          {queue.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-2">🎉</p>
              <p className="text-gray-500 font-medium">Queue is empty</p>
              <p className="text-gray-400 text-sm mt-1">All patients have been served</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {queue.map((p, i) => (
                <div
                  key={p.token}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg border transition
                    ${p.priority ? 'border-red-200 bg-red-50' : 'border-gray-100 hover:bg-gray-50'}`}
                >
                  {/* Token */}
                  <span className={`text-sm font-bold w-12 shrink-0 ${p.priority ? 'text-red-500' : 'text-gray-500'}`}>
                    {p.token}
                  </span>

                  {/* Name + dept */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800 text-sm">{p.name}</p>
                      {p.priority && (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                          Priority
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{p.dept} · {p.counter}</p>
                  </div>

                  {/* Wait time */}
                  <span className="text-xs text-gray-400 shrink-0">{p.wait} min</span>

                  {/* Actions */}
                  <button
                    onClick={() => handleCall(p.token)}
                    className="text-xs text-blue-500 hover:text-blue-700 font-medium shrink-0"
                  >
                    Call
                  </button>
                  <button
                    onClick={() => handleRemove(p.token)}
                    className="text-xs text-red-400 hover:text-red-600 shrink-0"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add to Queue Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-96">
              <h3 className="font-semibold text-gray-800 text-lg mb-4">Add to Queue</h3>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Patient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={addForm.name}
                    onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Enter patient name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={addForm.dept}
                    onChange={e => setAddForm(f => ({ ...f, dept: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select department</option>
                    {["Cardiology", "General", "Ortho", "Neurology", "Dermatology", "Gynecology"].map(d =>
                      <option key={d}>{d}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Counter
                  </label>
                  <select
                    value={addForm.counter}
                    onChange={e => setAddForm(f => ({ ...f, counter: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {["Counter 1", "Counter 2", "Counter 3"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addForm.priority}
                    onChange={e => setAddForm(f => ({ ...f, priority: e.target.checked }))}
                    className="w-4 h-4 accent-red-500"
                  />
                  <span className="text-sm text-gray-600 font-medium">Mark as Priority</span>
                </label>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToQueue}
                  className="flex-1 bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Add to Queue
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default QueueManagement