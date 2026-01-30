import { useState, useMemo } from "react";
import { Search, Calendar, Clock, User, FileText, X, Filter, Plus, ChevronRight, Stethoscope, Clipboard } from "lucide-react";
import { sampleAppointments as appointments } from "../data/data";
import AddAppointment from "./modal/AddAppointment";
import { Link } from "react-router-dom";

function AppointmentDashboard() {
  const [statusFilter, setStatusFilter] = useState("active");
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((appt) => appt.status === statusFilter)
      .filter((appt) => {
        if (!search.trim()) return true;
        const term = search.toLowerCase();
        return (
          appt.patientName?.toLowerCase().includes(term) ||
          appt.notes?.toLowerCase().includes(term) ||
          appt.doctorName?.toLowerCase().includes(term)
        );
      });
  }, [statusFilter, search]);

  const tabs = [
    { key: "active", label: "Active", count: appointments.filter((a) => a.status === "active").length },
    { key: "completed", label: "Completed", count: appointments.filter((a) => a.status === "completed").length },
    { key: "Teleconsultation", label: "Teleconsultation", count: appointments.filter((a) => a.status === "Teleconsultation").length },
  ];

  const handleAddAppointment = (appointmentData) => {
    console.log('New appointment:', appointmentData);
    setIsAddModalOpen(false); // Close modal after submission
  };

  return (
    <div className="h-[calc(100dvh-120px)] w-full flex flex-col items-center justify-start bg-transparent font-sans px-4 sm:px-6 lg:px-8 py-2 overflow-hidden">
      <div className="max-w-7xl w-full h-full flex flex-col">
        
        {/* --- THE ANCHORED MAIN CARD --- */}
        <div className="bg-white rounded-[2.5rem] md:rounded-3xl shadow-xl border border-neutral-200/60 overflow-hidden flex flex-col h-full">
          
          {/* HEADER: ANCHORED (Does not scroll) */}
          <div className="px-6 md:px-8 pt-6 md:pt-8 pb-3 md:pb-4 shrink-0 bg-white">
            
            {/* MOBILE HEADER: Cleaned up */}
            <div className="md:hidden">
              {/* REMOVED: Extra "O Dental Clinic" text and logo here */}
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

            {/* DESKTOP HEADER: Untouched */}
            <div className="hidden md:flex flex-row items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Dashboard</h1>
                <p className="text-sm text-neutral-500 font-medium">Manage your schedule and patients</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                  <Filter className="w-4 h-4" /> <span>Filter</span>
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

            {/* TABS: Shared logic */}
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

            {/* MOBILE ONLY: Section Title with reduced font and button */}
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
            <div className="grid grid-cols-1 gap-2.5 md:gap-4 pt-1">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => (
                  <Link 
                    key={appt.id} 
                    to={`/patients/${appt.id}`}
                    className="bg-white p-3 md:p-5 rounded-2xl md:rounded-2xl shadow-sm border border-neutral-100 flex flex-row items-center gap-3 md:gap-8 hover:border-blue-300 transition-all group cursor-pointer"
                  >
                    {/* Date Box: Smaller on mobile */}
                    <div className="bg-gray-100 rounded-xl md:rounded-2xl w-12 h-12 md:w-16 md:h-16 flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                      <span className="text-[8px] md:text-[10px] font-bold uppercase opacity-60">
                        {new Date(appt.date).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-base md:text-xl font-black leading-none">
                        {new Date(appt.date).getDate()}
                      </span>
                    </div>

                    {/* Content Logic: Stacks on mobile, Rows on desktop */}
                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-0.5 md:gap-10">
                      <div className="flex flex-col gap-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm md:text-lg font-bold text-black group-hover:text-blue-600 transition-colors">{appt.patientName}</h3>
                          <User className="w-3 h-3 text-black md:hidden" />
                        </div>
                        <div className="flex items-center gap-3 md:gap-4 text-[11px] md:text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Stethoscope className="w-3 h-3" /> Dr. {appt.doctorName}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {appt.time}</span>
                        </div>
                      </div>
                      
                      <div className="text-[11px] md:text-sm text-gray-400 truncate max-w-[180px] md:max-w-[400px]">
                        <span className="flex items-center gap-1"><Clipboard className="w-3 h-3 md:hidden" /> {appt.notes || "Follow-up visit"}</span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 md:py-20 text-neutral-400">
                  <Calendar className="w-10 h-10 md:w-12 md:h-12 mb-4 opacity-10" />
                  <p className="text-sm font-medium">No appointments found</p>
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP FOOTER: Untouched */}
          <div className="hidden md:block px-8 py-4 border-t border-gray-100 bg-white shrink-0">
             <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
               O Dental Clinic • {filteredAppointments.length} Active Records
             </p>
          </div>
        </div>
      </div>

      {/* MODAL TRIGGER */}
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