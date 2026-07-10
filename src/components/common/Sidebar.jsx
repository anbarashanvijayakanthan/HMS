import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

// Role-based nav icons — add more as needed
const NAV_ICONS = {
  // Doctor
  "Dashboard": "🏠",
  "Patient Consultation": "🩺",
  "Diagnosis": "🔬",
  "Prescription": "💊",
  "Lab Order": "🧪",
  "Radiology Order": "🩻",
  "Follow-up Manager": "📅",
  // Receptionist
  "Patient Management": "👥",
  "Patient Registration": "📋",
  "Appointment Management": "📆",
  "Queue Management": "🔢",
  "Billing Collection": "💳",
  // Nurse
  "Patient Queue": "🏥",
  "Vitals Entry": "❤️",
  "Vitals History": "📊",
  // Lab
  "Test Order": "🧾",
  "Sample Collection": "🧫",
  "Result Entry": "📝",
  "Reports Management": "📁",
  // Pharmacy
  "Medicine Inventory": "🗃️",
  "Add Medicine": "➕",
  "Prescription Queue": "📜",
  "Dispense Medicine": "💉",
  "Billing": "🧾",
  // Admin"Patients":      "👥",
"Appointments":  "📆",
"Doctors":       "👨‍⚕️",
"Staff":         "🧑‍💼",
"OP":            "🏥",
"IP":            "🛏️",
"Prescriptions": "💊",
"Pharmacy":      "🗃️",
"Laboratory":    "🧪",
"Vehicles":      "🚑",
"Finance":       "💰",
"Follow-ups":    "📞",
"Reports":       "📊",
// IP Manager
"Admissions": "📥",
"Current Patients": "🛏️",
"Bed Management": "🏥",
"Discharge": "📄",
}

const ROLE_LABELS = {
  doctor: "Doctor",
  receptionist: "Receptionist",
  nurse: "Nurse",
  lab: "Lab Technician",
  pharmacy: "Pharmacist",
  ipmanager: "IP Manager",
}

const ROLE_COLORS = {
  doctor:       "bg-blue-500",
  receptionist: "bg-purple-500",
  nurse:        "bg-green-500",
  lab:          "bg-yellow-500",
  pharmacy:     "bg-orange-500",
  ipmanager:    "bg-red-500",
}

function Sidebar({ links, activeLink, onLinkClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const avatarColor = ROLE_COLORS[user?.role] || "bg-blue-500"

  return (
    <aside
      className="w-64 flex flex-col h-screen sticky top-0 shrink-0"
      style={{ backgroundColor: '#0C1B2E' }}
    >
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">MediCore HMS</p>
            <p className="text-white/40 text-xs">Hospital Management</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${avatarColor} rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              <span className="text-green-400 text-xs">
                Active · {ROLE_LABELS[user?.role]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {links.map(link => {
          const isActive = activeLink === link
          return (
            <button
              key={link}
              onClick={() => onLinkClick(link)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                transition-all duration-150 text-left
                ${isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-white/60 hover:bg-white/8 hover:text-white/90'
                }
              `}
            >
              <span className="text-base w-5 text-center">
                {NAV_ICONS[link] || "•"}
              </span>
              <span className="truncate">{link}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full shrink-0" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom: Settings + Logout */}
      <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-0.5">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:bg-white/8 hover:text-white/80 transition-all">
          <span className="text-base w-5 text-center">⚙️</span>
          <span>Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <span className="text-base w-5 text-center">→</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar