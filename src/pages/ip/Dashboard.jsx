import { useState, useEffect } from "react";
import StatsCard from "../../components/common/StatsCard";
import DataTable from "../../components/common/DataTable";

const dashboardStats = [
  {
    icon: "🛏️",
    label: "Total Inpatients",
    value: "92",
    sub: "+6 since yesterday",
    trend: "up",
    subColor: "text-green-500",
  },
  {
    icon: "🟢",
    label: "Available Beds",
    value: "33",
    sub: "26% of total capacity",
    trend: "down",
    subColor: "text-orange-500",
  },
  {
    icon: "🏥",
    label: "Occupied Beds",
    value: "92",
    sub: "71% occupancy rate",
    trend: "up",
    subColor: "text-blue-500",
  },
  {
    icon: "📄",
    label: "Pending Discharges",
    value: "4",
    sub: "Awaiting final approval",
    trend: null,
    subColor: "text-orange-500",
  },
  {
    icon: "🚨",
    label: "Emergency Admissions",
    value: "12",
    sub: "+3 in last 24 hrs",
    trend: "up",
    subColor: "text-red-500",
  },
  {
    icon: "❤️",
    label: "ICU Occupancy",
    value: "85%",
    sub: "17 of 20 beds occupied",
    trend: "up",
    subColor: "text-red-500",
  },
];

const recentAdmissions = [
  {
    admissionId: "ADM-2026-1042",
    patient: "Ramesh Kumar",
    age: 58,
    ward: "General Ward",
    doctor: "Dr. Rajesh Menon",
    admissionDate: "10 Jul 2026",
    priority: "Normal",
    status: "Admitted",
  },
  {
    admissionId: "ADM-2026-1043",
    patient: "Sunita Verma",
    age: 34,
    ward: "Private Ward",
    doctor: "Dr. Ananya Sharma",
    admissionDate: "10 Jul 2026",
    priority: "High",
    status: "Stable",
  },
  {
    admissionId: "ADM-2026-1044",
    patient: "Arvind Joshi",
    age: 67,
    ward: "ICU",
    doctor: "Dr. Vikram Nair",
    admissionDate: "10 Jul 2026",
    priority: "Emergency",
    status: "Critical",
  },
  {
    admissionId: "ADM-2026-1045",
    patient: "Meena Pillai",
    age: 45,
    ward: "General Ward",
    doctor: "Dr. Priya Iyer",
    admissionDate: "11 Jul 2026",
    priority: "Normal",
    status: "Observation",
  },
  {
    admissionId: "ADM-2026-1046",
    patient: "Farhan Sheikh",
    age: 29,
    ward: "Emergency Ward",
    doctor: "Dr. Karan Malhotra",
    admissionDate: "11 Jul 2026",
    priority: "Emergency",
    status: "Critical",
  },
  {
    admissionId: "ADM-2026-1047",
    patient: "Lakshmi Narayan",
    age: 71,
    ward: "ICU",
    doctor: "Dr. Vikram Nair",
    admissionDate: "11 Jul 2026",
    priority: "High",
    status: "Observation",
  },
  {
    admissionId: "ADM-2026-1048",
    patient: "Devika Rao",
    age: 52,
    ward: "Private Ward",
    doctor: "Dr. Fatima Sheikh",
    admissionDate: "11 Jul 2026",
    priority: "Normal",
    status: "Stable",
  },
  {
    admissionId: "ADM-2026-1049",
    patient: "Suresh Pillai",
    age: 63,
    ward: "General Ward",
    doctor: "Dr. Arjun Reddy",
    admissionDate: "11 Jul 2026",
    priority: "Normal",
    status: "Pending",
  },
  {
    admissionId: "ADM-2026-1050",
    patient: "Anita Deshmukh",
    age: 39,
    ward: "Emergency Ward",
    doctor: "Dr. Karan Malhotra",
    admissionDate: "11 Jul 2026",
    priority: "Emergency",
    status: "Admitted",
  },
  {
    admissionId: "ADM-2026-1051",
    patient: "Vijay Kulkarni",
    age: 48,
    ward: "General Ward",
    doctor: "Dr. Meera Menon",
    admissionDate: "11 Jul 2026",
    priority: "High",
    status: "Stable",
  },
];

