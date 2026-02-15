import React, { useState, useEffect } from 'react';
import { DeliveryScheduler } from '../ui/delivery-scheduler';
import { ChatMessageListDemo } from '../ui/chat-demo'; 
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Building2, Video, CalendarCheck, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function BookingModal({ isOpen, onClose, onSubmit }) {
  const [isBooked, setIsBooked] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ 
    date: '', 
    time: '', 
    type: 'Clinic visit',
    appointmentId: null 
  });
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [appointmentType, setAppointmentType] = useState('Clinic visit');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);

  // Fetch current user and doctors on mount
  useEffect(() => {
    if (isOpen) {
      fetchCurrentUser();
      fetchDoctors();
    }
  }, [isOpen]);

  // Fetch current authenticated user
  const fetchCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setCurrentUser(user);

      // Fetch user profile for additional details
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setCurrentUser({ ...user, profile });
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Fetch available doctors
  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name, specialization, available')
        .eq('active', true)
        .order('name');

      if (error) throw error;

      if (data && data.length > 0) {
        setDoctors(data);
        setSelectedDoctor(data[0]); // Set first doctor as default
        fetchAvailableSlots(data[0].id); // Fetch slots for default doctor
      } else {
        // Fallback doctors
        setDoctors([
          { id: 1, name: 'Dr. Sarah Smith', specialization: 'General Dentist' }
        ]);
        setSelectedDoctor({ id: 1, name: 'Dr. Sarah Smith', specialization: 'General Dentist' });
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Use fallback
      setDoctors([
        { id: 1, name: 'Dr. Sarah Smith', specialization: 'General Dentist' }
      ]);
      setSelectedDoctor({ id: 1, name: 'Dr. Sarah Smith', specialization: 'General Dentist' });
    }
  };

  // Fetch available time slots for selected doctor and date
  const fetchAvailableSlots = async (doctorId, selectedDate = new Date()) => {
    setLoadingSlots(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];

      // Get existing appointments for this doctor on this date
      const { data: existingAppointments, error } = await supabase
        .from('appointments')
        .select('appointment_date')
        .eq('doctor_id', doctorId)
        .gte('appointment_date', `${dateStr}T00:00:00`)
        .lt('appointment_date', `${dateStr}T23:59:59`)
        .neq('status', 'cancelled');

      if (error) throw error;

      // Default time slots
      const allSlots = [
        '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
        '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
      ];

      // Filter out booked slots
      const bookedTimes = existingAppointments.map(apt => {
        const time = new Date(apt.appointment_date);
        return time.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      });

      const available = allSlots.filter(slot => !bookedTimes.includes(slot));
      setAvailableSlots(available);

    } catch (error) {
      console.error('Error fetching slots:', error);
      // Use default slots on error
      setAvailableSlots(['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM', '5:00 PM']);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Handle appointment scheduling
  const handleSchedule = async (dateTime) => {
    if (!currentUser) {
      setError('Please login to book an appointment');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Combine date and time
      const appointmentDateTime = new Date(dateTime.date);
      const [time, modifier] = dateTime.time.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours);
      
      if (modifier === 'PM' && hours !== 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      
      appointmentDateTime.setHours(hours, parseInt(minutes), 0, 0);

      // Check for conflicts again before inserting
      const { data: conflicts } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', selectedDoctor.id)
        .eq('appointment_date', appointmentDateTime.toISOString())
        .neq('status', 'cancelled');

      if (conflicts && conflicts.length > 0) {
        setError('This time slot is no longer available. Please select another.');
        return;
      }

      // Prepare appointment data
      const appointmentData = {
        patient_id: currentUser.id,
        patient_name: currentUser.profile?.full_name || currentUser.email,
        patient_email: currentUser.email,
        patient_phone: currentUser.profile?.phone_number || null,
        doctor_id: selectedDoctor.id,
        doctor_name: selectedDoctor.name,
        appointment_date: appointmentDateTime.toISOString(),
        appointment_type: appointmentType,
        is_teleconsultation: appointmentType === 'Teleconsultation',
        reason: `${appointmentType} booked via Welbi AI`,
        notes: `Booked through Welbi AI assistant`,
        status: 'pending',
        created_by: currentUser.id,
        created_at: new Date().toISOString(),
        booking_source: 'welbi_ai'
      };

      // Insert appointment into Supabase
      const { data: newAppointment, error: insertError } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (insertError) throw insertError;

      // Send confirmation email (optional - via Edge Function)
      try {
        await supabase.functions.invoke('send-appointment-confirmation', {
          body: {
            to: currentUser.email,
            patientName: appointmentData.patient_name,
            appointmentDate: appointmentDateTime,
            doctorName: selectedDoctor.name,
            appointmentType: appointmentType,
            isTelemedicine: appointmentType === 'Teleconsultation'
          }
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't block booking if email fails
      }

      // Create notification for the patient
      await supabase
        .from('notifications')
        .insert([{
          user_id: currentUser.id,
          title: 'Appointment Confirmed',
          message: `Your ${appointmentType} with ${selectedDoctor.name} is scheduled for ${appointmentDateTime.toLocaleDateString()} at ${dateTime.time}`,
          type: 'appointment',
          related_id: newAppointment.id,
          read: false,
          created_at: new Date().toISOString()
        }]);

      // If teleconsultation, create video meeting link
      if (appointmentType === 'Teleconsultation') {
        await createTelemedicineSession(newAppointment.id, appointmentDateTime);
      }

      // Set booking details for UI display
      setBookingDetails({
        date: appointmentDateTime.toLocaleDateString(),
        time: dateTime.time,
        type: appointmentType,
        appointmentId: newAppointment.id,
        doctorName: selectedDoctor.name
      });

      // Call parent's onSubmit with the created appointment
      if (onSubmit) {
        onSubmit({
          ...newAppointment,
          date: appointmentDateTime.toISOString(),
          time: dateTime.time,
          isTele: appointmentType === 'Teleconsultation'
        });
      }

      // Show success view
      setIsBooked(true);

    } catch (error) {
      console.error('Error booking appointment:', error);
      setError(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create telemedicine session
  const createTelemedicineSession = async (appointmentId, appointmentDate) => {
    try {
      const meetingLink = `https://meet.yourdomain.com/appointment/${appointmentId}`;
      
      await supabase
        .from('telemedicine_sessions')
        .insert([{
          appointment_id: appointmentId,
          meeting_link: meetingLink,
          scheduled_time: appointmentDate.toISOString(),
          status: 'scheduled',
          created_at: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Error creating telemedicine session:', error);
    }
  };

  // Handle doctor change
  const handleDoctorChange = (doctor) => {
    setSelectedDoctor(doctor);
    fetchAvailableSlots(doctor.id);
  };

  // Reset state when modal closes
  const handleClose = () => {
    setIsBooked(false);
    setError(null);
    setShowMobileChat(false);
    setAppointmentType('Clinic visit');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 text-gray-900">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full h-full sm:rounded-2xl shadow-2xl sm:max-w-6xl sm:h-[85vh] overflow-hidden flex flex-col md:flex-row"
      >
        
        {/* LEFT SIDE: CALENDAR */}
        <div className={`relative w-full md:w-1/2 p-6 flex flex-col border-r border-gray-200 bg-white 
          ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          
          <AnimatePresence>
            {isBooked && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 backdrop-blur-md bg-white/95 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CalendarCheck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">Appointment Booked!</h2>
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 w-full max-w-xs">
                  <p className="text-gray-600 text-sm">
                    Your <span className="text-blue-600 font-bold">{bookingDetails.type}</span> is scheduled:
                  </p>
                  <p className="text-lg font-bold mt-1">
                    {bookingDetails.date} at {bookingDetails.time}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    with {bookingDetails.doctorName}
                  </p>
                  {appointmentType === 'Teleconsultation' && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700">
                        Video call link sent to your email
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-3 w-full max-w-xs mt-8">
                  <button 
                    onClick={() => setShowMobileChat(true)} 
                    className="flex md:hidden items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
                  >
                    <MessageCircle size={20} /> Talk to Welbi
                  </button>
                  <button 
                    onClick={handleClose} 
                    className="py-2 text-gray-500 font-bold hover:text-gray-700"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Select Appointment</h2>
            <button 
              onClick={handleClose} 
              className="md:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Doctor Selection */}
          {doctors.length > 1 && (
            <div className="mb-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">
                Select Doctor
              </p>
              <select
                value={selectedDoctor?.id}
                onChange={(e) => {
                  const doctor = doctors.find(d => d.id === parseInt(e.target.value));
                  handleDoctorChange(doctor);
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                disabled={loading}
              >
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} {doctor.specialization && `- ${doctor.specialization}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Visit Mode Selection */}
          <div className="mb-6 space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Visit Mode
            </p>
            <div className="flex gap-3">
              {[
                { id: 'Clinic visit', icon: <Building2 size={18} />, label: 'Clinic Visit' },
                { id: 'Teleconsultation', icon: <Video size={18} />, label: 'Video Call' }
              ].map((type) => (
                <label 
                  key={type.id} 
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    appointmentType === type.id 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                      : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input 
                    type="radio" 
                    name="type" 
                    value={type.id} 
                    checked={appointmentType === type.id} 
                    onChange={(e) => setAppointmentType(e.target.value)} 
                    className="hidden"
                    disabled={loading}
                  />
                  {type.icon} 
                  <span className="font-bold text-xs">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Calendar/Scheduler */}
          <div className="flex-1 overflow-y-auto">
            {loadingSlots ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <DeliveryScheduler 
                timeSlots={availableSlots}
                onSchedule={handleSchedule}
                className="border-none shadow-none"
                disabled={loading}
                onDateChange={(date) => fetchAvailableSlots(selectedDoctor.id, date)}
              />
            )}
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-sm font-medium text-gray-600">Booking your appointment...</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: CHATBOT */}
        <div className={`w-full md:w-1/2 bg-gray-50 flex flex-col h-full ${
          showMobileChat ? 'flex' : 'hidden md:flex'
        }`}>
          <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowMobileChat(false)} 
                className="md:hidden p-1 text-gray-900 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                W
              </div>
              <div>
                <p className="font-bold text-sm">Welbi AI</p>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden bg-white">
            <ChatMessageListDemo 
              appointmentType={appointmentType}
              selectedDoctor={selectedDoctor}
              onBookingRequest={() => setShowMobileChat(false)}
            />
          </div>
        </div>

      </motion.div>
    </div>
  );
}