import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import { useVehicles } from '../../store/hospitalStore'

const NAV_LINKS = [
  'Dashboard', 'Patients', 'Appointments', 'Doctors', 'Staff',
  'OP', 'IP', 'Prescriptions', 'Pharmacy', 'Laboratory',
  'Vehicles', 'Finance', 'Follow-ups', 'Reports', 'Settings',
]

const VEHICLE_TYPES = ['Ambulance', 'Staff Van', 'Doctor Car']

const EMPTY_FORM = {
  reg: '', type: '', driver: '',
  insurance: '', permitExpiry: '', nextService: '',
}

function AddVehicle() {
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState('Vehicles')
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const { vehicles, addVehicle } = useVehicles()

  const set = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }))
    setError('')
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const handleSubmit = () => {
    if (!form.reg.trim() || !form.type || !form.driver.trim()) {
      setError('Please fill in registration number, type, and driver.')
      return
    }
    addVehicle({
      id: `V-${String(vehicles.length + 1).padStart(3, '0')}`,
      reg: form.reg.toUpperCase(),
      type: form.type,
      status: 'Available',
      driver: form.driver,
      insurance: formatDate(form.insurance),
      permitExpiry: formatDate(form.permitExpiry),
      nextService: formatDate(form.nextService),
    })
    navigate('/admin/vehicles')
  }

  const inp = `w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700`

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
          if (link === 'Vehicles')  navigate('/admin/vehicles')
        }}
      />

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Add Vehicle</h2>
            <p className="text-sm text-gray-400 mt-0.5">Register a new hospital vehicle</p>
          </div>
          <button
            onClick={() => navigate('/admin/vehicles')}
            className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            ✕ Cancel
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5 mb-5 max-w-2xl">
            {error}
          </p>
        )}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                value={form.reg}
                onChange={e => set('reg', e.target.value)}
                placeholder="KL 07 AB 1234"
                className={inp}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Vehicle Type <span className="text-red-500">*</span>
              </label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className={inp}>
                <option value="">Select type</option>
                {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Driver Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.driver}
              onChange={e => set('driver', e.target.value)}
              placeholder="Enter driver name"
              className={inp}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Insurance Expiry</label>
              <input type="date" value={form.insurance} onChange={e => set('insurance', e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Permit Expiry</label>
              <input type="date" value={form.permitExpiry} onChange={e => set('permitExpiry', e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Next Service</label>
              <input type="date" value={form.nextService} onChange={e => set('nextService', e.target.value)} className={inp} />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition"
          >
            + Add Vehicle
          </button>
        </div>
      </main>
    </div>
  )
}

export default AddVehicle