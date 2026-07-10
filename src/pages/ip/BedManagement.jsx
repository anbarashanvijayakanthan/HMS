import { useState, useEffect } from "react";

const WARDS = ["General Ward", "Private Ward", "ICU", "Emergency Ward"];

const initialBeds = [
  { id: "GB-01", ward: "General Ward", status: "Occupied", patient: "Ramesh Kumar" },
  { id: "GB-02", ward: "General Ward", status: "Occupied", patient: "Meena Pillai" },
  { id: "GB-03", ward: "General Ward", status: "Available", patient: null },
  { id: "GB-04", ward: "General Ward", status: "Cleaning", patient: null },
  { id: "GB-05", ward: "General Ward", status: "Occupied", patient: "Suresh Pillai" },
  { id: "GB-06", ward: "General Ward", status: "Available", patient: null },
  { id: "PB-01", ward: "Private Ward", status: "Occupied", patient: "Sunita Verma" },
  { id: "PB-02", ward: "Private Ward", status: "Occupied", patient: "Devika Rao" },
  { id: "PB-03", ward: "Private Ward", status: "Available", patient: null },
  { id: "PB-04", ward: "Private Ward", status: "Maintenance", patient: null },
  { id: "PB-05", ward: "Private Ward", status: "Available", patient: null },
  { id: "IB-01", ward: "ICU", status: "Occupied", patient: "Arvind Joshi" },
  { id: "IB-02", ward: "ICU", status: "Occupied", patient: "Lakshmi Narayan" },
  { id: "IB-03", ward: "ICU", status: "Occupied", patient: "Manoj Tiwari" },
  { id: "IB-04", ward: "ICU", status: "Cleaning", patient: null },
  { id: "IB-05", ward: "ICU", status: "Available", patient: null },
  { id: "EB-01", ward: "Emergency Ward", status: "Occupied", patient: "Farhan Sheikh" },
  { id: "EB-02", ward: "Emergency Ward", status: "Occupied", patient: "Anita Deshmukh" },
  { id: "EB-03", ward: "Emergency Ward", status: "Available", patient: null },
  { id: "EB-04", ward: "Emergency Ward", status: "Maintenance", patient: null },
];

const statusStyles = {
  Occupied: "bg-blue-50 border-blue-200 text-blue-700",
  Available: "bg-green-50 border-green-200 text-green-700",
  Cleaning: "bg-yellow-50 border-yellow-200 text-yellow-700",
  Maintenance: "bg-red-50 border-red-200 text-red-700",
};

const statusDot = {
  Occupied: "bg-blue-500",
  Available: "bg-green-500",
  Cleaning: "bg-yellow-500",
  Maintenance: "bg-red-500",
};

function summarizeWard(beds, ward) {
  const wardBeds = beds.filter((bed) => bed.ward === ward);
  return {
    total: wardBeds.length,
    occupied: wardBeds.filter((bed) => bed.status === "Occupied").length,
    available: wardBeds.filter((bed) => bed.status === "Available").length,
    cleaning: wardBeds.filter((bed) => bed.status === "Cleaning").length,
    maintenance: wardBeds.filter((bed) => bed.status === "Maintenance").length,
  };
}

export default function BedManagement() {
  const [beds, setBeds] = useState(initialBeds);
  const [wardFilter, setWardFilter] = useState("All");
  const [allocateBed, setAllocateBed] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const updateBed = (id, changes) => {
    setBeds((prev) => prev.map((bed) => (bed.id === id ? { ...bed, ...changes } : bed)));
  };

  const handleBedAction = (bed, action) => {
    switch (action) {
      case "allocate":
        setAllocateBed(bed);
        setPatientName("");
        break;
      case "release":
        updateBed(bed.id, { status: "Cleaning", patient: null });
        setToast(`Bed ${bed.id} released and marked for cleaning`);
        break;
      case "cleaning":
        updateBed(bed.id, { status: "Cleaning", patient: null });
        setToast(`Bed ${bed.id} marked for cleaning`);
        break;
      case "maintenance":
        updateBed(bed.id, { status: "Maintenance", patient: null });
        setToast(`Bed ${bed.id} flagged for maintenance`);
        break;
      case "markAvailable":
        updateBed(bed.id, { status: "Available", patient: null });
        setToast(`Bed ${bed.id} is now available`);
        break;
      default:
        break;
    }
  };

  const confirmAllocate = () => {
    if (!allocateBed || !patientName.trim()) return;
    updateBed(allocateBed.id, { status: "Occupied", patient: patientName.trim() });
    setToast(`Bed ${allocateBed.id} allocated to ${patientName.trim()}`);
    setAllocateBed(null);
  };

  const visibleBeds = beds.filter((bed) => wardFilter === "All" || bed.ward === wardFilter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Bed Management</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Track occupancy and manage bed status across all wards
          </p>
        </div>
        {toast && (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
            {toast}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {WARDS.map((ward) => {
          const summary = summarizeWard(beds, ward);
          const percentage = summary.total
            ? Math.round((summary.occupied / summary.total) * 100)
            : 0;
          return (
            <div key={ward} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-semibold text-gray-800">{ward}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{percentage}%</p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3 text-xs text-gray-500">
                <span>Total: {summary.total}</span>
                <span>Occupied: {summary.occupied}</span>
                <span>Available: {summary.available}</span>
                <span>Cleaning: {summary.cleaning}</span>
                <span className="col-span-2">Maintenance: {summary.maintenance}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">Bed Grid</h3>
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="All">All Wards</option>
            {WARDS.map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleBeds.map((bed) => (
            <div
              key={bed.id}
              className={`rounded-xl border p-4 ${statusStyles[bed.status]}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono text-sm font-semibold">{bed.id}</p>
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[bed.status]}`} />
                  {bed.status}
                </span>
              </div>
              <p className="text-xs opacity-70">{bed.ward}</p>
              <p className="text-sm font-medium mt-1 truncate">
                {bed.patient || "No patient assigned"}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {bed.status === "Available" && (
                  <>
                    <ActionButton onClick={() => handleBedAction(bed, "allocate")}>
                      Allocate
                    </ActionButton>
                    <ActionButton onClick={() => handleBedAction(bed, "maintenance")}>
                      Maintenance
                    </ActionButton>
                  </>
                )}
                {bed.status === "Occupied" && (
                  <ActionButton onClick={() => handleBedAction(bed, "release")}>
                    Release
                  </ActionButton>
                )}
                {bed.status === "Cleaning" && (
                  <>
                    <ActionButton onClick={() => handleBedAction(bed, "markAvailable")}>
                      Mark Available
                    </ActionButton>
                    <ActionButton onClick={() => handleBedAction(bed, "maintenance")}>
                      Maintenance
                    </ActionButton>
                  </>
                )}
                {bed.status === "Maintenance" && (
                  <ActionButton onClick={() => handleBedAction(bed, "markAvailable")}>
                    Mark Fixed
                  </ActionButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {allocateBed && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Allocate Bed {allocateBed.id}</h3>
              <button
                onClick={() => setAllocateBed(null)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Patient Name
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient name..."
              className="w-full mt-1.5 mb-4 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              onClick={confirmAllocate}
              disabled={!patientName.trim()}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirm Allocation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white/70 hover:bg-white transition border border-current/20"
    >
      {children}
    </button>
  );
}