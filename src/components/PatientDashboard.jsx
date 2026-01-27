import { useState } from 'react';
import { 
  Phone, MapPin, Activity, FileText, Pill, Calendar,
  Clock, User, X, ChevronRight, Droplet, Search, History,
  Printer, Download, Edit2, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- INITIAL PATIENT DATA ---
const INITIAL_PATIENT_DATA = {
  id: 1,
  name: "John Doe",
  age: "35",
  gender: "Male",
  phone: "+1 (234) 567-8900",
  email: "john.doe@email.com",
  address: "123 Main Street, New York, NY",
  bloodType: "O+",
};

// --- FULL HISTORY DATA ---
const VISITS_HISTORY = [
  {
    id: 1,
    date: "2024-01-15",
    time: "10:00 AM",
    title: "Appointment on Jan 15, 2024",
    doctor: "Dr. Sarah Smith",
    diagnosis: "Seasonal Flu",
    suggestions: "Drink plenty of water. Rest.",
    status: "Completed",
    medications: [
      { id: 101, name: "Paracetamol", dosage: "500mg", foodTiming: "After Food", duration: "3", schedule: { breakfast: true, lunch: true, dinner: true } },
      { id: 102, name: "Cetirizine", dosage: "10mg", foodTiming: "Before Sleep", duration: "5", schedule: { breakfast: false, lunch: false, dinner: true } }
    ]
  },
  {
    id: 2,
    date: "2023-11-20",
    time: "02:30 PM",
    title: "Appointment on Nov 20, 2023",
    doctor: "Dr. Michael Johnson",
    diagnosis: "Dental Cleaning",
    suggestions: "Use sensitive toothpaste for 2 weeks.",
    status: "Completed",
    medications: [
      { id: 201, name: "Chlorhexidine", dosage: "10ml", foodTiming: "After Food", duration: "7", schedule: { breakfast: true, lunch: false, dinner: true } }
    ]
  },
  {
    id: 3,
    date: "2023-08-05",
    time: "09:15 AM",
    title: "Appointment on Aug 05, 2023",
    doctor: "Dr. Sarah Smith",
    diagnosis: "General Checkup",
    suggestions: "Vitamin D levels are low. Get more morning sun.",
    status: "Completed",
    medications: [
      { id: 301, name: "Vitamin D3", dosage: "60k IU", foodTiming: "After Food", duration: "4", schedule: { breakfast: true, lunch: false, dinner: false } }
    ]
  }
];

// --- 1. EDIT PROFILE MODAL ---
const EditPatientModal = ({ patient, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(patient);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden"
      >
        <div className="px-6 py-4 border-b bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-neutral-900">Edit Profile</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5 text-neutral-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Age</label>
              <input name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Blood Type</label>
              <select name="bloodType" value={formData.bloodType} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 block">Address</label>
            <input name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-neutral-600 hover:bg-gray-200 rounded-lg">Cancel</button>
          <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- 2. APPOINTMENT DETAILS MODAL ---
const AppointmentDetailsModal = ({ visit, isOpen, onClose }) => {
  if (!isOpen || !visit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b bg-gray-50/50 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">{visit.title}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-sm text-neutral-500">
                <User className="w-3.5 h-3.5" /> {visit.doctor}
              </span>
              <span className="text-neutral-300">•</span>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-sm font-bold rounded border border-indigo-100">
                {visit.diagnosis || "General Checkup"}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5 text-neutral-500" /></button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {visit.suggestions && (
            <div className="mb-6 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
              <h4 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1">Doctor's Suggestions</h4>
              <p className="text-sm text-yellow-900">{visit.suggestions}</p>
            </div>
          )}

          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Pill className="w-4 h-4 text-emerald-600" /> Prescribed Medications
          </h3>

          <div className="border border-neutral-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-neutral-200 text-neutral-500 font-medium">
                <tr>
                  <th className="px-4 py-3">Medicine</th>
                  <th className="px-4 py-3">Dosage</th>
                  <th className="px-4 py-3">Timing</th>
                  <th className="px-4 py-3">Schedule</th>
                  <th className="px-4 py-3 text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {visit.medications && visit.medications.length > 0 ? (
                  visit.medications.map((med, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-neutral-900">{med.name}</td>
                      <td className="px-4 py-3 text-neutral-600">{med.dosage}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 rounded text-xs font-medium border bg-blue-50 text-blue-700 border-blue-100">{med.foodTiming}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {med.schedule.breakfast && <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-700 border border-green-200">Breakfast</span>}
                          {med.schedule.lunch && <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-orange-700 border border-orange-200">Lunch</span>}
                          {med.schedule.dinner && <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">Dinner</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-500">{med.duration} days</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="px-4 py-8 text-center text-neutral-400 italic">No medications recorded for this visit.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer with TWO Buttons */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
             <FileText className="w-4 h-4" /> Print Invoice
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
             <Printer className="w-4 h-4" /> Print Prescription
           </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN COMPONENT ---
function PatientDashboard() {
  const [patient, setPatient] = useState(INITIAL_PATIENT_DATA);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const filteredVisits = VISITS_HISTORY.filter(visit => 
    visit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-10">
      
      {/* --- HEADER --- */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-neutral-200/60 shadow-sm px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Patient Info Block */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-600 w-full group">
            
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{patient.name}</h1>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">ID: #{patient.id}</span>
            </div>

            <span className="hidden md:block text-neutral-300">|</span>

            <div className="flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-1.5 font-medium">{patient.age} yrs, {patient.gender}</span>
              <span className="hidden md:block text-neutral-300">|</span>
              <span className="flex items-center gap-1.5 font-medium"><Phone className="w-3.5 h-3.5 text-neutral-400" /> {patient.phone}</span>
              <span className="hidden md:block text-neutral-300">|</span>
              <span className="flex items-center gap-1.5 font-medium"><Droplet className="w-3.5 h-3.5 text-red-500 fill-red-500/20" /> Blood: <span className="text-neutral-900 font-bold">{patient.bloodType}</span></span>
              <span className="hidden md:block text-neutral-300">|</span>
              <span className="flex items-center gap-1.5 font-medium truncate max-w-[200px]" title={patient.address}><MapPin className="w-3.5 h-3.5 text-neutral-400" /> {patient.address}</span>
            </div>

            <button onClick={() => setIsEditProfileOpen(true)} className="ml-auto md:ml-0 p-1.5 rounded-full bg-gray-50 hover:bg-blue-100 text-neutral-400 hover:text-blue-600 transition-colors" title="Edit Profile">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-2 shrink-0">
            <button className="p-2 border border-neutral-200 bg-white rounded-lg hover:bg-gray-50 text-neutral-600 shadow-sm"><Printer className="w-4 h-4" /></button>
            <button className="p-2 border border-neutral-200 bg-white rounded-lg hover:bg-gray-50 text-neutral-600 shadow-sm"><Download className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/60 overflow-hidden min-h-[600px] flex flex-col">
          
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <History className="w-6 h-6 text-blue-600" /> Appointment History
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input type="text" placeholder="Search history..." className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="flex-1 p-6 bg-[#FAFAFA] overflow-y-auto">
            <div className="space-y-4">
              <AnimatePresence>
                {filteredVisits.length > 0 ? (
                  filteredVisits.map((visit) => (
                    <motion.button key={visit.id} layout whileHover={{ scale: 1.01 }} onClick={() => setSelectedVisit(visit)} className="w-full text-left bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between group hover:border-blue-400 hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 bg-blue-50 text-blue-700 rounded-xl font-bold border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <span className="text-xs uppercase">{new Date(visit.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-lg">{new Date(visit.date).getDate()}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-neutral-900 text-lg mb-1">{visit.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-neutral-500">
                            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {visit.doctor}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {visit.time}</span>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 border border-gray-200">{visit.medications.length} Meds</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors"><ChevronRight className="w-5 h-5" /></div>
                    </motion.button>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-neutral-400"><Activity className="w-12 h-12 mb-3 opacity-20" /><p>No records found.</p></div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 bg-white text-center"><p className="text-xs text-neutral-400">Total Visits: {VISITS_HISTORY.length}</p></div>
        </div>
      </div>

      <AppointmentDetailsModal visit={selectedVisit} isOpen={!!selectedVisit} onClose={() => setSelectedVisit(null)} />
      <EditPatientModal patient={patient} isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} onSave={setPatient} />
    </div>
  );
}

export default PatientDashboard;