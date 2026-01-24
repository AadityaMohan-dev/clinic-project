import { 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Activity,
  FileText,
  Pill,
  Stethoscope,
  AlertCircle,
  Download,
  Printer,
  ArrowLeft
} from 'lucide-react';


// Sample patient data - replace with actual data from your API/state
const patientData = {
  id: 1,
  name: "John Doe",
  age: 35,
  gender: "Male",
  phone: "+1 (234) 567-8900",
  email: "john.doe@email.com",
  address: "123 Main Street, New York, NY 10001",
  bloodType: "O+",
  allergies: ["Penicillin", "Peanuts"],
  emergencyContact: {
    name: "Jane Doe",
    relationship: "Spouse",
    phone: "+1 (234) 567-8901"
  },
  visits: [
    {
      id: 1,
      date: "2024-01-15",
      time: "10:00 AM",
      doctor: "Dr. Sarah Smith",
      reason: "Regular Checkup",
      diagnosis: "Healthy - Annual physical examination completed",
      notes: "Blood pressure normal, vitals stable"
    },
    {
      id: 2,
      date: "2024-01-08",
      time: "2:30 PM",
      doctor: "Dr. Michael Johnson",
      reason: "Dental Cleaning",
      diagnosis: "Minor cavity detected on lower left molar",
      notes: "Scheduled follow-up for filling"
    },
    {
      id: 3,
      date: "2023-12-20",
      time: "11:15 AM",
      doctor: "Dr. Sarah Smith",
      reason: "Follow-up",
      diagnosis: "Cold and flu symptoms resolved",
      notes: "Patient recovering well"
    }
  ],
  medications: [
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      prescribedBy: "Dr. Sarah Smith",
      startDate: "2023-06-01",
      status: "Active"
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      prescribedBy: "Dr. Sarah Smith",
      startDate: "2023-08-15",
      status: "Active"
    },
    {
      id: 3,
      name: "Amoxicillin",
      dosage: "250mg",
      frequency: "Three times daily",
      prescribedBy: "Dr. Michael Johnson",
      startDate: "2023-12-18",
      status: "Completed"
    }
  ],
  upcomingAppointments: [
    {
      id: 1,
      date: "2024-02-01",
      time: "9:00 AM",
      doctor: "Dr. Sarah Smith",
      type: "Follow-up"
    },
    {
      id: 2,
      date: "2024-02-15",
      time: "3:00 PM",
      doctor: "Dr. Michael Johnson",
      type: "Dental Procedure"
    }
  ]
};

function PatientsDetails() {
//   const navigate = useNavigate();
//   const { id } = useParams(); // Get patient ID from URL if using routing

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {patientData.name}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Patient ID: #{patientData.id} • {patientData.age} years • {patientData.gender}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Patient Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Contact</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {patientData.phone}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {patientData.email}
              </p>
            </div>
          </div>

          {/* Medical Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Medical</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium">Blood Type:</span> {patientData.bloodType}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Allergies:</span> {patientData.allergies.join(", ")}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Address</h3>
            </div>
            <p className="text-sm text-gray-600">{patientData.address}</p>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Emergency</h3>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600 font-medium">{patientData.emergencyContact.name}</p>
              <p className="text-gray-500 text-xs">{patientData.emergencyContact.relationship}</p>
              <p className="text-gray-600">{patientData.emergencyContact.phone}</p>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Upcoming Appointments</h2>
                  <p className="text-sm text-gray-600">Next scheduled visits</p>
                </div>
              </div>
              <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                + New
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {patientData.upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4 sm:p-5 lg:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{appointment.type}</h3>
                      <p className="text-sm text-gray-600">{appointment.doctor}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(appointment.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium">
                      Reschedule
                    </button>
                    <button className="px-3 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visit History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Visit History</h2>
                <p className="text-sm text-gray-600">{patientData.visits.length} total visits</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {patientData.visits.map((visit) => (
              <div key={visit.id} className="p-4 sm:p-5 lg:p-6 hover:bg-gray-50 transition-colors">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{visit.reason}</h3>
                        <p className="text-sm text-gray-600 mt-1">{visit.doctor}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(visit.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {visit.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
                    <div>
                      <span className="text-xs font-semibold text-gray-700 uppercase">Diagnosis</span>
                      <p className="text-sm text-gray-900 mt-1">{visit.diagnosis}</p>
                    </div>
                    {visit.notes && (
                      <div>
                        <span className="text-xs font-semibold text-gray-700 uppercase">Notes</span>
                        <p className="text-sm text-gray-600 mt-1">{visit.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Medications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Medications</h2>
                  <p className="text-sm text-gray-600">Current and past prescriptions</p>
                </div>
              </div>
              <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                + Add
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Medication</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase hidden sm:table-cell">Dosage</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase hidden md:table-cell">Frequency</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase hidden lg:table-cell">Prescribed By</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patientData.medications.map((med) => (
                  <tr key={med.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{med.name}</p>
                        <p className="text-sm text-gray-600 sm:hidden">{med.dosage} • {med.frequency}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 hidden sm:table-cell">{med.dosage}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">{med.frequency}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 hidden lg:table-cell">{med.prescribedBy}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        med.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {med.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientsDetails;