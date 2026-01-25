import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText, Stethoscope, AlertCircle } from 'lucide-react';

function EditAppointment({ onClose, appointment }) {
  const [formData, setFormData] = useState({
    patientName: appointment?.patientName || "John Doe",
    date: appointment?.date || "2024-06-15",
    time: appointment?.time || "10:30",
    doctor: appointment?.doctorName || "Dr. Smith",
    reason: appointment?.reason || "Regular Checkup",
    status: appointment?.status || "pending",
    notes: appointment?.notes || ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = "Patient name is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.doctor) newErrors.doctor = "Doctor selection is required";
    if (!formData.reason.trim()) newErrors.reason = "Reason is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Add your save logic here
      onClose();
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
            className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-gray-700 transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

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
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
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
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
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
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
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
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.doctor ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="">Select a doctor</option>
                <option value="Dr. Smith">Dr. Smith</option>
                <option value="Dr. Johnson">Dr. Johnson</option>
                <option value="Dr. Lee">Dr. Lee</option>
                <option value="Dr. Williams">Dr. Williams</option>
                <option value="Dr. Brown">Dr. Brown</option>
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
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
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none ${
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
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Add any additional notes..."
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-semibold text-sm sm:text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40"
          >
            Save Changes
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