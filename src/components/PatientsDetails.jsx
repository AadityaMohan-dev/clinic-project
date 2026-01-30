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

// --- ADD MEDICATION MODAL ---
const AddMedicationModal = ({ isOpen, onClose, onSave }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", dosage: "", foodTiming: "After Food", 
    schedule: { breakfast: false, lunch: false, dinner: false }, 
    duration: "3", comments: "" 
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.name) return;
    onSave({ ...formData });
    setSearchTerm("");
    setFormData({ name: "", dosage: "", foodTiming: "After Food", schedule: { breakfast: false, lunch: false, dinner: false }, duration: "3", comments: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-900 text-sm">Add Prescription</h3>
          <button onClick={onClose} className="p-1 cursor-pointer"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <input className="w-full p-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none" placeholder="Medicine Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
             <input className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} placeholder="Dosage (500mg)" />
             <input className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="Duration (Days)" />
          </div>
          <div className="flex gap-1.5">
              {['breakfast', 'lunch', 'dinner'].map(m => (
                <button key={m} type="button" onClick={() => setFormData({...formData, schedule: {...formData.schedule, [m]: !formData.schedule[m]}})}
                  className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase border transition-all ${formData.schedule[m] ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-400 border-transparent'}`}>{m}</button>
              ))}
          </div>
          <input className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none" value={formData.comments} onChange={e => setFormData({...formData, comments: e.target.value})} placeholder="Note..." />
        </div>
        <button onClick={handleSave} className="w-full mt-4 py-3 bg-black text-white rounded-xl font-bold text-sm active:scale-95 transition-all">Add</button>
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

  const handleFinalizeSession = () => {
    if (!diagnosis.trim()) return alert("Enter a diagnosis to save.");
    const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newVisitRecord = { 
        id: Date.now(), date: formattedDate, title: `Appointment on ${formattedDate.split(',')[0]}`, doctor: "Dr. Smith", diagnosis: diagnosis, suggestions: suggestions, medications: [...medications]
    };
    setVisits(prevHistory => [newVisitRecord, ...prevHistory]);
    setMedications([]); setDiagnosis(""); setSuggestions("");
    alert("Session saved successfully!");
  };

  return (
    <div className="h-[calc(100dvh-120px)] w-full flex flex-col items-center justify-start bg-transparent font-sans px-0 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl w-full h-full flex flex-col bg-white rounded-none sm:rounded-[2.5rem] shadow-xl overflow-hidden relative border-none sm:border border-neutral-200/60">
        
        {/* MOBILE HEADER (STAYS SAME) */}
        <header className="md:hidden bg-white px-4 py-3 flex justify-between items-center border-b border-gray-100 shrink-0 sticky top-0 z-20">
          <button onClick={() => navigate(-1)} className="p-1 cursor-pointer"><ChevronRight className="rotate-180" /></button>
          <h1 className="text-lg font-bold">Patient Record</h1>
          <div className="flex items-center space-x-4"><Printer size={18} /><ArrowUpFromLine size={18} /></div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-[#FAFAFA]">
          
          {/* LEFT SIDE: ACTIVE WORKSPACE (INPUTS/MEDS) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 no-scrollbar">
            
            {/* Patient Info Card (Mobile Only) */}
            <section className="md:hidden bg-white p-5 shadow-sm border border-gray-100 rounded-3xl">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold text-gray-900">{patientData.name}</h2>
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded w-fit uppercase border border-blue-100">ID: #{patientData.id}</span>
                </div>
                <button onClick={() => setShowMobileHistory(true)} className="bg-white border border-blue-500 text-blue-500 text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer shadow-sm active:bg-blue-50">History</button>
              </div>
              <div className="flex flex-col gap-2 text-[13px] text-gray-500 font-medium">
                <span className="flex items-center gap-2"><User size={16} className="text-gray-400" /> {patientData.age} yrs, {patientData.gender}</span>
                <span className="flex items-center gap-2 text-red-500 font-bold"><Droplet size={16} /> Blood: {patientData.bloodType}</span>
                <span className="flex items-center gap-2 pt-1 border-t border-gray-50"><MapPin size={16} className="text-gray-400" /> {patientData.address}</span>
              </div>
            </section>

            {/* Diagnosis & Suggestions Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              <div className="bg-white p-3 rounded-2xl border border-neutral-100 flex items-center gap-3 shadow-sm focus-within:border-teal-400 transition-colors">
                <Stethoscope size={20} className="text-teal-500 shrink-0" />
                <input className="w-full text-sm outline-none bg-transparent font-medium" placeholder="Diagnosis..." value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
              </div>
              <div className="bg-white p-3 rounded-2xl border border-neutral-100 flex items-center gap-3 shadow-sm focus-within:border-blue-400 transition-colors">
                <Activity size={20} className="text-blue-500 shrink-0" />
                <input className="w-full text-sm outline-none bg-transparent font-medium" placeholder="Suggestions..." value={suggestions} onChange={e => setSuggestions(e.target.value)} />
              </div>
            </div>

            {/* Prescription List Section */}
            <section className="bg-white shadow-sm border border-gray-100 rounded-[2rem] overflow-hidden flex flex-col">
              <div className="p-4 px-6 bg-gray-50 border-b flex justify-between items-center">
                <div className="flex items-center gap-2"><Pill size={20} className="text-blue-600" /><h3 className="font-bold text-sm">Prescriptions</h3></div>
                <button onClick={() => setIsAddMedOpen(true)} className="bg-blue-600 text-white text-[11px] font-bold px-4 py-2 rounded-xl shadow-md active:scale-95 transition-all">+ Add Med</button>
              </div>
              <div className="p-6 min-h-[180px] flex items-center justify-center">
                {medications.length === 0 ? <p className="text-gray-300 text-[10px] font-black uppercase tracking-widest opacity-50">No medications added</p> : (
                  <div className="w-full space-y-3">
                    {medications.map(m => (
                      <div key={m.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center shadow-sm">
                        <div><span className="font-black text-gray-900 text-sm">{m.name}</span><br/><span className="text-[10px] text-blue-600 font-bold uppercase">{m.dosage} • {m.foodTiming}</span></div>
                        <button onClick={() => setMedications(medications.filter(med => med.id !== m.id))} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT SIDE: DESKTOP HISTORY SIDEBAR (CONDENSED & COMPLETE) */}
          <aside className="hidden md:flex w-[340px] lg:w-[400px] border-l border-gray-100 bg-white flex-col shrink-0">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-white sticky top-0 z-10">
              <History size={18} className="text-blue-600" />
              <h3 className="font-bold text-gray-900 text-sm">Appointment History</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-[#FDFDFD]">
              {visits.map(v => (
                <div key={v.id} className="bg-white border border-gray-100 rounded-[1.75rem] p-4 shadow-sm hover:border-blue-200 transition-all group">
                  <div className="flex justify-between items-start mb-3 border-b border-gray-50 pb-2">
                    <div>
                      <h4 className="font-black text-gray-900 text-xs leading-tight group-hover:text-blue-600 transition-colors">{v.title}</h4>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{v.date}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2 bg-teal-50/50 rounded-lg border border-teal-50">
                      <p className="text-[8px] font-black text-teal-700 uppercase tracking-widest leading-none mb-1">Diagnosis</p>
                      <p className="text-[10px] font-bold text-teal-600 truncate">{v.diagnosis}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Note</p>
                      <p className="text-[10px] font-medium text-gray-600 truncate">{v.suggestions || "-"}</p>
                    </div>
                  </div>

                  {/* SIDEBAR TABLE WITH NOTE COLUMN & HORIZONTAL SCROLL */}
                  <div className="rounded-xl border border-gray-50 overflow-x-auto custom-scrollbar-h">
                    <table className="w-full text-left text-[9px] min-w-[420px]">
                      <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr className="text-gray-400 font-bold uppercase tracking-tighter">
                          <th className="px-2 py-1.5 sticky left-0 bg-[#f9fafb] z-10">Medicine</th>
                          <th className="px-2 py-1.5">Timing</th>
                          <th className="px-2 py-1.5">B/L/D</th>
                          <th className="px-2 py-1.5">Note</th>
                          <th className="px-2 py-1.5 text-right">Dur</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {v.medications.map((m, i) => (
                          <tr key={i} className="bg-white hover:bg-blue-50/30 transition-colors">
                            <td className="px-2 py-2 sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.01)]">
                              <span className="font-black text-gray-900">{m.name}</span><br/>
                              <span className="text-[8px] text-gray-400">{m.dosage}</span>
                            </td>
                            <td className="px-2 py-2 text-gray-500 whitespace-nowrap">{m.foodTiming}</td>
                            <td className="px-2 py-2">
                              <div className="flex gap-0.5">
                                {m.schedule.breakfast && <span className="bg-blue-100 px-0.5 rounded text-blue-600">B</span>}
                                {m.schedule.lunch && <span className="bg-blue-100 px-0.5 rounded text-blue-600">L</span>}
                                {m.schedule.dinner && <span className="bg-blue-100 px-0.5 rounded text-blue-600">D</span>}
                              </div>
                            </td>
                            <td className="px-2 py-2 text-gray-400 italic min-w-[100px] truncate">"{m.comments || m.note || "-"}"</td>
                            <td className="px-2 py-2 text-right font-black text-blue-600 uppercase">{m.duration}d</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* BOTTOM FINAL BUTTON */}
        <div className="p-4 px-6 bg-white shrink-0 z-30 border-t border-gray-100">
           <button onClick={handleFinalizeSession} className="w-full py-4 bg-black text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all">Finalize Session</button>
        </div>

        {/* MOBILE HISTORY (MODAL) */}
        <AnimatePresence>
          {showMobileHistory && (
            <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 backdrop-blur-sm md:hidden">
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full rounded-t-[2.5rem] p-6 max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                 <div className="flex justify-between items-center mb-4 border-b pb-4"><h2 className="text-xl font-bold">Medical History</h2><button onClick={()=>setShowMobileHistory(false)} className="p-1"><X size={20}/></button></div>
                 <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                   {visits.map(v => (
                     <div key={v.id} className="p-4 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
                        <div className="flex justify-between"><h4 className="font-bold">{v.title}</h4><span className="text-[10px] font-bold text-gray-400">{v.date}</span></div>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                           <div className="p-2 bg-teal-50 rounded-lg"><b>Diagnosis:</b><br/>{v.diagnosis}</div>
                           <div className="p-2 bg-gray-100 rounded-lg"><b>Note:</b><br/>{v.suggestions}</div>
                        </div>
                        <div className="overflow-x-auto"><table className="w-full text-left text-[9px] min-w-[300px]"><tbody>{v.medications.map((m,i)=>(<tr key={i}><td className="font-bold">{m.name}</td><td>{m.foodTiming}</td><td className="text-right font-black text-blue-600">{m.duration}d</td></tr>))}</tbody></table></div>
                     </div>
                   ))}
                 </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <AddMedicationModal isOpen={isAddMedOpen} onClose={() => setIsAddMedOpen(false)} onSave={addMedication} />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar-h::-webkit-scrollbar { height: 3px; }
        .custom-scrollbar-h::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default PatientsDetails;