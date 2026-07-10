import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import { useNavigate } from 'react-router-dom'
import { usePatients, useQueue, useAllVitals } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Patient Queue",
  "Vitals Entry",
  "Vitals History",
]

function VitalsHistory() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [activeLink, setActiveLink] = useState("Vitals History")

  // ── Shared store ──
  const patients = usePatients()
  const { queue } = useQueue()
  const vitalsMap = useAllVitals()

  const [searchInput, setSearchInput]   = useState('')
  const [patient, setPatient]           = useState(null)
  const [visit, setVisit]               = useState(null)
  const [searchError, setSearchError]   = useState('')

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")      navigate('/nurse')
    if (link === "Patient Queue")  navigate('/nurse/patient-queue')
    if (link === "Vitals Entry")   navigate('/nurse/vitals-entry')
  }

  const handleSearch = () => {
    const key = searchInput.trim().toUpperCase()

    // Try matching a today's-visit token directly
    let foundVisit = queue.find(v => v.token === key)

    // Otherwise match by patient name or ID, then find their visit today
    if (!foundVisit) {
      const byId = patients.find(p => p.id.toUpperCase() === key)
      const byName = patients.find(p => p.name.toLowerCase().includes(searchInput.toLowerCase()))
      const matchedPatient = byId || byName
      if (matchedPatient) {
        foundVisit = queue.find(v => v.patientId === matchedPatient.id)
      }
    }

    if (foundVisit) {
      setVisit(foundVisit)
      setPatient(foundVisit.patient)
      setSearchError('')
    } else {
      setPatient(null)
      setVisit(null)
      setSearchError('No patient found with a visit today. Try a different name, ID or token.')
    }
  }

  const vitals = visit ? vitalsMap[visit.token] : null

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
            <p className="text-sm text-gray-400">View today's recorded vital signs for a patient</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Patient ID, Name, or Token
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
                    {patient.id} · {patient.age} yrs · {patient.gender} · Blood: {patient.blood} · Token: {visit.token}
                  </p>
                </div>
              </div>

              {vitals ? (
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">BP</p>
                    <p className="text-sm font-bold text-orange-500">{vitals.bpSys}/{vitals.bpDia}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">SpO2</p>
                    <p className="text-sm font-bold text-green-500">{vitals.spo2}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Temp</p>
                    <p className="text-sm font-bold text-blue-500">{vitals.temp}°F</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Weight</p>
                    <p className="text-sm font-bold text-gray-800">{vitals.weight} kg</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No vitals recorded yet today</p>
              )}
            </div>
          </div>
        )}

        {/* Today's Vitals Record */}
        {patient && vitals && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Today's Vitals Record</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">Recorded At</th>
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
                  <tr className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 text-xs text-gray-500 font-medium">{vitals.timestamp}</td>
                    <td className="py-3 font-semibold text-gray-800">{vitals.bpSys}/{vitals.bpDia}</td>
                    <td className="py-3 text-gray-700">{vitals.temp}</td>
                    <td className="py-3 text-gray-700">{vitals.pulse}</td>
                    <td className="py-3 font-semibold">
                      <span className={vitals.critical ? "text-red-500" : "text-green-500"}>
                        {vitals.spo2}%
                      </span>
                    </td>
                    <td className="py-3 text-gray-700">{vitals.weight} kg</td>
                    <td className="py-3 text-gray-700">{vitals.glucose || '—'} mg/dL</td>
                    <td className="py-3 text-gray-500 text-xs">{vitals.recordedBy}</td>
                    <td className="py-3 text-gray-400 text-xs italic">{vitals.complaints || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Showing today's visit only. Historical vitals across past visits aren't tracked yet.
            </p>
          </div>
        )}

        {/* Patient found, but nothing recorded */}
        {patient && !vitals && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-500 font-medium">No vitals recorded yet for {patient.name} today</p>
          </div>
        )}

        {/* Empty state — no search yet */}
        {!patient && !searchError && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-gray-500 font-medium">Search for a patient to view their vitals</p>
            <p className="text-gray-400 text-sm mt-1">Enter a patient name, ID or token above</p>
          </div>
        )}

      </main>
    </div>
  )
}

export default VitalsHistory