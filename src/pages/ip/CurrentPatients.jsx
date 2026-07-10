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

const initialPatients = [
  {
    id: 1,
    patient: "Ramesh Kumar",
    ward: "General Ward",
    room: "G-101",
    bed: "GB-04",
    doctor: "Dr. Rajesh Menon",
    daysAdmitted: 3,
    condition: "Stable",
    status: "Admitted",
  },
  {
    id: 2,
    patient: "Sunita Verma",
    ward: "Private Ward",
    room: "P-202",
    bed: "PB-02",
    doctor: "Dr. Ananya Sharma",
    daysAdmitted: 1,
    condition: "Improving",
    status: "Under Treatment",
  },
  {
    id: 3,
    patient: "Arvind Joshi",
    ward: "ICU",
    room: "ICU-01",
    bed: "IB-01",
    doctor: "Dr. Vikram Nair",
    daysAdmitted: 5,
    condition: "Critical",
    status: "Under Treatment",
  },
  {
    id: 4,
    patient: "Meena Pillai",
    ward: "General Ward",
    room: "G-103",
    bed: "GB-06",
    doctor: "Dr. Priya Iyer",
    daysAdmitted: 2,
    condition: "Stable",
    status: "Under Treatment",
  },
  {
    id: 5,
    patient: "Farhan Sheikh",
    ward: "Emergency Ward",
    room: "EW-02",
    bed: "EB-02",
    doctor: "Dr. Karan Malhotra",
    daysAdmitted: 1,
    condition: "Serious",
    status: "Admitted",
  },
  {
    id: 6,
    patient: "Lakshmi Narayan",
    ward: "ICU",
    room: "ICU-03",
    bed: "IB-03",
    doctor: "Dr. Vikram Nair",
    daysAdmitted: 4,
    condition: "Serious",
    status: "Under Treatment",
  },
  {
    id: 7,
    patient: "Devika Rao",
    ward: "Private Ward",
    room: "P-204",
    bed: "PB-04",
    doctor: "Dr. Fatima Sheikh",
    daysAdmitted: 6,
    condition: "Improving",
    status: "Ready for Discharge",
  },
  {
    id: 8,
    patient: "Suresh Pillai",
    ward: "General Ward",
    room: "G-105",
    bed: "GB-09",
    doctor: "Dr. Rajesh Menon",
    daysAdmitted: 7,
    condition: "Stable",
    status: "Ready for Discharge",
  },
  {
    id: 9,
    patient: "Anita Deshmukh",
    ward: "Emergency Ward",
    room: "EW-05",
    bed: "EB-05",
    doctor: "Dr. Karan Malhotra",
    daysAdmitted: 1,
    condition: "Serious",
    status: "Admitted",
  },
  {
    id: 10,
    patient: "Vijay Kulkarni",
    ward: "General Ward",
    room: "G-108",
    bed: "GB-12",
    doctor: "Dr. Priya Iyer",
    daysAdmitted: 4,
    condition: "Improving",
    status: "Under Treatment",
  },
];

const patientColumns = [
  { key: "patient", label: "Patient", type: "patient" },
  { key: "ward", label: "Ward" },
  { key: "room", label: "Room" },
  { key: "bed", label: "Bed" },
  { key: "doctor", label: "Doctor" },
  { key: "daysAdmitted", label: "Days Admitted" },
  { key: "condition", label: "Condition", type: "badge" },
  { key: "status", label: "Status", type: "badge" },
  { key: "view", label: "View", type: "action" },
  { key: "transfer", label: "Transfer", type: "action" },
  { key: "treatment", label: "Treatment", type: "action", variant: "primary" },
  { key: "discharge", label: "Discharge", type: "action", variant: "dark" },
];

