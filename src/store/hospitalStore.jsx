import { createContext, useContext, useReducer, useEffect } from 'react'
// ─────────────────────────────────────────────────────────────────────────
// SEED DATA
// Merged from every role's mock data — one consistent shape per entity,
// keyed consistently by patientId. `token` is the CURRENT visit token for
// that patient today (tokens are per-visit, patientId is permanent).
// ─────────────────────────────────────────────────────────────────────────
// Doctors — referenced by name elsewhere (prescriptions, lab orders, diagnoses)
// This is the first place they exist as real records instead of plain strings.
const SEED_DOCTORS = [
  { id: "D-001", name: "Dr. Priya Sharma", specialty: "Cardiology", qualification: "MD, DM Cardiology", status: "Active", experience: "18 years", schedule: "Mon–Sat, 9am–1pm" },
  { id: "D-002", name: "Dr. Ravi Kumar", specialty: "General Medicine", qualification: "MD Internal Medicine", status: "Active", experience: "12 years", schedule: "Mon–Fri, 10am–2pm" },
  { id: "D-003", name: "Dr. Arun Nair", specialty: "Orthopedics", qualification: "MS Ortho, DNB", status: "Active", experience: "15 years", schedule: "Tue–Sat, 11am–3pm" },
]

// Staff — nurses, lab techs, pharmacists, receptionists, admin
const SEED_STAFF = [
  { id: "S-101", name: "Sr. Meena", role: "Head Nurse", dept: "General Ward", phone: "+91 90001 21001", status: "Active" },
  { id: "S-102", name: "Sr. Rani", role: "Staff Nurse", dept: "General Ward", phone: "+91 90001 21002", status: "Active" },
  { id: "S-103", name: "Karthik R", role: "Lab Technician", dept: "Laboratory", phone: "+91 90001 21003", status: "Active" },
  { id: "S-104", name: "Divya S", role: "Pharmacist", dept: "Pharmacy", phone: "+91 90001 21004", status: "Active" },
]
const SEED_PATIENTS = [
  {
    id: "P-1001", name: "Arjun Mehta", age: 34, gender: "Male", blood: "O+",
    phone: "+91 98765 43210", email: "arjun.mehta@gmail.com",
    department: "Cardiology", allergies: [], chronic: "None",
    address: "Chennai", height: "178 cm", weight: "75 kg",
  },
  {
    id: "P-1002", name: "Kavitha Rajan", age: 29, gender: "Female", blood: "A+",
    phone: "+91 91234 56789", email: "kavitha.r@gmail.com",
    department: "General", allergies: [], chronic: "None",
    address: "Chennai", height: "160 cm", weight: "58 kg",
  },
  {
    id: "P-1003", name: "Mohammed Farhan", age: 45, gender: "Male", blood: "O+",
    phone: "+91 99887 76655", email: "farhan@gmail.com",
    department: "General", allergies: ["Penicillin"], chronic: "None",
    address: "Chennai", height: "170 cm", weight: "72 kg",
  },
  {
    id: "P-1004", name: "Sneha Patel", age: 31, gender: "Female", blood: "B+",
    phone: "+91 98001 12345", email: "sneha.patel@gmail.com",
    department: "Cardiology", allergies: ["Aspirin"], chronic: "Hypertension",
    address: "Chennai", height: "162 cm", weight: "58 kg",
  },
  {
    id: "P-1005", name: "Rajesh Verma", age: 56, gender: "Male", blood: "A-",
    phone: "+91 97654 32109", email: "rajesh.verma@gmail.com",
    department: "Ortho", allergies: [], chronic: "Hypertension",
    address: "Chennai", height: "172 cm", weight: "80 kg",
  },
  {
    id: "P-1006", name: "Ananya Krishnan", age: 32, gender: "Female", blood: "B+",
    phone: "+91 99887 76655", email: "ananyaKrishnan@gmail.com",
    department: "Cardiology", allergies: ["Penicillin", "Pollen"], chronic: "Hypertension",
    address: "Vellore, Tamil Nadu", height: "175 cm", weight: "72 kg",
  },
  {
    id: "P-1007", name: "Vikram Nair", age: 41, gender: "Male", blood: "O-",
    phone: "+91 90000 11122", email: "vikram.nair@gmail.com",
    department: "Neuro", allergies: [], chronic: "None",
    address: "Chennai", height: "168 cm", weight: "77 kg",
  },
  {
    id: "P-1008", name: "Anita Desai", age: 42, gender: "Female", blood: "AB+",
    phone: "+91 90011 22334", email: "anita.desai@gmail.com",
    department: "Emergency", allergies: [], chronic: "None",
    address: "Chennai", height: "158 cm", weight: "60 kg",
  },
]

