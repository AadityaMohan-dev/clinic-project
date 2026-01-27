import { useState } from 'react';
import { 
  Phone, MapPin, Activity, FileText, Pill, Stethoscope, 
  AlertCircle, Download, Printer, ArrowLeft, Plus, Search, 
  Check, Clock, Save, Trash2, History, Droplet, User, X, Calendar, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- DUMMY DATA ---
const MEDICINE_DATABASE = [
  "Amoxicillin", "Ibuprofen", "Paracetamol", "Metronidazole", 
  "Azithromycin", "Augmentin", "Ketorolac", "Lisinopril", "Metformin"
];

// Initial History Data
const INITIAL_VISITS = [
  {
    id: "prev-1",
    date: "2024-01-15",
    title: "Appointment on Jan 15, 2024",
    doctor: "Dr. Sarah Smith",
    diagnosis: "Seasonal Flu",
    suggestions: "Drink plenty of water. Rest.",
    medications: [
      { id: 1, name: "Paracetamol", dosage: "500mg", foodTiming: "After Food", duration: "3", schedule: { breakfast: true, lunch: true, dinner: true }, status: "Completed" }
    ]
  }
];

const patientData = {
  id: 1,
  name: "John Doe",
  age: 35,
  gender: "Male",
  phone: "+1 (234) 567-8900",
  email: "john.doe@email.com",
  address: "123 Main Street, New York, NY",
  bloodType: "O+",
  allergies: ["Penicillin"]
};

// --- 1. ADD MEDICATION MODAL ---
const AddMedicationModal = ({ isOpen, onClose, onSave }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    name: "", dosage: "", foodTiming: "After Food",
    schedule: { breakfast: false, lunch: false, dinner: false },
    duration: "3", comments: ""
  });

  if (!isOpen) return null;

  const suggestions = MEDICINE_DATABASE.filter(med => 
    med.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (!formData.name) return alert("Medication name required");
    onSave(formData);
    onClose();
    setFormData({ name: "", dosage: "", foodTiming: "After Food", schedule: { breakfast: false, lunch: false, dinner: false }, duration: "3", comments: "" });
    setSearchTerm("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden"
      >
        <div className="px-6 py-4 border-b bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-neutral-900">Add Prescription</h3>
          <button onClick={onClose}><Plus className="w-5 h-5 rotate-45 text-neutral-400" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="relative">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Medication</label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                placeholder="Search medicine..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setFormData({...formData, name: e.target.value}); setShowSuggestions(true); }}
              />
            </div>
            {showSuggestions && searchTerm && suggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-40 overflow-y-auto">
                {suggestions.map((m, i) => (
                  <button key={i} onClick={() => { setFormData({...formData, name: m}); setSearchTerm(m); setShowSuggestions(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-neutral-700">{m}</button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Dosage</label>
              <input type="text" className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="e.g. 500mg" 
                value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Duration (Days)</label>
              <select className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" 
                value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})}>
                {[3, 5, 7, 10, 14, 30].map(d => <option key={d} value={d}>{d} Days</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Schedule</label>
            <div className="grid grid-cols-3 gap-2">
              {['breakfast', 'lunch', 'dinner'].map(meal => (
                <label key={meal} className={`flex items-center justify-center p-2 rounded-lg border cursor-pointer text-sm capitalize transition-all ${formData.schedule[meal] ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-neutral-500 border-gray-200'}`}>
                  <input type="checkbox" className="hidden" checked={formData.schedule[meal]} 
                    onChange={() => setFormData({...formData, schedule: {...formData.schedule, [meal]: !formData.schedule[meal]}})} />
                  {meal}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-4 pt-2">
             {['Before Food', 'After Food'].map(opt => (
               <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                 <input type="radio" name="timing" checked={formData.foodTiming === opt} onChange={() => setFormData({...formData, foodTiming: opt})} className="accent-blue-600" />
                 {opt}
               </label>
             ))}
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50/50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-neutral-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 text-sm font-bold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800">Add</button>
        </div>
      </motion.div>
    </div>
  );
};

// --- 2. VIEW APPOINTMENT DETAILS MODAL ---
const AppointmentDetailsModal = ({ visit, isOpen, onClose }) => {
  if (!isOpen || !visit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden max-h-[85vh] flex flex-col"
      >
        <div className="px-6 py-5 border-b bg-gray-50/50 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">{visit.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium text-neutral-500">Diagnosis For:</span>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-sm font-bold rounded border border-indigo-100">
                {visit.diagnosis || "General Checkup"}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5 text-neutral-500" /></button>
        </div>

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
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-neutral-900">{med.name}</td>
                      <td className="px-4 py-3 text-neutral-600">{med.dosage}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${med.foodTiming === 'Before Food' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                          {med.foodTiming}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {/* UPDATED: Text Badges in History Modal */}
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
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-neutral-400 italic">No medications recorded for this visit.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
           <div className="flex items-center gap-2 text-xs text-neutral-400">
             <User className="w-3.5 h-3.5" /> Prescribed by {visit.doctor}
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-gray-50">
             <Printer className="w-4 h-4" /> Print
           </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN PAGE ---
function PatientsDetails() {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]); 
  const [visits, setVisits] = useState(INITIAL_VISITS);
  
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null); 
  
  const [diagnosis, setDiagnosis] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const addMedication = (data) => {
    setMedications([...medications, { ...data, id: Date.now() }]);
  };

  const handleSaveSession = () => {
    if (medications.length === 0 && !diagnosis && !suggestions) return;

    const todayDate = new Date().toISOString().split('T')[0]; 
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const existingVisitIndex = visits.findIndex(v => v.date === todayDate);

    if (existingVisitIndex !== -1) {
      const updatedVisits = [...visits];
      const existing = updatedVisits[existingVisitIndex];
      
      updatedVisits[existingVisitIndex] = {
        ...existing,
        diagnosis: diagnosis || existing.diagnosis,
        suggestions: suggestions ? (existing.suggestions ? existing.suggestions + "\n" + suggestions : suggestions) : existing.suggestions,
        medications: [...existing.medications, ...medications] 
      };
      setVisits(updatedVisits);
    } else {
      const newVisit = {
        id: Date.now(),
        date: todayDate,
        title: `Appointment on ${todayStr}`,
        doctor: "Dr. Smith",
        diagnosis: diagnosis || "General Checkup",
        suggestions: suggestions,
        medications: medications
      };
      setVisits([newVisit, ...visits]);
    }

    setMedications([]);
    setDiagnosis("");
    setSuggestions("");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-10">
      
      {/* Super Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-neutral-200/60 shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 border rounded-xl hover:bg-gray-50"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <div className="flex items-baseline gap-3">
                <h1 className="text-2xl font-bold text-neutral-900">{patientData.name}</h1>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-100">ID: #{patientData.id}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 mt-1">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {patientData.age} yrs, {patientData.gender}</span>
                <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {patientData.phone}</span>
                <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                <span className="flex items-center gap-1.5"><Droplet className="w-3.5 h-3.5 text-red-500" /> Blood: <span className="text-neutral-900 font-semibold">{patientData.bloodType}</span></span>
                <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {patientData.address}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 border rounded-lg hover:bg-gray-50 text-neutral-600"><Printer className="w-5 h-5" /></button>
            <button className="p-2 border rounded-lg hover:bg-gray-50 text-neutral-600"><Download className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Clinical Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-neutral-700">Diagnosis</h3>
            </div>
            <textarea 
              className="w-full h-20 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:outline-none resize-none transition-all"
              placeholder="Enter clinical diagnosis..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-neutral-700">Doctor's Suggestions</h3>
            </div>
            <textarea 
              className="w-full h-20 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-none resize-none transition-all"
              placeholder="Lifestyle changes, diet plans, etc..."
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: Appointment History */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2 px-1">
              <History className="w-5 h-5 text-neutral-400" /> Appointment History
            </h2>
            <div className="space-y-4 h-[500px] overflow-y-auto pr-2 scrollbar-hide">
              <AnimatePresence initial={false}>
                {visits.map((visit) => (
                  <motion.button 
                    key={visit.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setSelectedVisit(visit)}
                    className="w-full text-left bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm relative group hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-neutral-900 text-sm">{visit.title}</h3>
                      <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-blue-500" />
                    </div>
                    
                    <p className="text-xs text-neutral-500 font-medium">
                      Diagnosis: <span className="text-neutral-400 font-normal">{visit.diagnosis || "N/A"}</span>
                    </p>
                    
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                        {visit.medications ? visit.medications.length : 0} Meds
                      </span>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: Workspace */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/60 overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-neutral-700">Prescriptions</span>
                  <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{medications.length}</span>
                </div>
                <button 
                  onClick={() => setIsAddMedOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Add Med
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAFA]">
                {medications.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-3 opacity-60">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Pill className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-sm">No medications added yet.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {medications.map((med, index) => (
                      <motion.div
                        key={med.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                        className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">{index + 1}</div>
                          <div>
                            <h4 className="font-bold text-neutral-900 text-sm">{med.name} <span className="text-neutral-400 font-normal">({med.dosage})</span></h4>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1"><Clock className="w-3 h-3" /> {med.foodTiming}</span>
                              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">{med.duration} days</span>
                              {/* UPDATED: Text Badges in Active Workspace */}
                              <div className="flex gap-1 ml-1">
                                {med.schedule.breakfast && <span className="text-[10px] font-medium bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200">Breakfast</span>}
                                {med.schedule.lunch && <span className="text-[10px] font-medium bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200">Lunch</span>}
                                {med.schedule.dinner && <span className="text-[10px] font-medium bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">Dinner</span>}
                              </div>
                            </div>
                            {med.comments && <p className="text-xs text-neutral-400 mt-1 italic">"{med.comments}"</p>}
                          </div>
                        </div>
                        <button onClick={() => setMedications(medications.filter(m => m.id !== med.id))} className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              <div className="p-4 border-t border-gray-100 bg-white flex justify-end shrink-0">
                <button 
                  onClick={handleSaveSession}
                  disabled={medications.length === 0 && !diagnosis}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white text-sm shadow-xl transition-all ${(medications.length > 0 || diagnosis) ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02]' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                  <Save className="w-4 h-4" /> Finalize Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      <AddMedicationModal isOpen={isAddMedOpen} onClose={() => setIsAddMedOpen(false)} onSave={addMedication} />
      <AppointmentDetailsModal visit={selectedVisit} isOpen={!!selectedVisit} onClose={() => setSelectedVisit(null)} />
    </div>
  );
}

export default PatientsDetails;