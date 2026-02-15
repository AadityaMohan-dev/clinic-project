import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, FileText, Stethoscope, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function AddAppointment({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    patientName: "", 
    patientEmail: "", 
    patientPhone: "",
    date: "", 
    time: "", 
    doctor: "",
    appointmentType: "", 
    reason: "", 
    notes: "", 
    status: "pending"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const appointmentTypes = ["Checkup", "Cleaning", "Extraction", "Root Canal", "Whitening", "Emergency", "Follow-up"];

  // Fetch current user on mount
  useEffect(() => {
    getCurrentUser();
    fetchDoctors();
  }, []);

  // Get current authenticated user
  const getCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (user) {
        setCurrentUser(user);
        // Pre-fill form with user data if available
        setFormData(prev => ({
          ...prev,
          patientEmail: user.email || "",
          patientName: user.user_metadata?.full_name || "",
          patientPhone: user.user_metadata?.phone_number || ""
        }));

        // Fetch additional user profile data if exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setFormData(prev => ({
            ...prev,
            patientName: profile.full_name || prev.patientName,
            patientPhone: profile.phone_number || prev.patientPhone
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Fetch doctors from Supabase
  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      // Assuming you have a 'doctors' table
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name, specialization')
        .eq('active', true)
        .order('name');

      if (error) throw error;

      if (data && data.length > 0) {
        setDoctors(data);
      } else {
        // Fallback to default doctors if table doesn't exist or is empty
        setDoctors([
          { id: 1, name: "Dr. Sarah Smith", specialization: "General" },
          { id: 2, name: "Dr. Michael Johnson", specialization: "Orthodontics" },
          { id: 3, name: "Dr. Emily Brown", specialization: "Pediatric" },
          { id: 4, name: "Dr. David Lee", specialization: "Periodontics" },
          { id: 5, name: "Dr. Jessica Williams", specialization: "Endodontics" }
        ]);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Use default doctors as fallback
      setDoctors([
        { id: 1, name: "Dr. Sarah Smith" },
        { id: 2, name: "Dr. Michael Johnson" },
        { id: 3, name: "Dr. Emily Brown" },
        { id: 4, name: "Dr. David Lee" },
        { id: 5, name: "Dr. Jessica Williams" }
      ]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = "Required";
    if (!formData.date) newErrors.date = "Required";
    if (!formData.time) newErrors.time = "Required";
    if (!formData.doctor) newErrors.doctor = "Required";
    
    // Email validation
    if (formData.patientEmail && !/\S+@\S+\.\S+/.test(formData.patientEmail)) {
      newErrors.patientEmail = "Invalid email";
    }
    
    // Phone validation (basic)
    if (formData.patientPhone && formData.patientPhone.length < 10) {
      newErrors.patientPhone = "Invalid phone";
    }

    // Date validation (can't book past dates)
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Can't book past dates";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Combine date and time for timestamp
      const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);

      // Prepare appointment data
      const appointmentData = {
        patient_name: formData.patientName,
        patient_email: formData.patientEmail || null,
        patient_phone: formData.patientPhone || null,
        appointment_date: appointmentDateTime.toISOString(),
        doctor_name: formData.doctor,
        appointment_type: formData.appointmentType || 'Checkup',
        reason: formData.reason || null,
        notes: formData.notes || null,
        status: formData.status,
        created_by: currentUser?.id || null,
        created_at: new Date().toISOString()
      };

      // Insert appointment into Supabase
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email (optional - using Supabase Edge Functions)
      if (formData.patientEmail) {
        try {
          await supabase.functions.invoke('send-appointment-confirmation', {
            body: {
              to: formData.patientEmail,
              patientName: formData.patientName,
              appointmentDate: appointmentDateTime,
              doctorName: formData.doctor
            }
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          // Don't block appointment creation if email fails
        }
      }

      // Call parent's onSubmit with the created appointment
      onSubmit?.(data);
      
      // Show success message
      alert('Appointment booked successfully!');
      onClose();
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      setErrors({ submit: error.message || 'Failed to book appointment. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Check for appointment conflicts
  const checkConflicts = async () => {
    if (!formData.date || !formData.time || !formData.doctor) return;

    try {
      const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
      const endTime = new Date(appointmentDateTime.getTime() + 30 * 60000); // 30 min slots

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_name', formData.doctor)
        .gte('appointment_date', appointmentDateTime.toISOString())
        .lt('appointment_date', endTime.toISOString())
        .neq('status', 'cancelled');

      if (error) throw error;

      if (data && data.length > 0) {
        setErrors(prev => ({ 
          ...prev, 
          time: 'This time slot is already booked' 
        }));
      }
    } catch (error) {
      console.error('Error checking conflicts:', error);
    }
  };

  // Check conflicts when doctor, date, or time changes
  useEffect(() => {
    if (formData.date && formData.time && formData.doctor) {
      checkConflicts();
    }
  }, [formData.date, formData.time, formData.doctor]);

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-slideUp max-h-[70vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 px-6 border-b border-gray-100 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">New Appointment</h2>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Error Alert */}
        {errors.submit && (
          <div className="mx-6 mt-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs text-red-700">{errors.submit}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3 custom-modal-scrollbar bg-white">
          
          <div className="space-y-0.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Patient Name *</label>
            <input 
              name="patientName" 
              value={formData.patientName} 
              onChange={handleChange} 
              placeholder="John Doe"
              disabled={loading}
              className={`w-full px-3 py-1.5 text-sm bg-gray-50 border rounded-lg outline-none focus:ring-1 focus:ring-blue-500/10 disabled:opacity-50 ${errors.patientName ? 'border-red-300' : 'border-gray-200'}`} 
            />
            {errors.patientName && <p className="text-[10px] text-red-500 ml-1">{errors.patientName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email</label>
              <input 
                name="patientEmail" 
                type="email"
                value={formData.patientEmail} 
                onChange={handleChange} 
                placeholder="email@test.com"
                disabled={loading}
                className={`w-full px-3 py-1.5 text-sm bg-gray-50 border rounded-lg outline-none disabled:opacity-50 ${errors.patientEmail ? 'border-red-300' : 'border-gray-200'}`}
              />
              {errors.patientEmail && <p className="text-[10px] text-red-500 ml-1">{errors.patientEmail}</p>}
            </div>
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Phone</label>
              <input 
                name="patientPhone" 
                type="tel"
                value={formData.patientPhone} 
                onChange={handleChange} 
                placeholder="+1..."
                disabled={loading}
                className={`w-full px-3 py-1.5 text-sm bg-gray-50 border rounded-lg outline-none disabled:opacity-50 ${errors.patientPhone ? 'border-red-300' : 'border-gray-200'}`}
              />
              {errors.patientPhone && <p className="text-[10px] text-red-500 ml-1">{errors.patientPhone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Date *</label>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                disabled={loading}
                className={`w-full px-3 py-1.5 text-sm bg-gray-50 border rounded-lg outline-none disabled:opacity-50 ${errors.date ? 'border-red-300' : 'border-gray-200'}`} 
              />
              {errors.date && <p className="text-[10px] text-red-500 ml-1">{errors.date}</p>}
            </div>
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Time *</label>
              <input 
                type="time" 
                name="time" 
                value={formData.time} 
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-3 py-1.5 text-sm bg-gray-50 border rounded-lg outline-none disabled:opacity-50 ${errors.time ? 'border-red-300' : 'border-gray-200'}`}
              />
              {errors.time && <p className="text-[10px] text-red-500 ml-1">{errors.time}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Doctor *</label>
              <select 
                name="doctor" 
                value={formData.doctor} 
                onChange={handleChange}
                disabled={loading || loadingDoctors}
                className={`w-full px-3 py-1.5 text-sm bg-gray-50 border rounded-lg outline-none disabled:opacity-50 ${errors.doctor ? 'border-red-300' : 'border-gray-200'}`}
              >
                <option value="">
                  {loadingDoctors ? "Loading..." : "Select Doctor"}
                </option>
                {doctors.map(d => (
                  <option key={d.id} value={d.name}>
                    {d.name} {d.specialization ? `- ${d.specialization}` : ''}
                  </option>
                ))}
              </select>
              {errors.doctor && <p className="text-[10px] text-red-500 ml-1">{errors.doctor}</p>}
            </div>
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Type</label>
              <select 
                name="appointmentType" 
                value={formData.appointmentType} 
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none disabled:opacity-50"
              >
                <option value="">Select Type</option>
                {appointmentTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-0.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Reason</label>
            <textarea 
              name="reason" 
              value={formData.reason} 
              onChange={handleChange} 
              rows="1" 
              placeholder="Describe the issue..."
              disabled={loading}
              className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none resize-none disabled:opacity-50" 
            />
          </div>
          
          <div className="space-y-0.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange} 
              rows="1" 
              placeholder="Extra details..."
              disabled={loading}
              className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none resize-none disabled:opacity-50" 
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-white flex gap-2 shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={loading}
            className="flex-1 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="flex-1 py-2 bg-black text-white text-xs font-bold rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Booking...
              </>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </div>

      <style>{`
        .custom-modal-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-modal-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export default AddAppointment;