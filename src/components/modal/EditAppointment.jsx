import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, FileText, Stethoscope, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function EditAppointment({ onClose, appointment, onUpdate }) {
  const [formData, setFormData] = useState({
    patientName: "",
    date: "",
    time: "",
    doctor: "",
    doctorId: null,
    reason: "",
    status: "pending",
    notes: "",
    appointmentType: "Checkup"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [originalDateTime, setOriginalDateTime] = useState(null);

  // Initialize form data from appointment prop
  useEffect(() => {
    if (appointment) {
      // Parse the appointment date
      const appointmentDate = new Date(appointment.appointment_date || appointment.date);
      const dateStr = appointmentDate.toISOString().split('T')[0];
      const timeStr = appointmentDate.toTimeString().slice(0, 5); // HH:MM format

      setFormData({
        patientName: appointment.patient_name || appointment.patientName || "",
        date: dateStr,
        time: timeStr,
        doctor: appointment.doctor_name || appointment.doctorName || "",
        doctorId: appointment.doctor_id || null,
        reason: appointment.reason || "",
        status: appointment.status || "pending",
        notes: appointment.notes || "",
        appointmentType: appointment.appointment_type || "Checkup"
      });

      setOriginalDateTime({
        date: dateStr,
        time: timeStr,
        doctorId: appointment.doctor_id
      });
    }

    fetchDoctors();
  }, [appointment]);

  // Fetch available doctors
  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name, specialization')
        .eq('active', true)
        .order('name');

      if (error) throw error;

      if (data && data.length > 0) {
        setDoctors(data);
      } else {
        // Fallback doctors
        setDoctors([
          { id: 1, name: 'Dr. Smith', specialization: 'General' },
          { id: 2, name: 'Dr. Johnson', specialization: 'Orthodontics' },
          { id: 3, name: 'Dr. Lee', specialization: 'Pediatric' },
          { id: 4, name: 'Dr. Williams', specialization: 'Periodontics' },
          { id: 5, name: 'Dr. Brown', specialization: 'Endodontics' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Use fallback
      setDoctors([
        { id: 1, name: 'Dr. Smith' },
        { id: 2, name: 'Dr. Johnson' },
        { id: 3, name: 'Dr. Lee' }
      ]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If doctor is changed, update both name and ID
    if (name === 'doctor') {
      const selectedDoctor = doctors.find(d => d.name === value);
      setFormData(prev => ({ 
        ...prev, 
        doctor: value,
        doctorId: selectedDoctor?.id || null
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientName.trim()) {
      newErrors.patientName = "Patient name is required";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      // Check if date is not in the past
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Cannot schedule appointments in the past";
      }
    }
    
    if (!formData.time) {
      newErrors.time = "Time is required";
    }
    
    if (!formData.doctor) {
      newErrors.doctor = "Doctor selection is required";
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check for appointment conflicts
  const checkConflicts = async () => {
    try {
      const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
      const endTime = new Date(appointmentDateTime.getTime() + 30 * 60000); // 30 min slots

      // Skip conflict check if date/time/doctor hasn't changed
      if (
        originalDateTime &&
        formData.date === originalDateTime.date &&
        formData.time === originalDateTime.time &&
        formData.doctorId === originalDateTime.doctorId
      ) {
        return true;
      }

      const { data, error } = await supabase
        .from('appointments')
        .select('id')
        .eq('doctor_id', formData.doctorId)
        .gte('appointment_date', appointmentDateTime.toISOString())
        .lt('appointment_date', endTime.toISOString())
        .neq('status', 'cancelled')
        .neq('id', appointment.id); // Exclude current appointment

      if (error) throw error;

      if (data && data.length > 0) {
        setErrors(prev => ({ 
          ...prev, 
          time: 'This time slot is already booked for this doctor' 
        }));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking conflicts:', error);
      return true; // Allow update if conflict check fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // Check for conflicts
      const noConflicts = await checkConflicts();
      if (!noConflicts) {
        setLoading(false);
        return;
      }

      // Combine date and time
      const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);

      // Prepare update data
      const updateData = {
        patient_name: formData.patientName,
        doctor_id: formData.doctorId,
        doctor_name: formData.doctor,
        appointment_date: appointmentDateTime.toISOString(),
        appointment_type: formData.appointmentType,
        reason: formData.reason,
        notes: formData.notes || null,
        status: formData.status,
        updated_at: new Date().toISOString()
      };

      // Update appointment in Supabase
      const { data, error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', appointment.id)
        .select()
        .single();

      if (error) throw error;

      // Log the change in appointment history
      await supabase
        .from('appointment_history')
        .insert([{
          appointment_id: appointment.id,
          action: 'updated',
          changed_fields: JSON.stringify({
            from: {
              date: originalDateTime.date,
              time: originalDateTime.time,
              doctor: appointment.doctor_name,
              status: appointment.status
            },
            to: {
              date: formData.date,
              time: formData.time,
              doctor: formData.doctor,
              status: formData.status
            }
          }),
          performed_by: appointment.patient_id, // Or current user ID
          created_at: new Date().toISOString()
        }]);

      // Send notification to patient if date/time changed
      if (
        formData.date !== originalDateTime.date ||
        formData.time !== originalDateTime.time
      ) {
        await supabase
          .from('notifications')
          .insert([{
            user_id: appointment.patient_id,
            title: 'Appointment Rescheduled',
            message: `Your appointment has been rescheduled to ${new Date(appointmentDateTime).toLocaleDateString()} at ${formData.time}`,
            type: 'appointment',
            related_id: appointment.id,
            read: false,
            created_at: new Date().toISOString()
          }]);

        // Send email notification (optional)
        try {
          await supabase.functions.invoke('send-appointment-update', {
            body: {
              to: appointment.patient_email,
              patientName: formData.patientName,
              oldDateTime: new Date(`${originalDateTime.date}T${originalDateTime.time}`),
              newDateTime: appointmentDateTime,
              doctorName: formData.doctor,
              reason: formData.reason
            }
          });
        } catch (emailError) {
          console.error('Failed to send notification email:', emailError);
        }
      }

      // Call parent's onUpdate callback
      if (onUpdate) {
        onUpdate(data);
      }

      // Show success message
      alert('Appointment updated successfully!');
      onClose();

    } catch (error) {
      console.error('Error updating appointment:', error);
      setErrors({ submit: error.message || 'Failed to update appointment. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Appointment</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Update appointment details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-gray-700 transition-all duration-200 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Error Alert */}
        {errors.submit && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">{errors.submit}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Patient Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <User className="w-4 h-4 text-blue-600" />
              Patient Name
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.patientName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Enter patient name"
            />
            {errors.patientName && (
              <p className="flex items-center gap-1 text-xs sm:text-sm text-red-600">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                {errors.patientName}
              </p>
            )}
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-blue-600" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                disabled={loading}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.date ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              {errors.date && (
                <p className="flex items-center gap-1 text-xs sm:text-sm text-red-600">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {errors.date}
                </p>
              )}
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
                <Clock className="w-4 h-4 text-blue-600" />
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.time ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              {errors.time && (
                <p className="flex items-center gap-1 text-xs sm:text-sm text-red-600">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {errors.time}
                </p>
              )}
            </div>
          </div>

          {/* Doctor & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Doctor */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                Doctor
              </label>
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                disabled={loading || loadingDoctors}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.doctor ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="">
                  {loadingDoctors ? 'Loading...' : 'Select a doctor'}
                </option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name} {doctor.specialization && `- ${doctor.specialization}`}
                  </option>
                ))}
              </select>
              {errors.doctor && (
                <p className="flex items-center gap-1 text-xs sm:text-sm text-red-600">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {errors.doctor}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
                <FileText className="w-4 h-4 text-blue-600" />
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>
          </div>

          {/* Appointment Type */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-blue-600" />
              Appointment Type
            </label>
            <select
              name="appointmentType"
              value={formData.appointmentType}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
            >
              <option value="Checkup">Checkup</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Extraction">Extraction</option>
              <option value="Root Canal">Root Canal</option>
              <option value="Whitening">Whitening</option>
              <option value="Emergency">Emergency</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>

          {/* Reason for Visit */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-blue-600" />
              Reason for Visit
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              disabled={loading}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.reason ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Enter reason for visit"
            />
            {errors.reason && (
              <p className="flex items-center gap-1 text-xs sm:text-sm text-red-600">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                {errors.reason}
              </p>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-blue-600" />
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              disabled={loading}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none disabled:bg-gray-100"
              placeholder="Add any additional notes..."
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-semibold text-sm sm:text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default EditAppointment;