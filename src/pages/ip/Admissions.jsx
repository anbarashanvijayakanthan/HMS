import { useState, useEffect } from "react";
import DataTable from "../../components/common/DataTable";

const WARDS = ["General Ward", "Private Ward", "ICU", "Emergency Ward"];
const DOCTORS = [
  "Dr. Rajesh Menon",
  "Dr. Ananya Sharma",
  "Dr. Vikram Nair",
  "Dr. Priya Iyer",
  "Dr. Karan Malhotra",
  "Dr. Fatima Sheikh",
];
const ROOM_POOL = ["G-101", "G-102", "P-201", "P-202", "ICU-01", "ICU-02", "EW-04", "EW-05"];
const STATUSES = ["Pending Review", "Approved", "Rejected", "Admitted"];

const initialAdmissions = [
  {
    id: 1,
    admissionId: "ADM-2026-2201",
    patient: "Rohit Bhatia",
    age: 42,
    gender: "Male",
    doctor: "Dr. Rajesh Menon",
    ward: "General Ward",
    room: "Unassigned",
    priority: "Normal",
    admissionDate: "11 Jul 2026",
    status: "Pending Review",
  },
  {
    id: 2,
    admissionId: "ADM-2026-2202",
    patient: "Kavya Nambiar",
    age: 29,
    gender: "Female",
    doctor: "Dr. Ananya Sharma",
    ward: "Private Ward",
    room: "P-201",
    priority: "High",
    admissionDate: "11 Jul 2026",
    status: "Approved",
  },
  {
    id: 3,
    admissionId: "ADM-2026-2203",
    patient: "Imran Qureshi",
    age: 61,
    gender: "Male",
    doctor: "Dr. Vikram Nair",
    ward: "ICU",
    room: "ICU-01",
    priority: "Emergency",
    admissionDate: "11 Jul 2026",
    status: "Admitted",
  },
  {
    id: 4,
    admissionId: "ADM-2026-2204",
    patient: "Sneha Kulkarni",
    age: 35,
    gender: "Female",
    doctor: "Dr. Priya Iyer",
    ward: "General Ward",
    room: "Unassigned",
    priority: "Normal",
    admissionDate: "11 Jul 2026",
    status: "Pending Review",
  },
  {
    id: 5,
    admissionId: "ADM-2026-2205",
    patient: "Arjun Chandran",
    age: 54,
    gender: "Male",
    doctor: "Dr. Karan Malhotra",
    ward: "Emergency Ward",
    room: "EW-04",
    priority: "Emergency",
    admissionDate: "11 Jul 2026",
    status: "Admitted",
  },
  {
    id: 6,
    admissionId: "ADM-2026-2206",
    patient: "Divya Menon",
    age: 47,
    gender: "Female",
    doctor: "Dr. Fatima Sheikh",
    ward: "Private Ward",
    room: "Unassigned",
    priority: "High",
    admissionDate: "12 Jul 2026",
    status: "Pending Review",
  },
  {
    id: 7,
    admissionId: "ADM-2026-2207",
    patient: "Manoj Tiwari",
    age: 66,
    gender: "Male",
    doctor: "Dr. Vikram Nair",
    ward: "ICU",
    room: "Unassigned",
    priority: "Emergency",
    admissionDate: "12 Jul 2026",
    status: "Pending Review",
  },
  {
    id: 8,
    admissionId: "ADM-2026-2208",
    patient: "Neha Kapoor",
    age: 31,
    gender: "Female",
    doctor: "Dr. Ananya Sharma",
    ward: "General Ward",
    room: "G-101",
    priority: "Normal",
    admissionDate: "12 Jul 2026",
    status: "Approved",
  },
  {
    id: 9,
    admissionId: "ADM-2026-2209",
    patient: "Sundar Pillai",
    age: 58,
    gender: "Male",
    doctor: "Dr. Rajesh Menon",
    ward: "General Ward",
    room: "Unassigned",
    priority: "Normal",
    admissionDate: "12 Jul 2026",
    status: "Rejected",
  },
  {
    id: 10,
    admissionId: "ADM-2026-2210",
    patient: "Priyanka Das",
    age: 39,
    gender: "Female",
    doctor: "Dr. Karan Malhotra",
    ward: "Emergency Ward",
    room: "Unassigned",
    priority: "Emergency",
    admissionDate: "12 Jul 2026",
    status: "Pending Review",
  },
];

