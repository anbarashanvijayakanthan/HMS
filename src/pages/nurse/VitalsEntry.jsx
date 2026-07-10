import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useVisit, useVitals } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Patient Queue",
  "Vitals Entry",
  "Vitals History",
]

const NORMAL_RANGES = [
  { label: "Blood Pressure",  value: "90–120 / 60–80" },
  { label: "Temperature",     value: "97–99°F"        },
  { label: "Pulse Rate",      value: "60–100 bpm"     },
  { label: "SpO2",            value: "≥ 95%"          },
  { label: "Respiratory Rate",value: "12–20 /min"     },
  { label: "Fasting Glucose", value: "70–100 mg/dL"  },
]

function VitalsEntry() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [activeLink, setActiveLink] = useState("Vitals Entry")

  // Token can arrive via ?token=T-008 (from the nurse dashboard "Record" button)
  // or be typed/searched manually below.
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get('token') || ''

  const [tokenInput, setTokenInput]   = useState(tokenFromUrl)
  const [activeToken, setActiveToken] = useState(tokenFromUrl)
  const [searchError, setSearchError] = useState('')

  // ── Shared store lookups ──
  const { visit, patient } = useVisit(activeToken)
  const { vitals: existingVitals, saveVitals } = useVitals(activeToken)

  // Vitals form
  const [vitals, setVitals] = useState({
    bpSys: '', bpDia: '',
    temp: '',
    pulse: '',
    spo2: '',
    respRate: '',
    glucose: '',
    height: '',
    weight: '',
    painScale: '0',
    consciousness: '',
    complaints: '',
  })
  const [saved, setSaved] = useState(false)

  const bmi =
    vitals.height && vitals.weight
      ? (parseFloat(vitals.weight) / Math.pow(parseFloat(vitals.height) / 100, 2)).toFixed(1)
      : '—'

  const handleSearch = () => {
    const key = tokenInput.trim().toUpperCase()
    setActiveToken(key)
    setSaved(false)
    // useVisit will resolve on next render; give immediate feedback here
    setSearchError('')
  }

  const handleChange = (field, value) => {
    setVitals(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = (flagCritical = false) => {
    if (!activeToken || !patient) {
      setSearchError('Search for a valid patient/token before saving vitals.')
      return
    }
    saveVitals({
      bpSys: vitals.bpSys, bpDia: vitals.bpDia,
      temp: vitals.temp, pulse: vitals.pulse, spo2: vitals.spo2,
      respRate: vitals.respRate, glucose: vitals.glucose,
      height: vitals.height, weight: vitals.weight,
      painScale: vitals.painScale, consciousness: vitals.consciousness,
      complaints: vitals.complaints,
      recordedBy: user?.name || 'Nurse',
      critical: flagCritical,
    })
    setSaved(true)
  }

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")      navigate('/nurse')
    if (link === "Patient Queue")  navigate('/nurse/patient-queue')
    if (link === "Vitals History") navigate('/nurse/vitals-history')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Breadcrumb header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Record Vitals</h2>
            <p className="text-sm text-gray-400">
              Enter patient vital signs before doctor consultation
            </p>
          </div>
          <button
            onClick={() => navigate('/nurse')}
            className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            ✕ Cancel
          </button>
        </div>

        <div className="flex gap-5">

          {/* LEFT: Patient Info + Normal Ranges */}
          <div className="w-80 shrink-0 flex flex-col gap-4">

            {/* Patient Search */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-700 mb-4">Patient Information</h3>

              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Patient ID or Token <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tokenInput}
                  onChange={e => setTokenInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter token or scan barcode"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSearch}
                  className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  🔍 Search
                </button>
              </div>

              {searchError && (
                <p className="text-xs text-red-500 mb-3">{searchError}</p>
              )}

              {activeToken && !patient && !searchError && (
                <p className="text-xs text-red-500 mb-3">No patient found for token "{activeToken}".</p>
              )}

              {patient && visit && (
                <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{patient.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {patient.id} · {patient.age} yrs · {patient.gender} · {visit.department}
                    </p>
                    <p className="text-xs mt-1">
                      {patient.allergies.length > 0 && (
                        <>Allergies: <span className="text-red-500 font-medium">{patient.allergies.join(', ')}</span> · </>
                      )}
                      Blood: {patient.blood}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Normal Ranges */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Normal Ranges</h3>
              <div className="flex flex-col gap-2.5">
                {NORMAL_RANGES.map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{r.label}</span>
                    <span className="text-green-600 font-medium">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Previous Vitals — from the store, if already recorded today */}
            {existingVitals && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-700 mb-3">Already Recorded Today</h3>
                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">BP</span>
                    <span className="text-orange-500 font-semibold">{existingVitals.bpSys}/{existingVitals.bpDia}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Weight</span>
                    <span className="font-semibold text-gray-800">{existingVitals.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Recorded at</span>
                    <span className="font-semibold text-gray-800">{existingVitals.timestamp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">By</span>
                    <span className="font-semibold text-gray-800">{existingVitals.recordedBy}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Vital Signs Form */}
          <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-5 flex items-center gap-2">
              <span className="text-red-500">❤️</span> Vital Signs
            </h3>

            {/* Row 1: BP / Temp / Pulse */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Blood Pressure (mmHg) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <input
                    type="number"
                    value={vitals.bpSys}
                    onChange={e => handleChange('bpSys', e.target.value)}
                    placeholder="Sys"
                    className="w-full px-3 py-2 text-sm focus:outline-none"
                  />
                  <span className="text-gray-400 px-1">/</span>
                  <input
                    type="number"
                    value={vitals.bpDia}
                    onChange={e => handleChange('bpDia', e.target.value)}
                    placeholder="Dia"
                    className="w-full px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Normal: 90–120 / 60–80</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Temperature (°F) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={vitals.temp}
                  onChange={e => handleChange('temp', e.target.value)}
                  placeholder="98.6"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">97–99°F</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Pulse Rate (BPM) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={vitals.pulse}
                  onChange={e => handleChange('pulse', e.target.value)}
                  placeholder="72"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">60–100 bpm</p>
              </div>
            </div>

            {/* Row 2: SpO2 / Resp Rate / Glucose */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  SpO2 (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={vitals.spo2}
                  onChange={e => handleChange('spo2', e.target.value)}
                  placeholder="98"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">≥ 95%</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Respiratory Rate (/min) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={vitals.respRate}
                  onChange={e => handleChange('respRate', e.target.value)}
                  placeholder="16"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">12–20 /min</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Blood Glucose (mg/dL)
                </label>
                <input
                  type="number"
                  value={vitals.glucose}
                  onChange={e => handleChange('glucose', e.target.value)}
                  placeholder="100"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">Fasting: 70–100</p>
              </div>
            </div>

            {/* Row 3: Height / Weight / BMI */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={vitals.height}
                  onChange={e => handleChange('height', e.target.value)}
                  placeholder="170"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={vitals.weight}
                  onChange={e => handleChange('weight', e.target.value)}
                  placeholder="72"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  BMI (Auto-Calc)
                </label>
                <div className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500">
                  {bmi}
                </div>
              </div>
            </div>

            {/* Row 4: Pain Scale / Consciousness */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Pain Scale (0–10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={vitals.painScale}
                  onChange={e => handleChange('painScale', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Consciousness Level
                </label>
                <select
                  value={vitals.consciousness}
                  onChange={e => handleChange('consciousness', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                >
                  <option value="">Select...</option>
                  <option value="Alert">Alert</option>
                  <option value="Verbal">Verbal</option>
                  <option value="Pain">Pain</option>
                  <option value="Unresponsive">Unresponsive</option>
                </select>
              </div>
            </div>

            {/* Chief Complaints */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Chief Complaints
              </label>
              <textarea
                rows={3}
                value={vitals.complaints}
                onChange={e => handleChange('complaints', e.target.value)}
                placeholder="Observations, complaints reported by patient, skin condition..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {saved && (
              <p className="text-sm text-green-600 mb-3">✓ Vitals saved for {patient?.name}.</p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSave(true)}
                className="flex items-center gap-1.5 border border-red-300 text-red-600 text-sm px-4 py-2 rounded-lg hover:bg-red-50 transition"
              >
                ⚠️ Flag as Critical
              </button>
              <button
                onClick={() => handleSave(false)}
                className="flex items-center gap-1.5 border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition ml-auto"
              >
                💾 Save Vitals
              </button>
              <button
                onClick={() => navigate('/nurse/patient-queue')}
                className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                🔔 Notify Doctor
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

export default VitalsEntry