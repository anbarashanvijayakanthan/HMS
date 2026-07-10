import StatsCard from "../../components/common/StatsCard";

const reportStats = [
  { icon: "📥", label: "Admissions (MTD)", value: "184", sub: "+11% vs last month", trend: "up", subColor: "text-green-500" },
  { icon: "📄", label: "Discharges (MTD)", value: "161", sub: "+6% vs last month", trend: "up", subColor: "text-green-500" },
  { icon: "🏥", label: "Occupancy Rate", value: "71%", sub: "-3% vs last month", trend: "down", subColor: "text-orange-500" },
  { icon: "⏱️", label: "Average Stay", value: "4.2 days", sub: "-0.4 days vs last month", trend: "down", subColor: "text-green-500" },
  { icon: "🚨", label: "Emergency Admissions", value: "47", sub: "+9% vs last month", trend: "up", subColor: "text-red-500" },
  { icon: "📊", label: "Ward Utilization", value: "78%", sub: "+2% vs last month", trend: "up", subColor: "text-blue-500" },
];

const monthlySummary = [
  { month: "Feb", admissions: 142, discharges: 138 },
  { month: "Mar", admissions: 156, discharges: 149 },
  { month: "Apr", admissions: 149, discharges: 151 },
  { month: "May", admissions: 168, discharges: 160 },
  { month: "Jun", admissions: 173, discharges: 165 },
  { month: "Jul", admissions: 184, discharges: 161 },
];

const departmentSummary = [
  { ward: "General Ward", admissions: 68, avgStay: "3.4 days", occupancy: 75 },
  { ward: "Private Ward", admissions: 41, avgStay: "4.1 days", occupancy: 60 },
  { ward: "ICU", admissions: 29, avgStay: "6.8 days", occupancy: 85 },
  { ward: "Emergency Ward", admissions: 46, avgStay: "1.9 days", occupancy: 80 },
];

const occupancySummary = [
  { ward: "General Ward", occupied: 45, total: 60, color: "#2563eb" },
  { ward: "Private Ward", occupied: 18, total: 30, color: "#7c3aed" },
  { ward: "ICU", occupied: 17, total: 20, color: "#dc2626" },
  { ward: "Emergency Ward", occupied: 12, total: 15, color: "#ea580c" },
];

const maxMonthlyValue = Math.max(
  ...monthlySummary.map((m) => Math.max(m.admissions, m.discharges))
);

const topWard = departmentSummary.reduce((best, ward) =>
  ward.admissions > best.admissions ? ward : best
);
const highestOccupancy = occupancySummary.reduce((best, ward) =>
  ward.occupied / ward.total > best.occupied / best.total ? ward : best
);
const lowestOccupancy = occupancySummary.reduce((worst, ward) =>
  ward.occupied / ward.total < worst.occupied / worst.total ? ward : worst
);

export default function Reports() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Reports</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Inpatient analytics, occupancy trends, and department performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {reportStats.map((stat) => (
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Summary Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-800">Monthly Summary</h3>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" /> Admissions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-gray-300" /> Discharges
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-3 h-48">
            {monthlySummary.map((entry) => (
              <div key={entry.month} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-end justify-center gap-1 h-40">
                  <div
                    className="w-3 rounded-t-md bg-blue-600"
                    style={{ height: `${(entry.admissions / maxMonthlyValue) * 100}%` }}
                    title={`Admissions: ${entry.admissions}`}
                  />
                  <div
                    className="w-3 rounded-t-md bg-gray-300"
                    style={{ height: `${(entry.discharges / maxMonthlyValue) * 100}%` }}
                    title={`Discharges: ${entry.discharges}`}
                  />
                </div>
                <span className="text-xs text-gray-400">{entry.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Occupancy Summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-base font-semibold text-gray-800 mb-5">Occupancy Summary</h3>
          <div className="flex flex-col gap-4">
            {occupancySummary.map((ward) => {
              const percentage = Math.round((ward.occupied / ward.total) * 100);
              return (
                <div key={ward.ward}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span className="font-medium text-gray-700">{ward.ward}</span>
                    <span className="text-gray-400">
                      {ward.occupied}/{ward.total} beds &middot; {percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%`, backgroundColor: ward.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Department Summary */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Department Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium pr-4">Ward</th>
                <th className="pb-3 font-medium pr-4">Admissions (MTD)</th>
                <th className="pb-3 font-medium pr-4">Avg. Stay</th>
                <th className="pb-3 font-medium pr-4">Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {departmentSummary.map((row) => (
                <tr key={row.ward} className="border-b border-gray-50">
                  <td className="py-3 pr-4 font-medium text-gray-700">{row.ward}</td>
                  <td className="py-3 pr-4 text-gray-600">{row.admissions}</td>
                  <td className="py-3 pr-4 text-gray-600">{row.avgStay}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2 w-40">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${row.occupancy}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-9">{row.occupancy}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trend Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TrendCard
          label="Top Performing Ward"
          value={topWard.ward}
          detail={`${topWard.admissions} admissions this month`}
          color="text-blue-600 bg-blue-50"
          icon="🏆"
        />
        <TrendCard
          label="Highest Occupancy"
          value={highestOccupancy.ward}
          detail={`${Math.round((highestOccupancy.occupied / highestOccupancy.total) * 100)}% occupied`}
          color="text-red-600 bg-red-50"
          icon="🔺"
        />
        <TrendCard
          label="Lowest Occupancy"
          value={lowestOccupancy.ward}
          detail={`${Math.round((lowestOccupancy.occupied / lowestOccupancy.total) * 100)}% occupied`}
          color="text-green-600 bg-green-50"
          icon="🔻"
        />
      </div>
    </div>
  );
}

function TrendCard({ label, value, detail, color, icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-base font-bold text-gray-800 truncate">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{detail}</p>
      </div>
    </div>
  );
}