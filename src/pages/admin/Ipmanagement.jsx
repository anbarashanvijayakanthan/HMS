import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'

// ─── Nav (same across all admin pages) ──────────────────────────────────────
const NAV_LINKS = [
  'Dashboard', 'Patients', 'Appointments', 'Doctors', 'Staff',
  'OP', 'IP', 'Prescriptions', 'Pharmacy', 'Laboratory',
  'Vehicles', 'Finance', 'Follow-ups', 'Reports', 'Settings',
]

// ─── Mock data ───────────────────────────────────────────────────────────────
// const STAFF_DATA = [
//   { id: 'S-101', name: 'Esther Howard',       role: 'Head Nurse',       dept: 'ICU',          phone: '+91 90001 21001', attendance: '98%',  status: 'Active'   },
//   { id: 'S-102', name: 'Cameron Williamson',  role: 'Lab Technician',   dept: 'Laboratory',   phone: '+91 90001 21002', attendance: '95%',  status: 'Active'   },
//   { id: 'S-103', name: 'Jenny Wilson',        role: 'Pharmacist',       dept: 'Pharmacy',     phone: '+91 90001 21003', attendance: '100%', status: 'Active'   },
//   { id: 'S-104', name: 'Brooklyn Simmons',    role: 'Receptionist',     dept: 'OPD',          phone: '+91 90001 21004', attendance: '92%',  status: 'On Leave' },
//   { id: 'S-105', name: 'Jacob Jones',         role: 'Ward Nurse',       dept: 'General Ward', phone: '+91 90001 21005', attendance: '88%',  status: 'On Leave' },
//   { id: 'S-106', name: 'Biju Jose',           role: 'Accountant',       dept: 'Finance',      phone: '+91 90001 21006', attendance: '96%',  status: 'Active'   },
//   { id: 'S-101', name: 'Theresa Webb',        role: 'Head Nurse',       dept: 'ICU',          phone: '+91 90001 21001', attendance: '98%',  status: 'Active'   },
//   { id: 'S-101', name: 'Eleanor Pena',        role: 'Head Nurse',       dept: 'ICU',          phone: '+91 90001 21001', attendance: '98%',  status: 'Active'   },
//   { id: 'S-101', name: 'Kristin Watson',      role: 'Head Nurse',       dept: 'ICU',          phone: '+91 90001 21001', attendance: '98%',  status: 'Active'   },
// ]
// ─── Mock data ───────────────────────────────────────────────────────────────
// NOTE: This page shows IP (inpatient) records, not staff — despite the
// variable name. There's no real `inpatients` entity in the shared store
// yet, so this stays local mock for now (out of scope for today).
const STAFF_DATA = [
  { id: 'S-101', name: 'Esther Howard',       role: 'Head Nurse',       dept: 'ICU',          phone: '+91 90001 21001', attendance: '98%',  status: 'Active'   },
  { id: 'S-102', name: 'Cameron Williamson',  role: 'Lab Technician',   dept: 'Laboratory',   phone: '+91 90001 21002', attendance: '95%',  status: 'Active'   },
  { id: 'S-103', name: 'Jenny Wilson',        role: 'Pharmacist',       dept: 'Pharmacy',     phone: '+91 90001 21003', attendance: '100%', status: 'Active'   },
  { id: 'S-104', name: 'Brooklyn Simmons',    role: 'Receptionist',     dept: 'OPD',          phone: '+91 90001 21004', attendance: '92%',  status: 'On Leave' },
  { id: 'S-105', name: 'Jacob Jones',         role: 'Ward Nurse',       dept: 'General Ward', phone: '+91 90001 21005', attendance: '88%',  status: 'On Leave' },
  { id: 'S-106', name: 'Biju Jose',           role: 'Accountant',       dept: 'Finance',      phone: '+91 90001 21006', attendance: '96%',  status: 'Active'   },
  { id: 'S-107', name: 'Theresa Webb',        role: 'Head Nurse',       dept: 'ICU',          phone: '+91 90001 21007', attendance: '98%',  status: 'Active'   },
  { id: 'S-108', name: 'Eleanor Pena',        role: 'Head Nurse',       dept: 'ICU',          phone: '+91 90001 21008', attendance: '98%',  status: 'Active'   },
  { id: 'S-109', name: 'Kristin Watson',      role: 'Head Nurse',       dept: 'ICU',          phone: '+91 90001 21009', attendance: '98%',  status: 'Active'   },
]
// Initials from name
function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