const admissionColumns = [
  { key: "admissionId", label: "Admission ID", type: "token" },
  { key: "patient", label: "Patient", type: "patient" },
  { key: "age", label: "Age" },
  { key: "gender", label: "Gender" },
  { key: "doctor", label: "Doctor" },
  { key: "ward", label: "Ward" },
  { key: "room", label: "Room" },
  { key: "priority", label: "Priority", type: "badge" },
  { key: "admissionDate", label: "Admission Date" },
  { key: "status", label: "Status", type: "badge" },
  { key: "view", label: "View", type: "action" },
  { key: "assignBed", label: "Assign Bed", type: "action" },
  { key: "assignDoctor", label: "Assign Doctor", type: "action" },
  { key: "approve", label: "Approve", type: "action", variant: "primary" },
  { key: "reject", label: "Reject", type: "action", variant: "dark" },
];

export default function Admissions() {
  const [admissions, setAdmissions] = useState(initialAdmissions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [wardFilter, setWardFilter] = useState("All");
  const [viewRow, setViewRow] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredAdmissions = admissions.filter((row) => {
    const matchesSearch =
      row.patient.toLowerCase().includes(search.toLowerCase()) ||
      row.admissionId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    const matchesWard = wardFilter === "All" || row.ward === wardFilter;
    return matchesSearch && matchesStatus && matchesWard;
  });

  const updateAdmission = (id, changes) => {
    setAdmissions((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...changes } : row))
    );
  };

  const handleAction = (row, key) => {
    switch (key) {
      case "view":
        setViewRow(row);
        break;
      case "assignBed": {
        const nextRoom = ROOM_POOL[Math.floor(Math.random() * ROOM_POOL.length)];
        updateAdmission(row.id, { room: nextRoom });
        setToast(`Room ${nextRoom} assigned to ${row.patient}`);
        break;
      }
      case "assignDoctor": {
        const currentIndex = DOCTORS.indexOf(row.doctor);
        const nextDoctor = DOCTORS[(currentIndex + 1) % DOCTORS.length];
        updateAdmission(row.id, { doctor: nextDoctor });
        setToast(`${nextDoctor} assigned to ${row.patient}`);
        break;
      }
      case "approve":
        if (row.status === "Admitted") {
          setToast(`${row.patient} is already admitted`);
          break;
        }
        updateAdmission(row.id, { status: "Approved" });
        setToast(`Admission approved for ${row.patient}`);
        break;
      case "reject":
        updateAdmission(row.id, { status: "Rejected" });
        setToast(`Admission rejected for ${row.patient}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Admissions</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Review, approve, and manage new inpatient admission requests
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
          placeholder="Search by patient or admission ID..."
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
        <select
          value={wardFilter}
          onChange={(e) => setWardFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="All">All Wards</option>
          {WARDS.map((ward) => (
            <option key={ward} value={ward}>
              {ward}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">Admission Requests</h3>
          <span className="text-xs text-gray-400">{filteredAdmissions.length} records</span>
        </div>
        <DataTable columns={admissionColumns} rows={filteredAdmissions} onAction={handleAction} />
      </div>

      {viewRow && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Admission Details</h3>
              <button
                onClick={() => setViewRow(null)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <DetailRow label="Admission ID" value={viewRow.admissionId} />
              <DetailRow label="Patient" value={viewRow.patient} />
              <DetailRow label="Age / Gender" value={`${viewRow.age} / ${viewRow.gender}`} />
              <DetailRow label="Doctor" value={viewRow.doctor} />
              <DetailRow label="Ward" value={viewRow.ward} />
              <DetailRow label="Room" value={viewRow.room} />
              <DetailRow label="Priority" value={viewRow.priority} />
              <DetailRow label="Admission Date" value={viewRow.admissionDate} />
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