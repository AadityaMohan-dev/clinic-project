import { useState, useMemo } from "react";
import { Search, Calendar, Clock, User, FileText } from "lucide-react";
import { sampleAppointments as appointments } from "../data/data";
function AppointmentDashboard() {
  const [statusFilter, setStatusFilter] = useState("active");
  const [search, setSearch] = useState("");

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
  }, [appointments, statusFilter, search]);

  const tabs = [
    {
      key: "active",
      label: "Active",
      count: appointments.filter((a) => a.status === "active").length,
      color: "blue",
    },
    {
      key: "completed",
      label: "Completed",
      count: appointments.filter((a) => a.status === "completed").length,
      color: "green",
    },
    {
      key: "pending",
      label: "Pending",
      count: appointments.filter((a) => a.status === "pending").length,
      color: "yellow",
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

  return (
    <div className="min-h-fit bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Appointment Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and track all your appointments in one place
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium">
                Export
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                + New Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by patient name, patients id ..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={[
                  "flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200",
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

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No appointments found
              </h3>
              <p className="text-gray-500 text-center max-w-md">
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
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Patient Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {appt.patientName}
                          </h3>
                          {appt.doctorName && (
                            <p className="text-sm text-gray-600">
                              Dr. {appt.doctorName}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {new Date(appt.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{appt.time}</span>
                        </div>
                      </div>

                      {/* Notes */}
                      {appt.notes && (
                        <div className="flex items-start gap-2 text-sm">
                          <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                          <p className="text-gray-600">{appt.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <span
                        className={[
                          "px-3 py-1 rounded-full text-xs font-semibold border",
                          getStatusColor(appt.status),
                        ].join(" ")}
                      >
                        {appt.status.charAt(0).toUpperCase() +
                          appt.status.slice(1)}
                      </span>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                          View Details
                        </button>
                        <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
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

        {/* Footer Stats */}
        {filteredAppointments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600 text-center">
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
    </div>
  );
}

export default AppointmentDashboard;
