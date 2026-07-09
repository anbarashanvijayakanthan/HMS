import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/common/Sidebar'
import StatsCard from '../../components/common/StatsCard'
import StatusBadge from '../../components/common/StatusBadge'
import { useNavigate } from 'react-router-dom'
import { useQueue, STATUS_ORDER } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Patient Management",
  "Patient Registration",
  "Appointment Management",
  "Queue Management",
  "Billing Collection",
  "Follow-up Management",
]

function QueueManagement() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Queue Management")

  const { queue, setStatus } = useQueue()

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")              navigate('/receptionist')
    if (link === "Patient Management")     navigate('/receptionist/patients')
    if (link === "Patient Registration")   navigate('/receptionist/registration')
    if (link === "Appointment Management") navigate('/receptionist/appointments')
    if (link === "Billing Collection")     navigate('/receptionist/billing')
    if (link === "Follow-up Management")   navigate('/receptionist/followup')
    if (link === "Queue Management")       navigate('/receptionist/queue')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Queue Management</h2>
          <p className="text-sm text-gray-400">Today's full patient queue, front-desk view</p>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {STATUS_ORDER.map(status => (
            <StatsCard
              key={status}
              icon="🔢"
              label={status}
              value={queue.filter(v => v.status === status).length}
            />
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Token</th>
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Check-in</th>
                <th className="pb-3 font-medium">Priority</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Update</th>
              </tr>
            </thead>
            <tbody>
              {queue.map(v => (
                <tr key={v.token} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 font-mono text-xs text-gray-500 font-semibold">{v.token}</td>
                  <td className="py-3 font-medium text-gray-800">{v.patient?.name}</td>
                  <td className="py-3 text-gray-500">{v.department}</td>
                  <td className="py-3 text-gray-500">{v.checkIn}</td>
                  <td className="py-3"><StatusBadge status={v.priority} /></td>
                  <td className="py-3"><StatusBadge status={v.status} /></td>
                  <td className="py-3">
                    <select
                      value={v.status}
                      onChange={e => setStatus(v.token, e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {STATUS_ORDER.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default QueueManagement