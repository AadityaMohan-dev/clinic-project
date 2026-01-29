import { useState } from 'react';
import { 
  Phone, MapPin, Activity, FileText, Pill, Stethoscope, 
  Download, Printer, ArrowLeft, Plus, Search, 
  Clock, Save, Trash2, History, Droplet, User, X, ChevronRight, ArrowUpFromLine
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA ---
const MEDICINE_DATABASE = ["Amoxicillin", "Ibuprofen", "Paracetamol", "Metronidazole", "Augmentin", "Ketorolac", "Lisinopril"];

const INITIAL_VISITS = [
  { 
    id: "prev-1", 
    date: "Jan 24, 2026", 
    title: "Appointment on Jan 24", 
    doctor: "Dr. Smith", 
    diagnosis: "Seasonal Flu",
    suggestions: "Rest for 3 days.",
    medications: [
      { name: "Paracetamol", dosage: "500mg", foodTiming: "After Food", duration: "3", schedule: { breakfast: true, lunch: true, dinner: true }, comments: "Take if fever > 101F" }
    ]
  }
];

const patientData = { id: 1, name: "John Doe", age: 35, gender: "Male", phone: "+1 (234) 567-8900", address: "123 Main Street, New York, NY", bloodType: "O+" };

// --- COMPACT ADD MEDICATION MODAL ---
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

  const handleSelectMed = (medName) => {
    setFormData(prev => ({ ...prev, name: medName }));
    setSearchTerm(medName);
    setShowSuggestions(false);
  };

  const handleSave = () => {
    if (!formData.name) return;
    onSave({ ...formData }); // Pass a copy
    setSearchTerm("");
    setFormData({ name: "", dosage: "", foodTiming: "After Food", schedule: { breakfast: false, lunch: false, dinner: false }, duration: "3", comments: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-5 overflow-hidden">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-900 text-sm">Add Prescription</h3>
          <button onClick={onClose} className="p-1 cursor-pointer"><X className="w-4 h-4 text-gray-400" /></button>
        </div>
        
        <div className="space-y-3">
          <div className="relative space-y-0.5">
            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Medicine Name</label>
            <input 
              className="w-full p-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setFormData({...formData, name: e.target.value}); setShowSuggestions(true); }}
            />
            {showSuggestions && searchTerm && suggestions.length > 0 && (
              <div className="absolute z-[210] w-full mt-0.5 bg-white border border-gray-100 rounded-xl shadow-lg max-h-32 overflow-y-auto">
                {suggestions.map((m, i) => (
                  <button key={i} onClick={() => handleSelectMed(m)} className="w-full text-left px-3 py-1.5 text-xs hover:bg-blue-50 border-b last:border-0">{m}</button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-0.5">
            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Timing</label>
            <div className="flex gap-2">
              {["Before Food", "After Food"].map((t) => (
                <label key={t} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer">
                  <input type="radio" name="foodTiming" checked={formData.foodTiming === t} onChange={() => setFormData({...formData, foodTiming: t})} className="w-3 h-3 text-black focus:ring-0" />
                  <span className="text-[10px] font-medium text-gray-600">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
             <div className="space-y-0.5">
               <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Dosage</label>
               <input className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} placeholder="500mg" />
             </div>
             <div className="space-y-0.5">
               <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Duration</label>
               <select className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})}>
                 {[3,5,7,14].map(d => <option key={d} value={d}>{d} Days</option>)}
               </select>
             </div>
          </div>

          <div className="space-y-0.5">
            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Schedule</label>
            <div className="flex gap-1.5">
              {['breakfast', 'lunch', 'dinner'].map(m => (
                <button key={m} type="button" onClick={() => setFormData({...formData, schedule: {...formData.schedule, [m]: !formData.schedule[m]}})}
                  className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase border transition-all ${formData.schedule[m] ? 'bg-black text-white border-black shadow-sm' : 'bg-gray-50 text-gray-400 border-transparent'}`}>{m}</button>
              ))}
            </div>
          </div>

          <div className="space-y-0.5">
            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Note</label>
            <input className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs" value={formData.comments} onChange={e => setFormData({...formData, comments: e.target.value})} placeholder="..." />
          </div>
        </div>
        <button onClick={handleSave} className="w-full mt-4 py-3 bg-black text-white rounded-xl font-bold text-sm active:scale-95 transition-all cursor-pointer">Add</button>
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
  const [showMobileHistory, setShowMobileHistory] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const addMedication = (data) => setMedications(prev => [...prev, { ...data, id: Date.now() }]);

  // --- FIXED FINALIZE SESSION LOGIC ---
  const handleFinalizeSession = () => {
    if (!diagnosis.trim()) return alert("Enter a diagnosis to save.");
    
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const newVisitRecord = { 
        id: Date.now(), 
        date: formattedDate, 
        title: `Appointment on ${formattedDate.split(',')[0]}`, 
        doctor: "Dr. Smith", 
        diagnosis: diagnosis, 
        suggestions: suggestions, 
        medications: [...medications] // Deep copy current meds
    };
    
    // Add to history array
    setVisits(prevHistory => [newVisitRecord, ...prevHistory]);
    
    // Clear the active workspace
    setMedications([]); 
    setDiagnosis(""); 
    setSuggestions("");
    alert("Session saved successfully!");
  };

  return (
    <div className="h-[calc(100dvh-120px)] w-full flex flex-col items-center justify-start bg-transparent font-sans px-0 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl w-full h-full flex flex-col bg-white rounded-none sm:rounded-[2.5rem] shadow-xl overflow-hidden relative border-none sm:border border-neutral-200/60">
        
        {/* MOBILE HEADER */}
        <header className="md:hidden bg-white px-4 py-3 flex justify-between items-center border-b border-gray-100 shrink-0 sticky top-0 z-20">
          <button onClick={() => navigate(-1)} className="p-1 cursor-pointer"><ChevronRight className="w-6 h-6 rotate-180" /></button>
          <h1 className="text-lg font-bold text-gray-900">Patient Record</h1>
          <div className="flex items-center space-x-4"><Printer className="w-5 h-5 text-gray-600" /><ArrowUpFromLine className="w-5 h-5 text-gray-600" /></div>
        </header>

        {/* WORKSPACE AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FAFAFA] space-y-4 no-scrollbar">
          
          <section className="md:hidden bg-white p-5 shadow-sm border border-gray-100 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-gray-900">{patientData.name}</h2>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded w-fit uppercase border border-blue-100">ID: #{patientData.id}</span>
              </div>
              <button onClick={() => setShowMobileHistory(true)} className="bg-white border border-blue-500 text-blue-500 text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer shadow-sm active:bg-blue-50 transition-all">History</button>
            </div>
            <div className="flex flex-col gap-2 text-[13px] text-gray-500 font-medium">
              <span className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> {patientData.age} yrs, {patientData.gender}</span>
              <span className="flex items-center gap-2 text-red-500 font-bold"><Droplet className="w-4 h-4" /> Blood: {patientData.bloodType}</span>
              <span className="flex items-center gap-2 pt-1 border-t border-gray-50"><MapPin className="w-4 h-4 text-gray-400" /> {patientData.address}</span>
            </div>
          </section>

          {/* SINGLE-LINE SLEEK INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <div className="bg-white p-3 rounded-2xl border border-neutral-100 flex items-center gap-3 shadow-sm group focus-within:border-teal-400 transition-colors">
              <Stethoscope className="w-5 h-5 text-teal-500 shrink-0" />
              <input className="w-full text-sm outline-none bg-transparent font-medium" placeholder="Diagnosis..." value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
            </div>
            <div className="bg-white p-3 rounded-2xl border border-neutral-100 flex items-center gap-3 shadow-sm group focus-within:border-blue-400 transition-colors">
              <Activity className="w-5 h-5 text-blue-500 shrink-0" />
              <input className="w-full text-sm outline-none bg-transparent font-medium" placeholder="Suggestions..." value={suggestions} onChange={e => setSuggestions(e.target.value)} />
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-neutral-100 flex items-center gap-3 shadow-sm">
             <FileText className="w-5 h-5 text-gray-400 shrink-0" />
             <input className="w-full text-sm outline-none bg-transparent font-medium text-gray-900" placeholder="Key notes about the patient..." />
          </div>

          {/* PRESCRIPTIONS */}
          <section className="bg-white shadow-sm border border-gray-100 rounded-[2rem] overflow-hidden flex flex-col">
            <div className="p-4 px-6 bg-gray-50 border-b flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2"><Pill className="w-5 h-5 text-blue-600" /><h3 className="font-bold text-sm text-gray-900">Prescriptions</h3></div>
              <button onClick={() => setIsAddMedOpen(true)} className="bg-blue-600 text-white text-[11px] font-bold px-4 py-2 rounded-xl shadow-md cursor-pointer active:scale-95 transition-all">+ Add Med</button>
            </div>
            <div className="p-6 min-h-[180px] flex items-center justify-center">
              {medications.length === 0 ? (
                <div className="text-gray-300 flex flex-col items-center rotate-45 opacity-40"><Pill className="w-12 h-12" /><p className="text-[10px] mt-2 font-black uppercase">No meds</p></div>
              ) : (
                <div className="w-full space-y-3">
                  {medications.map(m => (
                    <div key={m.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center shadow-sm">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-black text-gray-900">{m.name}</span>
                        <span className="text-[10px] text-blue-600 font-bold uppercase">{m.dosage} • {m.foodTiming}</span>
                      </div>
                      <button onClick={() => setMedications(medications.filter(med => med.id !== m.id))} className="cursor-pointer text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* FOOTER ACTION */}
        <div className="p-4 px-6 bg-white shrink-0 z-30 border-t border-gray-100">
           <button onClick={handleFinalizeSession} className="w-full py-4 bg-black text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all cursor-pointer">Finalize Session</button>
        </div>

        {/* MOBILE HISTORY WINDOW */}
        <AnimatePresence>
          {showMobileHistory && (
            <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 backdrop-blur-sm md:hidden">
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="bg-white w-full rounded-t-[2.5rem] p-6 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="flex justify-between items-center mb-6 border-b pb-4 shrink-0">
                  <h2 className="text-xl font-bold text-gray-900">Medical History</h2>
                  <button onClick={() => setShowMobileHistory(false)} className="p-2 bg-gray-100 rounded-full cursor-pointer"><X className="w-5 h-5 text-gray-500" /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-6 pb-10 no-scrollbar">
                  {visits.map(v => (
                    <div key={v.id} className="space-y-4">
                      {/* DIAGNOSIS & SUGGESTIONS AS TWO COLUMNS IN ONE ROW */}
                      <div className="border-b border-gray-100 pb-3">
                        <div className="flex justify-between items-center"><h4 className="font-black text-gray-900 text-lg">{v.title}</h4><span className="text-xs font-bold text-blue-600 px-2 py-1 bg-blue-50 rounded-lg">{v.date}</span></div>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                           <div className="p-2 bg-teal-50 rounded-lg border border-teal-100">
                             <p className="text-[9px] font-black text-teal-700 uppercase mb-0.5 tracking-wider">Diagnosis</p>
                             <p className="text-[11px] font-bold text-teal-600">{v.diagnosis}</p>
                           </div>
                           <div className="p-2 bg-gray-100 rounded-lg border border-gray-200">
                             <p className="text-[9px] font-black text-gray-500 uppercase mb-0.5 tracking-wider">Suggestions</p>
                             <p className="text-[11px] font-bold text-gray-500">{v.suggestions || "-"}</p>
                           </div>
                        </div>
                      </div>

                      {/* FULL DETAIL MEDICATION TABLE */}
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-inner overflow-x-auto">
                        <table className="w-full text-left min-w-[350px]">
                          <thead><tr className="text-[8px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200">
                            <th className="pb-2">Medicine</th><th className="pb-2">Timing</th><th className="pb-2">B/L/D</th><th className="pb-2">Note</th><th className="pb-2 text-right">Dur</th>
                          </tr></thead>
                          <tbody className="divide-y divide-gray-100">{v.medications.map((m, i) => (
                            <tr key={i} className="text-[10px]">
                              <td className="py-2.5 font-black text-gray-900 leading-tight">{m.name}<br/><span className="text-[8px] font-normal text-gray-400">{m.dosage}</span></td>
                              <td className="py-2.5 text-gray-600 whitespace-nowrap">{m.foodTiming}</td>
                              <td className="py-2.5">
                                <div className="flex gap-0.5">
                                  {m.schedule.breakfast && <span className="bg-blue-100 px-1 rounded text-blue-600">B</span>}
                                  {m.schedule.lunch && <span className="bg-blue-100 px-1 rounded text-blue-600">L</span>}
                                  {m.schedule.dinner && <span className="bg-blue-100 px-1 rounded text-blue-600">D</span>}
                                </div>
                              </td>
                              <td className="py-2.5 text-gray-400 italic max-w-[70px] truncate">{m.comments || "-"}</td>
                              <td className="py-2.5 text-right font-black text-blue-600">{m.duration}d</td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <AddMedicationModal isOpen={isAddMedOpen} onClose={() => setIsAddMedOpen(false)} onSave={addMedication} />
    </div>
  );
}

export default PatientsDetails;