// Today's visits — this is the live queue. `status` drives the whole
// cross-role workflow: Waiting → With Nurse → Ready for Doctor → With Doctor → Done
const SEED_QUEUE = [
  { token: "T-001", patientId: "P-1001", department: "Cardiology", checkIn: "08:45 AM", status: "Done", priority: "Normal", complaint: "Routine checkup", lastUpdated: "10:20 AM" },
  { token: "T-007", patientId: "P-1002", department: "General", checkIn: "09:20 AM", status: "With Doctor", priority: "Normal", complaint: "Persistent cough, 3 days", lastUpdated: "11:05 AM" },
  { token: "T-008", patientId: "P-1003", department: "General", checkIn: "09:30 AM", status: "With Nurse", priority: "Critical", complaint: "Fever, weakness", lastUpdated: "11:10 AM" },
  { token: "T-009", patientId: "P-1004", department: "Cardiology", checkIn: "09:45 AM", status: "Ready for Doctor", priority: "Normal", complaint: "Chest pain, palpitations", lastUpdated: "11:08 AM" },
  { token: "T-010", patientId: "P-1005", department: "Ortho", checkIn: "10:00 AM", status: "Waiting", priority: "Urgent", complaint: "Hypertension follow-up", lastUpdated: "10:00 AM" },
  { token: "T-011", patientId: "P-1008", department: "General", checkIn: "10:10 AM", status: "With Nurse", priority: "Normal", complaint: "SpO2 below threshold", lastUpdated: "11:00 AM" },
  { token: "T-012", patientId: "P-1007", department: "Neuro", checkIn: "10:20 AM", status: "Waiting", priority: "Normal", complaint: "Knee pain, post-op review", lastUpdated: "10:20 AM" },
]
const SEED_APPOINTMENTS = [
  { id: "APT-001", patientId: "P-1004", doctor: "Dr. Priya Sharma", date: "19 Jun 2025", time: "10:30 AM", type: "Consultation", status: "Scheduled" },
  { id: "APT-002", patientId: "P-1001", doctor: "Dr. Ravi Kumar", date: "19 Jun 2025", time: "09:00 AM", type: "Follow-up", status: "Completed" },
]
const STATUS_ORDER = ["Waiting", "With Nurse", "Ready for Doctor", "With Doctor", "Done"]

// Vitals keyed by visit token
const SEED_VITALS = {
  "T-009": {
    bpSys: "128", bpDia: "84", temp: "98.8", pulse: "92", spo2: "97",
    respRate: "16", glucose: "105", height: "162", weight: "58",
    painScale: "0", consciousness: "Alert", complaints: "Chest pain follow-up",
    recordedBy: "Sr. Meena", timestamp: "09:45 AM", critical: false,
  },
  "T-008": {
    bpSys: "138", bpDia: "88", temp: "99.1", pulse: "78", spo2: "97",
    respRate: "18", glucose: "108", height: "170", weight: "72",
    painScale: "2", consciousness: "Alert", complaints: "Mild headache",
    recordedBy: "Sr. Meena", timestamp: "09:15 AM", critical: false,
  },
  "T-011": {
    bpSys: "150", bpDia: "95", temp: "98.6", pulse: "88", spo2: "88",
    respRate: "22", glucose: "—", height: "158", weight: "60",
    painScale: "0", consciousness: "Alert", complaints: "SpO2 below threshold",
    recordedBy: "Sr. Meena", timestamp: "09:50 AM", critical: true,
  },
}

