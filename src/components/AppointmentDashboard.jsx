import { useState, useMemo } from "react";
import { Search, Calendar, Clock, User, FileText, X, Filter } from "lucide-react";
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
    // Add your logic to save the appointment
    // Example: setAppointments([...appointments, { ...appointmentData, id: Date.now() }]);
  };

  const handleEditAppointment = (appointmentData) => {
    console.log('Updated appointment:', appointmentData);
    // Add your logic to update the appointment
    // Example: setAppointments(appointments.map(a => a.id === appointmentData.id ? appointmentData : a));
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
    {
      key: "active",
      label: "Active",
      count: appointments.filter((a) => a.status === "active").length,
    },
    {
      key: "completed",
      label: "Completed",
      count: appointments.filter((a) => a.status === "completed").length,
    },
    {
      key: "pending",
      label: "Pending",
      count: appointments.filter((a) => a.status === "pending").length,
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Responsive Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                Appointment Dashboard
              </h1>
              <p className="text-xs text-gray-600 mt-0.5 sm:text-sm lg:text-base">
                Manage and track all your appointments in one place
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-gray-700 font-medium text-sm lg:text-base">
                <Filter className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={handleOpenAddModal}
                className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-medium text-sm lg:text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40"
              >
                <span className="hidden sm:inline">+ New Appointment</span>
                <span className="sm:hidden">+ New</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 lg:space-y-6">
        {/* Responsive Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search by patient name, doctor, or notes..."
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Responsive Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 lg:p-3">
          <div className="flex gap-2 overflow-x-auto lg:overflow-visible scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={[
                  "flex-shrink-0 flex-1 lg:flex-none px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base whitespace-nowrap",
                  statusFilter === tab.key
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-50",
                ].join(" ")}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{tab.label}</span>
                  <span
                    className={[
                      "px-2 py-0.5 rounded-full text-xs font-semibold",
                      statusFilter === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600",
                    ].join(" ")}
                  >
                    {tab.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Appointments List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-130">
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 text-center">
                No appointments found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 text-center max-w-md">
                {search
                  ? "No appointments match your search criteria. Try adjusting your filters."
                  : `You don't have any ${statusFilter} appointments at the moment.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-4 sm:p-5 lg:p-6 hover:bg-gray-50 transition-all duration-200 group"
                >
                  {/* Responsive Card Layout */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1 space-y-3">
                      {/* Patient Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 truncate">
                            {appt.patientName}
                          </h3>
                          {appt.doctorName && (
                            <p className="text-xs sm:text-sm text-gray-600 truncate">
                              Dr. {appt.doctorName}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-6 text-sm sm:text-base text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">
                            {new Date(appt.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{appt.time}</span>
                        </div>
                      </div>

                      {/* Notes */}
                      {appt.notes && (
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 lg:line-clamp-none">
                            {appt.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Section - Status & Actions */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 lg:gap-4">
                      <span
                        className={[
                          "px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold border whitespace-nowrap",
                          getStatusColor(appt.status),
                        ].join(" ")}
                      >
                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                      </span>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link to={`/patients/details/${appt.id}`} className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium">
                          View Details
                        </Link>
                        <button
                          onClick={() => handleEditClick(appt)}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Responsive Footer Stats */}
        {filteredAppointments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-5">
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 text-center">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredAppointments.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {appointments.length}
              </span>{" "}
              total appointments
            </p>
          </div>
        )}
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
          onClose={handleCloseAddModal}
          onSubmit={handleAddAppointment}
        />
      )}

      {/* Custom scrollbar hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default AppointmentDashboard;