const admissionColumns = [
  { key: "admissionId", label: "Admission ID", type: "token" },
  { key: "patient", label: "Patient", type: "patient" },
  { key: "age", label: "Age" },
  { key: "ward", label: "Ward" },
  { key: "doctor", label: "Doctor" },
  { key: "admissionDate", label: "Admission Date" },
  { key: "priority", label: "Priority", type: "badge" },
  { key: "status", label: "Status", type: "badge" },
];

const wardOccupancy = [
  { id: "general", name: "General Ward", icon: "🛏️", total: 60, occupied: 45 },
  { id: "private", name: "Private Ward", icon: "🚪", total: 30, occupied: 18 },
  { id: "icu", name: "ICU", icon: "❤️", total: 20, occupied: 17 },
  { id: "emergency", name: "Emergency Ward", icon: "🚨", total: 15, occupied: 12 },
];

const initialAlerts = [
  {
    id: "alert-1",
    level: "red",
    title: "ICU Nearing Capacity",
    message: "ICU is at 85% occupancy. Only 3 beds remaining.",
  },
  {
    id: "alert-2",
    level: "orange",
    title: "Pending Discharge Approvals",
    message: "4 patients cleared for discharge are awaiting final sign-off.",
  },
  {
    id: "alert-3",
    level: "red",
    title: "Emergency Patient Waiting",
    message: "1 emergency patient in queue awaiting bed allocation.",
  },
  {
    id: "alert-4",
    level: "yellow",
    title: "Bed Cleaning Required",
    message: "5 beds in General Ward are pending housekeeping clearance.",
  },
  {
    id: "alert-5",
    level: "orange",
    title: "Medication Review Pending",
    message: "3 patients require medication review before evening rounds.",
  },
];

const todayTimeline = [
  {
    time: "09:15",
    title: "Patient Admitted",
    description: "Ramesh Kumar admitted to General Ward under Dr. Menon.",
  },
  {
    time: "10:30",
    title: "Ward Transfer Completed",
    description: "Patient ADM-2026-1044 transferred from Emergency to ICU.",
  },
  {
    time: "11:45",
    title: "Patient Discharged",
    description: "Devika Rao discharged from Private Ward.",
  },
  {
    time: "13:00",
    title: "Emergency Admission",
    description: "Trauma case admitted directly to Emergency Ward.",
  },
  {
    time: "14:20",
    title: "Bed Allocated",
    description: "Bed EW-04 allocated to incoming emergency patient.",
  },
  {
    time: "15:10",
    title: "Observation Started",
    description: "Lakshmi Narayan moved to observation in ICU.",
  },
];

const quickActions = [
  {
    id: "view-admissions",
    label: "View Admissions",
    description: "Review all inpatient admission records",
    icon: "📥",
    message: "Opening Admissions overview…",
  },
  {
    id: "current-patients",
    label: "Current Patients",
    description: "See patients currently admitted",
    icon: "🛏️",
    message: "Loading current patient list…",
  },
  {
    id: "manage-beds",
    label: "Manage Beds",
    description: "Track and allocate hospital beds",
    icon: "🏥",
    message: "Opening bed management panel…",
  },
  {
    id: "pending-discharges",
    label: "Pending Discharges",
    description: "Approve and process discharges",
    icon: "📄",
    message: "Fetching pending discharge requests…",
  },
];

