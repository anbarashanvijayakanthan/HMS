import { useState, useEffect } from "react";
import DataTable from "../../components/common/DataTable";

const STATUSES = ["Pending", "Approved", "Discharged"];

const initialDischarges = [
  {
    id: 1,
    patient: "Devika Rao",
    doctor: "Dr. Fatima Sheikh",
    ward: "Private Ward",
    admissionDate: "05 Jul 2026",
    expectedDischarge: "12 Jul 2026",
    billing: "Completed",
    doctorApproval: "Completed",
    status: "Pending",
  },
  {
    id: 2,
    patient: "Suresh Pillai",
    doctor: "Dr. Rajesh Menon",
    ward: "General Ward",
    admissionDate: "04 Jul 2026",
    expectedDischarge: "12 Jul 2026",
    billing: "Pending",
    doctorApproval: "Completed",
    status: "Pending",
  },
  {
    id: 3,
    patient: "Karthik Subramaniam",
    doctor: "Dr. Ananya Sharma",
    ward: "General Ward",
    admissionDate: "06 Jul 2026",
    expectedDischarge: "11 Jul 2026",
    billing: "Completed",
    doctorApproval: "Pending",
    status: "Pending",
  },
  {
    id: 4,
    patient: "Rekha Nair",
    doctor: "Dr. Vikram Nair",
    ward: "ICU",
    admissionDate: "01 Jul 2026",
    expectedDischarge: "11 Jul 2026",
    billing: "Completed",
    doctorApproval: "Completed",
    status: "Approved",
  },
  {
    id: 5,
    patient: "Anil Verma",
    doctor: "Dr. Priya Iyer",
    ward: "General Ward",
    admissionDate: "07 Jul 2026",
    expectedDischarge: "12 Jul 2026",
    billing: "Pending",
    doctorApproval: "Pending",
    status: "Pending",
  },
  {
    id: 6,
    patient: "Geeta Rao",
    doctor: "Dr. Karan Malhotra",
    ward: "Emergency Ward",
    admissionDate: "08 Jul 2026",
    expectedDischarge: "10 Jul 2026",
    billing: "Completed",
    doctorApproval: "Completed",
    status: "Discharged",
  },
  {
    id: 7,
    patient: "Manoj Bhargava",
    doctor: "Dr. Fatima Sheikh",
    ward: "Private Ward",
    admissionDate: "03 Jul 2026",
    expectedDischarge: "11 Jul 2026",
    billing: "Completed",
    doctorApproval: "Completed",
    status: "Approved",
  },
  {
    id: 8,
    patient: "Shalini Kapoor",
    doctor: "Dr. Rajesh Menon",
    ward: "General Ward",
    admissionDate: "06 Jul 2026",
    expectedDischarge: "13 Jul 2026",
    billing: "Pending",
    doctorApproval: "Completed",
    status: "Pending",
  },
];

const dischargeColumns = [
  { key: "patient", label: "Patient", type: "patient" },
  { key: "doctor", label: "Doctor" },
  { key: "ward", label: "Ward" },
  { key: "admissionDate", label: "Admission Date" },
  { key: "expectedDischarge", label: "Expected Discharge" },
  { key: "billing", label: "Billing", type: "badge" },
  { key: "doctorApproval", label: "Doctor Approval", type: "badge" },
  { key: "status", label: "Status", type: "badge" },
  { key: "viewSummary", label: "View Summary", type: "action" },
  { key: "generateSummary", label: "Generate Summary", type: "action" },
  { key: "approve", label: "Approve", type: "action", variant: "primary" },
  { key: "cancel", label: "Cancel", type: "action", variant: "dark" },
];

export default function Discharge() {
  const [discharges, setDischarges] = useState(initialDischarges);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewRow, setViewRow] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredDischarges = discharges.filter((row) => {
    const matchesSearch = row.patient.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateDischarge = (id, changes) => {
    setDischarges((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...changes } : row))
    );
  };

  const handleAction = (row, key) => {
    switch (key) {
      case "viewSummary":
        setViewRow(row);
        break;
      case "generateSummary":
        setToast(`Discharge summary generated for ${row.patient}`);
        break;
      case "approve":
        if (row.billing !== "Completed" || row.doctorApproval !== "Completed") {
          setToast(`Cannot approve ${row.patient}: billing or doctor approval pending`);
          break;
        }
        updateDischarge(row.id, { status: "Approved" });
        setToast(`Discharge approved for ${row.patient}`);
        break;
      case "cancel":
        updateDischarge(row.id, { status: "Pending" });
        setToast(`Discharge request cancelled for ${row.patient}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Discharge</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Review billing, approvals, and process patient discharges
          </p>
        </div>
        {toast && (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
            {toast}
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="All">All Statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">Discharge Requests</h3>
          <span className="text-xs text-gray-400">{filteredDischarges.length} records</span>
        </div>
        <DataTable columns={dischargeColumns} rows={filteredDischarges} onAction={handleAction} />
      </div>

      {viewRow && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Discharge Summary</h3>
              <button
                onClick={() => setViewRow(null)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <DetailRow label="Patient" value={viewRow.patient} />
              <DetailRow label="Doctor" value={viewRow.doctor} />
              <DetailRow label="Ward" value={viewRow.ward} />
              <DetailRow label="Admission Date" value={viewRow.admissionDate} />
              <DetailRow label="Expected Discharge" value={viewRow.expectedDischarge} />
              <DetailRow label="Billing" value={viewRow.billing} />
              <DetailRow label="Doctor Approval" value={viewRow.doctorApproval} />
              <DetailRow label="Status" value={viewRow.status} />
            </div>
            <button
              onClick={() => setViewRow(null)}
              className="mt-5 w-full py-2.5 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 py-1.5">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}