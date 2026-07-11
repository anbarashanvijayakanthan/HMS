import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import Dashboard from "./Dashboard";
import Admissions from "./Admissions";
import CurrentPatients from "./CurrentPatients";
import BedManagement from "./BedManagement";
import Discharge from "./Discharge";
import Reports from "./Reports";

const SIDEBAR_LINKS = [
  "Dashboard",
  "Admissions",
  "Current Patients",
  "Bed Management",
  "Discharge",
  "Reports",
];

const PAGE_META = {
  Dashboard: {
    title: "Dashboard",
    subtitle: "Overview of inpatient activities",
  },
  Admissions: {
    title: "Admissions",
    subtitle: "Manage new patient admissions",
  },
  "Current Patients": {
    title: "Current Patients",
    subtitle: "Track and manage admitted patients",
  },
  "Bed Management": {
    title: "Bed Management",
    subtitle: "Monitor hospital bed occupancy",
  },
  Discharge: {
    title: "Discharge",
    subtitle: "Process and review patient discharges",
  },
  Reports: {
    title: "Reports",
    subtitle: "Generate and review inpatient reports",
  },
};

export default function IPManager() {
  const [activeLink, setActiveLink] = useState("Dashboard");

  const handleQuickActionSelect = (actionId) => {
    const actionToPage = {
      "view-admissions": "Admissions",
      "current-patients": "Current Patients",
      "manage-beds": "Bed Management",
      "pending-discharges": "Discharge",
    };

    if (actionToPage[actionId]) {
      setActiveLink(actionToPage[actionId]);
    }
  };

  const pageComponents = {
    Dashboard: <Dashboard onQuickActionSelect={handleQuickActionSelect} />,
    Admissions: <Admissions />,
    "Current Patients": <CurrentPatients />,
    "Bed Management": <BedManagement />,
    Discharge: <Discharge />,
    Reports: <Reports />,
  };

  const { title, subtitle } = PAGE_META[activeLink];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar
        links={SIDEBAR_LINKS}
        activeLink={activeLink}
        onLinkClick={setActiveLink}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <Header title={title} subtitle={subtitle} />

        <main className="flex-1 overflow-y-auto p-6">
          {pageComponents[activeLink]}
        </main>
      </div>
    </div>
  );
}