import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  "Dashboard",
  "Patient Queue",
  "Vitals Entry",
  "Vitals History",
]

const MOCK_HISTORY = {
  "P-1003": {
    name: "Mohammed Farhan",
    id: "P-1003",
    age: "45 yrs",
    gender: "Male",
    blood: "O+",
    lastBP: "138/88",
    lastSpO2: "97%",
    lastTemp: "98.4°F",
    lastWeight: "74 kg",
    records: [
      { date: "19 Jun · 09:15", bp: "138/88", bpAlert: false, temp: "98.4", pulse: 78,  spo2: "97%", spo2Alert: false, weight: "74 kg", glucose: "108 mg/dL", recordedBy: "Sr. Meena", notes: "Mild headache"    },
      { date: "15 Jun · 10:30", bp: "142/90", bpAlert: true,  temp: "99.1", pulse: 82,  spo2: "96%", spo2Alert: false, weight: "74 kg", glucose: "112 mg/dL", recordedBy: "Sr. Meena", notes: "—"                },
      { date: "08 Jun · 09:00", bp: "136/85", bpAlert: false, temp: "98.6", pulse: 75,  spo2: "98%", spo2Alert: false, weight: "75 kg", glucose: "105 mg/dL", recordedBy: "Sr. Rani",  notes: "Post medication"  },
      { date: "01 Jun · 11:15", bp: "145/92", bpAlert: true,  temp: "98.2", pulse: 85,  spo2: "95%", spo2Alert: true,  weight: "76 kg", glucose: "118 mg/dL", recordedBy: "Sr. Rani",  notes: "Stressed"         },
    ]
  },
  "T-009": {
    name: "Sneha Patel",
    id: "P-1045",
    age: "31 yrs",
    gender: "Female",
    blood: "B+",
    lastBP: "120/80",
    lastSpO2: "99%",
    lastTemp: "98.2°F",
    lastWeight: "58 kg",
    records: [
      { date: "19 Jun · 09:45", bp: "120/80", bpAlert: false, temp: "98.2", pulse: 72,  spo2: "99%", spo2Alert: false, weight: "58 kg", glucose: "90 mg/dL",  recordedBy: "Sr. Meena", notes: "Chest pain follow-up" },
      { date: "10 Jun · 11:00", bp: "118/76", bpAlert: false, temp: "98.0", pulse: 70,  spo2: "99%", spo2Alert: false, weight: "58 kg", glucose: "88 mg/dL",  recordedBy: "Sr. Rani",  notes: "Routine"            },
    ]
  },
}

// Flatten all patients for search by name
const ALL_PATIENTS = Object.values(MOCK_HISTORY)

const VITAL_TYPES = ["All", "Blood Pressure", "Temperature", "SpO2", "Pulse", "Glucose", "Weight"]

function VitalsHistory() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [activeLink, setActiveLink] = useState("Vitals History")

  const [searchInput, setSearchInput]   = useState('')
  const [dateRange, setDateRange]       = useState('')
  const [vitalType, setVitalType]       = useState('All')
  const [patient, setPatient]           = useState(null)
  const [searchError, setSearchError]   = useState('')

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")      navigate('/nurse')
    if (link === "Patient Queue")  navigate('/nurse/patient-queue')
    if (link === "Vitals Entry")   navigate('/nurse/vitals-entry')
  }

  const handleSearch = () => {
    const key = searchInput.trim().toUpperCase()
    // Try token match first
    let found = MOCK_HISTORY[key]
    // Try name match
    if (!found) {
      found = ALL_PATIENTS.find(p =>
        p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.id.toLowerCase().includes(searchInput.toLowerCase())
      )
    }
    if (found) {
      setPatient(found)
      setSearchError('')
    } else {
      setPatient(null)
      setSearchError('No patient found. Try a different name, ID or token.')
    }
  }

  // Filter records by vital type (date range filter UI-only for now)
  const filteredRecords = patient?.records || []

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={handleNavClick}
      />

      <main className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Vitals History</h2>
            <p className="text-sm text-gray-400">View historical vital signs for a patient</p>
          </div>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
            ↑ Export
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="flex gap-4 items-end">

            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Patient ID or Name
              </label>
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search patient..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Date Range
              </label>
              <input
                type="text"
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                placeholder="e.g. 01 Jun – 19 Jun"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Vital Type
              </label>
              <select
                value={vitalType}
                onChange={e => setVitalType(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
              >
                {VITAL_TYPES.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="flex items-center gap-2 bg-gray-900 text-white text-sm px-5 py-2 rounded-lg hover:bg-gray-700 transition shrink-0"
            >
              🔍 Search
            </button>
          </div>

          {searchError && (
            <p className="text-xs text-red-500 mt-3">{searchError}</p>
          )}
        </div>

        {/* Patient Summary Card */}
        {patient && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{patient.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {patient.id} · {patient.age} · {patient.gender} · Blood: {patient.blood}
                  </p>
                </div>
              </div>

              {/* Last vitals summary */}
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Last BP</p>
                  <p className="text-sm font-bold text-orange-500">{patient.lastBP}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Last SpO2</p>
                  <p className="text-sm font-bold text-green-500">{patient.lastSpO2}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Last Temp</p>
                  <p className="text-sm font-bold text-blue-500">{patient.lastTemp}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Last Weight</p>
                  <p className="text-sm font-bold text-gray-800">{patient.lastWeight}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vitals Record History Table */}
        {patient && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Vitals Record History</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">Date & Time</th>
                    <th className="pb-3 font-medium">BP</th>
                    <th className="pb-3 font-medium">Temp (°F)</th>
                    <th className="pb-3 font-medium">Pulse</th>
                    <th className="pb-3 font-medium">SpO2</th>
                    <th className="pb-3 font-medium">Weight</th>
                    <th className="pb-3 font-medium">Glucose</th>
                    <th className="pb-3 font-medium">Recorded By</th>
                    <th className="pb-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="py-3 text-xs text-gray-500 font-medium">{r.date}</td>
                      <td className="py-3 font-semibold">
                        <span className={r.bpAlert ? "text-orange-500" : "text-gray-800"}>
                          {r.bp}
                        </span>
                      </td>
                      <td className="py-3 text-gray-700">{r.temp}</td>
                      <td className="py-3 text-gray-700">{r.pulse}</td>
                      <td className="py-3 font-semibold">
                        <span className={r.spo2Alert ? "text-red-500" : "text-green-500"}>
                          {r.spo2}
                        </span>
                      </td>
                      <td className="py-3 text-gray-700">{r.weight}</td>
                      <td className="py-3 text-gray-700">{r.glucose}</td>
                      <td className="py-3 text-gray-500 text-xs">{r.recordedBy}</td>
                      <td className="py-3 text-gray-400 text-xs italic">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state — no search yet */}
        {!patient && !searchError && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-gray-500 font-medium">Search for a patient to view their vitals history</p>
            <p className="text-gray-400 text-sm mt-1">Enter a patient name, ID or token above</p>
          </div>
        )}

      </main>
    </div>
  )
}

export default VitalsHistory