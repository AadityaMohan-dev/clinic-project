import { useState, useEffect } from "react";
import { X, Search, Clock, Save, Pill, AlertCircle } from "lucide-react";

// Dummy database for autocomplete
const MEDICATION_DB = [
  "Amoxicillin", "Paracetamol", "Ibuprofen", "Metformin", 
  "Atorvastatin", "Omeprazole", "Azithromycin", "Pantoprazole", 
  "Losartan", "Cetirizine", "Aspirin", "Clopidogrel"
];

export default function AddMedication({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    timingFood: "after", // default
    timingMeal: { breakfast: false, lunch: false, dinner: false },
    duration: "5",
    comments: ""
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        dosage: "",
        timingFood: "after",
        timingMeal: { breakfast: false, lunch: false, dinner: false },
        duration: "5",
        comments: ""
      });
    }
  }, [isOpen]);

  // Handle Search Input
  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, name: value }));
    
    if (value.length > 0) {
      const filtered = MEDICATION_DB.filter(med => 
        med.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (name) => {
    setFormData(prev => ({ ...prev, name }));
    setShowSuggestions(false);
  };

  const toggleMeal = (meal) => {
    setFormData(prev => ({
      ...prev,
      timingMeal: { ...prev.timingMeal, [meal]: !prev.timingMeal[meal] }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.dosage) return;

    // Construct the "Frequency" string based on meals
    const meals = Object.keys(formData.timingMeal)
      .filter(k => formData.timingMeal[k])
      .map(k => k.charAt(0).toUpperCase() + k.slice(1)) // Capitalize
      .join("-");
    
    const frequency = meals ? `${meals} (${formData.timingFood} food)` : `Once daily (${formData.timingFood} food)`;

    onSave({
      ...formData,
      frequency, // Derived field for the table
      status: "Active",
      prescribedBy: "Dr. You", // Default
      startDate: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Pill className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Add Medication</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* 1. Medication Name (Searchable) */}
          <div className="relative z-20">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Medication Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                onFocus={() => formData.name && setShowSuggestions(true)}
                placeholder="Search or type name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                  {suggestions.map((med) => (
                    <button
                      key={med}
                      type="button"
                      onClick={() => selectSuggestion(med)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm text-gray-700"
                    >
                      {med}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. Dosage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Dosage</label>
            <input 
              type="text"
              value={formData.dosage}
              onChange={(e) => setFormData({...formData, dosage: e.target.value})}
              placeholder="e.g. 500mg, 10ml"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* 3. Timings (Before/After & Meals) */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
            
            {/* Before/After Radio */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Timing</label>
              <div className="flex gap-4">
                {['before', 'after'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.timingFood === type ? 'border-blue-600' : 'border-gray-300'}`}>
                      {formData.timingFood === type && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                    </div>
                    <input 
                      type="radio" 
                      name="timingFood" 
                      value={type}
                      checked={formData.timingFood === type}
                      onChange={() => setFormData({...formData, timingFood: type})}
                      className="hidden" 
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize group-hover:text-blue-600 transition-colors">
                      {type} Food
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Meal Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Breakfast / Lunch / Dinner
              </label>
              <div className="flex flex-wrap gap-2">
                {['breakfast', 'lunch', 'dinner'].map((meal) => (
                  <button
                    key={meal}
                    type="button"
                    onClick={() => toggleMeal(meal)}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                      ${formData.timingMeal[meal] 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    {meal.charAt(0).toUpperCase() + meal.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Duration & Comments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" /> Duration (Days)
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {[1,2,3,4,5,7,10,15,30].map(num => (
                  <option key={num} value={num}>{num} Days</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400" /> Note
              </label>
              <input
                type="text"
                value={formData.comments}
                onChange={(e) => setFormData({...formData, comments: e.target.value})}
                placeholder="Special instructions..."
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Medication
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}