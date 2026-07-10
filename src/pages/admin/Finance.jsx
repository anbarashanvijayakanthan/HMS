import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import { useBills, usePatients } from '../../store/hospitalStore'
// ─── Nav ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  'Dashboard', 'Patients', 'Appointments', 'Doctors', 'Staff',
  'OP', 'IP', 'Prescriptions', 'Pharmacy', 'Laboratory',
  'Vehicles', 'Finance', 'Follow-ups', 'Reports', 'Settings',
]

// ─── Mock data ───────────────────────────────────────────────────────────────
const STAT_CARDS = [
  { value: '₹3,11,000', label: 'Total Income (Jun)', sub: '+8% vs last month', variant: 'green' },
  { value: '₹1,18,000', label: 'Total Expenses (Jun)', sub: '-3% vs last month', variant: 'red' },
  { value: '₹1,93,000', label: 'Net Profit (Jun)', sub: '+14% vs last month', variant: 'blue' },
  { value: '₹62,400', label: "Today's Revenue", sub: '+18% vs last month', variant: 'green' },
]

const BAR_LABELS = ['Figma', 'Sketch', 'XD', 'PS', 'AI', 'CorelDRAW', 'InDesign', 'Canva', 'Webflow', 'Affinity', 'Marker', 'Figma']
const BAR_SERIES = [
  { color: '#a78bfa', values: [85, 75, 90, 30, 40, 85, 50, 65, 55, 45, 65, 40] },
  { color: '#fb923c', values: [45, 65, 40, 85, 95, 75, 15, 25, 60, 30, 80, 55] },
  { color: '#22d3ee', values: [50, 55, 60, 15, 45, 55, 20, 80, 90, 40, 30, 50] },
]

const DONUT_DATA = [
  { label: 'Figma', color: '#a78bfa', value: 12 },
  { label: 'Sketch', color: '#fb7185', value: 10 },
  { label: 'XD', color: '#38bdf8', value: 8 },
  { label: 'PS', color: '#06b6d4', value: 9 },
  { label: 'AI', color: '#fb923c', value: 7 },
  { label: 'CorelDRAW', color: '#34d399', value: 8 },
  { label: 'InDesign', color: '#818cf8', value: 9 },
  { label: 'Canva', color: '#fbbf24', value: 8 },
  { label: 'Webflow', color: '#3b82f6', value: 10 },
  { label: 'Affinity', color: '#facc15', value: 6 },
  { label: 'Marker', color: '#10b981', value: 7 },
  { label: 'Figma', color: '#6366f1', value: 6 },
]

const TRANSACTIONS = [
  { title: 'OP Consultation - 42 patients', type: 'Revenue', date: '16 Jun 2026', amount: '+₹21,000' },
  { title: 'Pharmacy Sales', type: 'Revenue', date: '16 Jun 2026', amount: '+₹18,400' },
  { title: 'Lab Test Revenue', type: 'Revenue', date: '15 Jun 2026', amount: '+₹14,200' },
  { title: 'Staff Salaries', type: 'Expense', date: '15 Jun 2026', amount: '-₹85,000' },
  { title: 'Medical Equipment Purchase', type: 'Expense', date: '14 Jun 2026', amount: '-₹32,500' },
]

