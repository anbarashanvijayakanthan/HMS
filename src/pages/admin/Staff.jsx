import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'

// ─── Nav ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  'Dashboard', 'Patients', 'Appointments', 'Doctors', 'Staff',
  'OP', 'IP', 'Prescriptions', 'Pharmacy', 'Laboratory',
  'Vehicles', 'Finance', 'Follow-ups', 'Reports', 'Settings',
]

// ─── Mock inpatient data ──────────────────────────────────────────────────────
const INPATIENTS = [
  {
    id: 1,
    name: 'Sanjay Kumar',   age: '67y',
    admission: 'IP-3021',
    ward: 'Cardiac ICU',    room: 'C-04 · B-2',
    doctor: 'Dr. Suresh Kumar',
    admittedOn: '10 Jun 2026',
    status: 'Admitted',
    avatarColor: 'bg-blue-200',   avatarText: 'SK',
  },
  {
    id: 2,
    name: 'Lakshmi Devi',   age: '54y',
    admission: 'IP-3022',
    ward: 'General Ward',   room: 'G-12 · B-1',
    doctor: 'Dr. Kavitha Rao',
    admittedOn: '12 Jun 2026',
    status: 'Admitted',
    avatarColor: 'bg-pink-200',   avatarText: 'LD',
  },
  {
    id: 3,
    name: 'Mohan Das',      age: '41y',
    admission: 'IP-3023',
    ward: 'Surgical Ward',  room: 'S-06 · B-3',
    doctor: 'Dr. Arun Sharma',
    admittedOn: '14 Jun 2026',
    status: 'Post-Op',
    avatarColor: 'bg-orange-200', avatarText: 'MD',
  },
  {
    id: 4,
    name: 'Rekha Nair',     age: '32y',
    admission: 'IP-3024',
    ward: 'Maternity',      room: 'M-03 · B-1',
    doctor: 'Dr. Preethi Nair',
    admittedOn: '15 Jun 2026',
    status: 'Admitted',
    avatarColor: 'bg-purple-200', avatarText: 'RN',
  },
  {
    id: 5,
    name: 'Thomas Varghese', age: '72y',
    admission: 'IP-3025',
    ward: 'General Ward',   room: 'G-08 · B-2',
    doctor: 'Dr. Kavitha Rao',
    admittedOn: '16 Jun 2026',
    status: 'Under Observation',
    avatarColor: 'bg-teal-200',   avatarText: 'TV',
  },
  {
    id: 6,
    name: 'Thomas Varghese', age: '72y',
    admission: 'IP-3025',
    ward: 'General Ward',   room: 'G-08 · B-2',
    doctor: 'Dr. Kavitha Rao',
    admittedOn: '16 Jun 2026',
    status: 'Under Observation',
    avatarColor: 'bg-teal-200',   avatarText: 'TV',
  },
  {
    id: 7,
    name: 'Cameron Williamson', age: '72y',
    admission: 'IP-3025',
    ward: 'General Ward',   room: 'G-08 · B-2',
    doctor: 'Dr. Kavitha Rao',
    admittedOn: '16 Jun 2026',
    status: 'Under Observation',
    avatarColor: 'bg-indigo-200', avatarText: 'CW',
  },
]

