import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import { useFollowUps, usePatients } from '../../store/hospitalStore'

// ─── Nav ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  'Dashboard', 'Patients', 'Appointments', 'Doctors', 'Staff',
  'OP', 'IP', 'Prescriptions', 'Pharmacy', 'Laboratory',
  'Vehicles', 'Finance', 'Follow-ups', 'Reports', 'Settings',
]

// ─── Stat card ────────────────────────────────────────────────────────────────
function FollowUpStat({ value, label, variant }) {
  const styles = {
    blue:   { bg: 'bg-blue-50',   val: 'text-blue-600',   lbl: 'text-blue-400'   },
    red:    { bg: 'bg-red-50',    val: 'text-red-500',    lbl: 'text-red-400'    },
    green:  { bg: 'bg-green-50',  val: 'text-green-600',  lbl: 'text-green-500'  },
    yellow: { bg: 'bg-yellow-50', val: 'text-yellow-600', lbl: 'text-yellow-500' },
  }[variant]
  return (
    <div className={`rounded-xl p-5 ${styles.bg}`}>
      <p className={`text-3xl font-bold leading-none mb-1 ${styles.val}`}>{value}</p>
      <p className={`text-sm font-medium ${styles.lbl}`}>{label}</p>
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function FollowUpBadge({ status }) {
  const s = {
    'Scheduled':   'bg-blue-100 text-blue-600',
    'Missed':      'bg-red-100 text-red-500',
    'Completed':   'bg-green-100 text-green-600',
    'Rescheduled': 'bg-yellow-100 text-yellow-600',
  }
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap
                      ${s[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  )
}

// ─── Top bar ──────────────────────────────────────────────────────────────────
function AdminTopBar({ breadcrumb, search, onSearch }) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100
                       flex items-center justify-between px-6 py-3 gap-4">
      <p className="text-sm text-gray-500 font-medium">
        MediCore HMS
        <span className="mx-1.5 text-gray-300">/</span>
        <span className="text-gray-800 font-semibold">{breadcrumb}</span>
      </p>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input value={search} onChange={e => onSearch(e.target.value)}
            placeholder="Quick search..."
            className="text-sm border border-gray-200 rounded-lg pl-8 pr-3 py-1.5
                       w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600" />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
        </div>
        <button className="relative p-1.5 rounded-lg hover:bg-gray-100 transition">
          <span className="text-lg">🔔</span>
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white
                           text-[9px] font-bold rounded-full flex items-center justify-center">9</span>
        </button>
        <div className="flex items-center -space-x-2">
          <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white
                          flex items-center justify-center text-white text-xs font-bold">A</div>
          <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white
                          flex items-center justify-center text-white text-xs font-bold">S</div>
        </div>
        <span className="text-sm font-medium text-gray-700">Super Admin</span>
        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500 text-lg">⎋</button>
      </div>
    </header>
  )
}

// ─── Action icon button ───────────────────────────────────────────────────────
function IconButton({ title, onClick, hoverColor, children }) {
  return (
    <button title={title} onClick={onClick}
      className={`text-gray-400 transition ${hoverColor}`}>
      {children}
    </button>
  )
}

// ─── Avatar helper — derive initials + a stable color from patient name ──────
const AVATAR_COLORS = [
  'bg-blue-200', 'bg-pink-200', 'bg-orange-200',
  'bg-purple-200', 'bg-teal-200', 'bg-gray-300',
]
function initials(name) {
  if (!name) return "?"
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

// ─── Follow-up row ─────────────────────────────────────────────────────────────
function FollowUpRow({ item, idx, onAction }) {
  const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50
                    last:border-0 hover:bg-gray-50 transition">

      {/* Left: avatar + details */}
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center
                         justify-center text-gray-600 text-xs font-bold shrink-0`}>
          {initials(item.patientName)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800">{item.patientName}</p>
          <p className="text-xs text-gray-400">
            {item.purpose} · {item.doctor}
          </p>
          <p className="text-xs text-gray-400">Due: {item.date}</p>
        </div>
      </div>

      {/* Right: status + actions */}
      <div className="flex items-center gap-5 shrink-0">
        <FollowUpBadge status={item.status} />

        <div className="flex items-center gap-3">
          <IconButton title="Call" hoverColor="hover:text-blue-500" onClick={() => onAction(item.id, 'call')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502
                   1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1
                   0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716
                   21 3 14.284 3 6V5z" />
            </svg>
          </IconButton>

          <IconButton title="Message" hoverColor="hover:text-blue-500" onClick={() => onAction(item.id, 'message')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863
                   9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574
                   3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </IconButton>

          <IconButton title="Mark Complete" hoverColor="hover:text-green-500" onClick={() => onAction(item.id, 'complete')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </IconButton>

          <IconButton title="Reschedule" hoverColor="hover:text-yellow-500" onClick={() => onAction(item.id, 'reschedule')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0
                   0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </IconButton>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
function FollowUps() {
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState('Follow-ups')
  const [search, setSearch] = useState('')

  // ── Shared store — the SAME followUps the Doctor module writes to ──
  const { followUps, updateStatus } = useFollowUps()
  const patients = usePatients()

  const enriched = followUps.map(f => ({
    ...f,
    patientName: patients.find(p => p.id === f.patientId)?.name || f.patientId,
  }))

  const filtered = enriched.filter(i =>
    i.patientName.toLowerCase().includes(search.toLowerCase()) ||
    i.purpose.toLowerCase().includes(search.toLowerCase()) ||
    i.doctor.toLowerCase().includes(search.toLowerCase())
  )

  // Derived stats — note: this store only tracks Scheduled/Completed/Rescheduled
  // today (no automatic "Missed" detection based on date yet)
  const scheduled   = enriched.filter(i => i.status === 'Scheduled').length
  const completed   = enriched.filter(i => i.status === 'Completed').length
  const rescheduled = enriched.filter(i => i.status === 'Rescheduled').length

  const handleAction = (id, action) => {
    if (action === 'complete')    updateStatus(id, 'Completed')
    if (action === 'reschedule')  updateStatus(id, 'Rescheduled')
    // 'call' / 'message' — no backend concept for these yet
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={(link) => {
          setActiveLink(link)
          if (link === 'Dashboard')  navigate('/admin')
          if (link === 'Doctors')    navigate('/admin/doctors')
          if (link === 'Staff')      navigate('/admin/staff')
          if (link === 'IP')         navigate('/admin/ip')
          if (link === 'Vehicles')   navigate('/admin/vehicles')
          if (link === 'Finance')    navigate('/admin/finance')
          if (link === 'Follow-ups') navigate('/admin/followups')
        }}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        <AdminTopBar breadcrumb="Follow-ups" search={search} onSearch={setSearch} />

        <main className="flex-1 p-6">

          {/* Page heading */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Follow-ups</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Patient follow-up tracking — same data scheduled by doctors
              </p>
            </div>
            <button className="flex items-center gap-1.5 text-sm text-gray-500
                               hover:text-gray-700 transition">
              ⬇ Export
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <FollowUpStat value={scheduled}   label="Scheduled"   variant="blue"   />
            <FollowUpStat value={completed}   label="Completed"   variant="green"  />
            <FollowUpStat value={rescheduled} label="Rescheduled" variant="yellow" />
          </div>

          {/* Follow-up list */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {filtered.map((item, idx) => (
              <FollowUpRow key={item.id} item={item} idx={idx} onAction={handleAction} />
            ))}

            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">
                No follow-ups scheduled yet — these are created from the Doctor module
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

export default FollowUps