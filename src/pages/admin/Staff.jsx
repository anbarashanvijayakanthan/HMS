import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import { useStaff } from '../../store/hospitalStore'
import StatusBadge from '../../components/common/StatusBadge'                                                                                                                                                                                                                                                                                                                                                                                              
// Initials from name
function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

// Avatar color palette
const AVATAR_COLORS = [
  'bg-pink-400', 'bg-blue-500', 'bg-green-500',
  'bg-purple-500', 'bg-yellow-500', 'bg-teal-500',
  'bg-rose-400', 'bg-indigo-500', 'bg-orange-400',
]

// ─── Nav ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  'Dashboard', 'Patients', 'Appointments', 'Doctors', 'Staff',
  'OP', 'IP', 'Prescriptions', 'Pharmacy', 'Laboratory',
  'Vehicles', 'Finance', 'Follow-ups', 'Reports', 'Settings',
]

// ─── Mock inpatient data ──────────────────────────────────────────────────────
const INPATIENTS = [
  { id: 1, name: 'Sanjay Kumar', age: '67y', admission: 'IP-3021', ward: 'Cardiac ICU', room: 'C-04 · B-2', doctor: 'Dr. Suresh Kumar', admittedOn: '10 Jun 2026', status: 'Admitted', avatarColor: 'bg-blue-200', avatarText: 'SK' },
  { id: 2, name: 'Lakshmi Devi', age: '54y', admission: 'IP-3022', ward: 'General Ward', room: 'G-12 · B-1', doctor: 'Dr. Kavitha Rao', admittedOn: '12 Jun 2026', status: 'Admitted', avatarColor: 'bg-pink-200', avatarText: 'LD' },
  { id: 3, name: 'Mohan Das', age: '41y', admission: 'IP-3023', ward: 'Surgical Ward', room: 'S-06 · B-3', doctor: 'Dr. Arun Sharma', admittedOn: '14 Jun 2026', status: 'Post-Op', avatarColor: 'bg-orange-200', avatarText: 'MD' },
  { id: 4, name: 'Rekha Nair', age: '32y', admission: 'IP-3024', ward: 'Maternity', room: 'M-03 · B-1', doctor: 'Dr. Preethi Nair', admittedOn: '15 Jun 2026', status: 'Admitted', avatarColor: 'bg-purple-200', avatarText: 'RN' },
  { id: 5, name: 'Thomas Varghese', age: '72y', admission: 'IP-3025', ward: 'General Ward', room: 'G-08 · B-2', doctor: 'Dr. Kavitha Rao', admittedOn: '16 Jun 2026', status: 'Under Observation', avatarColor: 'bg-teal-200', avatarText: 'TV' },
  { id: 6, name: 'Thomas Varghese', age: '72y', admission: 'IP-3025', ward: 'General Ward', room: 'G-08 · B-2', doctor: 'Dr. Kavitha Rao', admittedOn: '16 Jun 2026', status: 'Under Observation', avatarColor: 'bg-teal-200', avatarText: 'TV' },
  { id: 7, name: 'Cameron Williamson', age: '72y', admission: 'IP-3025', ward: 'General Ward', room: 'G-08 · B-2', doctor: 'Dr. Kavitha Rao', admittedOn: '16 Jun 2026', status: 'Under Observation', avatarColor: 'bg-indigo-200', avatarText: 'CW' }

]

