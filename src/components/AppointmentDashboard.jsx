import { useState, useMemo } from "react";
import { Search, Calendar, Clock, User, FileText, X, Filter, Plus, ChevronRight } from "lucide-react";
import { sampleAppointments as appointments } from "../data/data";
import EditAppointment from "./modal/EditAppointment";
import AddAppointment from "./modal/AddAppointment";
import { Link } from "react-router-dom";


function AppointmentDashboard() {
  
  const [statusFilter, setStatusFilter] = useState("active");
  const [search, setSearch] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleAddAppointment = (appointmentData) => {
    console.log('New appointment:', appointmentData);
  };

  const handleEditAppointment = (appointmentData) => {
    console.log('Updated appointment:', appointmentData);
  };

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

  const getStatusStyles = (status) => {
    const styles = {
      active: "bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/20",
      completed: "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/20",
      pending: "bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/20",
    };
    return styles[status] || "bg-gray-50 text-gray-700 border-gray-100";
  };

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="min-h-screen bg-transparent font-sans p-4 sm:p-6 lg:p-8">
      
      <div className="max-w-7xl mx-auto">
        
        {/* --- THE MAIN UNIFIED CARD --- */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-neutral-200/60 overflow-hidden flex flex-col min-h-[800px]">
          
          {/* 1. CARD HEADER (Integrated Navigation) */}
          <div className="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white">
            
            {/* Title & Subtitle */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
                Dashboard
              </h1>
              <p className="text-sm text-neutral-500 font-medium mt-1">
                Manage your schedule and patients
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 text-neutral-600 rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all text-sm font-medium shadow-sm">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl active:scale-95 group"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-semibold text-sm">New Appointment</span>
              </button>
            </div>
          </div>

          {/* 2. TOOLBAR SECTION (Tabs & Search) */}
          <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex flex-col lg:flex-row gap-6 items-center justify-between">
            
            {/* Tabs */}
            <div className="flex p-1 bg-white border border-gray-200 rounded-xl w-full lg:w-auto overflow-x-auto scrollbar-hide shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`
                    relative flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${statusFilter === tab.key 
                      ? "bg-neutral-900 text-white shadow-md" 
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-gray-50"
                    }
                  `}
                >
                  <span>{tab.label}</span>
                  <span className={`
                    px-1.5 py-0.5 rounded-md text-[10px] font-bold border
                    ${statusFilter === tab.key 
                      ? "bg-neutral-700 border-neutral-600 text-white" 
                      : "bg-gray-100 border-gray-200 text-neutral-500"
                    }
                  `}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                placeholder="Search by patient, doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* 3. CONTENT SECTION (List) */}
          <div className="flex-1 px-8 py-6 bg-[#FAFAFA]">
            {filteredAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No appointments found</h3>
                <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="group bg-white rounded-2xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                      
                      {/* Date Block */}
                      <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {new Date(appt.date).toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="text-xl font-bold">
                          {new Date(appt.date).toLocaleDateString("en-US", { day: "numeric" })}
                        </span>
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {appt.patientName}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyles(appt.status)}`}>
                            {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            <span>Dr. {appt.doctorName}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{appt.time}</span>
                          </div>
                        </div>

                        {appt.notes && (
                          <div className="mt-3 flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                            <FileText className="w-4 h-4 mt-0.5 text-gray-400" />
                            <p className="line-clamp-1">{appt.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                        <button 
                          onClick={() => handleEditClick(appt)}
                          className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <Link 
                          to={`/patients/${appt.id}`} 
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all shadow-md hover:shadow-lg group/btn"
                        >
                          Details
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
                        </Link>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. FOOTER */}
          <div className="px-8 py-6 border-t border-gray-100 bg-white">
            {filteredAppointments.length > 0 && (
              <div className="flex justify-center">
                <p className="text-sm text-gray-400 font-medium">
                  Showing <span className="text-gray-900">{filteredAppointments.length}</span> of <span className="text-gray-900">{appointments.length}</span> total appointments
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modals */}
      {isEditModalOpen && selectedAppointment && (
        <EditAppointment
          appointment={selectedAppointment}
          onClose={handleCloseEditModal}
          onSubmit={handleEditAppointment}
        />
      )}

      {isAddModalOpen && (
        <AddAppointment
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddAppointment}
        />
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default AppointmentDashboard;