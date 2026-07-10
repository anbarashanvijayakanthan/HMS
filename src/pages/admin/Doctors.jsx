import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import { useDoctors } from '../../store/hospitalStore'
// ─── Nav ────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  'Dashboard', 'Patients', 'Appointments', 'Doctors', 'Staff',
  'OP', 'IP', 'Prescriptions', 'Pharmacy', 'Laboratory',
  'Vehicles', 'Finance', 'Follow-ups', 'Reports', 'Settings',
]

// ─── Mock doctors data ───────────────────────────────────────────────────────
const DOCTORS = [
  {
    id: 'D-001',
    name: 'Dr. loyd Miles',
    specialty: 'Cardiology',
    qualification: 'MD, DM Cardiology',
    status: 'Active',
    patientsToday: 8,
    experience: '18 years',
    schedule: 'Mon–Sat, 9am–1pm',
    accentColor: 'from-blue-500 to-cyan-400',
    avatarColor: 'bg-blue-100',
    avatarText: 'LM',
  },
  {
    id: 'D-002',
    name: 'Dr. Darrell Ste',
    specialty: 'Gynecology',
    qualification: 'MS Obs & Gynae',
    status: 'Active',
    patientsToday: 12,
    experience: '12 years',
    schedule: 'Mon–Fri, 10am–2pm',
    accentColor: 'from-teal-500 to-emerald-400',
    avatarColor: 'bg-teal-100',
    avatarText: 'DS',
  },
  {
    id: 'D-003',
    name: 'Dr. Theresa',
    specialty: 'Orthopedics',
    qualification: 'MS Ortho, DNB',
    status: 'On Leave',
    patientsToday: 0,
    experience: '15 years',
    schedule: 'Tue–Sat, 11am–3pm',
    accentColor: 'from-purple-500 to-violet-400',
    avatarColor: 'bg-purple-100',
    avatarText: 'TW',
  },
  {
    id: 'D-004',
    name: 'Dr. Kathryn M',
    specialty: 'Neurology',
    qualification: 'DM Neurology',
    status: 'Active',
    patientsToday: 6,
    experience: '10 years',
    schedule: 'Mon–Wed–Fri, 9am–1pm',
    accentColor: 'from-pink-500 to-rose-400',
    avatarColor: 'bg-pink-100',
    avatarText: 'KM',
  },
  {
    id: 'D-005',
    name: 'Dr. Arlene Mc',
    specialty: 'Urology',
    qualification: 'MCh Urology',
    status: 'Active',
    patientsToday: 5,
    experience: '20 years',
    schedule: 'Mon–Thu, 2pm–6pm',
    accentColor: 'from-orange-500 to-amber-400',
    avatarColor: 'bg-orange-100',
    avatarText: 'AM',
  },
  {
    id: 'D-006',
    name: 'Dr. Eleanor Pe',
    specialty: 'Pediatrics',
    qualification: 'MD Pediatrics',
    status: 'Active',
    patientsToday: 14,
    experience: '9 years',
    schedule: 'Mon–Sat, 8am–12pm',
    accentColor: 'from-cyan-500 to-sky-400',
    avatarColor: 'bg-cyan-100',
    avatarText: 'EP',
  },
  {
    id: 'D-007',
    name: 'Dr.Jacob Jone',
    specialty: 'Neurology',
    qualification: 'DM Neurology',
    status: 'Active',
    patientsToday: 6,
    experience: '10 years',
    schedule: 'Mon–Wed–Fri, 9am–1pm',
    accentColor: 'from-indigo-500 to-blue-400',
    avatarColor: 'bg-indigo-100',
    avatarText: 'JJ',
  },
  {
    id: 'D-008',
    name: 'Dr. Cody Fish',
    specialty: 'Urology',
    qualification: 'MCh Urology',
    status: 'Active',
    patientsToday: 5,
    experience: '20 years',
    schedule: 'Mon–Thu, 2pm–6pm',
    accentColor: 'from-green-500 to-teal-400',
    avatarColor: 'bg-green-100',
    avatarText: 'CF',
  },
  {
    id: 'D-009',
    name: 'Dr. Savannah',
    specialty: 'Pediatrics',
    qualification: 'MD Pediatrics',
    status: 'Active',
    patientsToday: 14,
    experience: '9 years',
    schedule: 'Mon–Sat, 8am–12pm',
    accentColor: 'from-rose-500 to-pink-400',
    avatarColor: 'bg-rose-100',
    avatarText: 'SB',
  },
]

// ─── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    'Active':   'bg-green-100 text-green-700',
    'On Leave': 'bg-orange-100 text-orange-600',
    'Inactive': 'bg-gray-100 text-gray-500',
  }
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full
                      ${styles[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
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

        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500 text-lg">
          ⎋
        </button>
      </div>
    </header>
  )
}

