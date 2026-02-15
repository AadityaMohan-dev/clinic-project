import { useState, useEffect } from 'react';
import { 
  Phone, MapPin, Activity, FileText, Pill, Calendar,
  Clock, User, X, ChevronRight, Droplet, Search, History,
  Printer, Download, Edit2, Save, ArrowLeft, Paperclip, Plus,
  Loader2, AlertCircle, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'react-router-dom';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- MODALS ---
const EditPatientModal = ({ patient, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(patient);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient) setFormData(patient);
  }, [patient]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.name,
          age: formData.age,
          gender: formData.gender,
          address: formData.address,
          phone_number: formData.phone,
          blood_type: formData.bloodType,
          updated_at: new Date().toISOString()
        })
        .eq('id', formData.id)
        .select()
        .single();

      if (error) throw error;

      onSave(formData);
      onClose();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="px-5 py-3 border-b bg-gray-50/50 flex justify-between items-center font-bold text-sm">
          Edit Profile
          <button onClick={onClose} disabled={loading} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Full Name</label>
            <input 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Age</label>
              <input 
                type="number"
                value={formData.age} 
                onChange={(e) => setFormData({...formData, age: e.target.value})} 
                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Gender</label>
              <select 
                value={formData.gender} 
                onChange={(e) => setFormData({...formData, gender: e.target.value})} 
                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                disabled={loading}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Phone</label>
            <input 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Blood Type</label>
            <select 
              value={formData.bloodType} 
              onChange={(e) => setFormData({...formData, bloodType: e.target.value})} 
              className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
              disabled={loading}
            >
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Address</label>
            <textarea
              value={formData.address} 
              onChange={(e) => setFormData({...formData, address: e.target.value})} 
              className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm resize-none"
              rows="2"
              disabled={loading}
            />
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="px-4 py-1.5 text-xs font-medium text-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="px-5 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : null}
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AppointmentDetailsModal = ({ visit, isOpen, onClose }) => {
  if (!isOpen || !visit) return null;

  const handlePrintPrescription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-prescription-pdf', {
        body: { visitId: visit.id }
      });
      if (error) throw error;
      // Download or open PDF
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error generating prescription:', error);
      alert('Failed to generate prescription. Please try again.');
    }
  };

  const handlePrintInvoice = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
        body: { visitId: visit.id }
      });
      if (error) throw error;
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        <div className="px-6 py-4 border-b flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">{visit.title}</h2>
            <p className="text-xs text-neutral-500 flex items-center gap-1">
              <User size={12} /> {visit.doctor}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-neutral-400" />
          </button>
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

          {visit.medications && visit.medications.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] flex items-center gap-2">
                <Pill size={14} className="text-blue-500" /> Prescriptions
              </h3>
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
                        <td className="px-3 py-3 font-bold text-gray-900">
                          {med.medication_name || med.name}
                          <br/>
                          <span className="text-[10px] text-gray-400 font-normal">{med.dosage}</span>
                        </td>
                        <td className="px-3 py-3 font-medium text-gray-600 whitespace-nowrap">
                          {med.timing_food || med.timing}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1 justify-center">
                            {['B', 'L', 'D'].map(slot => {
                              const active = (
                                (slot === 'B' && (med.timing_breakfast || med.breakfast)) || 
                                (slot === 'L' && (med.timing_lunch || med.lunch)) || 
                                (slot === 'D' && (med.timing_dinner || med.dinner))
                              );
                              return (
                                <span 
                                  key={slot} 
                                  className={`w-5 h-5 flex items-center justify-center rounded text-[9px] font-black border ${
                                    active 
                                      ? 'bg-blue-600 border-blue-600 text-white' 
                                      : 'bg-gray-50 border-gray-200 text-gray-300'
                                  }`}
                                >
                                  {slot}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-gray-500 italic min-w-[150px]">
                          "{med.comments || med.note || 'No additional notes'}"
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-blue-600 uppercase whitespace-nowrap">
                          {med.duration_days || med.duration}d
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Attached Files */}
          {visit.files && visit.files.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] flex items-center gap-2">
                <FileText size={14} className="text-blue-500" /> Attached Documents
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {visit.files.map((file, idx) => (
                  <a
                    key={idx}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <FileText size={16} className="text-gray-400" />
                    <span className="text-xs truncate">{file.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 shrink-0">
          <button 
            onClick={handlePrintPrescription}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold active:bg-gray-100 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Printer size={14} /> Prescription
          </button>
          <button 
            onClick={handlePrintInvoice}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold active:bg-gray-100 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <FileText size={14} /> Invoice
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN DASHBOARD ---
function PatientDashboard() {
  const { patientId } = useParams(); // Get patient ID from URL
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
      fetchVisitHistory();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      // First, get appointment data
      const { data: appointmentData, error: aptError } = await supabase
        .from('appointments')
        .select('*, patient:profiles!appointments_patient_id_fkey(*)')
        .eq('id', patientId)
        .single();

      if (aptError) throw aptError;

      // Transform to component format
      const patientInfo = {
        id: appointmentData.patient_id || appointmentData.patient?.id,
        name: appointmentData.patient_name || appointmentData.patient?.full_name,
        age: appointmentData.patient?.age || '---',
        gender: appointmentData.patient?.gender || '---',
        phone: appointmentData.patient_phone || appointmentData.patient?.phone_number,
        address: appointmentData.patient?.address || '---',
        bloodType: appointmentData.patient?.blood_type || 'N/A',
        email: appointmentData.patient_email || appointmentData.patient?.email
      };

      setPatient(patientInfo);
    } catch (error) {
      console.error('Error fetching patient:', error);
      setError('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitHistory = async () => {
    try {
      // Get all appointments for this patient
      const { data: appointmentData, error: aptError } = await supabase
        .from('appointments')
        .select('id, patient_id')
        .eq('id', patientId)
        .single();

      if (aptError) throw aptError;

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          prescriptions (*),
          appointment_files (*)
        `)
        .eq('patient_id', appointmentData.patient_id)
        .order('appointment_date', { ascending: false });

      if (error) throw error;

      // Transform to component format
      const transformedVisits = data.map(apt => ({
        id: apt.id,
        date: apt.appointment_date,
        time: new Date(apt.appointment_date).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        title: `Appointment on ${new Date(apt.appointment_date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })}`,
        doctor: apt.doctor_name,
        diagnosis: apt.reason || 'General Checkup',
        suggestions: apt.notes || 'Follow standard care',
        medications: apt.prescriptions || [],
        files: apt.appointment_files || [],
        filesCount: apt.appointment_files?.length || 0
      }));

      setVisits(transformedVisits);
    } catch (error) {
      console.error('Error fetching visit history:', error);
    }
  };

  const handleFileUpload = async (e, visitId) => {
    e.stopPropagation();
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${visitId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('appointment-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('appointment-files')
        .getPublicUrl(fileName);

      // Save file reference to database
      const { error: dbError } = await supabase
        .from('appointment_files')
        .insert([{
          appointment_id: visitId,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          uploaded_at: new Date().toISOString()
        }]);

      if (dbError) throw dbError;

      alert(`"${file.name}" uploaded successfully!`);
      fetchVisitHistory(); // Refresh to show new file
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const filteredVisits = visits.filter(visit => 
    visit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[calc(100dvh-120px)] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="h-[calc(100dvh-120px)] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="text-sm text-red-600">{error || 'Patient not found'}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-120px)] w-full flex items-center justify-center font-sans bg-transparent overflow-hidden">
      
      {/* --- MOBILE VIEW --- */}
      <div className="md:hidden w-full h-full flex flex-col items-center justify-center p-3">
        <div className="bg-white rounded-[2rem] shadow-2xl border border-neutral-200/60 overflow-hidden flex flex-col h-full w-full max-w-sm relative">
          <div className="px-5 pt-6 pb-4 border-b border-gray-100 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center text-white font-black text-lg shadow uppercase">
                {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h2 className="text-base font-bold text-gray-900 truncate">{patient.name}</h2>
                  <button 
                    onClick={() => setIsEditProfileOpen(true)} 
                    className="text-gray-400 p-1"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-none">
                  {patient.age}Y • {patient.gender} • ID: #{patient.id}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded-xl text-sm outline-none" 
                placeholder="Search visits..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 no-scrollbar bg-[#FAFAFA]/30">
            {filteredVisits.length > 0 ? (
              filteredVisits.map(v => (
                <motion.button 
                  key={v.id} 
                  whileTap={{ scale: 0.98 }} 
                  onClick={() => setSelectedVisit(v)} 
                  className="w-full bg-white border border-gray-100 rounded-2xl p-3 shadow-sm flex items-center justify-between text-left active:border-blue-200 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-900 shrink-0 border border-gray-200/50">
                    <span className="text-[7px] font-black uppercase opacity-40">
                      {new Date(v.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-sm font-black leading-none">
                      {new Date(v.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 mx-3">
                    <h4 className="text-xs font-bold text-gray-900 leading-tight truncate">{v.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <label 
                        className="bg-blue-50 text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase cursor-pointer flex items-center gap-1" 
                        onClick={e => e.stopPropagation()}
                      >
                        {uploading ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          <Paperclip size={10} />
                        )}
                        UPLOAD
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={e => handleFileUpload(e, v.id)}
                          disabled={uploading}
                        />
                      </label>
                      {v.filesCount > 0 && (
                        <span className="text-[8px] text-gray-500 font-bold">
                          {v.filesCount} file{v.filesCount > 1 ? 's' : ''}
                        </span>
                      )}
                      <span className="text-[9px] text-gray-400 font-bold uppercase truncate">
                        Dr. {v.doctor.split(' ').pop()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </motion.button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Calendar className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-xs">No visits found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:flex flex-col h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/60 overflow-hidden flex flex-col h-full">
          <div className="px-8 py-6 border-b border-gray-100 bg-white shrink-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <User size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <h1 className="text-2xl font-bold text-neutral-900">{patient.name}</h1>
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      ID: #{patient.id}
                    </span>
                    <button 
                      onClick={() => setIsEditProfileOpen(true)} 
                      className="p-1 text-neutral-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 mt-1 font-medium">
                    <span>{patient.age} yrs, {patient.gender}</span>
                    <span className="text-neutral-300">|</span>
                    <span>{patient.phone}</span>
                    <span className="text-neutral-300">|</span>
                    <span className="text-red-600 font-bold">Blood: {patient.bloodType}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    className="w-64 pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Search visits..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="p-2.5 border border-neutral-200 rounded-xl hover:bg-gray-50">
                  <Printer size={20} />
                </button>
                <button className="p-2.5 border border-neutral-200 rounded-xl hover:bg-gray-50">
                  <Download size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6 bg-[#FAFAFA] no-scrollbar">
            {filteredVisits.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredVisits.map(v => (
                  <button 
                    key={v.id} 
                    onClick={() => setSelectedVisit(v)} 
                    className="group bg-white rounded-2xl p-5 border border-neutral-200 flex items-center justify-between text-left hover:border-blue-400 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-blue-700 shrink-0">
                        <span className="text-[10px] font-bold uppercase">
                          {new Date(v.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold">
                          {new Date(v.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral-900 group-hover:text-blue-600">
                          {v.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-neutral-500 flex items-center gap-1">
                            <User size={14} /> Dr. {v.doctor}
                          </span>
                          {v.filesCount > 0 && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <FileText size={12} /> {v.filesCount} file{v.filesCount > 1 ? 's' : ''}
                            </span>
                          )}
                          <label 
                            className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-neutral-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all" 
                            onClick={e => e.stopPropagation()}
                          >
                            {uploading ? (
                              <>
                                <Loader2 size={14} className="animate-spin" /> Uploading...
                              </>
                            ) : (
                              <>
                                <Paperclip size={14} /> Attach Document
                              </>
                            )}
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={e => handleFileUpload(e, v.id)}
                              disabled={uploading}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-neutral-300" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Calendar className="w-12 h-12 mb-4 opacity-10" />
                <p className="text-sm">No visits found</p>
                {searchTerm && (
                  <p className="text-xs mt-2">Try a different search term</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AppointmentDetailsModal 
        visit={selectedVisit} 
        isOpen={!!selectedVisit} 
        onClose={() => setSelectedVisit(null)} 
      />
      <EditPatientModal 
        patient={patient} 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
        onSave={setPatient} 
      />

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