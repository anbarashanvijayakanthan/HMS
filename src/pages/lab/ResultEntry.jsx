import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'

const NAV_LINKS = [
  "Lab Dashboard",
  "Test Order",
  "Sample Collection",
  "Result Entry",
  "Reports Management",
]

// --- CBC Parameters ---
const CBC_PARAMS = [
  { id: "hb",         name: "Haemoglobin (Hb)", value: "11.2",   unit: "g/dL",  ref: "12.8–16.8 (F)", flag: "L", interpretation: "possible Anaemia"  },
  { id: "wbc",        name: "WBC Count",         value: "9800",   unit: "/µL",   ref: "4098–11000",    flag: "",  interpretation: "Slightly High"      },
  { id: "plt",        name: "Platelet Count",    value: "240000", unit: "/µL",   ref: "150000–400000", flag: "",  interpretation: "Below optimal"      },
  { id: "neut",       name: "Neutrophils",       value: "72",     unit: "%",     ref: "40–70",         flag: "H", interpretation: "Slightly High"      },
  { id: "lymph",      name: "Lymphocytes",       value: "22",     unit: "%",     ref: "20–45",         flag: "",  interpretation: "possible Anaemia"   },
  { id: "mcv",        name: "MCV",               value: "76",     unit: "fL",    ref: "80–100",        flag: "L", interpretation: "possible Anaemia"   },
]

// --- Lipid Profile Parameters ---
const LIPID_PARAMS = [
  { id: "tc",  name: "Total Cholesterol", value: "218", unit: "mg/dL", desirable: "< 200",    flag: "H", interpretation: "High"           },
  { id: "ldl", name: "LDL Cholesterol",   value: "142", unit: "mg/dL", desirable: "< 130",    flag: "H", interpretation: "High"           },
  { id: "hdl", name: "HDL Cholesterol",   value: "48",  unit: "mg/dL", desirable: "> 50 (F)", flag: "L", interpretation: "possible Anaemia"},
  { id: "tg",  name: "Triglycerides",     value: "168", unit: "mg/dL", desirable: "< 150",    flag: "H", interpretation: "High"           },
]

const ABNORMAL = [
  { text: "Hb: 11.2 — Low (possible anaemia)",        color: "text-orange-600" },
  { text: "Neutrophils: 72% — Slightly High",          color: "text-orange-600" },
  { text: "Total Cholesterol: 218 — Borderline High",  color: "text-red-600"    },
  { text: "LDL: 142 — High",                          color: "text-red-600"    },
  { text: "HDL: 48 — Below optimal",                  color: "text-orange-600" },
]

function FlagBadge({ flag }) {
  if (!flag) return null
  return (
    <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
      flag === "H" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
    }`}>
      {flag}
    </span>
  )
}

function InterpretationCell({ text }) {
  if (!text) return <span className="text-gray-300">—</span>
  return (
    <span className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-600 bg-white">
      {text}
    </span>
  )
}

function ResultEntry() {
  const { user } = useAuth()
  const [activeLink, setActiveLink] = useState("Result Entry")
  const [troponinValue, setTroponinValue] = useState("")

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar
        links={NAV_LINKS}
        activeLink={activeLink}
        onLinkClick={setActiveLink}
      />

      <main className="flex-1 p-6 overflow-auto">

        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-4">
          <span>Lab Technician</span>
          <span className="mx-1.5">›</span>
          <span className="text-gray-600 font-medium">Result Entry</span>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Result Entry</h2>
          <p className="text-sm text-gray-400">
            LO-5501 · Sneha Patel · CBC + Lipid Profile + Troponin + TSH
          </p>
        </div>

        <div className="flex gap-5">

          {/* Left Column — Test Tables */}
          <div className="flex-1 flex flex-col gap-5 min-w-0">

            {/* CBC Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Complete Blood Count (CBC)</h3>
                <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  Haematology
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100 text-xs uppercase tracking-wide">
                      <th className="pb-3 font-medium">Parameter</th>
                      <th className="pb-3 font-medium">Value</th>
                      <th className="pb-3 font-medium">Unit</th>
                      <th className="pb-3 font-medium">Reference Range</th>
                      <th className="pb-3 font-medium">Flag</th>
                      <th className="pb-3 font-medium">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CBC_PARAMS.map(p => (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="py-3 text-gray-700 font-medium">{p.name}</td>
                        <td className="py-3">
                          <input
                            defaultValue={p.value}
                            className="w-20 border border-gray-200 rounded px-2 py-1 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 text-gray-400 text-xs">{p.unit}</td>
                        <td className="py-3 text-gray-400 text-xs">{p.ref}</td>
                        <td className="py-3"><FlagBadge flag={p.flag} /></td>
                        <td className="py-3"><InterpretationCell text={p.interpretation} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lipid Profile Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Lipid Profile</h3>
                <span className="bg-teal-100 text-teal-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  Biochemistry
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100 text-xs uppercase tracking-wide">
                      <th className="pb-3 font-medium">Parameter</th>
                      <th className="pb-3 font-medium">Value</th>
                      <th className="pb-3 font-medium">Unit</th>
                      <th className="pb-3 font-medium">Desirable</th>
                      <th className="pb-3 font-medium">Flag</th>
                      <th className="pb-3 font-medium">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LIPID_PARAMS.map(p => (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="py-3 text-gray-700 font-medium">{p.name}</td>
                        <td className="py-3">
                          <input
                            defaultValue={p.value}
                            className="w-20 border border-gray-200 rounded px-2 py-1 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 text-gray-400 text-xs">{p.unit}</td>
                        <td className="py-3 text-gray-400 text-xs">{p.desirable}</td>
                        <td className="py-3"><FlagBadge flag={p.flag} /></td>
                        <td className="py-3"><InterpretationCell text={p.interpretation} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="w-72 shrink-0 flex flex-col gap-5">

            {/* Patient & Order Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Patient & Order Info</h3>
              <div className="flex flex-col gap-2.5 text-sm">
                {[
                  { label: "Patient",    value: "Sneha Patel",      bold: true },
                  { label: "Age/Sex",    value: "31 yrs / F",       bold: true },
                  { label: "Collected",  value: "11:45 AM",         bold: true },
                  { label: "Priority",   value: "Urgent",           urgent: true },
                  { label: "Doctor",     value: "Dr. Priya Sharma", bold: true },
                ].map(row => (
                  <div key={row.label} className="flex justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-400">{row.label}</span>
                    <span className={`font-medium ${row.urgent ? 'text-orange-500' : 'text-gray-800'}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Abnormal Values */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-orange-500">⚠</span>
                <h3 className="font-semibold text-gray-700">Abnormal Values</h3>
              </div>
              <ul className="flex flex-col gap-1.5">
                {ABNORMAL.map((a, i) => (
                  <li key={i} className={`text-xs ${a.color}`}>
                    • {a.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Troponin I (hs) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Troponin I (hs)</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Value (ng/L)</p>
              <input
                type="number"
                placeholder="e.g. 8.2"
                value={troponinValue}
                onChange={e => setTroponinValue(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <p className="text-xs text-gray-400 mb-3">Normal: &lt; 14 ng/L (female)</p>
              <button className="w-full text-left border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 transition">
                Normal — No Acute MI
              </button>
            </div>

            {/* Save Button */}
            <button className="w-full bg-gray-800 text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-700 transition">
              Save Results
            </button>

          </div>
        </div>
      </main>
    </div>
  )
}

export default ResultEntry