const alertStyles = {
  red: {
    container: "bg-red-50 border-red-100",
    dot: "bg-red-500",
    title: "text-red-700",
    text: "text-red-600/80",
    close: "text-red-400 hover:text-red-600",
  },
  orange: {
    container: "bg-orange-50 border-orange-100",
    dot: "bg-orange-500",
    title: "text-orange-700",
    text: "text-orange-600/80",
    close: "text-orange-400 hover:text-orange-600",
  },
  yellow: {
    container: "bg-yellow-50 border-yellow-100",
    dot: "bg-yellow-500",
    title: "text-yellow-700",
    text: "text-yellow-600/80",
    close: "text-yellow-400 hover:text-yellow-600",
  },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getTodayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Dashboard() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [activeAction, setActiveAction] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    if (!actionMessage) return;
    const timer = setTimeout(() => {
      setActionMessage(null);
      setActiveAction(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [actionMessage]);

  const handleQuickAction = (action) => {
    setActiveAction(action.id);
    setActionMessage(action.message);
  };

  const dismissAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Panel */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-blue-100 text-sm font-medium">{getGreeting()},</p>
            <h1 className="text-2xl font-bold mt-0.5">Welcome back, IP Manager</h1>
            <p className="text-blue-100 text-sm mt-2">
              Hospital occupancy is currently at 71%. Four patients are pending discharge.
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-blue-100 text-xs uppercase tracking-wide">Today</p>
            <p className="text-white font-semibold text-sm mt-0.5">{getTodayLabel()}</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {dashboardStats.map((stat) => (
          <StatsCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            sub={stat.sub}
            trend={stat.trend}
            subColor={stat.subColor}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">Quick Actions</h3>
          {actionMessage && (
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
              {actionMessage}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const isActive = activeAction === action.id;
            return (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className={`text-left rounded-xl p-4 border transition-all duration-150 ${
                  isActive
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                }`}
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <p className="text-sm font-semibold text-gray-800">{action.label}</p>
                <p className="text-xs text-gray-400 mt-1">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Admissions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">Recent Admissions</h3>
          <span className="text-xs text-gray-400">{recentAdmissions.length} records</span>
        </div>
        <DataTable columns={admissionColumns} rows={recentAdmissions} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bed Occupancy */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Bed Occupancy</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wardOccupancy.map((ward) => {
              const percentage = Math.round((ward.occupied / ward.total) * 100);
              const barColor =
                percentage >= 85
                  ? "bg-red-500"
                  : percentage >= 65
                  ? "bg-orange-500"
                  : "bg-blue-500";
              return (
                <div
                  key={ward.id}
                  className="rounded-xl border border-gray-100 p-4 bg-gray-50/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{ward.icon}</span>
                      <p className="text-sm font-semibold text-gray-800">{ward.name}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                    <span>{ward.occupied} occupied</span>
                    <span>{ward.total - ward.occupied} available</span>
                    <span>{ward.total} total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">Critical Alerts</h3>
            <span className="text-xs text-gray-400">{alerts.length} active</span>
          </div>
          <div className="flex flex-col gap-3">
            {alerts.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">
                No active alerts. All clear.
              </p>
            )}
            {alerts.map((alert) => {
              const style = alertStyles[alert.level];
              return (
                <div
                  key={alert.id}
                  className={`relative rounded-lg border p-3 pr-8 ${style.container}`}
                >
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className={`absolute top-2.5 right-2.5 text-xs font-bold ${style.close}`}
                  >
                    ✕
                  </button>
                  <div className="flex items-start gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${style.dot}`} />
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold ${style.title}`}>{alert.title}</p>
                      <p className={`text-xs mt-0.5 ${style.text}`}>{alert.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Activity */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-5">Today's Activity</h3>
        <div className="flex flex-col">
          {todayTimeline.map((event, index) => (
            <div key={event.time + event.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                {index !== todayTimeline.length - 1 && (
                  <div className="w-px flex-1 bg-gray-200 my-1" />
                )}
              </div>
              <div className={`min-w-0 ${index !== todayTimeline.length - 1 ? "pb-5" : ""}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">{event.time}</span>
                  <span className="text-sm font-semibold text-gray-800">{event.title}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}