// Diagnoses keyed by patientId (persists across visits)
const SEED_DIAGNOSES = {
  "P-1004": [
    { code: "I10", name: "Essential Hypertension", nature: "Confirmed" },
    { code: "I49.9", name: "Cardiac Arrhythmia, unspecified", nature: "Provisional" },
  ],
  "P-1005": [
    { code: "I10", name: "Essential Hypertension", nature: "Confirmed" },
  ],
}

// Prescriptions — the hop from Doctor → Pharmacy
const SEED_PRESCRIPTIONS = [
  {
    rxId: "RX-8821", patientId: "P-1004", token: "T-009", doctor: "Dr. Priya Sharma",
    date: "19 Jun 2025, 11:30 AM", status: "Pending", urgency: "Critical",
    medicines: [
      { name: "Metoprolol Succinate 25mg", dose: "1 tablet", frequency: "Once daily", duration: "30 days", instructions: "After breakfast", batch: "MT-2025-04", price: 255 },
      { name: "Atorvastatin 10mg", dose: "1 tablet", frequency: "At bedtime", duration: "30 days", instructions: "Monitor LFT", batch: "AT-2025-05", price: 285 },
    ],
  },
  {
    rxId: "RX-8820", patientId: "P-1001", token: "T-001", doctor: "Dr. Priya Sharma",
    date: "19 Jun 2025, 10:45 AM", status: "Processing", urgency: "Medium",
    medicines: [
      { name: "Aspirin 75mg", dose: "1 tablet", frequency: "Once daily", duration: "30 days", instructions: "", batch: "AS-2025-01", price: 54 },
    ],
  },
]


// Vehicles — ambulances, staff vans, doctor cars
const SEED_VEHICLES = [
  { id: "V-001", reg: "KL 07 AB 1234", type: "Ambulance", status: "Available", driver: "Ravi Kumar", insurance: "31 Aug 2026", permitExpiry: "30 Jun 2026", nextService: "01 Aug 2026" },
  { id: "V-002", reg: "KL 07 CD 9012", type: "Staff Van", status: "Available", driver: "Murugan P", insurance: "22 Jul 2026", permitExpiry: "20 Jun 2026", nextService: "05 Jul 2026" },
  { id: "V-003", reg: "KL 07 EF 3456", type: "Doctor Car", status: "Maintenance", driver: "Joseph M", insurance: "10 Feb 2027", permitExpiry: "28 Feb 2027", nextService: "16 Sep 2026" },
]
// Lab orders — the hop from Doctor → Lab
const SEED_LAB_ORDERS = [
  {
    orderId: "LO-5501", patientId: "P-1004", token: "T-009", doctor: "Dr. Priya Sharma",
    tests: [
      { name: "Complete Blood Count (CBC)", priority: "Routine" },
      { name: "Lipid Profile", priority: "Urgent" },
      { name: "Troponin I (hs)", priority: "Routine" },
      { name: "Thyroid Profile (T3/T4/TSH)", priority: "Routine" },
    ],
    priority: "Urgent", ordered: "11:35 AM", status: "Pending", fasting: "Yes — 12 hours",
  },
  {
    orderId: "LO-5495", patientId: "P-1008", token: "T-011", doctor: "Dr. Ravi Kumar",
    tests: [
      { name: "D-Dimer", priority: "STAT" },
      { name: "PT/INR", priority: "STAT" },
      { name: "APTT", priority: "STAT" },
    ],
    priority: "STAT", ordered: "09:00 AM", status: "Pending", fasting: "No",
  },
]

