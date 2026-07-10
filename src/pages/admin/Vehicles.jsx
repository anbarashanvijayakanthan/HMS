import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import { useVehicles } from '../../store/hospitalStore'
// ─── Nav ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  'Dashboard', 'Patients', 'Appointments', 'Doctors', 'Staff',
  'OP', 'IP', 'Prescriptions', 'Pharmacy', 'Laboratory',
  'Vehicles', 'Finance', 'Follow-ups', 'Reports', 'Settings',
]

// ─── Mock vehicle data ────────────────────────────────────────────────────────

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

// ─── Stat card with icon box ──────────────────────────────────────────────────
function VehicleStatCard({ iconBg, icon, label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5
                    flex items-center gap-4">
      <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center
                       justify-center text-2xl shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400 font-medium mb-0.5">{label}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function VehicleBadge({ status }) {
  const s = {
    'Available': 'bg-green-100 text-green-700',
    'Maintenance': 'bg-orange-100 text-orange-600',
    'In Use': 'bg-blue-100 text-blue-700',
  }
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full
                      ${s[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  )
}

// ─── Vehicle Card ─────────────────────────────────────────────────────────────
function VehicleCard({ vehicle }) {
  // Format registration number with spaces as shown in Figma
  const formatReg = (reg) => reg  // already formatted in data

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5
                    hover:shadow-md transition-shadow">

      {/* Reg number + status badge */}
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-xs text-blue-500 font-semibold tracking-wider">
          {formatReg(vehicle.reg)}
        </span>
        <VehicleBadge status={vehicle.status} />
      </div>

      {/* Vehicle type */}
      <p className="text-base font-bold text-gray-800 mb-4">{vehicle.type}</p>

      {/* Details rows */}
      <div className="flex flex-col gap-2 mb-5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Driver</span>
          <span className="text-gray-700 font-medium">{vehicle.driver}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Insurance</span>
          <span className="text-gray-700 font-medium">{vehicle.insurance}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Permit Expiry</span>
          <span className={`font-semibold ${vehicle.permitAlert ? 'text-orange-500' : 'text-gray-700'}`}>
            {vehicle.permitExpiry}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Next Service</span>
          <span className="text-gray-700 font-medium">{vehicle.nextService}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-3" />

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button className="flex-1 text-xs text-gray-500 font-medium py-1.5 px-3
                           border border-gray-200 rounded-lg hover:bg-gray-50
                           hover:text-gray-700 transition">
          Expense
        </button>
        <button className="flex-1 text-xs text-gray-500 font-medium py-1.5 px-3
                           border border-gray-200 rounded-lg hover:bg-gray-50
                           hover:text-gray-700 transition">
          Log
        </button>

      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
function Vehicles() {
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState('Vehicles')
  const [search, setSearch] = useState('')

  // ── Shared store ──
  const { vehicles } = useVehicles()

  const filtered = vehicles.filter(v =>
    v.type.toLowerCase().includes(search.toLowerCase()) ||
    v.reg.toLowerCase().includes(search.toLowerCase()) ||
    v.driver.toLowerCase().includes(search.toLowerCase())
  )

  // Stats derived from real data
  const totalVehicles = vehicles.length
  const availableCount = vehicles.filter(v => v.status === 'Available').length
  const maintenanceCount = vehicles.filter(v => v.status === 'Maintenance').length
  const activeDrivers = new Set(vehicles.map(v => v.driver)).size

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
        }}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        <AdminTopBar breadcrumb="Vehicles" search={search} onSearch={setSearch} />

        <main className="flex-1 p-6">

          {/* Page heading */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Vehicle Management</h2>
              <p className="text-sm text-gray-400 mt-0.5">Manage and view prescriptions</p>
            </div>
            <button
              onClick={() => navigate('/admin/add-vehicle')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                               text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
            >
              <span className="text-base font-bold leading-none">+</span>
              Add Vehicle
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <VehicleStatCard
              iconBg="bg-blue-100"
              icon="🚑"
              label="Total Vehicle"
              value={totalVehicles}
            />
            <VehicleStatCard
              iconBg="bg-green-100"
              icon="🚐"
              label="Available Vehicle"
              value={availableCount}
            />
            <VehicleStatCard
              iconBg="bg-orange-100"
              icon="🔧"
              label="Under Maintainence"
              value={maintenanceCount}
            />
            <VehicleStatCard
              iconBg="bg-purple-100"
              icon="👤"
              label="Active Drivers"
              value={activeDrivers}
            />
          </div>

          {/* Vehicle card grid — 4 columns */}
          <div className="grid grid-cols-4 gap-4">
            {filtered.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">
              No vehicles found
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default Vehicles