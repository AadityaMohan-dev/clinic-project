import React, { useState } from 'react';
import { DeliveryScheduler } from '../ui/delivery-scheduler';
import { ChatMessageListDemo } from '../ui/chat-demo'; 
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Building2, Video, CalendarCheck, ChevronLeft } from 'lucide-react';

export function BookingModal({ isOpen, onClose, onSubmit }) {
  const [isBooked, setIsBooked] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ date: '', time: '', type: 'Clinic visit' });
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [appointmentType, setAppointmentType] = useState('Clinic visit');

  // TRIGGERED BY THE EXISTING BUTTON INSIDE DELIVERY SCHEDULER
  const handleSchedule = (dateTime) => {
    // 1. Prepare the data
    const finalData = {
      name: "New Patient", 
      doctor: "Dr. Sarah Smith",
      date: dateTime.date.toISOString(),
      time: dateTime.time,
      isTele: appointmentType === 'Teleconsultation',
      notes: `${appointmentType} via Welbi AI`
    };

    // 2. Set internal display details
    setBookingDetails({
      date: dateTime.date.toLocaleDateString(),
      time: dateTime.time,
      type: appointmentType
    });

    // 3. SEND DATA TO DASHBOARD (Creates the Card)
    if (onSubmit) {
      onSubmit(finalData);
    }

    // 4. Show success view
    setIsBooked(true);
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
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 backdrop-blur-md bg-white/95 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                   <CalendarCheck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">Appointment Booked!</h2>
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 w-full max-w-xs">
                  <p className="text-gray-600 text-sm">Your <span className="text-blue-600 font-bold">{bookingDetails.type}</span> is scheduled:</p>
                  <p className="text-lg font-bold mt-1">{bookingDetails.date} at {bookingDetails.time}</p>
                </div>
                
                <div className="flex flex-col gap-3 w-full max-w-xs mt-8">
                    <button onClick={() => setShowMobileChat(true)} className="flex md:hidden items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg">
                      <MessageCircle size={20} /> Talk to Welbi
                    </button>
                    <button onClick={onClose} className="py-2 text-gray-500 font-bold hover:text-gray-700">Go to Dashboard</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Select Appointment</h2>
            <button onClick={onClose} className="md:hidden p-2 text-gray-400"><X size={24} /></button>
          </div>

          <div className="mb-6 space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Visit Mode</p>
            <div className="flex gap-3">
              {[
                { id: 'Clinic visit', icon: <Building2 size={18} /> },
                { id: 'Teleconsultation', icon: <Video size={18} /> }
              ].map((type) => (
                <label key={type.id} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${appointmentType === type.id ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-100 bg-gray-50 text-gray-500'}`}>
                  <input type="radio" name="type" value={type.id} checked={appointmentType === type.id} onChange={(e) => setAppointmentType(e.target.value)} className="hidden" />
                  {type.icon} <span className="font-bold text-xs">{type.id}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <DeliveryScheduler 
              timeSlots={['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM', '5:00 PM']}
              onSchedule={handleSchedule} // TRIGGERS ON THE ALREADY EXISTING BUTTON
              className="border-none shadow-none"
            />
          </div>
        </div>

        {/* RIGHT SIDE: CHATBOT */}
        <div className={`w-full md:w-1/2 bg-gray-50 flex flex-col h-full ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
          <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowMobileChat(false)} className="md:hidden p-1 text-gray-900 hover:bg-gray-100 rounded-full">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">W</div>
              <div><p className="font-bold text-sm">Welbi AI</p><div className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span><span className="text-[10px] text-gray-500 font-bold uppercase">Online</span></div></div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 overflow-hidden bg-white"><ChatMessageListDemo /></div>
        </div>

      </motion.div>
    </div>
  );
}