export default function CurrentPatients() {
  const [patients, setPatients] = useState(initialPatients);
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("All");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [viewRow, setViewRow] = useState(null);
  const [transferRow, setTransferRow] = useState(null);
  const [transferWard, setTransferWard] = useState("");
  const [treatmentRow, setTreatmentRow] = useState(null);
  const [treatmentNote, setTreatmentNote] = useState("");
  const [treatmentLogs, setTreatmentLogs] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredPatients = patients.filter((row) => {
    const matchesSearch = row.patient.toLowerCase().includes(search.toLowerCase());
    const matchesWard = wardFilter === "All" || row.ward === wardFilter;
    const matchesDoctor = doctorFilter === "All" || row.doctor === doctorFilter;
    return matchesSearch && matchesWard && matchesDoctor;
  });

  const updatePatient = (id, changes) => {
    setPatients((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...changes } : row))
    );
  };

  const handleAction = (row, key) => {
    switch (key) {
      case "view":
        setViewRow(row);
        break;
      case "transfer":
        setTransferRow(row);
        setTransferWard(WARDS.find((ward) => ward !== row.ward) || WARDS[0]);
        break;
      case "treatment":
        setTreatmentRow(row);
        setTreatmentNote("");
        break;
      case "discharge":
        setPatients((prev) => prev.filter((p) => p.id !== row.id));
        setToast(`${row.patient} discharged and moved to Discharge queue`);
        break;
      default:
        break;
    }
  };

  const confirmTransfer = () => {
    if (!transferRow) return;
    updatePatient(transferRow.id, {
      ward: transferWard,
      room: `${transferWard.charAt(0)}-${Math.floor(100 + Math.random() * 20)}`,
    });
    setToast(`${transferRow.patient} transferred to ${transferWard}`);
    setTransferRow(null);
  };

  const addTreatmentNote = () => {
    if (!treatmentRow || !treatmentNote.trim()) return;
    setTreatmentLogs((prev) => ({
      ...prev,
      [treatmentRow.id]: [
        { note: treatmentNote.trim(), time: new Date().toLocaleTimeString() },
        ...(prev[treatmentRow.id] || []),
      ],
    }));
    updatePatient(treatmentRow.id, { status: "Under Treatment" });
    setTreatmentNote("");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Current Patients</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Monitor and manage all currently admitted patients
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
        <select
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="All">All Doctors</option>
          {DOCTORS.map((doctor) => (
            <option key={doctor} value={doctor}>
              {doctor}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">Admitted Patients</h3>
          <span className="text-xs text-gray-400">{filteredPatients.length} patients</span>
        </div>
        <DataTable columns={patientColumns} rows={filteredPatients} onAction={handleAction} />
      </div>

      {viewRow && (
        <ModalShell title="Patient Details" onClose={() => setViewRow(null)}>
          <div className="flex flex-col gap-2 text-sm">
            <DetailRow label="Patient" value={viewRow.patient} />
            <DetailRow label="Ward" value={viewRow.ward} />
            <DetailRow label="Room" value={viewRow.room} />
            <DetailRow label="Bed" value={viewRow.bed} />
            <DetailRow label="Doctor" value={viewRow.doctor} />
            <DetailRow label="Days Admitted" value={viewRow.daysAdmitted} />
            <DetailRow label="Condition" value={viewRow.condition} />
            <DetailRow label="Status" value={viewRow.status} />
          </div>
        </ModalShell>
      )}

      {transferRow && (
        <ModalShell title={`Transfer ${transferRow.patient}`} onClose={() => setTransferRow(null)}>
          <p className="text-sm text-gray-500 mb-3">
            Currently in <span className="font-medium text-gray-800">{transferRow.ward}</span>,
            room {transferRow.room}.
          </p>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Transfer To
          </label>
          <select
            value={transferWard}
            onChange={(e) => setTransferWard(e.target.value)}
            className="w-full mt-1.5 mb-4 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {WARDS.filter((ward) => ward !== transferRow.ward).map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>
          <button
            onClick={confirmTransfer}
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Confirm Transfer
          </button>
        </ModalShell>
      )}

      {treatmentRow && (
        <ModalShell title={`Treatment Log — ${treatmentRow.patient}`} onClose={() => setTreatmentRow(null)}>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={treatmentNote}
              onChange={(e) => setTreatmentNote(e.target.value)}
              placeholder="Add a treatment note..."
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              onClick={addTreatmentNote}
              className="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {(treatmentLogs[treatmentRow.id] || []).length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No treatment notes yet</p>
            )}
            {(treatmentLogs[treatmentRow.id] || []).map((entry, index) => (
              <div key={index} className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-sm text-gray-700">{entry.note}</p>
                <p className="text-xs text-gray-400 mt-0.5">{entry.time}</p>
              </div>
            ))}
          </div>
        </ModalShell>
      )}
    </div>
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">
            ✕
          </button>
        </div>
        {children}
        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition"
        >
          Close
        </button>
      </div>
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