// ─── Doctor Card ─────────────────────────────────────────────────────────────
function DoctorCard({ doctor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden
                    hover:shadow-md transition-shadow">
      {/* Gradient top accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${doctor.accentColor}`} />

      {/* Card body */}
      <div className="p-5">

        {/* Header row: avatar + name + status */}
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div className={`w-14 h-14 rounded-xl ${doctor.avatarColor} flex items-center
                           justify-center text-gray-600 font-bold text-base shrink-0`}>
            {doctor.avatarText}
          </div>

          {/* Name + specialty + qualification */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-800 text-sm leading-tight">
                {doctor.name}
              </p>
              <StatusBadge status={doctor.status} />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{doctor.specialty}</p>
            <p className="text-xs text-blue-500 mt-0.5">{doctor.qualification}</p>
          </div>
        </div>

        {/* Stats row: patients today + experience */}
        <div className="flex items-center gap-8 mb-3">
          <div>
            <p className="text-base font-bold text-gray-800 leading-none">
              {doctor.patientsToday}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Patients today</p>
          </div>
          <div>
            <p className="text-base font-bold text-gray-800 leading-none">
              {doctor.experience}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Experience</p>
          </div>
        </div>

        {/* Schedule */}
        <p className="text-xs text-gray-400 mb-4">{doctor.schedule}</p>

        {/* Divider */}
        <div className="border-t border-gray-50 mb-3" />

        {/* Action row */}
        <div className="flex items-center gap-2">
          {/* View */}
          <button className="flex items-center gap-1.5 text-xs text-gray-500
                             hover:text-blue-600 transition px-2 py-1 rounded-lg
                             hover:bg-blue-50">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor"
                 strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943
                   9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View
          </button>

          {/* Edit */}
          <button className="flex items-center gap-1.5 text-xs text-gray-500
                             hover:text-green-600 transition px-2 py-1 rounded-lg
                             hover:bg-green-50">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor"
                 strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                   m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>

          {/* Assign / schedule icon */}
          <button className="ml-auto text-gray-400 hover:text-rose-500 transition
                             p-1 rounded-lg hover:bg-rose-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                 strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10
                   0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3
                   0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                   m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Add Doctor Modal ─────────────────────────────────────────────────────────
const EMPTY_FORM = { fullName: '', phone: '', department: '', qualification: '', experience: '' }

function AddDoctorModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM)

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = () => {
    if (!form.fullName.trim()) return
    onAdd(form)
    onClose()
  }

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">

        {/* Modal header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Add New Doctor</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Full Name — full width */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1.5">Full Name</label>
          <input
            value={form.fullName}
            onChange={e => handleChange('fullName', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>

        {/* Phone + Department — 2 columns */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Phone</label>
            <input
              value={form.phone}
              onChange={e => handleChange('phone', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Department</label>
            <input
              value={form.department}
              onChange={e => handleChange('department', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>
        </div>

        {/* Qualification + Experience — 2 columns */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Qualification</label>
            <input
              value={form.qualification}
              onChange={e => handleChange('qualification', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Experience (years)</label>
            <input
              value={form.experience}
              onChange={e => handleChange('experience', e.target.value)}
              type="number"
              min="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="w-full border border-gray-200 text-gray-500 text-sm font-medium
                       py-2.5 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.fullName.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium
                       py-2.5 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Doctor
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
const ACCENT_COLORS = [
  { accent: 'from-blue-500 to-cyan-400',     avatar: 'bg-blue-100'   },
  { accent: 'from-teal-500 to-emerald-400',  avatar: 'bg-teal-100'   },
  { accent: 'from-purple-500 to-violet-400', avatar: 'bg-purple-100' },
  { accent: 'from-pink-500 to-rose-400',     avatar: 'bg-pink-100'   },
  { accent: 'from-orange-500 to-amber-400',  avatar: 'bg-orange-100' },
  { accent: 'from-cyan-500 to-sky-400',      avatar: 'bg-cyan-100'   },
]

function Doctors() {
  const navigate    = useNavigate()
  const [activeLink, setActiveLink] = useState('Doctors')
  const [search, setSearch]         = useState('')
  const [showModal, setShowModal]   = useState(false)

  // ── Shared store — real doctors, same list Prescription/Lab Order/Diagnosis reference ──
  const { doctors: storeDoctors, addDoctor } = useDoctors()

  // Store doctors don't carry card-display fields (patientsToday, colors) —
  // derive those here so the card UI still works without changing the store shape.
  const doctors = storeDoctors.map((d, i) => {
    const colorSet = ACCENT_COLORS[i % ACCENT_COLORS.length]
    const initials = d.name.replace('Dr. ', '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    return {
      ...d,
      patientsToday: d.patientsToday ?? 0,
      accentColor: colorSet.accent,
      avatarColor: colorSet.avatar,
      avatarText: initials || '??',
    }
  })

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase()) ||
    d.qualification.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddDoctor = (form) => {
    addDoctor({
      id:            `D-${String(storeDoctors.length + 1).padStart(3, '0')}`,
      name:          form.fullName.startsWith('Dr.') ? form.fullName : `Dr. ${form.fullName}`,
      specialty:     form.department || '—',
      qualification: form.qualification || '—',
      status:        'Active',
      experience:    form.experience ? `${form.experience} years` : '—',
      schedule:      '—',
    })
  }

  
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Add Doctor Modal */}
      {showModal && (
        <AddDoctorModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddDoctor}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={(link) => {
          setActiveLink(link)
          if (link === 'Dashboard') navigate('/admin')
          if (link === 'IP')        navigate('/admin/ip')
          if (link === 'Doctors')   navigate('/admin/doctors')
          if (link === 'Staff')     navigate('/admin/staff')
        }}
      />

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">

        <AdminTopBar breadcrumb="Doctors" search={search} onSearch={setSearch} />

        <main className="flex-1 p-6">

          {/* Page heading */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Doctors</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {doctors.length} doctors registered
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                         text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
            >
              <span className="text-base font-bold leading-none">+</span>
              Add Doctor
            </button>
          </div>

          {/* Doctor card grid — 3 columns */}
          <div className="grid grid-cols-3 gap-5">
            {filtered.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">
              No doctors found
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default Doctors