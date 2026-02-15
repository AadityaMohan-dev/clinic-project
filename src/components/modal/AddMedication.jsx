import { useState, useEffect } from "react";
import { X, Search, Clock, Save, Pill, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AddMedication({ isOpen, onClose, onSave, patientId }) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    timingFood: "after",
    timingMeal: { breakfast: false, lunch: false, dinner: false },
    duration: "5",
    comments: ""
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [medicationDB, setMedicationDB] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMeds, setLoadingMeds] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch current user and medications on mount
  useEffect(() => {
    fetchCurrentUser();
    fetchMedications();
  }, []);

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
      setErrors({});
    }
  }, [isOpen]);

  // Fetch current authenticated user
  const fetchCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setCurrentUser(user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Fetch medications from database
  const fetchMedications = async () => {
    setLoadingMeds(true);
    try {
      // First try to fetch from a medications master table
      const { data: medsData, error: medsError } = await supabase
        .from('medications_master')
        .select('name, generic_name, category')
        .order('name');

      if (medsError) {
        console.log('No medications_master table, using defaults');
        // Use default medications if table doesn't exist
        setMedicationDB([
          "Amoxicillin", "Paracetamol", "Ibuprofen", "Metformin", 
          "Atorvastatin", "Omeprazole", "Azithromycin", "Pantoprazole", 
          "Losartan", "Cetirizine", "Aspirin", "Clopidogrel",
          "Metronidazole", "Clindamycin", "Penicillin", "Erythromycin",
          "Doxycycline", "Ciprofloxacin", "Acetaminophen", "Codeine",
          "Tramadol", "Prednisolone", "Chlorhexidine", "Lidocaine"
        ]);
      } else if (medsData && medsData.length > 0) {
        // Extract medication names from the data
        const medNames = medsData.map(med => med.name);
        setMedicationDB(medNames);
      } else {
        // Fallback to default medications
        setMedicationDB([
          "Amoxicillin", "Paracetamol", "Ibuprofen", "Metformin", 
          "Atorvastatin", "Omeprazole", "Azithromycin", "Pantoprazole"
        ]);
      }

      // Also fetch frequently prescribed medications for this doctor
      if (currentUser) {
        const { data: freqMeds } = await supabase
          .from('prescriptions')
          .select('medication_name')
          .eq('prescribed_by', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (freqMeds) {
          const uniqueMeds = [...new Set(freqMeds.map(m => m.medication_name))];
          setMedicationDB(prev => [...new Set([...uniqueMeds, ...prev])]);
        }
      }
    } catch (error) {
      console.error('Error fetching medications:', error);
      // Use defaults on error
      setMedicationDB([
        "Amoxicillin", "Paracetamol", "Ibuprofen", "Metformin"
      ]);
    } finally {
      setLoadingMeds(false);
    }
  };

  // Handle Search Input
  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, name: value }));
    
    if (value.length > 0) {
      const filtered = medicationDB.filter(med => 
        med.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8)); // Limit suggestions to 8
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (name) => {
    setFormData(prev => ({ ...prev, name }));
    setShowSuggestions(false);
    
    // Auto-fetch common dosage if available
    fetchCommonDosage(name);
  };

  // Fetch common dosage for selected medication
  const fetchCommonDosage = async (medicationName) => {
    try {
      const { data } = await supabase
        .from('medications_master')
        .select('common_dosage')
        .eq('name', medicationName)
        .single();

      if (data?.common_dosage) {
        setFormData(prev => ({ ...prev, dosage: data.common_dosage }));
      }
    } catch (error) {
      console.log('No common dosage found');
    }
  };

  const toggleMeal = (meal) => {
    setFormData(prev => ({
      ...prev,
      timingMeal: { ...prev.timingMeal, [meal]: !prev.timingMeal[meal] }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Medication name is required";
    }
    
    if (!formData.dosage.trim()) {
      newErrors.dosage = "Dosage is required";
    }
    
    const hasMealSelected = Object.values(formData.timingMeal).some(v => v);
    if (!hasMealSelected) {
      newErrors.timing = "Please select at least one meal timing";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    try {
      // Construct the frequency string
      const meals = Object.keys(formData.timingMeal)
        .filter(k => formData.timingMeal[k])
        .map(k => k.charAt(0).toUpperCase() + k.slice(1))
        .join("-");
      
      const frequency = meals ? `${meals} (${formData.timingFood} food)` : `Once daily (${formData.timingFood} food)`;

      // Calculate end date based on duration
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(formData.duration));

      // Prepare prescription data
      const prescriptionData = {
        patient_id: patientId || null,
        medication_name: formData.name,
        dosage: formData.dosage,
        frequency: frequency,
        timing_food: formData.timingFood,
        timing_breakfast: formData.timingMeal.breakfast,
        timing_lunch: formData.timingMeal.lunch,
        timing_dinner: formData.timingMeal.dinner,
        duration_days: parseInt(formData.duration),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        comments: formData.comments || null,
        status: 'active',
        prescribed_by: currentUser?.id || null,
        prescribed_by_name: currentUser?.user_metadata?.full_name || 'Dr. You',
        created_at: new Date().toISOString()
      };

      // Insert into Supabase
      const { data, error } = await supabase
        .from('prescriptions')
        .insert([prescriptionData])
        .select()
        .single();

      if (error) throw error;

      // Add medication to medications_history for tracking
      await supabase
        .from('medications_history')
        .insert([{
          patient_id: patientId,
          medication_name: formData.name,
          prescribed_date: startDate.toISOString(),
          prescribed_by: currentUser?.id
        }])
        .select(); // Don't throw error if this fails

      // Create a reminder/notification (optional)
      if (patientId) {
        await createMedicationReminders(data.id, prescriptionData);
      }

      // Call parent's onSave with the created prescription
      onSave(data);
      
      // Show success message
      alert('Medication added successfully!');
      onClose();
      
    } catch (error) {
      console.error('Error adding medication:', error);
      setErrors({ submit: error.message || 'Failed to add medication. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Create medication reminders
  const createMedicationReminders = async (prescriptionId, prescriptionData) => {
    try {
      const reminders = [];
      const meals = ['breakfast', 'lunch', 'dinner'];
      const mealTimes = {
        breakfast: '08:00:00',
        lunch: '13:00:00',
        dinner: '20:00:00'
      };

      // Create reminders for each selected meal time
      for (const meal of meals) {
        if (prescriptionData[`timing_${meal}`]) {
          // Create reminders for each day of the duration
          for (let day = 0; day < prescriptionData.duration_days; day++) {
            const reminderDate = new Date(prescriptionData.start_date);
            reminderDate.setDate(reminderDate.getDate() + day);
            
            reminders.push({
              prescription_id: prescriptionId,
              patient_id: prescriptionData.patient_id,
              medication_name: prescriptionData.medication_name,
              reminder_time: `${reminderDate.toISOString().split('T')[0]}T${mealTimes[meal]}`,
              meal_time: meal,
              status: 'pending',
              created_at: new Date().toISOString()
            });
          }
        }
      }

      if (reminders.length > 0) {
        await supabase
          .from('medication_reminders')
          .insert(reminders);
      }
    } catch (error) {
      console.error('Error creating reminders:', error);
      // Don't throw - reminders are optional
    }
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
          <button 
            onClick={onClose} 
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errors.submit && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* 1. Medication Name (Searchable) */}
          <div className="relative z-20">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Medication Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                onFocus={() => formData.name && setShowSuggestions(true)}
                placeholder={loadingMeds ? "Loading medications..." : "Search or type name..."}
                className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading || loadingMeds}
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
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm text-gray-700 transition-colors"
                    >
                      {med}
                    </button>
                  ))}
                </div>
              )}
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
          </div>

          {/* 2. Dosage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Dosage <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              value={formData.dosage}
              onChange={(e) => setFormData({...formData, dosage: e.target.value})}
              placeholder="e.g. 500mg, 10ml"
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.dosage ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loading}
              required
            />
            {errors.dosage && (
              <p className="text-xs text-red-500 mt-1">{errors.dosage}</p>
            )}
          </div>

          {/* 3. Timings (Before/After & Meals) */}
          <div className={`p-4 bg-gray-50 rounded-xl border space-y-4 ${
            errors.timing ? 'border-red-300' : 'border-gray-100'
          }`}>
            
            {/* Before/After Radio */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Timing</label>
              <div className="flex gap-4">
                {['before', 'after'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      formData.timingFood === type ? 'border-blue-600' : 'border-gray-300'
                    }`}>
                      {formData.timingFood === type && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                    </div>
                    <input 
                      type="radio" 
                      name="timingFood" 
                      value={type}
                      checked={formData.timingFood === type}
                      onChange={() => setFormData({...formData, timingFood: type})}
                      className="hidden"
                      disabled={loading} 
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
                Select Meal Times <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['breakfast', 'lunch', 'dinner'].map((meal) => (
                  <button
                    key={meal}
                    type="button"
                    onClick={() => toggleMeal(meal)}
                    disabled={loading}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                      ${formData.timingMeal[meal] 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                      } disabled:opacity-50
                    `}
                  >
                    {meal.charAt(0).toUpperCase() + meal.slice(1)}
                  </button>
                ))}
              </div>
              {errors.timing && (
                <p className="text-xs text-red-500 mt-2">{errors.timing}</p>
              )}
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
                disabled={loading}
              >
                {[1,2,3,4,5,7,10,14,15,21,30,60,90].map(num => (
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
                disabled={loading}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Medication
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }
        .animate-in {
          animation: fade-in 0.2s ease-out, zoom-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}