import { useState } from 'react';
import { 
  Phone, MapPin, Activity, FileText, Pill, Stethoscope, 
  Download, Printer, ArrowLeft, Plus, Search, 
  Clock, Save, Trash2, History, Droplet, User, X, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- RESTORED DUMMY DATA ---
const MEDICINE_DATABASE = [
  "Amoxicillin", "Ibuprofen", "Paracetamol", "Metronidazole", 
  "Azithromycin", "Augmentin", "Ketorolac", "Lisinopril", "Metformin"
];

const INITIAL_VISITS = [
  {
    id: "prev-1",
    date: "2024-01-15",
    title: "Appointment on Jan 15, 2024",
    doctor: "Dr. Sarah Smith",
    diagnosis: "Seasonal Flu",
    suggestions: "Drink plenty of water. Rest.",
    medications: [
      { id: 1, name: "Paracetamol", dosage: "500mg", foodTiming: "After Food", duration: "3", schedule: { breakfast: true, lunch: true, dinner: true }, comments: "Take only if fever > 101F" }
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

// --- MODALS ---
const AddMedicationModal = ({ isOpen, onClose, onSave }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    name: "", dosage: "", foodTiming: "After Food",
    schedule: { breakfast: false, lunch: false, dinner: false },
    duration: "3", comments: "" // Added comments field
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-neutral-900">Add Prescription</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-neutral-400" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="relative">
            <label className="text-xs font-bold text-neutral-500 uppercase">Medication</label>
            <input type="text" className="w-full mt-1 px-4 py-2 bg-gray-50 border rounded-xl text-sm" placeholder="Search medicine..." value={searchTerm} 
              onChange={(e) => { setSearchTerm(e.target.value); setFormData({...formData, name: e.target.value}); setShowSuggestions(true); }} />
            {showSuggestions && searchTerm && suggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-40 overflow-y-auto">
                {suggestions.map((m, i) => (
                  <button key={i} onClick={() => { setFormData({...formData, name: m}); setSearchTerm(m); setShowSuggestions(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50">{m}</button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="text-xs font-bold text-neutral-500 uppercase">Dosage</label>
               <input type="text" className="w-full mt-1 px-4 py-2 bg-gray-50 border rounded-xl text-sm" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} />
            </div>
            <div>
               <label className="text-xs font-bold text-neutral-500 uppercase">Duration</label>
               <select className="w-full mt-1 px-4 py-2 bg-gray-50 border rounded-xl text-sm" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})}>
                 {[3, 5, 7, 14].map(d => <option key={d} value={d}>{d} Days</option>)}
               </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['breakfast', 'lunch', 'dinner'].map(meal => (
              <button key={meal} onClick={() => setFormData({...formData, schedule: {...formData.schedule, [meal]: !formData.schedule[meal]}})}
                className={`p-2 rounded-lg border text-sm capitalize ${formData.schedule[meal] ? 'bg-blue-600 text-white' : 'bg-white text-neutral-500'}`}>{meal}</button>
            ))}
          </div>
          {/* New Suggestions / Note Field */}
          <div>
            <label className="text-xs font-bold text-neutral-500 uppercase">Medicine Note</label>
            <input 
              type="text" 
              className="w-full mt-1 px-4 py-2 bg-gray-50 border rounded-xl text-sm" 
              placeholder="e.g. Take with warm water" 
              value={formData.comments} 
              onChange={e => setFormData({...formData, comments: e.target.value})} 
            />
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-neutral-600">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 text-sm font-bold text-white bg-neutral-900 rounded-lg">Add</button>
        </div>
      </motion.div>
    </div>
  );
};

const AppointmentDetailsModal = ({ visit, isOpen, onClose }) => {
  if (!isOpen || !visit) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="px-6 py-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{visit.title}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-neutral-500" /></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
            <h4 className="text-xs font-bold text-yellow-700 uppercase">Suggestions</h4>
            <p className="text-sm">{visit.suggestions}</p>
          </div>
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="px-4 py-3">Medicine</th>
                    <th className="px-4 py-3">Dosage</th>
                    <th className="px-4 py-3">Timing</th>
                    <th className="px-4 py-3">Notes</th> {/* Added Notes Column */}
                    <th className="px-4 py-3 text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visit.medications.map((med, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 font-semibold">{med.name}</td>
                    <td className="px-4 py-3">{med.dosage}</td>
                    <td className="px-4 py-3">{med.foodTiming}</td>
                    <td className="px-4 py-3 text-neutral-500 italic text-xs">{med.comments || "-"}</td>
                    <td className="px-4 py-3 text-right">{med.duration} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

  const addMedication = (data) => setMedications([...medications, { ...data, id: Date.now() }]);

  const handleSaveSession = () => {
    if (medications.length === 0 && !diagnosis && !suggestions) return;
    const todayDate = new Date().toISOString().split('T')[0]; 
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const existingVisitIndex = visits.findIndex(v => v.date === todayDate);

    if (existingVisitIndex !== -1) {
      const updatedVisits = [...visits];
      updatedVisits[existingVisitIndex] = { 
        ...updatedVisits[existingVisitIndex], 
        diagnosis: diagnosis || updatedVisits[existingVisitIndex].diagnosis, 
        suggestions: suggestions || updatedVisits[existingVisitIndex].suggestions, 
        medications: [...updatedVisits[existingVisitIndex].medications, ...medications] 
      };
      setVisits(updatedVisits);
    } else {
      setVisits([{ id: Date.now(), date: todayDate, title: `Appointment on ${todayStr}`, doctor: "Dr. Smith", diagnosis, suggestions, medications }, ...visits]);
    }
    setMedications([]); setDiagnosis(""); setSuggestions("");
  };

  return (
    <div className="h-[calc(100dvh-120px)] w-full flex flex-col items-center justify-start bg-transparent font-sans px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* MAIN ANCHORED CARD */}
      <div className="max-w-7xl w-full h-full flex flex-col bg-white rounded-3xl shadow-xl border border-neutral-200/60 overflow-hidden">
        
        {/* HEADER AREA */}
        <div className="px-8 py-6 border-b border-gray-100 bg-white shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 border rounded-xl hover:bg-gray-50"><ArrowLeft className="w-5 h-5" /></button>
              <div>
                <div className="flex items-baseline gap-3">
                  <h1 className="text-2xl font-bold text-neutral-900">{patientData.name}</h1>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-100">ID: #{patientData.id}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 mt-1">
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {patientData.age} yrs, {patientData.gender}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {patientData.phone}</span>
                  <span className="flex items-center gap-1.5 text-red-600 font-semibold"><Droplet className="w-3.5 h-3.5" /> Blood: {patientData.bloodType}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {patientData.address}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2.5 border rounded-xl hover:bg-gray-50"><Printer className="w-5 h-5 text-gray-400" /></button>
              <button className="p-2.5 border rounded-xl hover:bg-gray-50"><Download className="w-5 h-5 text-gray-400" /></button>
            </div>
          </div>
        </div>

        {/* WORKSPACE: THE SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#FAFAFA] space-y-6 custom-scrollbar">
          
          {/* ROW 1: Diagnosis & Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col h-48">
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <Stethoscope className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-neutral-700">Diagnosis</h3>
              </div>
              <textarea className="flex-1 w-full p-4 bg-gray-50 border rounded-xl text-sm outline-none resize-none" placeholder="Clinical diagnosis..." value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col h-48">
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <Activity className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-neutral-700">Doctor's Suggestions</h3>
              </div>
              <textarea className="flex-1 w-full p-4 bg-gray-50 border rounded-xl text-sm outline-none resize-none" placeholder="Lifestyle/Diet suggestions..." value={suggestions} onChange={(e) => setSuggestions(e.target.value)} />
            </div>
          </div>

          {/* ROW 2: History & Prescriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* History Card */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col h-[500px]">
              <div className="p-5 border-b bg-gray-50/50 flex items-center gap-2 shrink-0">
                <History className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-neutral-700">Appointment History</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/30">
                {visits.map((visit) => (
                  <button key={visit.id} onClick={() => setSelectedVisit(visit)} className="w-full text-left bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-center justify-between group hover:border-blue-300 hover:shadow-md transition-all">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">{visit.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1">Diagnosis: {visit.diagnosis || "N/A"}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-blue-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Prescription Card */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden flex flex-col h-[500px]">
              <div className="p-5 border-b bg-gray-50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /><span className="font-bold text-neutral-700">Prescriptions</span></div>
                <button onClick={() => setIsAddMedOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition-all active:scale-95"><Plus className="w-4 h-4" /> Add Med</button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#FAFAFA]">
                {medications.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30"><Pill className="w-12 h-12" /><p className="text-sm mt-2">No meds added.</p></div>
                ) : medications.map((med, i) => (
                  <div key={med.id} className="bg-white p-4 rounded-xl border flex flex-col gap-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm">{med.name} ({med.dosage})</h4>
                        <div className="flex gap-1 mt-1">
                          {med.schedule.breakfast && <span className="text-[9px] bg-green-50 text-green-700 px-1 py-0.5 rounded">Breakfast</span>}
                          {med.schedule.lunch && <span className="text-[9px] bg-orange-50 text-orange-700 px-1 py-0.5 rounded">Lunch</span>}
                          {med.schedule.dinner && <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded">Dinner</span>}
                        </div>
                      </div>
                      <button onClick={() => setMedications(medications.filter(m => m.id !== med.id))} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    {/* Displaying Note in Workspace */}
                    {med.comments && (
                      <p className="text-[11px] text-neutral-500 italic bg-gray-50 p-1 rounded border border-gray-100">
                        Note: {med.comments}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-5 border-t bg-white shrink-0">
                <button onClick={handleSaveSession} disabled={medications.length === 0 && !diagnosis} className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-bold shadow-lg disabled:bg-gray-200 transition-all">Finalize Session</button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>

      {/* MODALS */}
      <AddMedicationModal isOpen={isAddMedOpen} onClose={() => setIsAddMedOpen(false)} onSave={addMedication} />
      <AppointmentDetailsModal visit={selectedVisit} isOpen={!!selectedVisit} onClose={() => setSelectedVisit(null)} />
    </div>
  );
}

export default PatientsDetails;