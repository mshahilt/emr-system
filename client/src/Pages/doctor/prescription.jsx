import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  FileText,
  Download,
  Printer,
} from "lucide-react";
import { axiosInstance } from "../../API/axiosInstance";
import { useLocation } from "react-router-dom";


const Prescription = () => {
  const [loading, setLoading] = useState(false);
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [patient, setPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availablePatients, setAvailablePatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [newMedicine, setNewMedicine] = useState({
    medicine: "",
    dosage: "",
    duration: "",
    instructions: "",
    timing: "",
  });
  const [newLabReport, setNewLabReport] = useState({
    title: "",
    description: "",
  });
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get("patiantId");
    const doctorId = queryParams.get("doctorId");
    set
  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch available doctors
        const doctorsResponse = await axiosInstance.get("/api/doctor");
        if (doctorsResponse.data) {
          setAvailableDoctors(doctorsResponse.data);
        }

        // Fetch available patients
        const patientsResponse = await axiosInstance.get("/api/patient");
        if (patientsResponse.data) {
          setAvailablePatients(patientsResponse.data);
        }

        // Fetch available medicines
        const medicinesResponse = await axiosInstance.get("/api/medicine");
        if (medicinesResponse.data) {
          setAvailableMedicines(medicinesResponse.data);
        }

        // Check if there's an existing prescription ID in the URL or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const prescId =
          urlParams.get("id") || localStorage.getItem("currentPrescriptionId");

        if (prescId) {
          setPrescriptionId(prescId);
          const prescriptionResponse = await axiosInstance.get(
            `/api/prescription/${prescId}`
          );
          if (prescriptionResponse.data) {
            const prescData = prescriptionResponse.data;
            setDiagnosis(prescData.diagnosis || "");
            setNotes(prescData.notes || "");
            setMedicines(prescData.medicines || []);
            setLabReports(prescData.labReports || []);

            // Set doctor and patient if they exist in the prescription
            if (prescData.doctor) {
              setDoctor(prescData.doctor);
              setSelectedDoctorId(prescData.doctor._id);
            }

            if (prescData.patient) {
              setPatient(prescData.patient);
              setSelectedPatientId(prescData.patient._id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle doctor selection
  const handleDoctorChange = async (e) => {
    const doctorId = e.target.value;
    setSelectedDoctorId(doctorId);

    if (doctorId) {
      try {
        const response = await axiosInstance.get(`/api/doctor/${doctorId}`);
        if (response.data) {
          setDoctor(response.data);
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    } else {
      setDoctor(null);
    }
  };

  // Handle patient selection
  const handlePatientChange = async (e) => {
    const patientId = e.target.value;
    setSelectedPatientId(patientId);

    if (patientId) {
      try {
        const response = await axiosInstance.get(`/api/patient/${patientId}`);
        if (response.data) {
          setPatient(response.data);
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    } else {
      setPatient(null);
    }
  };

  // Search medicines
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Filter medicines locally for quick response
    const filteredResults = availableMedicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filteredResults);

    // Optional: You can also implement a server-side search for better results
    const searchMedicinesFromServer = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/medicine/search?query=${encodeURIComponent(searchTerm)}`
        );
        if (response.data) {
          setSearchResults(response.data);
        }
      } catch (error) {
        console.error("Error searching medicines:", error);
        // Keep the filtered results if server search fails
      }
    };

    // Uncomment to enable server-side search
    // searchMedicinesFromServer();
  }, [searchTerm, availableMedicines]);

  const handleMedicineSelect = (medicine) => {
    setNewMedicine({
      ...newMedicine,
      medicine: medicine._id,
    });
    setSearchTerm(medicine.name);
    setShowMedicineDropdown(false);
  };

  const handleAddMedicine = async () => {
    if (!newMedicine.medicine || !newMedicine.dosage || !newMedicine.duration) {
      alert("Please fill all required medicine fields");
      return;
    }

    try {
      // Get full medicine details from API to ensure up-to-date information
      const medicineResponse = await axiosInstance.get(
        `/api/medicine/${newMedicine.medicine}`
      );
      const selectedMedicine = medicineResponse.data;

      const medicineToAdd = {
        medicine: selectedMedicine,
        dosage: newMedicine.dosage,
        duration: newMedicine.duration,
        instructions: newMedicine.instructions,
        timing: newMedicine.timing,
      };

      setMedicines([...medicines, medicineToAdd]);
      setNewMedicine({
        medicine: "",
        dosage: "",
        duration: "",
        instructions: "",
        timing: "",
      });
      setSearchTerm("");
    } catch (error) {
      console.error("Error fetching medicine details:", error);
      alert("Failed to add medicine. Please try again.");
    }
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = [...medicines];
    updatedMedicines.splice(index, 1);
    setMedicines(updatedMedicines);
  };

  const handleAddLabReport = () => {
    if (!newLabReport.title) {
      alert("Please enter a lab report title");
      return;
    }

    setLabReports([...labReports, newLabReport]);
    setNewLabReport({
      title: "",
      description: "",
    });
  };

  const handleRemoveLabReport = (index) => {
    const updatedLabReports = [...labReports];
    updatedLabReports.splice(index, 1);
    setLabReports(updatedLabReports);
  };

  const handleSavePrescription = async () => {
    if (!selectedDoctorId) {
      alert("Please select a doctor");
      return;
    }

    if (!selectedPatientId) {
      alert("Please select a patient");
      return;
    }

    if (!diagnosis) {
      alert("Please enter a diagnosis");
      return;
    }

    const prescriptionData = {
      doctor: selectedDoctorId,
      patient: selectedPatientId,
      diagnosis,
      notes,
      medicines: medicines.map((med) => ({
        medicine: med.medicine._id,
        dosage: med.dosage,
        duration: med.duration,
        instructions: med.instructions,
        timing: med.timing,
      })),
      labReports,
    };

    try {
      let response;
      if (prescriptionId) {
        // Update existing prescription
        response = await axiosInstance.put(
          `/api/prescription/${prescriptionId}`,
          prescriptionData
        );
        alert("Prescription updated successfully");
      } else {
        // Create new prescription
        response = await axiosInstance.post(
          "/api/prescription",
          prescriptionData
        );
        setPrescriptionId(response.data._id);
        // Store the new prescription ID for future reference
        localStorage.setItem("currentPrescriptionId", response.data._id);
        alert("Prescription saved successfully");
      }
    } catch (error) {
      console.error("Error saving prescription:", error);
      alert(
        `Failed to save prescription: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold">Medical Prescription</h1>
              <p className="text-blue-100 mt-1">
                {prescriptionId
                  ? "Edit Prescription"
                  : "Create New Prescription"}
              </p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md flex items-center"
                onClick={handleSavePrescription}
              >
                <FileText size={16} className="mr-2" />
                Save
              </button>
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md flex items-center">
                <Printer size={16} className="mr-2" />
                Print
              </button>
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md flex items-center">
                <Download size={16} className="mr-2" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Doctor and Patient Information */}
        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Doctor</h2>
            <div className="mb-4">
              <label
                htmlFor="doctorSelect"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Doctor
              </label>
              <select
                id="doctorSelect"
                value={selectedDoctorId}
                onChange={handleDoctorChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Doctor --</option>
                {availableDoctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>
            {doctor && (
              <div className="space-y-2">
                <p className="text-gray-800">
                  <span className="font-medium">Name:</span> {doctor.name}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">ID:</span> {doctor._id}
                </p>
                {doctor.specialization && (
                  <p className="text-gray-800">
                    <span className="font-medium">Specialization:</span>{" "}
                    {doctor.specialization}
                  </p>
                )}
                {doctor.contact && (
                  <p className="text-gray-800">
                    <span className="font-medium">Contact:</span>{" "}
                    {doctor.contact}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Patient
            </h2>
            <div className="mb-4">
              <label
                htmlFor="patientSelect"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Patient
              </label>
              <select
                id="patientSelect"
                value={selectedPatientId}
                onChange={handlePatientChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Patient --</option>
                {availablePatients.map((pat) => (
                  <option key={pat._id} value={pat._id}>
                    {pat.name} ({pat.age} yrs)
                  </option>
                ))}
              </select>
            </div>
            {patient && (
              <div className="space-y-2">
                <p className="text-gray-800">
                  <span className="font-medium">Name:</span> {patient.name}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Age:</span> {patient.age}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">ID:</span> {patient._id}
                </p>
                {patient.gender && (
                  <p className="text-gray-800">
                    <span className="font-medium">Gender:</span>{" "}
                    {patient.gender}
                  </p>
                )}
                {patient.contact && (
                  <p className="text-gray-800">
                    <span className="font-medium">Contact:</span>{" "}
                    {patient.contact}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Diagnosis and Notes */}
        <div className="p-4 md:p-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="diagnosis"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Diagnosis
              </label>
              <input
                type="text"
                id="diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter diagnosis"
              />
            </div>
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Medicines */}
        <div className="p-4 md:p-6 border-t">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Medicines
          </h2>

          {/* Medicine search and add */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="md:col-span-1 relative">
              <label
                htmlFor="medicine"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Medicine
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="medicine"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowMedicineDropdown(true);
                  }}
                  onFocus={() => setShowMedicineDropdown(true)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search medicine"
                />
                <Search
                  size={16}
                  className="absolute left-3 top-2.5 text-gray-400"
                />

                {showMedicineDropdown && searchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-48 overflow-auto">
                    {searchResults.map((medicine) => (
                      <div
                        key={medicine._id}
                        onClick={() => handleMedicineSelect(medicine)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="font-medium">{medicine.name}</div>
                        <div className="text-xs text-gray-500">
                          {medicine.type}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="dosage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dosage
              </label>
              <input
                type="text"
                id="dosage"
                value={newMedicine.dosage}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, dosage: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 500mg"
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration
              </label>
              <input
                type="text"
                id="duration"
                value={newMedicine.duration}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, duration: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 5 days"
              />
            </div>

            <div>
              <label
                htmlFor="instructions"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Instructions
              </label>
              <input
                type="text"
                id="instructions"
                value={newMedicine.instructions}
                onChange={(e) =>
                  setNewMedicine({
                    ...newMedicine,
                    instructions: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. After food"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAddMedicine}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
              >
                <Plus size={16} className="mr-2" />
                Add Medicine
              </button>
            </div>
          </div>

          {/* Medicine timing row */}
          <div className="mb-6">
            <label
              htmlFor="timing"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Timing
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="morning"
                  checked={newMedicine.timing.includes("Morning")}
                  onChange={(e) => {
                    const timing = newMedicine.timing.split(" ");
                    if (e.target.checked) {
                      timing.push("Morning");
                    } else {
                      const index = timing.indexOf("Morning");
                      if (index > -1) timing.splice(index, 1);
                    }
                    setNewMedicine({
                      ...newMedicine,
                      timing: timing.filter(Boolean).join(" and "),
                    });
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="morning" className="ml-2 text-sm text-gray-700">
                  Morning
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="afternoon"
                  checked={newMedicine.timing.includes("Afternoon")}
                  onChange={(e) => {
                    const timing = newMedicine.timing.split(" ");
                    if (e.target.checked) {
                      timing.push("Afternoon");
                    } else {
                      const index = timing.indexOf("Afternoon");
                      if (index > -1) timing.splice(index, 1);
                    }
                    setNewMedicine({
                      ...newMedicine,
                      timing: timing.filter(Boolean).join(" and "),
                    });
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="afternoon"
                  className="ml-2 text-sm text-gray-700"
                >
                  Afternoon
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="night"
                  checked={newMedicine.timing.includes("Night")}
                  onChange={(e) => {
                    const timing = newMedicine.timing.split(" ");
                    if (e.target.checked) {
                      timing.push("Night");
                    } else {
                      const index = timing.indexOf("Night");
                      if (index > -1) timing.splice(index, 1);
                    }
                    setNewMedicine({
                      ...newMedicine,
                      timing: timing.filter(Boolean).join(" and "),
                    });
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="night" className="ml-2 text-sm text-gray-700">
                  Night
                </label>
              </div>
            </div>
          </div>

          {/* Medicines list */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dosage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medicines.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No medicines added yet
                    </td>
                  </tr>
                ) : (
                  medicines.map((medicine, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {medicine.medicine.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {medicine.medicine.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {medicine.dosage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {medicine.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {medicine.instructions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {medicine.timing}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveMedicine(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lab Reports */}
        <div className="p-4 md:p-6 border-t">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Lab Reports
          </h2>

          {/* Lab Report add */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label
                htmlFor="labTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="labTitle"
                value={newLabReport.title}
                onChange={(e) =>
                  setNewLabReport({ ...newLabReport, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. CBC Test"
              />
            </div>

            <div>
              <label
                htmlFor="labDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <input
                type="text"
                id="labDescription"
                value={newLabReport.description}
                onChange={(e) =>
                  setNewLabReport({
                    ...newLabReport,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Check for infection indicators"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAddLabReport}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
              >
                <Plus size={16} className="mr-2" />
                Add Lab Report
              </button>
            </div>
          </div>

          {/* Lab Reports list */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {labReports.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No lab reports added yet
                    </td>
                  </tr>
                ) : (
                  labReports.map((report, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveLabReport(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t flex justify-end">
          <button
            onClick={handleSavePrescription}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center"
          >
            <FileText size={16} className="mr-2" />
            Save Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prescription;