// Medicine inventory — shared between Doctor's prescription search,
// Pharmacy's inventory view, and dispensing (which decrements stock)
const SEED_MEDICINES = [
  { name: "Metoprolol Succinate 25mg", generic: "Metoprolol", category: "Tablet", stock: 12, batch: "MT-2025-04", expiry: "Dec 2026", price: 85, reorderLevel: 50 },
  { name: "Amlodipine 5mg", generic: "Amlodipine", category: "Tablet", stock: 8, batch: "AM-2025-03", expiry: "Oct 2025", price: 42, reorderLevel: 100 },
  { name: "Atorvastatin 10mg", generic: "Atorvastatin", category: "Tablet", stock: 240, batch: "AT-2025-05", expiry: "Mar 2027", price: 95, reorderLevel: 50 },
  { name: "Azithromycin 500mg", generic: "Azithromycin", category: "Tablet", stock: 180, batch: "AZ-2025-02", expiry: "Aug 2026", price: 110, reorderLevel: 30 },
  { name: "Paracetamol 500mg", generic: "Paracetamol", category: "Tablet", stock: 45, batch: "PC-2025-06", expiry: "Sep 2025", price: 18, reorderLevel: 200 },
  { name: "Ondansetron 4mg", generic: "Ondansetron", category: "Tablet", stock: 0, batch: "—", expiry: "—", price: 72, reorderLevel: 50 },
  { name: "Aspirin 75mg", generic: "Aspirin", category: "Tablet", stock: 20, batch: "AS-2025-01", expiry: "Jan 2027", price: 54, reorderLevel: 100 },
]

// Bills — shared between Receptionist billing and Pharmacy billing
const SEED_BILLS = [
  { billId: "PB-4501", patientId: "P-1004", items: 3, gross: 665, discount: 0, net: 665, mode: "Cash", status: "Paid" },
  { billId: "PB-4500", patientId: "P-1001", items: 2, gross: 380, discount: 38, net: 342, mode: "Card", status: "Paid" },
  { billId: "PB-4499", patientId: "P-1003", items: 4, gross: 1240, discount: 0, net: 1240, mode: "Insurance", status: "Partial" },
]

// Lab results — keyed by orderId, written once ResultEntry saves
const SEED_LAB_RESULTS = {}

// Radiology orders — the hop from Doctor → Radiology
const SEED_RADIOLOGY_ORDERS = []

// Follow-ups — scheduled by Doctor, tracked by Admin
const SEED_FOLLOWUPS = []

function computeStatus(status) {
  return { hasNext: STATUS_ORDER.indexOf(status) < STATUS_ORDER.length - 1 }
}

