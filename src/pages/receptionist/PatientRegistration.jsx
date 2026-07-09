import { useState } from 'react'
import Sidebar from '../../components/common/Sidebar'
import { useNavigate } from 'react-router-dom'
import { useAddPatient } from '../../store/hospitalStore'

const NAV_LINKS = [
  "Dashboard",
  "Patient Management",
  "Patient Registration",
  "Appointment Management",
  "Queue Management",
  "Billing Collection",
  "Follow-up Management",
]

const DEPARTMENTS = ["Cardiology", "General", "Ortho", "Neuro", "Dermatology", "Gynecology", "Pediatrics", "ENT"]
const PATIENT_TYPES = ["OPD", "IPD", "Emergency", "Follow-up"]
const BLOOD_GROUPS  = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const GENDERS       = ["Male", "Female", "Other"]
const MARITAL       = ["Single", "Married", "Divorced", "Widowed"]

function PatientRegistration() {
  const navigate = useNavigate()
  const [activeLink, setActiveLink] = useState("Patient Registration")

  // Form state
  const [form, setForm] = useState({
    firstName: '', lastName: '', dob: '', gender: '',
    bloodGroup: '', maritalStatus: '', nationality: '', aadhar: '',
    mobile: '', altPhone: '', email: '', state: '', address: '',
    emergencyName: '', relationship: '', emergencyPhone: '', emergencyEmail: '',
    insuranceProvider: '', policyNumber: '', validFrom: '', validUntil: '',
    coverageAmount: '', insuranceType: '',
    department: '', assignedDoctor: '', patientType: '', chiefComplaint: '',
  })
  const [allergies, setAllergies]   = useState(['Penicillin'])
  const [allergyInput, setAllergyInput] = useState('')
  const [photo, setPhoto]           = useState(null)
  const [errors, setErrors]         = useState({})
const addPatient = useAddPatient()
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const addAllergy = () => {
    const val = allergyInput.trim()
    if (val && !allergies.includes(val)) {
      setAllergies(prev => [...prev, val])
      setAllergyInput('')
    }
  }

  const removeAllergy = (a) => setAllergies(prev => prev.filter(x => x !== a))

  const validate = () => {
    const e = {}
    if (!form.firstName)       e.firstName = 'Required'
    if (!form.lastName)        e.lastName  = 'Required'
    if (!form.dob)             e.dob       = 'Required'
    if (!form.gender)          e.gender    = 'Required'
    if (!form.mobile)          e.mobile    = 'Required'
    if (!form.emergencyName)   e.emergencyName  = 'Required'
    if (!form.relationship)    e.relationship   = 'Required'
    if (!form.emergencyPhone)  e.emergencyPhone = 'Required'
    if (!form.department)      e.department     = 'Required'
    if (!form.patientType)     e.patientType    = 'Required'
    return e
  }

  const handleRegister = () => {
  const e = validate()
  if (Object.keys(e).length > 0) { setErrors(e); return }

  const age = form.dob
    ? Math.floor((Date.now() - new Date(form.dob)) / (365.25 * 24 * 60 * 60 * 1000))
    : 0

  const newId = `P-${1000 + Math.floor(Math.random() * 9000)}`

  addPatient({
    id: newId,
    name: `${form.firstName} ${form.lastName}`,
    age,
    gender: form.gender,
    blood: form.bloodGroup || "—",
    phone: form.mobile,
    email: form.email || "—",
    department: form.department,
    allergies: allergies,
    chronic: "None",
    address: form.address || "—",
    height: "—",
    weight: "—",
  })

  alert(`Patient ${form.firstName} ${form.lastName} registered successfully! ID: ${newId}`)
  navigate('/receptionist/patients')
}

  const handleSaveDraft = () => {
    alert('Saved as draft!')
  }

  const handleNavClick = (link) => {
    setActiveLink(link)
    if (link === "Dashboard")           navigate('/receptionist')
    if (link === "Patient Management")  navigate('/receptionist/patients')
  }

  // Shared input class
  const inp = (field) =>
    `w-full border ${errors[field] ? 'border-red-400' : 'border-gray-200'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar links={NAV_LINKS} activeLink={activeLink} onLinkClick={handleNavClick} />

      <main className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Patient Registration</h2>
            <p className="text-sm text-gray-400">Register a new patient into the system</p>
          </div>
          <button
            onClick={() => navigate('/receptionist')}
            className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            ✕ Cancel
          </button>
        </div>

        <div className="flex gap-5 items-start">

          {/* LEFT: Main Form */}
          <div className="flex-1 flex flex-col gap-5">

            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span>👤</span> Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input value={form.firstName} onChange={e => handleChange('firstName', e.target.value)}
                    placeholder="Enter first name" className={inp('firstName')} />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input value={form.lastName} onChange={e => handleChange('lastName', e.target.value)}
                    placeholder="Enter last name" className={inp('lastName')} />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input type="date" value={form.dob} onChange={e => handleChange('dob', e.target.value)}
                    className={inp('dob')} />
                  {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select value={form.gender} onChange={e => handleChange('gender', e.target.value)}
                    className={inp('gender')}>
                    <option value="">Select gender</option>
                    {GENDERS.map(g => <option key={g}>{g}</option>)}
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Blood Group
                  </label>
                  <select value={form.bloodGroup} onChange={e => handleChange('bloodGroup', e.target.value)}
                    className={inp('bloodGroup')}>
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Marital Status
                  </label>
                  <select value={form.maritalStatus} onChange={e => handleChange('maritalStatus', e.target.value)}
                    className={inp('maritalStatus')}>
                    <option value="">Select</option>
                    {MARITAL.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Nationality
                  </label>
                  <input value={form.nationality} onChange={e => handleChange('nationality', e.target.value)}
                    placeholder="e.g. Indian" className={inp('nationality')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Aadhaar / ID Number
                  </label>
                  <input value={form.aadhar} onChange={e => handleChange('aadhar', e.target.value)}
                    placeholder="XXXX-XXXX-XXXX" className={inp('aadhar')} />
                </div>

              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span>📞</span> Contact Details
              </h3>
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input value={form.mobile} onChange={e => handleChange('mobile', e.target.value)}
                    placeholder="+91 XXXXX XXXXX" className={inp('mobile')} />
                  {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Alternate Phone
                  </label>
                  <input value={form.altPhone} onChange={e => handleChange('altPhone', e.target.value)}
                    placeholder="+91 XXXXX XXXXX" className={inp('altPhone')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)}
                    placeholder="patient@email.com" className={inp('email')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    State
                  </label>
                  <input value={form.state} onChange={e => handleChange('state', e.target.value)}
                    className={inp('state')} />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Address
                  </label>
                  <textarea rows={2} value={form.address} onChange={e => handleChange('address', e.target.value)}
                    placeholder="House No., Street, Area, City, PIN Code"
                    className={`${inp('address')} resize-none`} />
                </div>

              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span>🚨</span> Emergency Contact
              </h3>
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input value={form.emergencyName} onChange={e => handleChange('emergencyName', e.target.value)}
                    placeholder="Full name" className={inp('emergencyName')} />
                  {errors.emergencyName && <p className="text-xs text-red-500 mt-1">{errors.emergencyName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <input value={form.relationship} onChange={e => handleChange('relationship', e.target.value)}
                    placeholder="e.g. Spouse, Parent" className={inp('relationship')} />
                  {errors.relationship && <p className="text-xs text-red-500 mt-1">{errors.relationship}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input value={form.emergencyPhone} onChange={e => handleChange('emergencyPhone', e.target.value)}
                    placeholder="+91 XXXXX XXXXX" className={inp('emergencyPhone')} />
                  {errors.emergencyPhone && <p className="text-xs text-red-500 mt-1">{errors.emergencyPhone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Contact Email
                  </label>
                  <input type="email" value={form.emergencyEmail} onChange={e => handleChange('emergencyEmail', e.target.value)}
                    placeholder="contact@email.com" className={inp('emergencyEmail')} />
                </div>

              </div>
            </div>

            {/* Insurance Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span>📄</span> Insurance Information
              </h3>
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Insurance Provider
                  </label>
                  <input value={form.insuranceProvider} onChange={e => handleChange('insuranceProvider', e.target.value)}
                    className={inp('insuranceProvider')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Policy Number
                  </label>
                  <input value={form.policyNumber} onChange={e => handleChange('policyNumber', e.target.value)}
                    placeholder="Enter policy number" className={inp('policyNumber')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Valid From
                  </label>
                  <input type="date" value={form.validFrom} onChange={e => handleChange('validFrom', e.target.value)}
                    className={inp('validFrom')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Valid Until
                  </label>
                  <input type="date" value={form.validUntil} onChange={e => handleChange('validUntil', e.target.value)}
                    className={inp('validUntil')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Coverage Amount (₹)
                  </label>
                  <input value={form.coverageAmount} onChange={e => handleChange('coverageAmount', e.target.value)}
                    placeholder="e.g. 500000" className={inp('coverageAmount')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Insurance Type
                  </label>
                  <input value={form.insuranceType} onChange={e => handleChange('insuranceType', e.target.value)}
                    className={inp('insuranceType')} />
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT: Photo + Medical Info + Actions */}
          <div className="w-64 shrink-0 flex flex-col gap-5">

            {/* Patient Photo */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-700 mb-4">Patient Photo</h3>
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-3xl overflow-hidden">
                  {photo
                    ? <img src={URL.createObjectURL(photo)} alt="preview" className="w-full h-full object-cover rounded-xl" />
                    : '👤'
                  }
                </div>
                <label className="cursor-pointer flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 font-medium">
                  + Upload Photo
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files[0] && setPhoto(e.target.files[0])} />
                </label>
                <p className="text-xs text-gray-400">JPG or PNG, max 2 MB</p>
              </div>
            </div>

            {/* Initial Medical Info */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-700 mb-4">Initial Medical Info</h3>
              <div className="flex flex-col gap-4">

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select value={form.department} onChange={e => handleChange('department', e.target.value)}
                    className={inp('department')}>
                    <option value="">Select</option>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                  {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Assigned Doctor
                  </label>
                  <input value={form.assignedDoctor} onChange={e => handleChange('assignedDoctor', e.target.value)}
                    className={inp('assignedDoctor')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Patient Type <span className="text-red-500">*</span>
                  </label>
                  <select value={form.patientType} onChange={e => handleChange('patientType', e.target.value)}
                    className={inp('patientType')}>
                    <option value="">Select</option>
                    {PATIENT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  {errors.patientType && <p className="text-xs text-red-500 mt-1">{errors.patientType}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Chief Complaint
                  </label>
                  <textarea rows={2} value={form.chiefComplaint} onChange={e => handleChange('chiefComplaint', e.target.value)}
                    placeholder="Brief reason for visit"
                    className={`${inp('chiefComplaint')} resize-none`} />
                </div>

                {/* Known Allergies */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Known Allergies
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {allergies.map(a => (
                      <span key={a} className="flex items-center gap-1 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                        {a}
                        <button onClick={() => removeAllergy(a)} className="text-red-400 hover:text-red-600 ml-0.5">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      value={allergyInput}
                      onChange={e => setAllergyInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addAllergy()}
                      placeholder="Add allergy..."
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={addAllergy}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-50">
                      +
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleRegister}
              className="w-full bg-gray-900 text-white text-sm py-2.5 rounded-lg hover:bg-gray-700 transition font-medium flex items-center justify-center gap-2"
            >
              ✓ Register
            </button>
            <button
              onClick={handleSaveDraft}
              className="w-full border border-gray-200 text-gray-600 text-sm py-2.5 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Save as Draft
            </button>

          </div>
        </div>
      </main>
    </div>
  )
}

export default PatientRegistration