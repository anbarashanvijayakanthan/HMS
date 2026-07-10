import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import { useMedicines } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Medicine Inventory",
  "Add Medicine",
  "Prescription Queue",
  "Dispense Medicine",
  "Billing",
]

const INITIAL_FORM = {
  brandName: "",
  genericName: "",
  category: "",
  manufacturer: "",
  strength: "",
  batchNumber: "",
  quantityInStock: "",
  expiryDate: "",
  sellingPrice: "",
  costPrice: "",
  reorderLevel: "",
}

const REQUIRED_FIELDS = [
  "brandName", "genericName", "category", "strength",
  "batchNumber", "quantityInStock", "expiryDate",
  "sellingPrice", "costPrice", "reorderLevel",
]

function AddMedicine() {
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Add Medicine")
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')

  // ── Shared store ──
  const { addMedicine } = useMedicines()

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")          navigate('/pharmacy')
    if (link === "Medicine Inventory") navigate('/pharmacy/inventory')
    if (link === "Prescription Queue") navigate('/pharmacy/prescriptions')
    if (link === "Dispense Medicine")  navigate('/pharmacy/dispense')
    if (link === "Billing")            navigate('/pharmacy/billing')
    if (link === "Add Medicine")       navigate('/pharmacy/add-medicine')
  }

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  const handleSaveDraft = () => {
    console.log("Saved as draft:", form)
    // Drafts intentionally stay local-only — not a store concept yet.
  }

  // Format expiry date to match the store's "Mon YYYY" style (e.g. "Dec 2026")
  const formatExpiry = (dateStr) => {
    if (!dateStr) return "—"
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const deriveStatus = (stock, reorderLevel) => {
    if (stock === 0) return "Out of Stock"
    if (stock < reorderLevel) return "Low Stock"
    return "In Stock"
  }

  const handleAddToInventory = () => {
    const missing = REQUIRED_FIELDS.filter(f => !form[f])
    if (missing.length > 0) {
      setError('Please fill in all required fields marked with **')
      return
    }

    const stock = parseInt(form.quantityInStock, 10) || 0
    const reorderLevel = parseInt(form.reorderLevel, 10) || 0

    addMedicine({
      name: `${form.brandName} ${form.strength}`.trim(),
      generic: form.genericName,
      category: form.category,
      manufacturer: form.manufacturer || "—",
      stock,
      batch: form.batchNumber,
      expiry: formatExpiry(form.expiryDate),
      price: parseFloat(form.sellingPrice) || 0,
      costPrice: parseFloat(form.costPrice) || 0,
      reorderLevel,
      status: deriveStatus(stock, reorderLevel),
    })

    navigate('/pharmacy/inventory')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Add New Medicine</h2>
            <p className="text-sm text-gray-400">Add a new medicine to the pharmacy inventory</p>
          </div>
          <button
            onClick={() => navigate('/pharmacy/inventory')}
            className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            ⊗ Cancel
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5 mb-5">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-6">

          {/* Left column: form sections */}
          <div className="col-span-1 flex flex-col gap-6">

            {/* Medicine Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-4">Medicine Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    BRAND NAME <span className="text-red-500">**</span>
                  </label>
                  <input
                    type="text"
                    value={form.brandName}
                    onChange={handleChange("brandName")}
                    placeholder="e.g. Metoprolol XL"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    GENERIC NAME <span className="text-red-500">**</span>
                  </label>
                  <input
                    type="text"
                    value={form.genericName}
                    onChange={handleChange("genericName")}
                    placeholder="e.g. Metoprolol Succinate"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    CATEGORY <span className="text-red-500">**</span>
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={handleChange("category")}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    MANUFACTURER
                  </label>
                  <input
                    type="text"
                    value={form.manufacturer}
                    onChange={handleChange("manufacturer")}
                    placeholder="Company name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    STRENGTH / DOSAGE <span className="text-red-500">**</span>
                  </label>
                  <input
                    type="text"
                    value={form.strength}
                    onChange={handleChange("strength")}
                    placeholder="e.g. 25mg, 500mg"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Stock Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-4">Stock Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    BATCH NUMBER <span className="text-red-500">**</span>
                  </label>
                  <input
                    type="text"
                    value={form.batchNumber}
                    onChange={handleChange("batchNumber")}
                    placeholder="e.g. MT-2025-07"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    QUANTITY IN STOCK <span className="text-red-500">**</span>
                  </label>
                  <input
                    type="number"
                    value={form.quantityInStock}
                    onChange={handleChange("quantityInStock")}
                    placeholder="e.g. 500"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    EXPIRY DATE <span className="text-red-500">**</span>
                  </label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={handleChange("expiryDate")}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    SELLING PRICE (₹) <span className="text-red-500">**</span>
                  </label>
                  <input
                    type="number"
                    value={form.sellingPrice}
                    onChange={handleChange("sellingPrice")}
                    placeholder="MRP per unit"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    COST PRICE (₹) <span className="text-red-500">**</span>
                  </label>
                  <input
                    type="number"
                    value={form.costPrice}
                    onChange={handleChange("costPrice")}
                    placeholder="Purchase price per unit"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    REORDER LEVEL <span className="text-red-500">**</span>
                  </label>
                  <input
                    type="number"
                    value={form.reorderLevel}
                    onChange={handleChange("reorderLevel")}
                    placeholder="Min stock before alert"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column: action buttons (visually aligned like screenshot) */}
          <div className="col-span-1 flex flex-col items-start gap-3 pt-[420px]">
            <button
              onClick={handleSaveDraft}
              className="border border-gray-200 text-sm px-5 py-2.5 rounded-lg hover:bg-gray-50 transition w-48"
            >
              Save as Draft
            </button>
            <button
              onClick={handleAddToInventory}
              className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-800 transition w-48"
            >
              ⊙ Add to Inventory
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AddMedicine