// ─── Stat card ────────────────────────────────────────────────────────────────
function FinanceStatCard({ value, label, sub, variant }) {
  const styles = {
    green: { bg: 'bg-green-50', val: 'text-green-700', sub: 'text-green-500' },
    red: { bg: 'bg-red-50', val: 'text-red-600', sub: 'text-red-400' },
    blue: { bg: 'bg-blue-50', val: 'text-blue-600', sub: 'text-blue-400' },
  }[variant]
  return (
    <div className={`rounded-xl p-5 ${styles.bg}`}>
      <p className={`text-2xl font-mono font-bold mb-1 ${styles.val}`}>{value}</p>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xs font-medium ${styles.sub}`}>{sub}</p>
    </div>
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

// ─── Bar chart ────────────────────────────────────────────────────────────────
function FinanceBarChart() {
  const W = 600, H = 220, PAD_L = 30, PAD_B = 36, PAD_T = 10
  const chartW = W - PAD_L - 10
  const chartH = H - PAD_T - PAD_B
  const cols = BAR_SERIES[0].values.length
  const groupW = chartW / cols
  const barW = groupW / BAR_SERIES.length - 3

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }}>
        {/* Grid lines + Y labels */}
        {[0, 20, 40, 60, 80, 100].map(v => {
          const y = PAD_T + (1 - v / 100) * chartH
          return (
            <g key={v}>
              <line x1={PAD_L} x2={W - 10} y1={y} y2={y} stroke="#f1f1f1" strokeWidth="1" />
              <text x={PAD_L - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#aaa">{v}</text>
            </g>
          )
        })}
        {/* Bars */}
        {BAR_SERIES.map((s, si) =>
          s.values.map((v, ci) => {
            const bH = (v / 100) * chartH
            const x = PAD_L + ci * groupW + si * (barW + 3)
            const y = PAD_T + chartH - bH
            return <rect key={`${si}-${ci}`} x={x} y={y} width={barW} height={bH}
              fill={s.color} rx="1.5" />
          })
        )}
        {/* X labels */}
        {BAR_LABELS.map((l, i) => {
          const x = PAD_L + i * groupW + groupW / 2
          return (
            <text key={i} x={x} y={H - 14} textAnchor="end" fontSize="9" fill="#999"
              transform={`rotate(-35, ${x}, ${H - 14})`}>
              {l}
            </text>
          )
        })}
      </svg>
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-1">
        {[['#a78bfa', '2020'], ['#fb923c', '2021'], ['#22d3ee', '2022']].map(([c, l]) => (
          <span key={l} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: c }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
function DonutChart({ centerLabel }) {
  const total = DONUT_DATA.reduce((s, d) => s + d.value, 0)
  const R = 70, CX = 90, CY = 90, STROKE = 26
  let cumulative = 0

  const segments = DONUT_DATA.map((d) => {
    const fraction = d.value / total
    const startAngle = cumulative * 2 * Math.PI
    cumulative += fraction
    const endAngle = cumulative * 2 * Math.PI

    const x1 = CX + R * Math.sin(startAngle)
    const y1 = CY - R * Math.cos(startAngle)
    const x2 = CX + R * Math.sin(endAngle)
    const y2 = CY - R * Math.cos(endAngle)
    const largeArc = fraction > 0.5 ? 1 : 0

    return {
      d: `M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`,
      color: d.color,
    }
  })

  return (
    <div className="relative w-[180px] h-[180px] mx-auto">
      <svg viewBox="0 0 180 180" className="w-full h-full">
        {segments.map((s, i) => (
          <path key={i} d={s.d} fill="none" stroke={s.color}
            strokeWidth={STROKE} strokeLinecap="butt" />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-mono font-bold text-gray-700">{centerLabel}</span>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
function Finance() {
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState('Finance')
  const [search, setSearch] = useState('')

  // ── Shared store — real bills, same data Pharmacy/Receptionist write to ──
  const { bills } = useBills()
  const patients = usePatients()

  const totalRevenue = bills.filter(b => b.status === "Paid").reduce((sum, b) => sum + (b.net || 0), 0)
  const pendingAmount = bills.filter(b => b.status !== "Paid").reduce((sum, b) => sum + (b.net || 0), 0)
  const insuranceRevenue = bills.filter(b => b.mode === "Insurance").reduce((sum, b) => sum + (b.net || 0), 0)
  const grossRevenue = bills.reduce((sum, b) => sum + (b.gross || 0), 0)

  const statCards = [
    { value: `₹${totalRevenue.toLocaleString('en-IN')}`, label: 'Total Collected', sub: `${bills.filter(b => b.status === "Paid").length} bills paid`, variant: 'green' },
    { value: `₹${pendingAmount.toLocaleString('en-IN')}`, label: 'Pending Collection', sub: `${bills.filter(b => b.status !== "Paid").length} bills outstanding`, variant: 'red' },
    { value: `₹${insuranceRevenue.toLocaleString('en-IN')}`, label: 'Insurance Claims', sub: `${bills.filter(b => b.mode === "Insurance").length} claims`, variant: 'blue' },
    { value: `₹${grossRevenue.toLocaleString('en-IN')}`, label: 'Gross Billed', sub: `${bills.length} bills total`, variant: 'green' },
  ]

  // Real transactions, most recent first (bills are prepended on creation,
  // so the array order already reflects recency)
  const transactions = bills.map(b => ({
    title: `${b.mode} payment — ${patients.find(p => p.id === b.patientId)?.name || b.patientId}`,
    type: 'Revenue',
    billId: b.billId,
    amount: `+₹${b.net}`,
    status: b.status,
  }))

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={(link) => {
          setActiveLink(link)
          if (link === 'Dashboard') navigate('/admin')
          if (link === 'Doctors') navigate('/admin/doctors')
          if (link === 'Staff') navigate('/admin/staff')
          if (link === 'IP') navigate('/admin/ip')
          if (link === 'Vehicles') navigate('/admin/vehicles')
          if (link === 'Finance') navigate('/admin/finance')
        }}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        <AdminTopBar breadcrumb="Financial Management" search={search} onSearch={setSearch} />

        <main className="flex-1 p-6">

          {/* Page heading */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Finance Management</h2>
              <p className="text-sm text-gray-400 mt-0.5">Revenue, expenses &amp; cash flow</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 text-sm text-gray-500
                                 hover:text-gray-700 transition">
                ⬇ Export
              </button>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                                 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition">
                <span className="text-base font-bold leading-none">+</span>
                Add Expense
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {statCards.map((c, i) => (
              <FinanceStatCard key={i} {...c} />
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Bar chart — 2/3 width */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <FinanceBarChart />
            </div>

            {/* Donut chart — 1/3 width */}
            <div className="col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <DonutChart centerLabel="2015.73" />
              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-4">
                {DONUT_DATA.map((d, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <span className="w-2 h-2 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: d.color }} />
                    {d.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

        {/* Recent transactions — real bills, not mock */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Recent Transactions</h3>
            <div className="flex flex-col gap-4">
              {transactions.map((t, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center
                                     text-sm font-bold shrink-0 bg-green-100 text-green-600">
                      +
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{t.title}</p>
                      <p className="text-xs text-gray-400">{t.billId} · {t.status}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {t.amount}
                  </span>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">No transactions yet</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Finance