import React, { useState } from 'react';
import { DeliveryScheduler } from '../ui/delivery-scheduler';
import { ChatMessageListDemo } from '../ui/chat-demo'; 
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

export function BookingModal({ isOpen, onClose }) {
  const [isBooked, setIsBooked] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ date: '', time: '' });
  // New state to toggle mobile view from "Success" to "Chat"
  const [showMobileChat, setShowMobileChat] = useState(false);

  const handleSchedule = (dateTime) => {
    setBookingDetails({
      date: dateTime.date.toLocaleDateString(),
      time: dateTime.time,
    });
    setIsBooked(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 text-gray-900">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full h-full sm:rounded-2xl shadow-2xl sm:max-w-6xl sm:h-[80vh] overflow-hidden flex flex-col md:flex-row"
      >
        
        {/* --- LEFT SIDE: CALENDAR (Always visible on Desktop, Conditional on Mobile) --- */}
        <div className={`relative w-full md:w-1/2 p-6 flex flex-col border-r border-gray-200 bg-white 
          ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          
          <AnimatePresence>
            {isBooked && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 backdrop-blur-md bg-white/90 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                   </svg>
                </div>
                <h2 className="text-2xl font-bold">Appointment Booked!</h2>
                <p className="mt-2 text-gray-600">
                  Your appointment is booked on <span className="font-bold">{bookingDetails.date}</span> at <span className="font-bold">{bookingDetails.time}</span>.
                </p>
                <p className="mt-4 text-sm text-gray-500 font-medium">
                  Meanwhile, you can talk to Welbi
                </p>
                
                {/* Mobile Only: Button to switch to Chat */}
                <button 
                  onClick={() => setShowMobileChat(true)}
                  className="mt-6 flex md:hidden items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-transform"
                >
                  <MessageCircle size={20} />
                  Talk to Welbi
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Select Appointment</h2>
            {/* Mobile close button when chat isn't open yet */}
            <button onClick={onClose} className="md:hidden p-2 text-gray-400">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-y-auto">
            <DeliveryScheduler 
              timeSlots={['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM', '5:00 PM']}
              timeZone="Clinic Time (GMT+1)"
              onSchedule={handleSchedule}
              className="border-none shadow-none"
            />
          </div>
        </div>

        {/* --- RIGHT SIDE: CHATBOT (Hidden on Mobile until button clicked) --- */}
        <div className={`w-full md:w-1/2 bg-gray-50 flex flex-col h-full
          ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
          
          <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Added back button for mobile to return to calendar if needed */}
              {showMobileChat && (
                <button 
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden p-1 text-gray-400 mr-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">W</div>
              <div>
                <p className="font-bold text-sm">Welbi AI</p>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Online</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
               <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden bg-white">
             <ChatMessageListDemo />
          </div>
        </div>

      </motion.div>
    </div>
  );
}