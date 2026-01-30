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

// --- 1. ADD MEDICATION MODAL ---
const AddMedicationModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ 
    name: "", dosage: "", foodTiming: "After Food", 
    schedule: { breakfast: false, lunch: false, dinner: false }, 
    duration: "3", comments: "" 
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.name) return;
    onSave({ ...formData });
    setFormData({ name: "", dosage: "", foodTiming: "After Food", schedule: { breakfast: false, lunch: false, dinner: false }, duration: "3", comments: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-4 text-gray-900 font-bold">
          <h3>Add Prescription</h3>
          <button onClick={onClose} className="p-1 cursor-pointer"><X size={20}/></button>
        </div>
        <div className="space-y-4">
          <input className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10" placeholder="Medicine Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
             <input className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} placeholder="Dosage" />
             <input className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="Duration" />
          </div>
          <input className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none" value={formData.comments} onChange={e => setFormData({...formData, comments: e.target.value})} placeholder="Note..." />
        </div>
        <button onClick={handleSave} className="w-full mt-6 py-4 bg-black text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all">Add</button>
      </motion.div>
    </div>
  );
};

// --- 2. MAIN COMPONENT ---
function PatientsDetails() {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]); 
  const [visits, setVisits] = useState(INITIAL_VISITS);
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [showMobileHistory, setShowMobileHistory] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [keyNotes, setKeyNotes] = useState("");

  const addMedication = (data) => setMedications(prev => [...prev, { ...data, id: Date.now() }]);

  const handleFinalizeSession = () => {
    if (!diagnosis.trim()) return alert("Enter a diagnosis.");
    const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newVisitRecord = { 
      id: Date.now(), 
      date: formattedDate, 
      title: `Appointment on ${formattedDate.split(',')[0]}`, 
      doctor: "Dr. Smith", 
      diagnosis, 
      suggestions, 
      medications: [...medications] 
    };
    setVisits(prev => [newVisitRecord, ...prev]);
    setMedications([]); setDiagnosis(""); setSuggestions(""); setKeyNotes("");
    alert("Saved Successfully!");
  };

  return (
    <div className="h-[calc(100dvh-120px)] w-full flex flex-col items-center justify-start bg-transparent font-sans overflow-hidden px-0 sm:px-6 lg:px-8">
      
      {/* --- MOBILE UI: ONE MAIN UNIFIED CARD --- */}
      <div className="md:hidden w-full h-full p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-neutral-200/60 overflow-hidden flex flex-col h-full w-full max-w-md relative">
          
          <header className="bg-white px-6 pt-8 pb-4 flex justify-between items-center border-b border-gray-100 shrink-0">
            <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 rounded-full active:scale-90 transition-all"><ChevronRight className="rotate-180 text-gray-600" size={20}/></button>
            <h1 className="text-lg font-black text-gray-900 uppercase">Patient Record</h1>
            <div className="flex items-center space-x-3 text-gray-400"><Printer size={18} /><ArrowUpFromLine size={18} /></div>
          </header>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar bg-[#FAFAFA]/30">
            {/* Mobile Patient Identity */}
            <section className="bg-white p-5 shadow-sm border border-gray-100 rounded-[2rem]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-black text-gray-900 leading-none">{patientData.name}</h2>
                  <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-blue-100 w-fit uppercase">ID: #{patientData.id}</span>
                </div>
                <button onClick={() => setShowMobileHistory(true)} className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest cursor-pointer">History</button>
              </div>
              <div className="flex flex-col gap-2 text-[13px] text-gray-500 font-bold uppercase tracking-tight">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><User size={14} className="text-blue-500" /> {patientData.age}Y, {patientData.gender}</span>
                  <span className="flex items-center gap-1.5 text-red-500"><Droplet size={14} /> {patientData.bloodType}</span>
                </div>
                <span className="flex items-center gap-1.5 pt-3 border-t border-gray-100 font-medium normal-case tracking-normal"><MapPin size={14} className="text-gray-400" /> {patientData.address}</span>
              </div>
            </section>

            {/* Mobile Inputs */}
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-[1.5rem] border border-neutral-100 flex items-center gap-3 shadow-sm focus-within:border-teal-400 transition-colors">
                <Stethoscope size={20} className="text-teal-500 shrink-0" />
                <input className="w-full text-sm outline-none bg-transparent font-bold text-gray-900" placeholder="Diagnosis..." value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
              </div>
              <div className="bg-white p-4 rounded-[1.5rem] border border-neutral-100 flex items-center gap-3 shadow-sm focus-within:border-blue-400 transition-colors">
                <Activity size={20} className="text-blue-500 shrink-0" />
                <input className="w-full text-sm outline-none bg-transparent font-bold text-gray-900" placeholder="Suggestions..." value={suggestions} onChange={e => setSuggestions(e.target.value)} />
              </div>
              {/* KEY NOTES MOBILE */}
              <div className="bg-white p-4 rounded-[1.5rem] border border-neutral-100 flex items-center gap-3 shadow-sm focus-within:border-amber-400 transition-colors">
                <FileText size={20} className="text-amber-500 shrink-0" />
                <input className="w-full text-sm outline-none bg-transparent font-bold text-gray-900" placeholder="Patient Key Notes..." value={keyNotes} onChange={e => setKeyNotes(e.target.value)} />
              </div>
            </div>

            {/* Mobile Prescriptions List */}
            <section className="bg-white shadow-sm border border-gray-100 rounded-[2.5rem] overflow-hidden flex flex-col">
              <div className="p-5 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2 font-black text-xs uppercase text-gray-400 tracking-widest"><Pill size={18} className="text-blue-600" /> Prescriptions</div>
                <button onClick={() => setIsAddMedOpen(true)} className="bg-black text-white text-[10px] font-black px-4 py-2 rounded-xl active:scale-95 transition-all uppercase">+ Add</button>
              </div>
              <div className="p-5 min-h-[140px] flex items-center justify-center">
                {medications.length === 0 ? <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">No meds added</p> : (
                  <div className="w-full space-y-3">
                    {medications.map(m => (
                      <div key={m.id} className="p-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] flex justify-between items-center shadow-sm">
                        <div className="min-w-0 flex-1">
                            <p className="font-black text-gray-900 text-sm truncate">{m.name}</p>
                            <p className="text-[10px] text-blue-600 font-black uppercase mt-0.5">{m.dosage} • {m.duration}d</p>
                        </div>
                        <button onClick={() => setMedications(medications.filter(med => med.id !== m.id))} className="text-red-400 hover:text-red-600 shadow-sm ml-2 cursor-pointer transition-colors"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="p-6 bg-white border-t border-gray-100 shrink-0">
             <button onClick={handleFinalizeSession} className="w-full py-5 bg-black text-white rounded-[1.75rem] font-black text-sm uppercase shadow-2xl active:scale-[0.98] transition-all cursor-pointer">Finalize Session</button>
          </div>
        </div>
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:flex flex-col h-full w-full max-w-7xl bg-transparent relative">
        <div className="flex-1 overflow-hidden flex flex-row bg-white rounded-[2.5rem] shadow-xl border border-neutral-200/60">
          
          {/* Main workspace */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-[#FAFAFA]/40">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-2xl border border-neutral-100 flex items-center gap-3 shadow-sm focus-within:border-teal-400">
                <Stethoscope size={24} className="text-teal-500" /><input className="w-full outline-none bg-transparent font-bold text-gray-800" placeholder="Diagnosis..." value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-neutral-100 flex items-center gap-3 shadow-sm focus-within:border-blue-400">
                <Activity size={24} className="text-blue-500" /><input className="w-full outline-none bg-transparent font-bold text-gray-800" placeholder="Suggestions..." value={suggestions} onChange={e => setSuggestions(e.target.value)} />
              </div>
            </div>

            {/* KEY NOTES DESKTOP */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-100 flex items-center gap-3 shadow-sm focus-within:border-amber-400">
              <FileText size={24} className="text-amber-500" /><input className="w-full outline-none bg-transparent font-bold text-gray-800" placeholder="Patient Key Notes (Allergies, chronic conditions, etc)..." value={keyNotes} onChange={e => setKeyNotes(e.target.value)} />
            </div>

            <section className="bg-white shadow-sm border border-gray-100 rounded-[2.5rem] overflow-hidden flex flex-col min-h-[350px]">
              <div className="p-6 bg-gray-50 border-b flex justify-between items-center font-bold">
                <div className="flex items-center gap-2 uppercase tracking-widest text-xs opacity-50"><Pill size={18}/> Prescriptions</div>
                <button onClick={() => setIsAddMedOpen(true)} className="bg-blue-600 text-white text-sm px-6 py-2.5 rounded-xl shadow-md">+ Add Medication</button>
              </div>
              <div className="p-10 flex-1 flex items-center justify-center">
                {medications.length === 0 ? <p className="text-center text-gray-300 font-bold uppercase opacity-50">Active medications appear here</p> : 
                <div className="grid grid-cols-2 gap-4 w-full self-start">{medications.map(m => <div key={m.id} className="p-4 bg-gray-50 border border-gray-100 rounded-3xl flex justify-between items-center shadow-sm"><div><p className="font-black text-gray-900">{m.name}</p><p className="text-xs text-blue-600 font-bold uppercase">{m.dosage} • {m.duration} days</p></div><button onClick={() => setMedications(medications.filter(med => med.id !== m.id))} className="text-red-400 transition-colors"><Trash2 size={20} /></button></div>)}</div>}
              </div>
            </section>
            
            <button onClick={handleFinalizeSession} className="w-full py-5 bg-black text-white rounded-3xl font-bold shadow-xl active:scale-[0.98] transition-all cursor-pointer">Finalize Session</button>
          </div>

          {/* History sidebar */}
          <aside className="w-[400px] border-l border-gray-100 bg-white flex flex-col shrink-0">
             <div className="p-6 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-900 uppercase tracking-widest text-xs sticky top-0 bg-white z-10"><History size={16} className="text-blue-600" /> Visit History</div>
             <div className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar bg-[#FDFDFD]">
               {visits.map(v => (
                 <div key={v.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
                   <div className="flex justify-between font-black text-gray-900 text-xs uppercase"><span>{v.title}</span><span className="text-gray-400">{v.date}</span></div>
                   <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold"><div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl"><b>Diag:</b> {v.diagnosis}</div><div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl"><b>Note:</b> {v.suggestions}</div></div>
                   
                   {/* Table with Note column + scroll */}
                   <div className="rounded-xl border border-gray-100 overflow-x-auto custom-scrollbar-h">
                        <table className="w-full text-left text-[9px] min-w-[420px]">
                          <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr className="text-gray-400 font-bold uppercase tracking-tighter">
                              <th className="px-2 py-1.5 sticky left-0 bg-[#f9fafb]">Medicine</th><th className="px-2 py-1.5">Timing</th><th className="px-2 py-1.5 text-center">B/L/D</th><th className="px-2 py-1.5">Note</th><th className="px-2 py-1.5 text-right">Dur</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {v.medications.map((m, i) => (
                              <tr key={i} className="bg-white hover:bg-blue-50/30 transition-colors">
                                <td className="px-2 py-2 sticky left-0 bg-white shadow-[2px_0_5px_rgba(0,0,0,0.01)] font-black text-gray-900">{m.name}</td>
                                <td className="px-2 py-2 text-gray-500">{m.foodTiming}</td>
                                <td className="px-2 py-2"><div className="flex gap-0.5 justify-center">{m.schedule?.breakfast && <span className="bg-blue-100 px-0.5 rounded text-blue-600">B</span>}{m.schedule?.lunch && <span className="bg-blue-100 px-0.5 rounded text-blue-600">L</span>}{m.schedule?.dinner && <span className="bg-blue-100 px-0.5 rounded text-blue-600">D</span>}</div></td>
                                <td className="px-2 py-2 text-gray-400 italic truncate max-w-[100px]">"{m.comments || "-"}"</td>
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
      </div>

      {/* --- SHARED MOBILE HISTORY SHEET --- */}
      <AnimatePresence>
        {showMobileHistory && (
          <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 backdrop-blur-sm md:hidden">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="bg-white w-full rounded-t-[3rem] p-6 max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
               <div className="flex justify-between items-center mb-6 border-b pb-4 shrink-0 font-black text-gray-900 uppercase text-sm">Visit History<button onClick={()=>setShowMobileHistory(false)} className="p-2 bg-gray-100 rounded-full active:scale-90 transition-transform"><X size={20}/></button></div>
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-10">
                 {visits.map(v => (
                   <div key={v.id} className="p-5 bg-gray-50 rounded-[2.5rem] border border-gray-200 space-y-3">
                      <div className="flex justify-between font-black text-gray-900 text-sm"><span>{v.title}</span><span className="text-[10px] text-gray-400">{v.date}</span></div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase tracking-tighter"><div className="p-3 bg-teal-50 text-teal-700 rounded-2xl border border-teal-100"><b>Diag:</b> {v.diagnosis}</div><div className="p-3 bg-white text-gray-400 border border-gray-100 rounded-2xl"><b>Note:</b> {v.suggestions}</div></div>
                      
                      {/* Fixed horizontal scroll table for Mobile History Modal */}
                      <div className="rounded-2xl border border-gray-200 overflow-x-auto custom-scrollbar-h bg-white">
                        <table className="w-full text-left text-[9px] min-w-[400px]">
                          <thead className="bg-gray-100/50 border-b border-gray-200">
                            <tr className="text-gray-400 font-bold uppercase">
                              <th className="px-2 py-1.5 sticky left-0 bg-white">Medicine</th>
                              <th className="px-2 py-1.5">Timing</th>
                              <th className="px-2 py-1.5 text-center">B/L/D</th>
                              <th className="px-2 py-1.5">Note</th>
                              <th className="px-2 py-1.5 text-right">Dur</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {v.medications.map((m, i) => (
                              <tr key={i}>
                                <td className="px-2 py-2 sticky left-0 bg-white font-black text-gray-900">{m.name}</td>
                                <td className="px-2 py-2 text-gray-500">{m.foodTiming}</td>
                                <td className="px-2 py-2">
                                  <div className="flex gap-0.5 justify-center">
                                    {m.schedule?.breakfast && <span className="bg-blue-100 px-0.5 rounded text-blue-600">B</span>}
                                    {m.schedule?.lunch && <span className="bg-blue-100 px-0.5 rounded text-blue-600">L</span>}
                                    {m.schedule?.dinner && <span className="bg-blue-100 px-0.5 rounded text-blue-600">D</span>}
                                  </div>
                                </td>
                                <td className="px-2 py-2 text-gray-400 italic truncate max-w-[80px]">"{m.comments || m.note || "-"}"</td>
                                <td className="px-2 py-2 text-right font-black text-blue-600 uppercase">{m.duration}d</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                   </div>
                 ))}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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