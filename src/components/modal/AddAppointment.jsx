import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, FileText, Stethoscope, AlertCircle, Plus } from 'lucide-react';

function AddAppointment({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    patientName: "", patientEmail: "", patientPhone: "",
    date: "", time: "", doctor: "",
    appointmentType: "", reason: "", notes: "", status: "pending"
  });

  const [errors, setErrors] = useState({});

  const doctors = ["Dr. Sarah Smith", "Dr. Michael Johnson", "Dr. Emily Brown", "Dr. David Lee", "Dr. Jessica Williams"];
  const appointmentTypes = ["Checkup", "Cleaning", "Extraction", "Root Canal", "Whitening", "Emergency", "Follow-up"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = "Required";
    if (!formData.date) newErrors.date = "Required";
    if (!formData.doctor) newErrors.doctor = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Reduced max-height to 70vh and max-width to lg */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-slideUp max-h-[70vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Header - Reduced padding */}
        <div className="flex items-center justify-between p-3 px-6 border-b border-gray-100 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">New Appointment</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Scrollable Form Body - Denser layout */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3 custom-modal-scrollbar bg-white">
          
          <div className="space-y-0.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Patient Name</label>
            <input name="patientName" value={formData.patientName} onChange={handleChange} placeholder="John Doe"
              className={`w-full px-3 py-1.5 text-sm bg-gray-50 border rounded-lg outline-none focus:ring-1 focus:ring-blue-500/10 ${errors.patientName ? 'border-red-300' : 'border-gray-200'}`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email</label>
              <input name="patientEmail" value={formData.patientEmail} onChange={handleChange} placeholder="email@test.com"
                className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Phone</label>
              <input name="patientPhone" value={formData.patientPhone} onChange={handleChange} placeholder="+1..."
                className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} 
                className={`w-full px-3 py-1.5 text-sm bg-gray-50 border rounded-lg outline-none ${errors.date ? 'border-red-300' : 'border-gray-200'}`} />
            </div>
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Time</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange}
                className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Doctor</label>
              <select name="doctor" value={formData.doctor} onChange={handleChange}
                className={`w-full px-3 py-1.5 text-sm bg-gray-50 border rounded-lg outline-none ${errors.doctor ? 'border-red-300' : 'border-gray-200'}`}>
                <option value="">Select Doctor</option>
                {doctors.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Type</label>
              <select name="appointmentType" value={formData.appointmentType} onChange={handleChange}
                className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none">
                <option value="">Select Type</option>
                {appointmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-0.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Reason</label>
            <textarea name="reason" value={formData.reason} onChange={handleChange} rows="1" placeholder="Describe the issue..."
              className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none resize-none" />
          </div>
          
          <div className="space-y-0.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="1" placeholder="Extra details..."
              className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none resize-none" />
          </div>
        </form>

        {/* Footer - Reduced padding and smaller text */}
        <div className="p-3 border-t border-gray-100 bg-white flex gap-2 shrink-0">
          <button type="button" onClick={onClose} className="flex-1 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-2 bg-black text-white text-xs font-bold rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer">
            Confirm Booking
          </button>
        </div>
      </div>

      <style>{`
        .custom-modal-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-modal-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default AddAppointment;