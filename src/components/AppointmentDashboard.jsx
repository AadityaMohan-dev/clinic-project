import { useState, useMemo } from "react";
import { Search, Calendar, Clock, User, FileText, X, Filter, Plus, ChevronRight } from "lucide-react";
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
  };

  return (
    <div className="h-[calc(100dvh-120px)] w-full flex flex-col items-center justify-start bg-transparent font-sans px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl w-full h-full flex flex-col">
        
        {/* --- THE MAIN UNIFIED CARD --- */}
        <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/60 overflow-hidden flex flex-col h-full">
          
          {/* Header Section */}
          <div className="px-8 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white shrink-0">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Dashboard</h1>
              <p className="text-sm text-neutral-500 font-medium">Manage your schedule and patients</p>
            </div>
            
            <div className="flex items-center gap-3 pr-4 md:pr-0">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" /> <span>Filter</span>
              </button>
              <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl shadow-lg active:scale-95 group transition-all">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-semibold text-sm whitespace-nowrap">New Appointment</span>
              </button>
            </div>
          </div>

          {/* Toolbar Section */}
          <div className="px-8 pt-4 pb-8 bg-gray-50/50 border-b border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between shrink-0">
            <div className="flex p-1 bg-white border border-gray-200 rounded-xl overflow-x-auto scrollbar-hide shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${statusFilter === tab.key ? "bg-neutral-900 text-white shadow-md" : "text-neutral-500 hover:text-neutral-900 hover:bg-gray-50"}`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${statusFilter === tab.key ? "bg-neutral-700 border-neutral-600" : "bg-gray-100 border-gray-200"}`}>{tab.count}</span>
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-8 py-6 bg-[#FAFAFA] custom-scrollbar">
            <div className="grid grid-cols-1 gap-4">
              {filteredAppointments.map((appt) => (
                <div key={appt.id} className="group bg-white rounded-2xl p-5 border border-gray-200 hover:border-blue-300 transition-all duration-300">
                   <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-16 h-16 bg-blue-50/50 rounded-2xl flex flex-col items-center justify-center text-blue-700 shrink-0 border border-blue-100/50">
                        <span className="text-xs font-bold uppercase">{new Date(appt.date).toLocaleDateString("en-US", { month: "short" })}</span>
                        <span className="text-xl font-bold">{new Date(appt.date).toLocaleDateString("en-US", { day: "numeric" })}</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                           <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{appt.patientName}</h3>
                           <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-blue-100">Active</span>
                        </div>
                        <div className="flex gap-4 mt-1 text-sm text-gray-500">
                           <span className="flex items-center gap-1"><User className="w-3.5 h-3.5"/> Dr. {appt.doctorName}</span>
                           <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {appt.time}</span>
                        </div>
                        <div className="mt-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                           <FileText className="w-4 h-4 text-gray-400 shrink-0"/> {appt.notes || "Follow-up visit"}
                        </div>
                    </div>
                    <div className="flex shrink-0 w-full md:w-auto mt-4 md:mt-0">
                        <Link 
                          to={`/patients/${appt.id}`} 
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-sm font-medium shadow-md active:scale-95 group/btn transition-all"
                        >
                          Edit Details <ChevronRight className="w-4 h-4 text-gray-400 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer: Fixed */}
          <div className="px-8 py-4 border-t border-gray-100 bg-white shrink-0">
             <p className="text-center text-[10px] sm:text-xs text-gray-400 font-medium tracking-wide">
               Showing <span className="text-gray-900 font-bold">{filteredAppointments.length}</span> of <span className="text-gray-900 font-bold">{appointments.length}</span> appointments
             </p>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <AddAppointment
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddAppointment}
        />
      )}

      <style>{`
        html, body { overflow: hidden !important; height: 100dvh; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}</style>
    </div>
  );
}

export default AppointmentDashboard;