const initialState = {
  patients: SEED_PATIENTS,
  queue: SEED_QUEUE,
  vitals: SEED_VITALS,
  diagnoses: SEED_DIAGNOSES,
  prescriptions: SEED_PRESCRIPTIONS,
  appointments: SEED_APPOINTMENTS,
  labOrders: SEED_LAB_ORDERS,
  doctors: SEED_DOCTORS,
  staff: SEED_STAFF,
  vehicles: SEED_VEHICLES,          // ADD THIS
  labResults: SEED_LAB_RESULTS,
  radiologyOrders: SEED_RADIOLOGY_ORDERS,
  followUps: SEED_FOLLOWUPS,
  medicines: SEED_MEDICINES,
  bills: SEED_BILLS,
}
// ─────────────────────────────────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────────────────────────────────

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function hospitalReducer(state, action) {
  switch (action.type) {

    case 'ADVANCE_VISIT_STATUS': {
      const { token } = action.payload
      return {
        ...state,
        queue: state.queue.map(v => {
          if (v.token !== token) return v
          const idx = STATUS_ORDER.indexOf(v.status)
          if (idx >= STATUS_ORDER.length - 1) return v
          return { ...v, status: STATUS_ORDER[idx + 1], lastUpdated: nowTime() }
        }),
      }
    }

    case 'SET_VISIT_STATUS': {
      const { token, status } = action.payload
      return {
        ...state,
        queue: state.queue.map(v =>
          v.token === token ? { ...v, status, lastUpdated: nowTime() } : v
        ),
      }
    }

    case 'ADD_VITALS': {
      const { token, vitals } = action.payload
      return {
        ...state,
        vitals: { ...state.vitals, [token]: { ...vitals, timestamp: nowTime() } },
      }
    }

    case 'ADD_DIAGNOSIS': {
      const { patientId, diagnosis } = action.payload
      const existing = state.diagnoses[patientId] || []
      return {
        ...state,
        diagnoses: { ...state.diagnoses, [patientId]: [...existing, diagnosis] },
      }
    }

    case 'CREATE_PRESCRIPTION': {
      return { ...state, prescriptions: [action.payload, ...state.prescriptions] }
    }

    case 'UPDATE_PRESCRIPTION_STATUS': {
      const { rxId, status } = action.payload
      return {
        ...state,
        prescriptions: state.prescriptions.map(rx =>
          rx.rxId === rxId ? { ...rx, status } : rx
        ),
      }
    }

    case 'ADD_PATIENT': {
      return { ...state, patients: [action.payload, ...state.patients] }
    }

    case 'SAVE_LAB_RESULT': {
      const { orderId, result } = action.payload
      return {
        ...state,
        labResults: { ...state.labResults, [orderId]: result },
        // Saving a result completes the order
        labOrders: state.labOrders.map(o =>
          o.orderId === orderId ? { ...o, status: "Completed" } : o
        ),
      }
    }

    case 'UPDATE_REPORT_DELIVERY': {
      const { orderId, delivery } = action.payload
      return {
        ...state,
        labResults: {
          ...state.labResults,
          [orderId]: { ...state.labResults[orderId], delivery },
        },
      }
    }
    case 'ADD_VEHICLE': {
      return { ...state, vehicles: [action.payload, ...state.vehicles] }
    }

    case 'UPDATE_VEHICLE_STATUS': {
      const { id, status } = action.payload
      return {
        ...state,
        vehicles: state.vehicles.map(v => v.id === id ? { ...v, status } : v),
      }
    }
    case 'CREATE_RADIOLOGY_ORDER': {
      return { ...state, radiologyOrders: [action.payload, ...state.radiologyOrders] }
    }

    case 'UPDATE_RADIOLOGY_STATUS': {
      const { id, status } = action.payload
      return {
        ...state,
        radiologyOrders: state.radiologyOrders.map(r =>
          r.id === id ? { ...r, status } : r
        ),
      }
    }

    case 'CREATE_FOLLOWUP': {
      return { ...state, followUps: [action.payload, ...state.followUps] }
    }
    case 'CREATE_APPOINTMENT': {
      return { ...state, appointments: [action.payload, ...state.appointments] }
    }
    case 'UPDATE_APPOINTMENT_STATUS': {
      const { id, status } = action.payload
      return {
        ...state,
        appointments: state.appointments.map(a => a.id === id ? { ...a, status } : a),
      }
    }

    case 'UPDATE_FOLLOWUP_STATUS': {
      const { id, status } = action.payload
      return {
        ...state,
        followUps: state.followUps.map(f =>
          f.id === id ? { ...f, status } : f
        ),
      }
    }
    case 'CREATE_LAB_ORDER': {
      return { ...state, labOrders: [action.payload, ...state.labOrders] }
    }

    case 'UPDATE_LAB_ORDER_STATUS': {
      const { orderId, status } = action.payload
      return {
        ...state,
        labOrders: state.labOrders.map(o =>
          o.orderId === orderId ? { ...o, status } : o
        ),
      }
    }

    case 'DECREMENT_STOCK': {
      const { name, qty } = action.payload
      return {
        ...state,
        medicines: state.medicines.map(m =>
          m.name === name ? { ...m, stock: Math.max(0, m.stock - qty) } : m
        ),
      }
    }
    case 'ADD_MEDICINE': {
      return { ...state, medicines: [action.payload, ...state.medicines] }
    }

    case 'ADD_BILL': {
      return { ...state, bills: [action.payload, ...state.bills] }
    }
    case 'ADD_DOCTOR': {
      return { ...state, doctors: [action.payload, ...state.doctors] }
    }

    case 'ADD_STAFF': {
      return { ...state, staff: [action.payload, ...state.staff] }
    }

    case 'UPDATE_STAFF_STATUS': {
      const { id, status } = action.payload
      return {
        ...state,
        staff: state.staff.map(s => s.id === id ? { ...s, status } : s),
      }
    }
    default:
      return state
  }
}

