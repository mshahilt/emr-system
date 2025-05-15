import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaStethoscope, 
  FaEye, 
  FaTrash, 
  FaBell 
} from 'react-icons/fa';
import InfoCard from '../../Components/doctor/common/InfoCard';
import PatientDetailsModal from '../../Components/doctor/models/PatientDetails';
import { formatDate } from '../../util/formatters';
import { axiosInstance } from '../../API/axiosInstance';

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    consultations: 0,
    appointments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const bookingResponse = await axiosInstance.get("/api/booking");
        const appointmentsData = bookingResponse.data?.data.filter((item)=>item.status=="booked") || [];

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split("T")[0];

        // Count today's appointments
        const todayAppointmentsCount = appointmentsData.filter(
          (appt) => appt.appointmentDate.split("T")[0] === today
        ).length;

        // Count unique patients
        const uniquePatients = new Set(
          appointmentsData.map((appt) => appt.patientId._id)
        ).size;

        setDashboardData({
          totalPatients: uniquePatients,
          todayAppointments: todayAppointmentsCount,
          consultations: appointmentsData.length,
          appointments: appointmentsData,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        setError("Failed to load dashboard data. Please try again later.");
        setDashboardData({
          totalPatients: 0,
          todayAppointments: 0,
          consultations: 0,
          appointments: [],
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await axiosInstance.delete(`/api/booking/${appointmentId}`);
        // Refresh data after deletion
        const updatedAppointments = dashboardData.appointments.filter(
          (appt) => appt._id !== appointmentId
        );
        setDashboardData({
          ...dashboardData,
          appointments: updatedAppointments,
          consultations: updatedAppointments.length,
        });
      } catch (error) {
        console.error("Error deleting appointment", error);
        alert("Failed to cancel appointment. Please try again.");
      }
    }
  };
  console.log(dashboardData);
  return (
    <main className="p-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Doctor Dashboard</h1>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search patients..."
            className="px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative">
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {dashboardData.todayAppointments}
            </span>
            <button className="text-xl">
              <FaBell />
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <InfoCard
          icon={<FaUsers />}
          title="Total Patients"
          value={dashboardData.totalPatients}
          color="bg-blue-100 text-blue-600"
        />
        <InfoCard
          icon={<FaCalendarAlt />}
          title="Today's Appointments"
          value={dashboardData.todayAppointments}
          color="bg-green-100 text-green-600"
        />
        <InfoCard
          icon={<FaStethoscope />}
          title="Total Consultations"
          value={dashboardData.consultations}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Appointment Schedule</h2>
          <Link to="/doctor/appointment" className="text-blue-600 font-medium">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
        ) : dashboardData.appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.appointments.map((appt) => (
                  <tr
                    key={appt._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/doctor/prescription?patientId=${appt.patientId._id}&doctorId=${appt.doctorId._id}&appointmentId=${appt._id}`
                      )
                    }
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                          {appt.patientId.name[0]?.toUpperCase() || "P"}
                        </div>
                        <div>
                          <div className="font-medium">
                            {appt.patientId.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appt.patientId.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {formatDate(appt.appointmentDate)}
                    </td>
                    <td className="py-3 px-3">{appt.timeSlot}</td>
                    <td className="py-3 px-3">
                      <div className="truncate max-w-xs">{appt.reason}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewDetails(appt)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDeleteAppointment(appt._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No appointments found
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      {showModal && selectedAppointment && (
        <PatientDetailsModal
          selectedAppointment={selectedAppointment}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}


export default DashboardPage;