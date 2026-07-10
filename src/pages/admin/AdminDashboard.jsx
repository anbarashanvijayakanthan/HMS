import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import StatusBadge from '../../components/common/StatusBadge'
import { usePatients, useQueue, useAppointments, useDoctors, useBills } from '../../store/hospitalStore'

// Initials from name


// ─── Nav ────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  'Dashboard', 'Doctors', 'Staff', 'IP',
  'Vehicles', 'Finance', 'Follow-ups', 'Reports',
]

// ─── Mock data ───────────────────────────────────────────────────────────────
const RECENT_PATIENTS = [
  { avatar: 'JB', name: 'Jerome Bell', dept: 'Cardiology · 34y', status: 'Checked In' },
  { avatar: 'BS', name: 'Brooklyn Simmons', dept: 'Orthopedics · 58y', status: 'Waiting' },
  { avatar: 'SN', name: 'Savannah Nguyen', dept: 'Gynecology · 27y', status: 'In Consultation' },
  { avatar: 'EH', name: 'Esther Howard', dept: 'Neurology · 45y', status: 'Completed' },
  { avatar: 'JJ', name: 'Jacob Jones', dept: 'Internal Medicine · 62y', status: 'Waiting' },
]

const DOCTOR_AVAILABILITY = [
  { avatar: 'RF', name: 'Dr. Robert Fox', dept: 'Cardiology', status: 'Available', count: '8 today' },
  { avatar: 'BC', name: 'Dr. Bessie Cooper', dept: 'Gynecology', status: 'In Consultation', count: '12 today' },
  { avatar: 'JB', name: 'Dr. Jerome Bell', dept: 'Orthopedics', status: 'On Leave', count: '' },
  { avatar: 'RE', name: 'Dr. Ralph Edwards', dept: 'Neurology', status: 'Available', count: '6 today' },
]

const ALERTS = [
  { color: 'orange', icon: '⚠️', text: '3 prescriptions pending pharmacy fulfilment' },
  { color: 'green', icon: '✅', text: 'Lab report uploaded for patient P-10419' },
  { color: 'blue', icon: 'ℹ️', text: '2 follow-ups due today — Call Pending' },
]

// ─── Tiny chart data (SVG sparkline-style, rendered inline) ─────────────────
// Multi-line trend chart data points (normalised 0–100)
const LINE_CHART_SERIES = [
  { color: '#6366f1', points: [60, 55, 70, 65, 80, 60, 75, 65, 70, 55, 65, 75, 60] },
  { color: '#f97316', points: [80, 70, 60, 75, 55, 80, 65, 80, 60, 70, 80, 65, 75] },
  { color: '#06b6d4', points: [40, 55, 45, 55, 40, 55, 50, 45, 55, 40, 50, 45, 55] },
]
const LINE_LABELS = ['Figma', 'Sketch', 'XD', 'PS', 'AI', 'CoreD RAW', 'InDesign', 'Canva', 'Webflow', 'Affinity', 'Marker']

const BAR_CHART_SERIES = [
  { color: '#6366f1', values: [65, 75, 55, 80, 60, 70, 55, 65, 70, 75] },
  { color: '#f97316', values: [80, 60, 70, 55, 75, 60, 80, 70, 60, 65] },
  { color: '#06b6d4', values: [45, 55, 65, 40, 55, 50, 45, 60, 50, 55] },
]

// ─── Helper: avatar bubble ───────────────────────────────────────────────────

// ─── Helper: avatar bubble ───────────────────────────────────────────────────
const AVATAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500',
  'bg-pink-500', 'bg-yellow-500', 'bg-teal-500',
]
function Avatar({ initials, idx = 0, size = 'w-9 h-9' }) {  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  return (
    <div className={`${size} ${color} rounded-full flex items-center justify-center
                     text-white text-xs font-bold shrink-0`}>
      {initials}
    </div>
  )
}

