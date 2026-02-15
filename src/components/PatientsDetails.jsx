import { useState, useEffect } from 'react';
import { 
  Phone, MapPin, Activity, FileText, Pill, Stethoscope, 
  Download, Printer, ArrowLeft, Plus, Search, 
  Clock, Save, Trash2, History, Droplet, User, X, ChevronRight, 
  ArrowUpFromLine, Loader2, AlertCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import AddMedication from './modal/AddMedication';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- MAIN COMPONENT ---
function PatientsDetails() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  
  // State management
  const [patientData, setPatientData] = useState(null);
  const [medications, setMedications] = useState([]); 
  const [visits, setVisits] = useState([]);
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [showMobileHistory, setShowMobileHistory] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [keyNotes, setKeyNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    fetchCurrentUser();
    if (patientId) {
      fetchPatientData();
      fetchVisitHistory();
    }
  }, [patientId]);

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setCurrentUser(user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Fetch patient data
  const fetchPatientData = async () => {
    setLoading(true);
    try {
      // Get appointment details
      const { data: appointment, error: aptError } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:profiles!appointments_patient_id_fkey(*)
        `)
        .eq('id', patientId)
        .single();

      if (aptError) throw aptError;

      setCurrentAppointment(appointment);

      const patient = {
        id: appointment.patient_id || appointment.patient?.id,
        name: appointment.patient_name || appointment.patient?.full_name,
        age: appointment.patient?.age || '---',
        gender: appointment.patient?.gender || '---',
        phone: appointment.patient_phone || appointment.patient?.phone_number,
        address: appointment.patient?.address || '---',
        bloodType: appointment.patient?.blood_type || 'N/A',
        email: appointment.patient_email || appointment.patient?.email
      };

      setPatientData(patient);

      // Load existing session data if available
      if (appointment.diagnosis) setDiagnosis(appointment.diagnosis);
      if (appointment.notes) setSuggestions(appointment.notes);
      if (appointment.patient?.medical_notes) setKeyNotes(appointment.patient.medical_notes);

    } catch (error) {
      console.error('Error fetching patient:', error);
      setError('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch visit history
  const fetchVisitHistory = async () => {
    try {
      // Get patient ID from current appointment first
      const { data: currentApt } = await supabase
        .from('appointments')
        .select('patient_id')
        .eq('id', patientId)
        .single();

      if (!currentApt) return;

      // Get all completed appointments for this patient
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          prescriptions (*)
        `)
        .eq('patient_id', currentApt.patient_id)
        .eq('status', 'completed')
        .order('appointment_date', { ascending: false });

      if (error) throw error;

      const transformedVisits = data.map(apt => ({
        id: apt.id,
        date: new Date(apt.appointment_date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        title: `Appointment on ${new Date(apt.appointment_date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })}`,
        doctor: apt.doctor_name || 'Dr. Smith',
        diagnosis: apt.diagnosis || apt.reason || 'General Checkup',
        suggestions: apt.notes || 'No additional notes',
        medications: apt.prescriptions?.map(p => ({
          name: p.medication_name,
          dosage: p.dosage,
          foodTiming: p.timing_food || 'After Food',
          duration: p.duration_days?.toString() || '3',
          schedule: {
            breakfast: p.timing_breakfast || false,
            lunch: p.timing_lunch || false,
            dinner: p.timing_dinner || false
          },
          comments: p.comments || ''
        })) || []
      }));

      setVisits(transformedVisits);
    } catch (error) {
      console.error('Error fetching visit history:', error);
    }
  };

  // Add medication
  const addMedication = (data) => {
    setMedications(prev => [...prev, { ...data, id: Date.now() }]);
  };

  // Handle finalize session
  const handleFinalizeSession = async () => {
    if (!diagnosis.trim()) {
      alert("Please enter a diagnosis.");
      return;
    }

    if (medications.length === 0) {
      const confirm = window.confirm("No medications added. Continue anyway?");
      if (!confirm) return;
    }

    setSaving(true);
    try {
      // Update appointment with diagnosis and notes
      const { error: updateError } = await supabase
        .from('appointments')
        .update({
          diagnosis: diagnosis.trim(),
          notes: suggestions.trim() || null,
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', patientId);

      if (updateError) throw updateError;

      // Update patient medical notes
      if (keyNotes.trim() && patientData?.id) {
        await supabase
          .from('profiles')
          .update({
            medical_notes: keyNotes.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', patientData.id);
      }

      // Save all prescriptions
      if (medications.length > 0) {
        const prescriptions = medications.map(med => ({
          appointment_id: patientId,
          patient_id: patientData.id,
          medication_name: med.name,
          dosage: med.dosage,
          frequency: `${med.schedule.breakfast ? 'Breakfast' : ''}${med.schedule.lunch ? (med.schedule.breakfast ? '-' : '') + 'Lunch' : ''}${med.schedule.dinner ? (med.schedule.breakfast || med.schedule.lunch ? '-' : '') + 'Dinner' : ''} (${med.foodTiming})`,
          timing_food: med.foodTiming,
          timing_breakfast: med.schedule.breakfast || false,
          timing_lunch: med.schedule.lunch || false,
          timing_dinner: med.schedule.dinner || false,
          duration_days: parseInt(med.duration) || 3,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + (parseInt(med.duration) || 3) * 24 * 60 * 60 * 1000).toISOString(),
          comments: med.comments || null,
          status: 'active',
          prescribed_by: currentUser?.id,
          prescribed_by_name: currentUser?.user_metadata?.full_name || 'Doctor',
          created_at: new Date().toISOString()
        }));

        const { error: prescriptionError } = await supabase
          .from('prescriptions')
          .insert(prescriptions);

        if (prescriptionError) throw prescriptionError;
      }

      // Create notification for patient
      await supabase
        .from('notifications')
        .insert([{
          user_id: patientData.id,
          title: 'Appointment Completed',
          message: `Your appointment has been completed. Diagnosis: ${diagnosis}`,
          type: 'appointment',
          related_id: patientId,
          read: false,
          created_at: new Date().toISOString()
        }]);

      // Send email notification (optional)
      try {
        await supabase.functions.invoke('send-appointment-summary', {
          body: {
            to: patientData.email,
            patientName: patientData.name,
            diagnosis: diagnosis,
            suggestions: suggestions,
            medications: medications,
            appointmentDate: new Date()
          }
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }

      alert("Session finalized successfully!");
      
      // Reset form
      setMedications([]);
      setDiagnosis("");
      setSuggestions("");
      setKeyNotes("");

      // Refresh visit history
      await fetchVisitHistory();

      // Navigate back to dashboard
      setTimeout(() => navigate('/dashboard'), 1000);

    } catch (error) {
      console.error('Error finalizing session:', error);
      alert('Failed to finalize session. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Delete medication
  const deleteMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  // Handle print prescription
  const handlePrintPrescription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-prescription-pdf', {
        body: { 
          appointmentId: patientId,
          medications: medications
        }
      });
      if (error) throw error;
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error generating prescription:', error);
      alert('Failed to generate prescription. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-[calc(100dvh-120px)] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">Loading patient details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !patientData) {
    return (
      <div className="h-[calc(100dvh-120px)] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="text-sm text-red-600">{error || 'Patient not found'}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-120px)] w-full flex flex-col items-center justify-start bg-transparent font-sans overflow-hidden px-0 sm:px-6 lg:px-8">
      
      {/* --- MOBILE UI --- */}
      <div className="md:hidden w-full h-full p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-neutral-200/60 overflow-hidden flex flex-col h-full w-full max-w-md relative">
          
          <header className="bg-white px-6 pt-8 pb-4 flex justify-between items-center border-b border-gray-100 shrink-0">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 bg-gray-50 rounded-full active:scale-90 transition-all"
            >
              <ChevronRight className="rotate-180 text-gray-600" size={20}/>
            </button>
            <h1 className="text-lg font-black text-gray-900 uppercase">Patient Record</h1>
            <div className="flex items-center space-x-3 text-gray-400">
              <button onClick={handlePrintPrescription} disabled={medications.length === 0}>
                <Printer size={18} />
              </button>
              <ArrowUpFromLine size={18} />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar bg-[#FAFAFA]/30">
            {/* Patient Identity */}
            <section className="bg-white p-5 shadow-sm border border-gray-100 rounded-[2rem]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-black text-gray-900 leading-none">{patientData.name}</h2>
                  <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-blue-100 w-fit uppercase">
                    ID: #{patientData.id}
                  </span>
                </div>
                <button 
                  onClick={() => setShowMobileHistory(true)} 
                  className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest cursor-pointer"
                >
                  History
                </button>
              </div>
              <div className="flex flex-col gap-2 text-[13px] text-gray-500 font-bold uppercase tracking-tight">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <User size={14} className="text-blue-500" /> {patientData.age}Y, {patientData.gender}
                  </span>
                  <span className="flex items-center gap-1.5 text-red-500">
                    <Droplet size={14} /> {patientData.bloodType}
                  </span>
                </div>
                <span className="flex items-center gap-1.5 pt-3 border-t border-gray-100 font-medium normal-case tracking-normal">
                  <MapPin size={14} className="text-gray-400" /> {patientData.address}
                </span>
              </div>
            </section>

            {/* Input Fields */}
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-[1.5rem] border border-neutral-100 flex items-center gap-3 shadow-sm focus-within:border-teal-400 transition-colors">
                <Stethoscope size={20} className="text-teal-500 shrink-0" />
                <input 
                  className="w-full text-sm outline-none bg-transparent font-bold text-gray-900" 
                  placeholder="Diagnosis..." 
                  value={diagnosis} 
                  onChange={e => setDiagnosis(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="bg-white p-4 rounded-[1.5rem] border border-neutral-100 flex items-center gap-3 shadow-sm focus-within:border-blue-400 transition-colors">
                <Activity size={20} className="text-blue-500 shrink-0" />
                <input 
                  className="w-full text-sm outline-none bg-transparent font-bold text-gray-900" 
                  placeholder="Suggestions..." 
                  value={suggestions} 
                  onChange={e => setSuggestions(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="bg-white p-4 rounded-[1.5rem] border border-neutral-100 flex items-center gap-3 shadow-sm focus-within:border-amber-400 transition-colors">
                <FileText size={20} className="text-amber-500 shrink-0" />
                <input 
                  className="w-full text-sm outline-none bg-transparent font-bold text-gray-900" 
                  placeholder="Patient Key Notes..." 
                  value={keyNotes} 
                  onChange={e => setKeyNotes(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            {/* Prescriptions List */}
            <section className="bg-white shadow-sm border border-gray-100 rounded-[2.5rem] overflow-hidden flex flex-col">
              <div className="p-5 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2 font-black text-xs uppercase text-gray-400 tracking-widest">
                  <Pill size={18} className="text-blue-600" /> Prescriptions
                </div>
                <button 
                  onClick={() => setIsAddMedOpen(true)} 
                  className="bg-black text-white text-[10px] font-black px-4 py-2 rounded-xl active:scale-95 transition-all uppercase"
                  disabled={saving}
                >
                  + Add
                </button>
              </div>
              <div className="p-5 min-h-[140px] flex items-center justify-center">
                {medications.length === 0 ? (
                  <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                    No meds added
                  </p>
                ) : (
                  <div className="w-full space-y-3">
                    {medications.map(m => (
                      <div 
                        key={m.id} 
                        className="p-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] flex justify-between items-center shadow-sm"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-black text-gray-900 text-sm truncate">{m.name}</p>
                          <p className="text-[10px] text-blue-600 font-black uppercase mt-0.5">
                            {m.dosage} • {m.duration}d
                          </p>
                        </div>
                        <button 
                          onClick={() => deleteMedication(m.id)} 
                          className="text-red-400 hover:text-red-600 shadow-sm ml-2 cursor-pointer transition-colors"
                          disabled={saving}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="p-6 bg-white border-t border-gray-100 shrink-0">
            <button 
              onClick={handleFinalizeSession} 
              disabled={saving || !diagnosis.trim()}
              className="w-full py-5 bg-black text-white rounded-[1.75rem] font-black text-sm uppercase shadow-2xl active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Finalize Session'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:flex flex-col h-full w-full max-w-7xl bg-transparent relative">
        <div className="flex-1 overflow-hidden flex flex-row bg-white rounded-[2.5rem] shadow-xl border border-neutral-200/60">
          
          {/* Main workspace */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-[#FAFAFA]/40">
            {/* Header with back button */}
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-semibold">Back to Dashboard</span>
              </button>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="font-bold">{patientData.name}</span>
                <span className="text-gray-300">•</span>
                <span>ID: #{patientData.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-2xl border border-neutral-100 flex items-center gap-3 shadow-sm focus-within:border-teal-400">
                <Stethoscope size={24} className="text-teal-500" />
                <input 
                  className="w-full outline-none bg-transparent font-bold text-gray-800" 
                  placeholder="Diagnosis..." 
                  value={diagnosis} 
                  onChange={e => setDiagnosis(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-neutral-100 flex items-center gap-3 shadow-sm focus-within:border-blue-400">
                <Activity size={24} className="text-blue-500" />
                <input 
                  className="w-full outline-none bg-transparent font-bold text-gray-800" 
                  placeholder="Suggestions..." 
                  value={suggestions} 
                  onChange={e => setSuggestions(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-neutral-100 flex items-center gap-3 shadow-sm focus-within:border-amber-400">
              <FileText size={24} className="text-amber-500" />
              <input 
                className="w-full outline-none bg-transparent font-bold text-gray-800" 
                placeholder="Patient Key Notes (Allergies, chronic conditions, etc)..." 
                value={keyNotes} 
                onChange={e => setKeyNotes(e.target.value)}
                disabled={saving}
              />
            </div>

            <section className="bg-white shadow-sm border border-gray-100 rounded-[2.5rem] overflow-hidden flex flex-col min-h-[350px]">
              <div className="p-6 bg-gray-50 border-b flex justify-between items-center font-bold">
                <div className="flex items-center gap-2 uppercase tracking-widest text-xs opacity-50">
                  <Pill size={18}/> Prescriptions ({medications.length})
                </div>
                <button 
                  onClick={() => setIsAddMedOpen(true)} 
                  className="bg-blue-600 text-white text-sm px-6 py-2.5 rounded-xl shadow-md hover:bg-blue-700 transition-colors"
                  disabled={saving}
                >
                  + Add Medication
                </button>
              </div>
              <div className="p-10 flex-1 flex items-center justify-center">
                {medications.length === 0 ? (
                  <p className="text-center text-gray-300 font-bold uppercase opacity-50">
                    Active medications appear here
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-4 w-full self-start">
                    {medications.map(m => (
                      <div 
                        key={m.id} 
                        className="p-4 bg-gray-50 border border-gray-100 rounded-3xl flex justify-between items-center shadow-sm"
                      >
                        <div>
                          <p className="font-black text-gray-900">{m.name}</p>
                          <p className="text-xs text-blue-600 font-bold uppercase">
                            {m.dosage} • {m.duration} days
                          </p>
                        </div>
                        <button 
                          onClick={() => deleteMedication(m.id)} 
                          className="text-red-400 hover:text-red-600 transition-colors"
                          disabled={saving}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
            
            <button 
              onClick={handleFinalizeSession} 
              disabled={saving || !diagnosis.trim()}
              className="w-full py-5 bg-black text-white rounded-3xl font-bold shadow-xl active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Finalizing Session...
                </>
              ) : (
                'Finalize Session'
              )}
            </button>
          </div>

          {/* History sidebar */}
          <aside className="w-[400px] border-l border-gray-100 bg-white flex flex-col shrink-0">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-900 uppercase tracking-widest text-xs sticky top-0 bg-white z-10">
              <History size={16} className="text-blue-600" /> Visit History ({visits.length})
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar bg-[#FDFDFD]">
              {visits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                  <History size={40} className="mb-3 opacity-20" />
                  <p className="text-xs font-bold uppercase">No previous visits</p>
                </div>
              ) : (
                visits.map(v => (
                  <div key={v.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex justify-between font-black text-gray-900 text-xs uppercase">
                      <span>{v.title}</span>
                      <span className="text-gray-400">{v.date}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold">
                      <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
                        <b>Diag:</b> {v.diagnosis}
                      </div>
                      <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl">
                        <b>Note:</b> {v.suggestions}
                      </div>
                    </div>
                    
                    {v.medications && v.medications.length > 0 && (
                      <div className="rounded-xl border border-gray-100 overflow-x-auto custom-scrollbar-h">
                        <table className="w-full text-left text-[9px] min-w-[420px]">
                          <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr className="text-gray-400 font-bold uppercase tracking-tighter">
                              <th className="px-2 py-1.5 sticky left-0 bg-[#f9fafb]">Medicine</th>
                              <th className="px-2 py-1.5">Timing</th>
                              <th className="px-2 py-1.5 text-center">B/L/D</th>
                              <th className="px-2 py-1.5">Note</th>
                              <th className="px-2 py-1.5 text-right">Dur</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {v.medications.map((m, i) => (
                              <tr key={i} className="bg-white hover:bg-blue-50/30 transition-colors">
                                <td className="px-2 py-2 sticky left-0 bg-white shadow-[2px_0_5px_rgba(0,0,0,0.01)] font-black text-gray-900">
                                  {m.name}
                                </td>
                                <td className="px-2 py-2 text-gray-500">{m.foodTiming}</td>
                                <td className="px-2 py-2">
                                  <div className="flex gap-0.5 justify-center">
                                    {m.schedule?.breakfast && <span className="bg-blue-100 px-0.5 rounded text-blue-600">B</span>}
                                    {m.schedule?.lunch && <span className="bg-blue-100 px-0.5 rounded text-blue-600">L</span>}
                                    {m.schedule?.dinner && <span className="bg-blue-100 px-0.5 rounded text-blue-600">D</span>}
                                  </div>
                                </td>
                                <td className="px-2 py-2 text-gray-400 italic truncate max-w-[100px]">
                                  "{m.comments || "-"}"
                                </td>
                                <td className="px-2 py-2 text-right font-black text-blue-600 uppercase">
                                  {m.duration}d
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* --- MOBILE HISTORY SHEET --- */}
      <AnimatePresence>
        {showMobileHistory && (
          <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 backdrop-blur-sm md:hidden">
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
              className="bg-white w-full rounded-t-[3rem] p-6 max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6 border-b pb-4 shrink-0 font-black text-gray-900 uppercase text-sm">
                Visit History
                <button 
                  onClick={() => setShowMobileHistory(false)} 
                  className="p-2 bg-gray-100 rounded-full active:scale-90 transition-transform"
                >
                  <X size={20}/>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-10">
                {visits.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                    <History size={40} className="mb-3 opacity-20" />
                    <p className="text-xs font-bold uppercase">No previous visits</p>
                  </div>
                ) : (
                  visits.map(v => (
                    <div key={v.id} className="p-5 bg-gray-50 rounded-[2.5rem] border border-gray-200 space-y-3">
                      <div className="flex justify-between font-black text-gray-900 text-sm">
                        <span>{v.title}</span>
                        <span className="text-[10px] text-gray-400">{v.date}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase tracking-tighter">
                        <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl border border-teal-100">
                          <b>Diag:</b> {v.diagnosis}
                        </div>
                        <div className="p-3 bg-white text-gray-400 border border-gray-100 rounded-2xl">
                          <b>Note:</b> {v.suggestions}
                        </div>
                      </div>
                      
                      {v.medications && v.medications.length > 0 && (
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
                                  <td className="px-2 py-2 sticky left-0 bg-white font-black text-gray-900">
                                    {m.name}
                                  </td>
                                  <td className="px-2 py-2 text-gray-500">{m.foodTiming}</td>
                                  <td className="px-2 py-2">
                                    <div className="flex gap-0.5 justify-center">
                                      {m.schedule?.breakfast && <span className="bg-blue-100 px-0.5 rounded text-blue-600">B</span>}
                                      {m.schedule?.lunch && <span className="bg-blue-100 px-0.5 rounded text-blue-600">L</span>}
                                      {m.schedule?.dinner && <span className="bg-blue-100 px-0.5 rounded text-blue-600">D</span>}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 text-gray-400 italic truncate max-w-[80px]">
                                    "{m.comments || "-"}"
                                  </td>
                                  <td className="px-2 py-2 text-right font-black text-blue-600 uppercase">
                                    {m.duration}d
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Use the enhanced AddMedication modal */}
      <AddMedication
        isOpen={isAddMedOpen} 
        onClose={() => setIsAddMedOpen(false)} 
        onSave={addMedication}
        patientId={patientData?.id}
      />

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