// ─────────────────────────────────────────────────────────────────────────
// CONTEXT + PROVIDER
// ─────────────────────────────────────────────────────────────────────────

const HospitalContext = createContext(null)
const STORAGE_KEY = 'hms_hospital_state'

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.error('Failed to load saved state, using seed data', e)
  }
  return initialState
}

export function HospitalProvider({ children }) {
  const [state, dispatch] = useReducer(hospitalReducer, undefined, loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY)
    window.location.reload()
  }

  return (
    <HospitalContext.Provider value={{ state, dispatch, resetDemoData }}>
      {children}
    </HospitalContext.Provider>
  )
}

function useHospital() {
  const ctx = useContext(HospitalContext)
  if (!ctx) throw new Error('useHospital must be used within HospitalProvider')
  return ctx
}


// ─────────────────────────────────────────────────────────────────────────
// SELECTOR HOOKS — pages import these instead of hardcoding mock arrays
// ─────────────────────────────────────────────────────────────────────────

export { STATUS_ORDER }

// All patients (master list)
export function usePatients() {
  const { state } = useHospital()
  return state.patients
}

export function usePatient(patientId) {
  const { state } = useHospital()
  return state.patients.find(p => p.id === patientId) || null
}
export function useAddPatient() {
  const { dispatch } = useHospital()
  return (patient) => dispatch({ type: 'ADD_PATIENT', payload: patient })
}
// Today's queue, joined with patient info for convenience
export function useQueue() {
  const { state, dispatch } = useHospital()
  const queue = state.queue.map(v => ({
    ...v,
    patient: state.patients.find(p => p.id === v.patientId) || null,
  }))

  const advanceStatus = (token) => dispatch({ type: 'ADVANCE_VISIT_STATUS', payload: { token } })
  const setStatus = (token, status) => dispatch({ type: 'SET_VISIT_STATUS', payload: { token, status } })

  return { queue, advanceStatus, setStatus }
}

// Look up one visit (+patient) by token — used by Nurse/Doctor detail pages
export function useVisit(token) {
  const { state } = useHospital()
  const visit = state.queue.find(v => v.token === token) || null
  const patient = visit ? state.patients.find(p => p.id === visit.patientId) : null
  return { visit, patient }
}

export function useVitals(token) {
  const { state, dispatch } = useHospital()
  const vitals = state.vitals[token] || null
  const saveVitals = (data) => dispatch({ type: 'ADD_VITALS', payload: { token, vitals: data } })
  return { vitals, saveVitals }
}

export function useAllVitals() {
  const { state } = useHospital()
  return state.vitals
}

export function useDiagnoses(patientId) {
  const { state, dispatch } = useHospital()
  const diagnoses = state.diagnoses[patientId] || []
  const addDiagnosis = (diagnosis) => dispatch({ type: 'ADD_DIAGNOSIS', payload: { patientId, diagnosis } })
  return { diagnoses, addDiagnosis }
}