// ─── Helper: doctor / patient status badge (local, not StatusBadge) ──────────
function DoctorBadge({ status }) {
  const map = {
    'Available': 'bg-green-100 text-green-700',
    'In Consultation': 'bg-blue-100  text-blue-700',
    'On Leave': 'bg-gray-100  text-gray-500',
  }
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${map[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  )
}

// ─── Inline SVG line chart ───────────────────────────────────────────────────
function LineChart() {
  const W = 380, H = 130, PAD = 20
  const cols = LINE_CHART_SERIES[0].points.length
  const xStep = (W - PAD * 2) / (cols - 1)

  const toPath = (pts) =>
    pts.map((v, i) => {
      const x = PAD + i * xStep
      const y = PAD + ((100 - v) / 100) * (H - PAD * 2)
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32">
      {/* Y grid lines */}
      {[0, 25, 50, 75, 100].map(v => {
        const y = PAD + ((100 - v) / 100) * (H - PAD * 2)
        return (
          <line key={v} x1={PAD} x2={W - PAD} y1={y} y2={y}
            stroke="#f0f0f0" strokeWidth="1" />
        )
      })}
      {/* Y axis labels */}
      {[0, 25, 50, 75, 100].map(v => {
        const y = PAD + ((100 - v) / 100) * (H - PAD * 2)
        return (
          <text key={v} x={PAD - 4} y={y + 3.5}
            textAnchor="end" fontSize="8" fill="#aaa">{v}</text>
        )
      })}
      {/* Lines */}
      {LINE_CHART_SERIES.map((s, si) => (
        <path key={si} d={toPath(s.points)}
          fill="none" stroke={s.color} strokeWidth="1.5"
          strokeLinejoin="round" strokeLinecap="round" />
      ))}
      {/* Dots on last point */}
      {LINE_CHART_SERIES.map((s, si) => {
        const last = s.points.length - 1
        const x = PAD + last * xStep
        const y = PAD + ((100 - s.points[last]) / 100) * (H - PAD * 2)
        return <circle key={si} cx={x} cy={y} r="3" fill={s.color} />
      })}
    </svg>
  )
}

// ─── Inline SVG bar chart ────────────────────────────────────────────────────
function BarChart() {
  const W = 190, H = 130, PAD = 10
  const cols = BAR_CHART_SERIES[0].values.length
  const groupW = (W - PAD * 2) / cols
  const barW = groupW / BAR_CHART_SERIES.length - 1.5
  const chartH = H - PAD * 2 - 10

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32">
      {/* Y grid */}
      {[0, 25, 50, 75, 100].map(v => {
        const y = PAD + ((100 - v) / 100) * chartH
        return <line key={v} x1={PAD} x2={W - PAD} y1={y} y2={y}
          stroke="#f0f0f0" strokeWidth="0.8" />
      })}
      {/* Y labels */}
      {[0, 25, 50, 75, 100].map(v => {
        const y = PAD + ((100 - v) / 100) * chartH
        return <text key={v} x={PAD - 2} y={y + 3}
          textAnchor="end" fontSize="6" fill="#aaa">{v}</text>
      })}
      {/* Bars */}
      {BAR_CHART_SERIES.map((s, si) =>
        s.values.map((v, ci) => {
          const bH = (v / 100) * chartH
          const x = PAD + ci * groupW + si * (barW + 1.5)
          const y = PAD + chartH - bH
          return (
            <rect key={`${si}-${ci}`}
              x={x} y={y} width={barW} height={bH}
              fill={s.color} rx="1" opacity="0.85" />
          )
        })
      )}
    </svg>
  )
}

// ─── AlertBanner ────────────────────────────────────────────────────────────
function AlertBanner({ color, icon, text }) {
  const bg = { orange: 'bg-orange-50 border-orange-200', green: 'bg-green-50 border-green-200', blue: 'bg-blue-50 border-blue-200' }
  const tc = { orange: 'text-orange-700', green: 'text-green-700', blue: 'text-blue-700' }
  return (
    <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-xs ${bg[color]} ${tc[color]}`}>
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState('Dashboard')
  const [search, setSearch] = useState('')

  // ── Shared store ──
  const patients = usePatients()
  const { queue } = useQueue()
  const { appointments } = useAppointments()
  const { doctors } = useDoctors()
  const { bills } = useBills()

  const opCount = queue.filter(v => v.department !== "Emergency").length
  const ipCount = queue.filter(v => v.department === "Emergency").length
  const todaysRevenue = bills.reduce((sum, b) => sum + (b.net || 0), 0)
  const doctorsOnDuty = doctors.filter(d => d.status === "Active").length

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ── */}
      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={(link) => {
          setActiveLink(link)
          if (link === 'Dashboard') navigate('/admin')
          if (link === 'IP') navigate('/admin/ip')
          if (link === 'Doctors') navigate('/admin/doctors')
          if (link === 'Staff') navigate('/admin/staff')
          if (link === 'Vehicles') navigate('/admin/vehicles')
          if (link === 'Finance') navigate('/admin/finance')
          if (link === 'Follow-ups') navigate('/admin/followups')
          if (link === 'Reports') navigate('/admin/reports')
        }} />

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">

        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100
                           flex items-center justify-between px-6 py-3 gap-4">
          {/* Breadcrumb */}
          <p className="text-sm text-gray-500 font-medium">
            MediCore HMS
            <span className="mx-1.5 text-gray-300">›</span>
            <span className="text-gray-800 font-semibold">Dashboard</span>
          </p>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Quick search..."
                className="text-sm border border-gray-200 rounded-lg pl-8 pr-3 py-1.5
                           w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
            </div>

            {/* Notification bell */}
            <button className="relative p-1.5 rounded-lg hover:bg-gray-100 transition">
              <span className="text-lg">🔔</span>
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white
                               text-[9px] font-bold rounded-full flex items-center justify-center">
                1
              </span>
            </button>

            {/* User avatars */}
            <div className="flex items-center -space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white
                              flex items-center justify-center text-white text-xs font-bold">A</div>
              <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white
                              flex items-center justify-center text-white text-xs font-bold">S</div>
            </div>

            <span className="text-sm font-medium text-gray-700">Super Admin</span>

            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">
              ⎋
            </button>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 p-6">

          {/* Page heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {today} — General Hospital
            </p>
          </div>

          {/* ── Stats Row 1: Patients / Appointments / OP / IP ── */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <StatsCard
              icon="♿"
              label="Patients Today"
              value={queue.length}
              sub={`${patients.length} total registered`}
              subColor="text-green-500"
            />
            <StatsCard
              icon="📅"
              label="Appointments"
              value={appointments.length}
              sub={`${appointments.filter(a => a.status === "Scheduled").length} pending`}
              subColor="text-orange-400"
            />
            <StatsCard
              icon="🗂️"
              label="OP Count"
              value={opCount}
            />
            <StatsCard
              icon="🛏️"
              label="Emergency Cases"
              value={ipCount}
            />
          </div>

          {/* ── Stats Row 2: Revenue / Expenses / Profit / Doctors ── */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* Revenue */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xl">💰</span>
                <span className="text-xs font-semibold text-green-500">+18%</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">₹ {todaysRevenue.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide font-medium">
                Revenue Today
              </p>
            </div>

            {/* Expenses */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xl">📉</span>
                <span className="text-xs font-semibold text-red-400">-4%</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">₹ 15,000</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide font-medium">
                Expenses Today
              </p>
            </div>

            {/* Net Profit */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xl">📈</span>
                <span className="text-xs font-semibold text-green-500">+22%</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">₹ 20,000</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide font-medium">
                Net Profit
              </p>
            </div>

            {/* Doctors on duty */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xl">👨‍⚕️</span>
                <span className="text-xs font-medium text-orange-500 bg-orange-50
                                 px-2 py-0.5 rounded-full">{doctors.length - doctorsOnDuty} on leave</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{doctorsOnDuty}/{doctors.length}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide font-medium">
                Doctors On Duty
              </p>
            </div>
          </div>

          {/* ── Charts Row ── */}
          <div className="grid grid-cols-3 gap-4 mb-6">

            {/* Line chart — 2/3 width */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <LineChart />
              {/* X labels */}
              <div className="flex justify-between mt-1 px-5">
                {LINE_LABELS.map((l, i) => (
                  <span key={i} className="text-[9px] text-gray-400 text-center leading-tight"
                    style={{ width: `${100 / LINE_LABELS.length}%` }}>
                    {l}
                  </span>
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-5 mt-3 justify-center">
                {[['#6366f1', '2020'], ['#f97316', '2021'], ['#06b6d4', '2022']].map(([c, l]) => (
                  <span key={l} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-6 h-0.5 rounded-full inline-block" style={{ backgroundColor: c }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Bar chart — 1/3 width */}
            <div className="col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <BarChart />
              {/* Legend */}
              <div className="flex items-center gap-3 mt-3 justify-center flex-wrap">
                {[['#6366f1', '2020'], ['#f97316', '2021'], ['#06b6d4', '2022']].map(([c, l]) => (
                  <span key={l} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: c }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom Row: Recent Patients + Doctor Availability ── */}
          <div className="grid grid-cols-2 gap-4">

            {/* Recent Patients */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Recent Patients</h3>
                <button className="text-xs text-blue-500 hover:underline">View all →</button>
              </div>
              <div className="flex flex-col gap-3">
                {RECENT_PATIENTS.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Avatar initials={p.avatar} idx={i} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 truncate">{p.dept}</p>
                    </div>
                    <StatusBadge status={
                      p.status === 'Checked In' ? 'Done'
                        : p.status === 'In Consultation' ? 'In Progress'
                          : p.status
                    } />
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Availability + Alerts */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Doctor Availability</h3>
                  <button className="text-xs text-blue-500 hover:underline">View all →</button>
                </div>
                <div className="flex flex-col gap-3">
                  {DOCTOR_AVAILABILITY.map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Avatar initials={d.avatar} idx={i + 2} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{d.name}</p>
                        <p className="text-xs text-gray-400 truncate">{d.dept}</p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5 shrink-0">
                        <DoctorBadge status={d.status} />
                        {d.count && (
                          <span className="text-[10px] text-gray-400">{d.count}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Alert banners */}
                <div className="flex flex-col gap-2 mt-4">
                  {ALERTS.map((a, i) => (
                    <AlertBanner key={i} color={a.color} icon={a.icon} text={a.text} />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard