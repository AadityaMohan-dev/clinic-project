import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils'; // Adjust path to your utils file if needed

const scheduleButtonVariants = cva(
  'relative isolate inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-transparent text-foreground hover:bg-muted',
        selected: 'text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const getWeekDays = (startDate) => {
  const days = [];
  const startOfWeek = new Date(startDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); 
  startOfWeek.setDate(diff);

  for (let i = 0; i < 6; i++) {
    const nextDay = new Date(startOfWeek);
    nextDay.setDate(startOfWeek.getDate() + i);
    days.push(nextDay);
  }
  return days;
};

export const DeliveryScheduler = ({
  initialDate = new Date(),
  timeSlots = [],
  timeZone,
  onSchedule,
  className,
}) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState(timeSlots[0] || null);
  
  const weekDays = getWeekDays(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  const changeWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };
  
  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      onSchedule({ date: selectedDate, time: selectedTime });
    }
  };

  return (
    <div className={cn('w-full max-w-md rounded-2xl border bg-white p-6 shadow-lg', className)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{monthYear}</h3>
          <div className="flex items-center space-x-2">
            <button onClick={() => changeWeek('prev')} className="p-1 hover:bg-gray-100 rounded-md"><ChevronLeft size={20}/></button>
            <button onClick={() => changeWeek('next')} className="p-1 hover:bg-gray-100 rounded-md"><ChevronRight size={20}/></button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {weekDays.map((day) => {
            const isSelected = selectedDate.toDateString() === day.toDateString();
            return (
              <div key={day.toISOString()} className="flex flex-col items-center">
                <span className="mb-2 text-xs text-gray-500">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <button
                  onClick={() => setSelectedDate(day)}
                  className={cn(scheduleButtonVariants({ variant: isSelected ? 'selected' : 'default' }), 'h-10 w-10 relative')}
                >
                  {isSelected && (
                    <motion.div layoutId="date-bg" className="absolute inset-0 bg-blue-600 rounded-lg z-0" />
                  )}
                  <span className="relative z-10">{day.getDate()}</span>
                </button>
              </div>
            );
          })}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">{timeZone}</p>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={cn(scheduleButtonVariants({ variant: isSelected ? 'selected' : 'default' }), 'relative')}
                >
                  {isSelected && (
                    <motion.div layoutId="time-bg" className="absolute inset-0 bg-blue-600 rounded-lg z-0" />
                  )}
                  <span className="relative z-10">{time}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t pt-4 flex justify-end">
          <button onClick={handleSchedule} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};