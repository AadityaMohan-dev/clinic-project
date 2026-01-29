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
    { key: "pending", label: "Pending", count: appointments.filter((a) => a.status === "pending").length },
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
          <div className="px-6 md:px-8 pt-8 pb-4 shrink-0 bg-white">
            
            {/* MOBILE HEADER: Stitch AI Style */}
            <div className="md:hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-sm" />
                <span className="font-bold text-sm tracking-tight text-black">O Dental Clinic</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-black mb-4">Clinic Dashboard</h1>
              <div className="relative w-full mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  className="block w-full pl-12 pr-4 py-3.5 bg-gray-100/60 border-none rounded-2xl text-lg outline-none" 
                  placeholder="Search patients..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* DESKTOP HEADER: Initial Dashboard Style */}
            <div className="hidden md:flex flex-row items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Dashboard</h1>
                <p className="text-sm text-neutral-500 font-medium">Manage your schedule and patients</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                  <Filter className="w-4 h-4" /> <span>Filter</span>
                </button>
                {/* FIXED: Added onClick to Desktop button */}
                <button 
                  onClick={() => setIsAddModalOpen(true)} 
                  className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl shadow-lg active:scale-95 group transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  <span className="font-semibold text-sm">New Appointment</span>
                </button>
              </div>
            </div>

            {/* TABS: Responsive & Anchored */}
            <nav className="mb-6">
              <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl md:w-fit border border-gray-100 shadow-sm">
                {tabs.map((tab, idx) => (
                  <div key={tab.key} className="flex-1 md:flex-none flex items-center">
                    <button
                      onClick={() => setStatusFilter(tab.key)}
                      className={`flex-1 md:px-8 py-2.5 px-1 flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer ${
                        statusFilter === tab.key 
                        ? "bg-black text-white shadow-md" 
                        : "text-gray-500 hover:bg-white/40"
                      }`}
                    >
                      <span className="font-semibold text-[13px] md:text-sm">{tab.label}</span>
                      <span className={`text-[10px] min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full font-bold leading-none ${
                        statusFilter === tab.key ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-600"
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                    {idx < tabs.length - 1 && <div className="w-px h-6 bg-gray-200 mx-1" />}
                  </div>
                ))}
              </div>
            </nav>

            {/* MOBILE ONLY: Appointments Section Title + Fixed New Button */}
            <div className="flex md:hidden justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-black">Appointments</h2>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-black text-white text-[11px] font-bold py-2 px-4 rounded-full flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> New appointment
              </button>
            </div>
          </div>

          {/* SCROLLABLE AREA: Patient Cards */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 custom-scrollbar bg-[#FAFAFA]/50">
            <div className="grid grid-cols-1 gap-4 pt-2">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => (
                  <Link 
                    key={appt.id} 
                    to={`/patients/${appt.id}`}
                    className="bg-white p-4 md:p-5 rounded-[2rem] md:rounded-2xl shadow-sm border border-neutral-100 flex flex-row items-center gap-4 md:gap-8 hover:border-blue-300 transition-all group cursor-pointer"
                  >
                    {/* Date Box: Mockup Style */}
                    <div className="bg-gray-100 rounded-2xl w-16 h-16 flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                      <span className="text-[10px] font-bold uppercase opacity-60">
                        {new Date(appt.date).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-xl font-black leading-none">
                        {new Date(appt.date).getDate()}
                      </span>
                    </div>

                    {/* Content Logic: Stacks on mobile, Rows on desktop */}
                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-10">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-black group-hover:text-blue-600 transition-colors">{appt.patientName}</h3>
                          <User className="w-3.5 h-3.5 text-black md:hidden" />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5" /> Dr. {appt.doctorName}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {appt.time}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-400 truncate max-w-[200px] md:max-w-[400px]">
                        <span className="flex items-center gap-1.5"><Clipboard className="w-3.5 h-3.5 md:hidden" /> {appt.notes || "Follow-up visit"}</span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                  <Calendar className="w-12 h-12 mb-4 opacity-10" />
                  <p className="font-medium">No appointments found</p>
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP FOOTER: Anchored */}
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