// ─── Status badge ─────────────────────────────────────────────────────────────
function IPStatusBadge({ status }) {
  const styles = {
    'Admitted': 'bg-blue-100 text-blue-700',
    'Post-Op': 'bg-purple-100 text-purple-700',
    'Under Observation': 'bg-yellow-100 text-yellow-700',
    'Discharged': 'bg-green-100 text-green-700',
  }
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap
                      ${styles[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  )
}

// ─── Bed stat cards ───────────────────────────────────────────────────────────
function BedStatCard({ value, label, variant = 'default' }) {
  const v = {
    default: { card: 'bg-white border border-gray-100', val: 'text-gray-800', lbl: 'text-gray-400' },
    blue: { card: 'bg-white border border-gray-100', val: 'text-blue-500', lbl: 'text-blue-400' },
    green: { card: 'bg-green-50 border border-green-100', val: 'text-green-600', lbl: 'text-green-500' },
    red: { card: 'bg-red-50 border border-red-100', val: 'text-red-500', lbl: 'text-red-400' },
  }[variant]
  return (
    <div className={`rounded-xl px-6 py-5 shadow-sm ${v.card}`}>
      <p className={`text-3xl font-bold leading-none mb-1 ${v.val}`}>{value}</p>
      <p className={`text-sm font-medium ${v.lbl}`}>{label}</p>
    </div>
  )
}

// ─── Top bar ─────────────────────────────────────────────────────────────────
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

// ─── Register Employee Modal ──────────────────────────────────────────────────
const DEPARTMENTS = ['ICU', 'General Ward', 'OPD', 'Laboratory', 'Pharmacy',
  'Radiology', 'Finance', 'Administration', 'Surgical Ward', 'Maternity']
const GENDERS = ['Male', 'Female', 'Other']
const EMPTY_EMP = { name: '', gender: '', department: '', category: '', dob: '', address: '', mobile: '', salary: '', joiningDate: '' }
let empCounter = 107

function RegisterEmployeeModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_EMP)
  const set = (field, val) => setForm(p => ({ ...p, [field]: val }))

  const handleSave = () => {
    if (!form.name.trim() || !form.department) return
    empCounter++
    onAdd({
      id: `S-${empCounter}`,
      name: form.name,
      role: form.category || 'Staff',
      dept: form.department,
      phone: form.mobile || '—',
      status: 'Active',
    })
    onClose()
  }

  const backdrop = (e) => { if (e.target === e.currentTarget) onClose() }

  const inp = `w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50
               focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={backdrop}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 p-7">

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-6">Register Employee Details</h3>

        {/* Row 1: Name | Employee ID | Gender */}
        <div className="grid grid-cols-3 gap-5 mb-5">
          <div>
            <label className="block text-sm text-blue-500 font-medium mb-1.5">Employee Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="eg. Joseph" className={inp} />
          </div>
          <div>
            <label className="block text-sm text-blue-500 font-medium mb-1.5">Employee ID <span className="text-red-500">*</span></label>
            <input value={`S-${empCounter}`} disabled
              className={`${inp} text-gray-400 cursor-not-allowed`} />
          </div>
          <div>
            <label className="block text-sm text-blue-500 font-medium mb-1.5">Gender <span className="text-red-500">*</span></label>
            <select value={form.gender} onChange={e => set('gender', e.target.value)} className={inp}>
              <option value="">Select Gender</option>
              {GENDERS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Row 2: Department | Category | Date of Birth */}
        <div className="grid grid-cols-3 gap-5 mb-5">
          <div>
            <label className="block text-sm text-blue-500 font-medium mb-1.5">Department <span className="text-red-500">*</span></label>
            <select value={form.department} onChange={e => set('department', e.target.value)} className={inp}>
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-blue-500 font-medium mb-1.5">Category <span className="text-red-500">*</span></label>
            <input value={form.category} onChange={e => set('category', e.target.value)}
              placeholder="Enter category" className={inp} />
          </div>
          <div>
            <label className="block text-sm text-blue-500 font-medium mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
            <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} className={inp} />
          </div>
        </div>

        {/* Row 3: Address (tall) | Mobile + Joining stacked | Salary */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {/* Address — tall */}
          <div>
            <label className="block text-sm text-blue-500 font-medium mb-1.5">Address <span className="text-red-500">*</span></label>
            <textarea value={form.address} onChange={e => set('address', e.target.value)}
              placeholder="Enter Address" rows={6}
              className={`${inp} resize-none`} />
          </div>

          {/* Mobile + Joining stacked */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-blue-500 font-medium mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
              <input value={form.mobile} onChange={e => set('mobile', e.target.value)}
                placeholder="+91 XXXXXXXXXX" className={inp} />
            </div>
            <div>
              <label className="block text-sm text-blue-500 font-medium mb-1.5">Joining Date <span className="text-red-500">*</span></label>
              <input type="date" value={form.joiningDate} onChange={e => set('joiningDate', e.target.value)}
                placeholder="Enter Date" className={inp} />
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm text-blue-500 font-medium mb-1.5">Salary <span className="text-red-500">*</span></label>
            <input value={form.salary} onChange={e => set('salary', e.target.value)}
              placeholder="Enter Salary" className={inp} />
          </div>
        </div>

        {/* Buttons — centred, fixed width */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={onClose}
            className="w-48 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-3 rounded-lg transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!form.name.trim()}
            className="w-48 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 rounded-lg
                       transition disabled:opacity-40 disabled:cursor-not-allowed">
            Save Employee
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
function Staff() {
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState('Staff')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  // ── Shared store — real staff list ──
  const { staff, addStaff, updateStatus } = useStaff()

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.dept.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Modal */}
      {showModal && <RegisterEmployeeModal onClose={() => setShowModal(false)} onAdd={addStaff} />}
      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={(link) => {
          setActiveLink(link)
          if (link === 'Dashboard') navigate('/admin')
          if (link === 'Doctors') navigate('/admin/doctors')
          if (link === 'Staff') navigate('/admin/staff')
          if (link === 'IP') navigate('/admin/ip')
        }}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        <AdminTopBar breadcrumb="Staff" search={search} onSearch={setSearch} />

        <main className="flex-1 p-6">

          {/* Heading */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Staff</h2>
              <p className="text-sm text-gray-400 mt-0.5">{staff.length} staff members</p>
            </div>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                         text-white text-sm font-medium px-4 py-2.5 rounded-lg transition">
              <span className="text-base font-bold leading-none">+</span>
              Add Employee
            </button>
          </div>

          {/* Staff stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <BedStatCard value={staff.length} label="Total Staff" variant="default" />
            <BedStatCard value={staff.filter(s => s.status === 'Active').length} label="Active" variant="green" />
            <BedStatCard value={staff.filter(s => s.status === 'On Leave').length} label="On Leave" variant="red" />
            <BedStatCard value={new Set(staff.map(s => s.dept)).size} label="Departments" variant="blue" />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Employee', 'Role', 'Department', 'Phone', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition">

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]}
                                         flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                          {initials(s.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-gray-600 text-sm">{s.role}</td>
                    <td className="px-5 py-3.5 text-gray-600 text-sm">{s.dept}</td>
                    <td className="px-5 py-3.5 text-gray-600 text-sm">{s.phone}</td>

                    <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 text-gray-400">
                        <button title="Edit" className="hover:text-blue-500 transition">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                                 m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button title="Mark On Leave" onClick={() => updateStatus(s.id, s.status === 'Active' ? 'On Leave' : 'Active')}
                          className="hover:text-orange-500 transition">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
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
                  <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">No staff found</td></tr>
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