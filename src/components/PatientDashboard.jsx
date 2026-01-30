import { useState } from 'react';
import { 
  Phone, MapPin, Activity, FileText, Pill, Calendar,
  Clock, User, X, ChevronRight, Droplet, Search, History,
  Printer, Download, Edit2, Save, ArrowLeft, Paperclip, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA ---
const INITIAL_PATIENT_DATA = { id: 1, name: "John Doe", age: "35", gender: "Male", phone: "+1 (234) 567-8900", address: "123 Main Street, New York, NY", bloodType: "O+" };
const VISITS_HISTORY = [
  { 
    id: 1, 
    date: "2024-01-15", 
    time: "10:00 AM", 
    title: "Appointment on Jan 15, 2024", 
    doctor: "Dr. Sarah Smith", 
    diagnosis: "Seasonal Flu",
    suggestions: "Rest for 3 days.",
    medications: [{ name: "Paracetamol", dosage: "500mg", timing: "After Food", breakfast: true, lunch: true, dinner: true, note: "Take if fever > 101F", duration: "3d" }],
    filesCount: 2 
  },
  { 
    id: 2, 
    date: "2023-11-20", 
    time: "02:30 PM", 
    title: "Appointment on Nov 20, 2023", 
    doctor: "Dr. Michael Johnson", 
    diagnosis: "Dental Cleaning",
    suggestions: "Use sensitive toothpaste.",
    medications: [{ name: "Chlorhexidine", dosage: "10ml", timing: "After Food", breakfast: true, lunch: false, dinner: true, note: "Gargle twice", duration: "7d" }],
    filesCount: 0 
  }
];

// --- MODALS ---
const EditPatientModal = ({ patient, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(patient);
  if (!isOpen) return null;
  const handleSubmit = () => { onSave(formData); onClose(); };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50/50 flex justify-between items-center font-bold text-sm">Edit Profile<button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X size={18} /></button></div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Age</label><input value={formData.age} onChange={(e)=>setFormData({...formData, age:e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm" /></div>
            <div><label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Gender</label><select value={formData.gender} onChange={(e)=>setFormData({...formData, gender:e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"><option>Male</option><option>Female</option></select></div>
          </div>
          <div><label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Address</label><input value={formData.address} onChange={(e)=>setFormData({...formData, address:e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm" /></div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2"><button onClick={onClose} className="px-4 py-1.5 text-xs font-medium text-gray-500">Cancel</button><button onClick={handleSubmit} className="px-5 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg">Save</button></div>
      </motion.div>
    </div>
  );
};

const AppointmentDetailsModal = ({ visit, isOpen, onClose }) => {
  if (!isOpen || !visit) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 border-b flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">{visit.title}</h2>
            <p className="text-xs text-neutral-500 flex items-center gap-1"><User size={12} /> {visit.doctor}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-neutral-400" /></button>
        </div>

        <div className="p-6 overflow-y-auto no-scrollbar space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Diagnosis</p>
              <p className="text-sm font-bold text-gray-900">{visit.diagnosis}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Suggestions</p>
              <p className="text-sm text-gray-700">{visit.suggestions}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] flex items-center gap-2"><Pill size={14} className="text-blue-500" /> Prescriptions</h3>
            <div className="border border-neutral-100 rounded-xl overflow-x-auto custom-scrollbar-h">
              <table className="w-full text-left text-xs min-w-[650px]"> 
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-3 py-2 text-gray-400 font-bold uppercase">Medicine</th>
                    <th className="px-3 py-2 text-gray-400 font-bold uppercase">Timing</th>
                    <th className="px-3 py-2 text-gray-400 font-bold uppercase text-center">B/L/D</th>
                    <th className="px-3 py-2 text-gray-400 font-bold uppercase">Note</th>
                    <th className="px-3 py-2 text-gray-400 font-bold uppercase text-right">Dur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {visit.medications.map((med, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/20 transition-colors">
                      <td className="px-3 py-3 font-bold text-gray-900">{med.name}<br/><span className="text-[10px] text-gray-400 font-normal">{med.dosage}</span></td>
                      <td className="px-3 py-3 font-medium text-gray-600 whitespace-nowrap">{med.timing}</td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1 justify-center">
                          {['B', 'L', 'D'].map(slot => {
                            const active = (slot === 'B' && med.breakfast) || (slot === 'L' && med.lunch) || (slot === 'D' && med.dinner);
                            return <span key={slot} className={`w-5 h-5 flex items-center justify-center rounded text-[9px] font-black border ${active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>{slot}</span>
                          })}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-500 italic min-w-[150px]">"{med.note}"</td>
                      <td className="px-3 py-3 text-right font-bold text-blue-600 uppercase whitespace-nowrap">{med.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold active:bg-gray-100 shadow-sm"><Printer size={14} /> Prescription</button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold active:bg-gray-100 shadow-sm"><FileText size={14} /> Invoice</button>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN DASHBOARD ---
function PatientDashboard() {
  const [patient, setPatient] = useState(INITIAL_PATIENT_DATA);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const filteredVisits = VISITS_HISTORY.filter(visit => 
    visit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (e, visitId) => {
    e.stopPropagation();
    const file = e.target.files[0];
    if (file) alert(`"${file.name}" attached to visit with Dr. ${visitId}`);
  };

  return (
    <div className="h-[calc(100dvh-120px)] w-full flex items-center justify-center font-sans bg-transparent overflow-hidden">
      
      {/* --- MOBILE VIEW --- */}
      <div className="md:hidden w-full h-full flex flex-col items-center justify-center p-3">
        <div className="bg-white rounded-[2rem] shadow-2xl border border-neutral-200/60 overflow-hidden flex flex-col h-full w-full max-w-sm relative">
          <div className="px-5 pt-6 pb-4 border-b border-gray-100 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center text-white font-black text-lg shadow uppercase">JD</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h2 className="text-base font-bold text-gray-900 truncate">{patient.name}</h2>
                  <button onClick={() => setIsEditProfileOpen(true)} className="text-gray-400 p-1"><Edit2 size={14} /></button>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-none">{patient.age}Y • {patient.gender} • ID: #{patient.id}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 no-scrollbar bg-[#FAFAFA]/30">
            {filteredVisits.map(v => (
              <motion.button key={v.id} whileTap={{ scale: 0.98 }} onClick={() => setSelectedVisit(v)} className="w-full bg-white border border-gray-100 rounded-2xl p-3 shadow-sm flex items-center justify-between text-left active:border-blue-200 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-900 shrink-0 border border-gray-200/50">
                  <span className="text-[7px] font-black uppercase opacity-40">{new Date(v.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="text-sm font-black leading-none">{new Date(v.date).getDate()}</span>
                </div>
                <div className="flex-1 min-w-0 mx-3">
                  <h4 className="text-xs font-bold text-gray-900 leading-tight truncate">{v.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <label className="bg-blue-50 text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase cursor-pointer" onClick={e => e.stopPropagation()}><Paperclip size={10} className="inline mr-1" />UPLOAD<input type="file" className="hidden" onChange={e => handleFileUpload(e, v.doctor)} /></label>
                    <span className="text-[9px] text-gray-400 font-bold uppercase truncate">Dr. {v.doctor.split(' ').pop()}</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* --- DESKTOP VIEW: FIXED UPLOAD OPTION --- */}
      <div className="hidden md:flex flex-col h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/60 overflow-hidden flex flex-col h-full">
           <div className="px-8 py-6 border-b border-gray-100 bg-white shrink-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><User size={24} /></div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <h1 className="text-2xl font-bold text-neutral-900">{patient.name}</h1>
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">ID: #{patient.id}</span>
                    <button onClick={() => setIsEditProfileOpen(true)} className="p-1 text-neutral-400 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 mt-1 font-medium"><span>{patient.age} yrs, {patient.gender}</span><span className="text-neutral-300">|</span><span>{patient.phone}</span><span className="text-neutral-300">|</span><span className="text-red-600 font-bold">Blood: {patient.bloodType}</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 border border-neutral-200 rounded-xl hover:bg-gray-50"><Printer size={20} /></button>
                <button className="p-2.5 border border-neutral-200 rounded-xl hover:bg-gray-50"><Download size={20} /></button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6 bg-[#FAFAFA] no-scrollbar">
            <div className="grid grid-cols-1 gap-4">
              {filteredVisits.map(v => (
                <button key={v.id} onClick={() => setSelectedVisit(v)} className="group bg-white rounded-2xl p-5 border border-neutral-200 flex items-center justify-between text-left hover:border-blue-400 transition-all shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-blue-700 shrink-0">
                      <span className="text-[10px] font-bold uppercase">{new Date(v.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-lg font-bold">{new Date(v.date).getDate()}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 group-hover:text-blue-600">{v.title}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-neutral-500 flex items-center gap-1"><User size={14} /> Dr. {v.doctor}</span>
                        {/* DESKTOP UPLOAD OPTION ADDED HERE */}
                        <label 
                          className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-neutral-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all" 
                          onClick={e => e.stopPropagation()}
                        >
                          <Paperclip size={14} /> Attach Document
                          <input type="file" className="hidden" onChange={e => handleFileUpload(e, v.doctor)} />
                        </label>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-neutral-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AppointmentDetailsModal visit={selectedVisit} isOpen={!!selectedVisit} onClose={() => setSelectedVisit(null)} />
      <EditPatientModal patient={patient} isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} onSave={setPatient} />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar-h::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar-h::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default PatientDashboard;