export function usePrescriptions() {
  const { state, dispatch } = useHospital()
  const createPrescription = (rx) => dispatch({ type: 'CREATE_PRESCRIPTION', payload: rx })
  const updateStatus = (rxId, status) => dispatch({ type: 'UPDATE_PRESCRIPTION_STATUS', payload: { rxId, status } })
  return { prescriptions: state.prescriptions, createPrescription, updateStatus }
}

export function useLabOrders() {
  const { state, dispatch } = useHospital()
  const createLabOrder = (order) => dispatch({ type: 'CREATE_LAB_ORDER', payload: order })
  const updateStatus = (orderId, status) => dispatch({ type: 'UPDATE_LAB_ORDER_STATUS', payload: { orderId, status } })
  return { labOrders: state.labOrders, createLabOrder, updateStatus }
}

export function useMedicines() {
  const { state, dispatch } = useHospital()
  const decrementStock = (name, qty) => dispatch({ type: 'DECREMENT_STOCK', payload: { name, qty } })
  const addMedicine = (medicine) => dispatch({ type: 'ADD_MEDICINE', payload: medicine })
  return { medicines: state.medicines, decrementStock, addMedicine }
}
export function useBills() {
  const { state, dispatch } = useHospital()
  const addBill = (bill) => dispatch({ type: 'ADD_BILL', payload: bill })
  return { bills: state.bills, addBill }
}

export function useAppointments() {
  const { state, dispatch } = useHospital()
  const createAppointment = (appt) => dispatch({ type: 'CREATE_APPOINTMENT', payload: appt })
  const updateStatus = (id, status) => dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', payload: { id, status } })
  return { appointments: state.appointments, createAppointment, updateStatus }
}

export function useLabResults() {
  const { state, dispatch } = useHospital()
  const saveResult = (orderId, result) =>
    dispatch({ type: 'SAVE_LAB_RESULT', payload: { orderId, result } })
  const updateDelivery = (orderId, delivery) =>
    dispatch({ type: 'UPDATE_REPORT_DELIVERY', payload: { orderId, delivery } })
  return { labResults: state.labResults, saveResult, updateDelivery }
}

export function useRadiologyOrders() {
  const { state, dispatch } = useHospital()
  const createRadiologyOrder = (order) =>
    dispatch({ type: 'CREATE_RADIOLOGY_ORDER', payload: order })
  const updateStatus = (id, status) =>
    dispatch({ type: 'UPDATE_RADIOLOGY_STATUS', payload: { id, status } })
  return { radiologyOrders: state.radiologyOrders, createRadiologyOrder, updateStatus }
}

export function useFollowUps() {
  const { state, dispatch } = useHospital()
  const createFollowUp = (followUp) =>
    dispatch({ type: 'CREATE_FOLLOWUP', payload: followUp })
  const updateStatus = (id, status) =>
    dispatch({ type: 'UPDATE_FOLLOWUP_STATUS', payload: { id, status } })
  return { followUps: state.followUps, createFollowUp, updateStatus }
}

export function useResetDemoData() {
  const { resetDemoData } = useHospital()
  return resetDemoData
}

export function useDoctors() {
  const { state, dispatch } = useHospital()
  const addDoctor = (doctor) => dispatch({ type: 'ADD_DOCTOR', payload: doctor })
  return { doctors: state.doctors, addDoctor }
}

export function useStaff() {
  const { state, dispatch } = useHospital()
  const addStaff = (member) => dispatch({ type: 'ADD_STAFF', payload: member })
  const updateStatus = (id, status) => dispatch({ type: 'UPDATE_STAFF_STATUS', payload: { id, status } })
  return { staff: state.staff, addStaff, updateStatus }
}

export function useVehicles() {
  const { state, dispatch } = useHospital()
  const addVehicle = (vehicle) => dispatch({ type: 'ADD_VEHICLE', payload: vehicle })
  const updateStatus = (id, status) => dispatch({ type: 'UPDATE_VEHICLE_STATUS', payload: { id, status } })
  return { vehicles: state.vehicles, addVehicle, updateStatus }
}