// Avatar palette
const AVATAR_COLORS = [
  'bg-pink-400', 'bg-blue-500', 'bg-green-500',
  'bg-purple-500', 'bg-yellow-500', 'bg-teal-500',
  'bg-rose-400', 'bg-indigo-500', 'bg-orange-400',
]

function Avatar({ name, idx }) {
  return (
    <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}
                     flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {initials(name)}
    </div>
  )
}

// Status badge
function StatusBadge({ status }) {
  const map = {
    'Active':   'bg-green-100 text-green-700',
    'On Leave': 'bg-orange-100 text-orange-600',
  }
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${map[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  )
}

// ─── Top bar (reusable pattern across admin pages) ───────────────────────────
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
        {/* Search */}
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

        {/* Bell */}
        <button className="relative p-1.5 rounded-lg hover:bg-gray-100 transition">
          <span className="text-lg">🔔</span>
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white
                           text-[9px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Avatars */}
        <div className="flex items-center -space-x-2">
          <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white
                          flex items-center justify-center text-white text-xs font-bold">A</div>
          <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white
                          flex items-center justify-center text-white text-xs font-bold">S</div>
        </div>

        <span className="text-sm font-medium text-gray-700">Super Admin</span>

        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500 text-lg">
          ⎋
        </button>
      </div>
    </header>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
function Ipmanagement() {
  const navigate     = useNavigate()
  const [activeLink, setActiveLink] = useState('IP')
  const [search, setSearch]         = useState('')

  // Filter rows by search
  const filtered = STAFF_DATA.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.dept.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={link => {
          setActiveLink(link)
          if (link === 'Dashboard') navigate('/admin')
         if (link === 'IP') navigate('/admin/ip')
         if (link === 'Doctors') navigate('/admin/doctors')
         if (link === 'Staff') navigate('/admin/staff')
        }}
      />

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">

        <AdminTopBar breadcrumb="IP" search={search} onSearch={setSearch} />

        <main className="flex-1 p-6">

          {/* Page heading */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">IP Management</h2>
              <p className="text-sm text-gray-400 mt-0.5">5 active inpatients</p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                               text-white text-sm font-medium px-4 py-2.5 rounded-lg transition">
              <span className="text-base font-bold leading-none">+</span>
              New Admission
            </button>
          </div>

          {/* Table card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100 bg-white">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Employee
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Role
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Department
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Phone
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Attendance
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((staff, i) => (
                  <tr
                    key={`${staff.id}-${i}`}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    {/* Employee col — avatar + name + id */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={staff.name} idx={i} />
                        <div>
                          <p className="font-medium text-gray-700 text-sm">{staff.name}</p>
                          <p className="text-xs text-gray-400">{staff.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-gray-600">{staff.role}</td>
                    <td className="px-4 py-3.5 text-gray-600">{staff.dept}</td>
                    <td className="px-4 py-3.5 text-gray-600">{staff.phone}</td>
                    <td className="px-4 py-3.5 text-gray-600">{staff.attendance}</td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={staff.status} />
                    </td>

                    {/* Actions — view / edit / delete icons */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3 text-gray-400">
                        {/* View */}
                        <button
                          title="View"
                          className="hover:text-blue-500 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8}
                               viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
                                 -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {/* Edit */}
                        <button
                          title="Edit"
                          className="hover:text-green-500 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8}
                               viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                                 m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Delete */}
                        <button
                          title="Delete"
                          className="hover:text-red-500 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8}
                               viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858
                                 L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                      No records found
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

export default Ipmanagement