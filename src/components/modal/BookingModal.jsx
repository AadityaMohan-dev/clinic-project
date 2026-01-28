import React, { useState } from 'react';
import { DeliveryScheduler } from '../ui/delivery-scheduler';
import { ChatMessageListDemo } from '../ui/chat-demo'; 
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function BookingModal({ isOpen, onClose }) {
  const [isBooked, setIsBooked] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ date: '', time: '' });

  const handleSchedule = (dateTime) => {
    setBookingDetails({
      date: dateTime.date.toLocaleDateString(),
      time: dateTime.time,
    });
    setIsBooked(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-gray-900">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] overflow-hidden flex flex-col md:flex-row"
      >
        {/* LEFT SIDE: CALENDAR SELECTION */}
        <div className="relative w-full md:w-1/2 p-6 flex flex-col border-r border-gray-200 bg-white">
          <AnimatePresence>
            {isBooked && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-10 backdrop-blur-md bg-white/70 flex flex-col items-center justify-center p-8 text-center"
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
                <p className="mt-4 text-sm text-blue-600 font-medium">
                  Meanwhile, you can talk to Welbi
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <h2 className="text-xl font-bold mb-4 text-gray-800">Select Appointment</h2>
          <div className="flex-1 flex items-center justify-center">
            <DeliveryScheduler 
              timeSlots={['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM', '5:00 PM']}
              timeZone="Clinic Time (GMT+1)"
              onSchedule={handleSchedule}
              className="border-none shadow-none"
            />
          </div>
        </div>

        {/* RIGHT SIDE: CHATBOT WELBI */}
        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
            <div className="flex items-center gap-3">
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
          <div className="flex-1 overflow-hidden">
             <ChatMessageListDemo />
          </div>
        </div>
      </motion.div>
    </div>
  );
}