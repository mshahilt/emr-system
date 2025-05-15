import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../API/axiosInstance';
import { FaEye } from 'react-icons/fa';
import PatientDetailsModal from '../../Components/doctor/models/PatientDetails';


function PatientHistoryPage() {
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    appointments: [],
  });
  const[selectedAppointment, setSelectedAppointment] = useState(null);
  const[showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/booking");
        console.log(response.data.data);
        const appointmentsData = response.data?.data.filter((item)=>item.status == "completed") || [];
        setDashboardData({
          appointments: appointmentsData
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        setError("Failed to load dashboard data. Please try again later.");
        
      };
    }
      fetchData();
    }
    , []);
    const handleViewDetails = (appointment) => {
      setSelectedAppointment(appointment);
      setShowModal(true);
    };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Patients History</h1>
      <div className="bg-white p-4 rounded-lg shadow">
      <div className="bg-white rounded-lg shadow p-4">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
        ) : dashboardData.appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <tbody className="divide-y divide-gray-200">
                {dashboardData.appointments.map((appt) => (
                  <tr
                    key={appt._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    // onClick={() =>
                    //   navigate(
                    //     `/doctor/prescription?patientId=${appt.patientId._id}&doctorId=${appt.doctorId._id}&appointmentId=${appt._id}`
                    //   )
                    // }
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
                      {/* {formatDate(appt.appointmentDate)} */}
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
      </div>
      {/* Patient Details Modal */}
            {showModal && selectedAppointment && (
              <PatientDetailsModal
                selectedAppointment={selectedAppointment}
                onClose={() => setShowModal(false)}
              />
            )}
    </div>
  );
}

export default PatientHistoryPage