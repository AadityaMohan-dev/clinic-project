import { useState, useMemo, useEffect } from "react";
import { Search, Calendar, Clock, User, FileText, X, Filter, Plus, ChevronRight, Stethoscope, Clipboard, Loader2, RefreshCw } from "lucide-react";
import AddAppointment from "./modal/AddAppointment";
import { Link } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function AppointmentDashboard() {
  const [statusFilter, setStatusFilter] = useState("active");
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch current user and appointments on mount
  useEffect(() => {
    fetchCurrentUser();
    fetchAppointments();

    // Set up real-time subscription
    const subscription = supabase
      .channel('appointments_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'appointments' 
        }, 
        (payload) => {
          console.log('Change received!', payload);
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  // Fetch appointments from Supabase
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:profiles!appointments_patient_id_fkey(
            full_name,
            phone_number
          )
        `)
        .order('appointment_date', { ascending: true });

      if (error) throw error;

      // Transform data to match component's expected format
      const transformedData = data.map(apt => ({
        id: apt.id,
        patientName: apt.patient_name || apt.patient?.full_name || 'Unknown',
        patientEmail: apt.patient_email,
        patientPhone: apt.patient_phone || apt.patient?.phone_number,
        date: apt.appointment_date,
        time: new Date(apt.appointment_date).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        doctorName: apt.doctor_name,
        doctorId: apt.doctor_id,
        notes: apt.notes,
        reason: apt.reason,
        status: apt.status,
        appointmentType: apt.appointment_type,
        isTeleconsultation: apt.is_teleconsultation,
        createdAt: apt.created_at
      }));

      setAppointments(transformedData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle real-time updates
  const handleRealtimeUpdate = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
      case 'INSERT':
        // Transform and add new appointment
        const newApt = {
          id: newRecord.id,
          patientName: newRecord.patient_name,
          patientEmail: newRecord.patient_email,
          patientPhone: newRecord.patient_phone,
          date: newRecord.appointment_date,
          time: new Date(newRecord.appointment_date).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          doctorName: newRecord.doctor_name,
          doctorId: newRecord.doctor_id,
          notes: newRecord.notes,
          reason: newRecord.reason,
          status: newRecord.status,
          appointmentType: newRecord.appointment_type,
          isTeleconsultation: newRecord.is_teleconsultation,
          createdAt: newRecord.created_at
        };
        setAppointments(prev => [newApt, ...prev]);
        break;
      
      case 'UPDATE':
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === newRecord.id 
              ? {
                  ...apt,
                  patientName: newRecord.patient_name,
                  date: newRecord.appointment_date,
                  time: new Date(newRecord.appointment_date).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  }),
                  doctorName: newRecord.doctor_name,
                  status: newRecord.status,
                  notes: newRecord.notes,
                  reason: newRecord.reason
                }
              : apt
          )
        );
        break;
      
      case 'DELETE':
        setAppointments(prev => prev.filter(apt => apt.id !== oldRecord.id));
        break;
    }
  };

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  };

  // Filter appointments with memoization
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((appt) => {
        // Status filter logic
        if (statusFilter === "active") {
          return appt.status === "pending" || appt.status === "confirmed";
        } else if (statusFilter === "completed") {
          return appt.status === "completed";
        } else if (statusFilter === "Teleconsultation") {
          return appt.isTeleconsultation === true;
        }
        return appt.status === statusFilter;
      })
      .filter((appt) => {
        if (!search.trim()) return true;
        const term = search.toLowerCase();
        return (
          appt.patientName?.toLowerCase().includes(term) ||
          appt.notes?.toLowerCase().includes(term) ||
          appt.doctorName?.toLowerCase().includes(term) ||
          appt.reason?.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
  }, [appointments, statusFilter, search]);

  // Count appointments for tabs
  const getTabCount = (filter) => {
    if (filter === "active") {
      return appointments.filter(a => a.status === "pending" || a.status === "confirmed").length;
    } else if (filter === "completed") {
      return appointments.filter(a => a.status === "completed").length;
    } else if (filter === "Teleconsultation") {
      return appointments.filter(a => a.isTeleconsultation === true).length;
    }
    return appointments.filter(a => a.status === filter).length;
  };

  const tabs = [
    { key: "active", label: "Active", count: getTabCount("active") },
    { key: "completed", label: "Completed", count: getTabCount("completed") },
    { key: "Teleconsultation", label: "Teleconsultation", count: getTabCount("Teleconsultation") },
  ];

  // Handle new appointment submission
  const handleAddAppointment = async (appointmentData) => {
    console.log('New appointment:', appointmentData);
    // The appointment is already added via the AddAppointment component
    // Real-time subscription will update the list automatically
    setIsAddModalOpen(false);
    
    // Optionally refresh to ensure sync
    await fetchAppointments();
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return {
        month: date.toLocaleDateString("en-US", { month: "short" }),
        day: date.getDate(),
        fullDate: date.toLocaleDateString("en-US", { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      };
    } catch {
      return { month: "---", day: "0", fullDate: "Invalid Date" };
    }
  };

  return (
    <div className="h-[calc(100dvh-120px)] w-full flex flex-col items-center justify-start bg-transparent font-sans px-4 sm:px-6 lg:px-8 py-2 overflow-hidden">
      <div className="max-w-7xl w-full h-full flex flex-col">
        
        {/* --- THE ANCHORED MAIN CARD --- */}
        <div className="bg-white rounded-[2.5rem] md:rounded-3xl shadow-xl border border-neutral-200/60 overflow-hidden flex flex-col h-full">
          
          {/* HEADER: ANCHORED (Does not scroll) */}
          <div className="px-6 md:px-8 pt-6 md:pt-8 pb-3 md:pb-4 shrink-0 bg-white">
            
            {/* MOBILE HEADER */}
            <div className="md:hidden">
              <h1 className="text-2xl font-extrabold tracking-tight text-black mb-3">Clinic Dashboard</h1>
              <div className="relative w-full mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  className="block w-full pl-12 pr-4 py-3 bg-gray-100/60 border-none rounded-2xl text-base outline-none" 
                  placeholder="Search patients..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* DESKTOP HEADER */}
            <div className="hidden md:flex flex-row items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Dashboard</h1>
                <p className="text-sm text-neutral-500 font-medium">Manage your schedule and patients</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Search..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button 
                  onClick={() => setIsAddModalOpen(true)} 
                  className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl shadow-lg active:scale-95 group transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  <span className="font-semibold text-sm">New Appointment</span>
                </button>
              </div>
            </div>

            {/* TABS */}
            <nav className="mb-4 md:mb-6">
              <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl md:w-fit border border-gray-100 shadow-sm">
                {tabs.map((tab, idx) => (
                  <div key={tab.key} className="flex-1 md:flex-none flex items-center">
                    <button
                      onClick={() => setStatusFilter(tab.key)}
                      className={`flex-1 md:px-8 py-2 md:py-2.5 px-1 flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer ${
                        statusFilter === tab.key 
                        ? "bg-black text-white shadow-md" 
                        : "text-gray-500 hover:bg-white/40"
                      }`}
                    >
                      <span className="font-semibold text-[11px] md:text-sm">{tab.label}</span>
                      <span className={`text-[10px] min-w-[18px] h-4.5 px-1 flex items-center justify-center rounded-full font-bold leading-none ${
                        statusFilter === tab.key ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-600"
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                    {idx < tabs.length - 1 && <div className="w-px h-5 md:h-6 bg-gray-200 mx-1" />}
                  </div>
                ))}
              </div>
            </nav>

            {/* MOBILE ONLY: Section Title */}
            <div className="flex md:hidden justify-between items-center mb-1">
              <h2 className="text-lg font-bold text-black uppercase tracking-wide">Appointments</h2>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-black text-white text-[10px] font-bold py-1.5 px-3.5 rounded-full flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-3 h-3" /> New
              </button>
            </div>
          </div>

          {/* SCROLLABLE AREA: Patient Cards */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-6 custom-scrollbar bg-[#FAFAFA]/50">
            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-sm text-gray-500">Loading appointments...</p>
              </div>
            ) : error ? (
              /* Error State */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-sm text-red-600 mb-4">{error}</p>
                <button 
                  onClick={fetchAppointments}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5 md:gap-4 pt-1">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appt) => {
                    const dateInfo = formatDate(appt.date);
                    return (
                      <Link 
                        key={appt.id} 
                        to={`/patients/${appt.id}`}
                        className="bg-white p-3 md:p-5 rounded-2xl md:rounded-2xl shadow-sm border border-neutral-100 flex flex-row items-center gap-3 md:gap-8 hover:border-blue-300 transition-all group cursor-pointer"
                      >
                        {/* Date Box */}
                        <div className="bg-gray-100 rounded-xl md:rounded-2xl w-12 h-12 md:w-16 md:h-16 flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                          <span className="text-[8px] md:text-[10px] font-bold uppercase opacity-60">
                            {dateInfo.month}
                          </span>
                          <span className="text-base md:text-xl font-black leading-none">
                            {dateInfo.day}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-0.5 md:gap-10">
                          <div className="flex flex-col gap-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm md:text-lg font-bold text-black group-hover:text-blue-600 transition-colors">
                                {appt.patientName}
                              </h3>
                              <User className="w-3 h-3 text-black md:hidden" />
                              {appt.isTeleconsultation && (
                                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                                  Video
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 md:gap-4 text-[11px] md:text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Stethoscope className="w-3 h-3" /> {appt.doctorName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {appt.time}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-[11px] md:text-sm text-gray-400 truncate max-w-[180px] md:max-w-[400px]">
                            <span className="flex items-center gap-1">
                              <Clipboard className="w-3 h-3 md:hidden" /> 
                              {appt.reason || appt.notes || "Follow-up visit"}
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                      </Link>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 md:py-20 text-neutral-400">
                    <Calendar className="w-10 h-10 md:w-12 md:h-12 mb-4 opacity-10" />
                    <p className="text-sm font-medium">No appointments found</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {search ? 'Try a different search term' : 'Add your first appointment to get started'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DESKTOP FOOTER */}
          <div className="hidden md:block px-8 py-4 border-t border-gray-100 bg-white shrink-0">
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              O Dental Clinic • {filteredAppointments.length} {statusFilter === 'active' ? 'Active' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Records
            </p>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isAddModalOpen && (
        <AddAppointment
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddAppointment}
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default AppointmentDashboard;