// ─── Status badge ─────────────────────────────────────────────────────────────
function IPStatusBadge({ status }) {
  const styles = {
    'Admitted':          'bg-blue-100 text-blue-700',
    'Post-Op':           'bg-purple-100 text-purple-700',
    'Under Observation': 'bg-yellow-100 text-yellow-700',
    'Discharged':        'bg-green-100 text-green-700',
    'Critical':          'bg-red-100 text-red-700',
  }
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap
                      ${styles[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  )
}

// ─── Stat card variants ───────────────────────────────────────────────────────
function BedStatCard({ value, label, variant = 'default' }) {
  const variants = {
    default: { card: 'bg-white border border-gray-100',        val: 'text-gray-800', lbl: 'text-gray-400' },
    blue:    { card: 'bg-white border border-gray-100',        val: 'text-blue-500', lbl: 'text-blue-400' },
    green:   { card: 'bg-green-50 border border-green-100',    val: 'text-green-600',lbl: 'text-green-500'},
    red:     { card: 'bg-red-50 border border-red-100',        val: 'text-red-500',  lbl: 'text-red-400'  },
  }
  const s = variants[variant]
  return (
    <div className={`rounded-xl px-6 py-5 shadow-sm ${s.card}`}>
      <p className={`text-3xl font-bold leading-none mb-1 ${s.val}`}>{value}</p>
      <p className={`text-sm font-medium ${s.lbl}`}>{label}</p>
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
        <span className="mx-1.5 text-gray-300">›</span>
        <span className="text-gray-800 font-semibold">{breadcrumb}</span>
      </p>

      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Quick search..."
            className="text-sm border border-gray-200 rounded-lg pl-8 pr-3 py-1.5
                       w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
        </div>

        <button className="relative p-1.5 rounded-lg hover:bg-gray-100 transition">
          <span className="text-lg">🔔</span>
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white
                           text-[9px] font-bold rounded-full flex items-center justify-center">
            9
          </span>
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

// ─── Main component ───────────────────────────────────────────────────────────
function Staff() {
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState('Staff')
  const [search, setSearch]         = useState('')
  const [patients, setPatients]     = useState(INPATIENTS)

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.admission.toLowerCase().includes(search.toLowerCase()) ||
    p.ward.toLowerCase().includes(search.toLowerCase()) ||
    p.doctor.toLowerCase().includes(search.toLowerCase())
  )

  const handleDischarge = (id) =>
    setPatients(prev => prev.map(p =>
      p.id === id ? { ...p, status: 'Discharged' } : p
    ))

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={(link) => {
          setActiveLink(link)
          if (link === 'Dashboard') navigate('/admin')
          if (link === 'Doctors')   navigate('/admin/doctors')
          if (link === 'Staff')     navigate('/admin/staff')
          if (link === 'IP')        navigate('/admin/ip')
        }}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-auto">

        <AdminTopBar breadcrumb="Staff" search={search} onSearch={setSearch} />

        <main className="flex-1 p-6">

          {/* Page heading */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Staff</h2>
              <p className="text-sm text-gray-400 mt-0.5">{patients.length} staff members</p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                               text-white text-sm font-medium px-4 py-2.5 rounded-lg transition">
              <span className="text-base font-bold leading-none">+</span>
              Add Employee
            </button>
          </div>

          {/* Bed stats row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <BedStatCard value={120}    label="Total Beds"  variant="default" />
            <BedStatCard value={87}     label="Occupied"    variant="blue"    />
            <BedStatCard value={33}     label="Available"   variant="green"   />
            <BedStatCard value="8/12"   label="ICU Beds"    variant="red"     />
          </div>

          {/* Table card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Patient
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Admission #
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Ward / Room / Bed
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Doctor
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Admitted On
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition">

                    {/* Patient col */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${p.avatarColor}
                                         flex items-center justify-center
                                         text-gray-600 text-xs font-bold shrink-0`}>
                          {p.avatarText}
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.age}</p>
                        </div>
                      </div>
                    </td>

                    {/* Admission # */}
                    <td className="px-4 py-3.5">
                      <span className="text-blue-500 font-mono text-xs font-medium">
                        {p.admission}
                      </span>
                    </td>

                    {/* Ward / Room / Bed */}
                    <td className="px-4 py-3.5">
                      <p className="text-gray-700 text-sm">{p.ward}</p>
                      <p className="text-gray-400 text-xs">{p.room}</p>
                    </td>

                    {/* Doctor */}
                    <td className="px-4 py-3.5 text-gray-600 text-sm">{p.doctor}</td>

                    {/* Admitted On */}
                    <td className="px-4 py-3.5 text-gray-600 text-sm">{p.admittedOn}</td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <IPStatusBadge status={p.status} />
                    </td>

                    {/* Actions — edit + discharge */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3 text-gray-400">
                        {/* Edit */}
                        <button
                          title="Edit"
                          className="hover:text-blue-500 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor"
                               strokeWidth={1.8} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                                 m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Discharge */}
                        <button
                          title="Discharge"
                          onClick={() => handleDischarge(p.id)}
                          className="hover:text-green-500 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor"
                               strokeWidth={1.8} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6
                                 a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  )
}

export default Staff