import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import { useMedicines } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Medicine Inventory",
  "Add Medicine",
  "Prescription Queue",
  "Dispense Medicine",
  "Billing",
]

const STATUS_STYLES = {
  "In Stock":     "bg-green-100 text-green-700",
  "Low Stock":    "bg-yellow-100 text-yellow-700",
  "Expiring Soon":"bg-blue-100 text-blue-700",
  "Out of Stock": "bg-red-100 text-red-700",
}

// Derive live status from stock vs reorderLevel rather than trusting a
// stored field — this way it's always correct even after DECREMENT_STOCK
// or a freshly-added medicine changes the numbers.
function deriveStatus(m) {
  if (m.stock === 0) return "Out of Stock"
  if (m.stock < m.reorderLevel) return "Low Stock"
  if (m.status === "Expiring Soon") return "Expiring Soon" // seed data flag, no expiry-date math yet
  return "In Stock"
}

function MedicineInventory() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Medicine Inventory")
  const [search, setSearch] = useState("")

  // ── Shared store ──
  const { medicines } = useMedicines()

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")          navigate('/pharmacy')
    if (link === "Add Medicine")       navigate('/pharmacy/add-medicine')
    if (link === "Prescription Queue") navigate('/pharmacy/prescriptions')
    if (link === "Dispense Medicine")  navigate('/pharmacy/dispense')
    if (link === "Billing")            navigate('/pharmacy/billing')
    if (link === "Medicine Inventory") navigate('/pharmacy/inventory')
  }

  const enriched = medicines.map(m => ({ ...m, liveStatus: deriveStatus(m) }))

  const filtered = enriched.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.generic || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalItems      = medicines.length
  const inStockCount    = enriched.filter(m => m.liveStatus === "In Stock").length
  const lowStockCount   = enriched.filter(m => m.liveStatus === "Low Stock").length
  const expiringCount   = enriched.filter(m => m.liveStatus === "Expiring Soon").length

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

        {/* Stats Row — now derived from real store data */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard icon="📦" label="Total Items"    value={totalItems} />
          <StatsCard icon="✅" label="In Stock"        value={inStockCount} />
          <StatsCard icon="⚠️" label="Low Stock"       value={lowStockCount} subColor="text-yellow-500" />
          <StatsCard icon="⛔" label="Expiring Soon"   value={expiringCount}  subColor="text-red-500" />
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
                  <tr key={`${m.name}-${i}`} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 font-medium text-gray-800">{m.name}</td>
                    <td className="py-3 text-gray-400">{m.generic}</td>
                    <td className="py-3">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{m.category}</span>
                    </td>
                    <td className={`py-3 font-medium ${m.stock === 0 ? "text-red-500" : m.stock < m.reorderLevel ? "text-red-500" : "text-gray-700"}`}>
                      {m.stock}
                    </td>
                    <td className="py-3 text-gray-500 text-xs">{m.batch}</td>
                    <td className={`py-3 text-xs ${m.liveStatus === "Expiring Soon" ? "text-orange-500 font-medium" : "text-gray-500"}`}>
                      {m.expiry}
                    </td>
                    <td className="py-3 text-gray-700">₹{m.price}</td>
                    <td className="py-3 text-gray-500">{m.reorderLevel}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[m.liveStatus] || "bg-gray-100 text-gray-600"}`}>
                        {m.liveStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <button className="text-xs text-gray-500 hover:text-gray-700 mr-3">✏ Edit</button>
                      <button className="text-xs border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-50 transition">+ Restock</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-gray-400 text-sm">
                      No medicines found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MedicineInventory