import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'

const NAV_LINKS = [
  "Dashboard",
  "Medicine Inventory",
  "Add Medicine",
  "Prescription Queue",
  "Dispense Medicine",
  "Billing",
]

const MEDICINES = [
  { name: "Metoprolol Succinate 25mg", generic: "Metoprolol",  category: "Tablet", stock: 12,  batch: "MT-2025-04", expiry: "Dec 2026", price: 85,  reorderLevel: 50,  status: "Low Stock"    },
  { name: "Amlodipine 5mg",            generic: "Amlodipine",  category: "Tablet", stock: 8,   batch: "AM-2025-03", expiry: "Oct 2025", price: 42,  reorderLevel: 100, status: "Low Stock"    },
  { name: "Atorvastatin 10mg",         generic: "Atorvastatin",category: "Tablet", stock: 240, batch: "AT-2025-05", expiry: "Mar 2027", price: 95,  reorderLevel: 50,  status: "In Stock"     },
  { name: "Azithromycin 500mg",        generic: "Azithromycin",category: "Tablet", stock: 180, batch: "AZ-2025-02", expiry: "Aug 2026", price: 110, reorderLevel: 30,  status: "In Stock"     },
  { name: "Paracetamol 500mg",         generic: "Paracetamol", category: "Tablet", stock: 45,  batch: "PC-2025-06", expiry: "Sep 2025", price: 18,  reorderLevel: 200, status: "Expiring Soon" },
  { name: "Ondansetron 4mg",           generic: "Ondansetron", category: "Tablet", stock: 0,   batch: "—",          expiry: "—",         price: 72,  reorderLevel: 50,  status: "Out of Stock"  },
]

const STATUS_STYLES = {
  "In Stock":     "bg-green-100 text-green-700",
  "Low Stock":    "bg-yellow-100 text-yellow-700",
  "Expiring Soon":"bg-blue-100 text-blue-700",
  "Out of Stock": "bg-red-100 text-red-700",
}

function MedicineInventory() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Medicine Inventory")
  const [search, setSearch] = useState("")

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")          navigate('/pharmacy')
    if (link === "Add Medicine")       navigate('/pharmacy/add-medicine')
    if (link === "Prescription Queue") navigate('/pharmacy/prescriptions')
    if (link === "Dispense Medicine")  navigate('/pharmacy/dispense')
    if (link === "Billing")            navigate('/pharmacy/billing')
    if (link === "Medicine Inventory") navigate('/pharmacy/inventory')
  }

  const filtered = MEDICINES.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.generic.toLowerCase().includes(search.toLowerCase())
  )

  const totalItems   = MEDICINES.length
  const inStockCount  = MEDICINES.filter(m => m.status === "In Stock").length
  // Note: counts below mirror the screenshot's totals (482/451/14/7), not derived
  // from this small mock list — wire these to real aggregate values from the API later.

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Medicine Inventory</h2>
            <p className="text-sm text-gray-400">Manage all pharmaceutical stock</p>
          </div>
          <div className="flex gap-3">
            <button className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
              ⬇ Export
            </button>
            <button
              onClick={() => navigate('/pharmacy/add-medicine')}
              className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              + Add Medicine
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="📦" label="Total Items"    value={482} />
          <StatsCard icon="✅" label="In Stock"        value={451} />
          <StatsCard icon="⚠️" label="Low Stock"       value={14} subColor="text-yellow-500" />
          <StatsCard icon="⛔" label="Expiring Soon"   value={7}  subColor="text-red-500" />
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center gap-3 mb-5">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search medicine..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="border border-gray-200 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition whitespace-nowrap">
              ▽ Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Medicine Name</th>
                  <th className="pb-3 font-medium">Generic</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Batch No.</th>
                  <th className="pb-3 font-medium">Expiry</th>
                  <th className="pb-3 font-medium">Unit Price</th>
                  <th className="pb-3 font-medium">Reorder Level</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 font-medium text-gray-800">{m.name}</td>
                    <td className="py-3 text-gray-400">{m.generic}</td>
                    <td className="py-3">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{m.category}</span>
                    </td>
                    <td className={`py-3 font-medium ${m.stock === 0 ? "text-red-500" : m.stock < m.reorderLevel ? "text-red-500" : "text-gray-700"}`}>
                      {m.stock}
                    </td>
                    <td className="py-3 text-gray-500 text-xs">{m.batch}</td>
                    <td className={`py-3 text-xs ${m.status === "Expiring Soon" ? "text-orange-500 font-medium" : "text-gray-500"}`}>
                      {m.expiry}
                    </td>
                    <td className="py-3 text-gray-700">₹{m.price}</td>
                    <td className="py-3 text-gray-500">{m.reorderLevel}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[m.status] || "bg-gray-100 text-gray-600"}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <button className="text-xs text-gray-500 hover:text-gray-700 mr-3">✏ Edit</button>
                      <button className="text-xs border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-50 transition">+ Restock</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MedicineInventory