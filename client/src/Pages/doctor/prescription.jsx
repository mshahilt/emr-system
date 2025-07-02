import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  FileText,
  Download,
} from "lucide-react";
import { axiosInstance } from "../../API/axiosInstance";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  header: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 10,
    textAlign: "center",
  },
  headerText: { fontSize: 14, fontWeight: "bold" },
  subHeaderText: { fontSize: 10 },
  section: { marginTop: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: { fontWeight: "bold" },
  table: {
    display: "table",
    width: "auto",
    marginTop: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#bfbfbf",
  },
  tableColHeader: {
    width: "20%",
    borderRightWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  tableCol: {
    width: "20%",
    borderRightWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
  },
  tableCellHeader: { fontSize: 10, fontWeight: "bold", textAlign: "center" },
  tableCell: { fontSize: 10, textAlign: "center" },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#555",
  },
});

// PDF Document Component
const PrescriptionPDF = ({
  doctor,
  patient,
  diagnosis,
  medicines,
  labReports,
}) => {
  const today = new Date();
  const formattedDate = today.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Dr {doctor?.name}, MD (PHYSICIAN)</Text>
          <Text style={styles.subHeaderText}>
            General Practitioner | Reg No: {doctor?._id} | +91 {doctor?.contact}
          </Text>
          <Text style={styles.subHeaderText}>
            Pathappiriyam | BOOKING NO: +91 8606344694
          </Text>
        </View>

        {/* Patient Information */}
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
            Patient Information
          </Text>
          <View style={styles.row}>
            <View>
              <Text>
                <Text style={styles.label}>Name:</Text> {patient?.name}
              </Text>
              <Text>
                <Text style={styles.label}>Phone:</Text> {patient?.contact}
              </Text>
              <Text>
                <Text style={styles.label}>Age:</Text> {patient?.age}
              </Text>
              <Text>
                <Text style={styles.label}>Diagnosis:</Text> {diagnosis || "N/A"}
              </Text>
              <Text>
                <Text style={styles.label}>Date & Time:</Text> {formattedDate}
              </Text>
            </View>
            <View style={{ width: "30%" }}>
              <Text>
                <Text style={styles.label}>SpO2:</Text> -
              </Text>
              <Text>
                <Text style={styles.label}>BP:</Text> -
              </Text>
              <Text>
                <Text style={styles.label}>Pulse:</Text> -
              </Text>
              <Text>
                <Text style={styles.label}>Temp:</Text> -
              </Text>
              <Text>
                <Text style={styles.label}>Weight:</Text> -
              </Text>
            </View>
          </View>
        </View>

        {/* Medicines Table */}
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>SI</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Medicine</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Type</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Dosage</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Tapering Schedule</Text>
              </View>
            </View>
            {medicines.length > 0 ? (
              medicines.map((med, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{med.medicine.name}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{med.medicine.type}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {med.isTapering ? "See Tapering Schedule" : med.dosage || "-"}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {med.isTapering && med.tapering?.length > 0
                        ? med.tapering
                            .map(
                              (schedule) =>
                                `${schedule.dosage} for ${schedule.days}`
                            )
                            .join("; ")
                        : "-"}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Lab Reports Section */}
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
            Lab Reports
          </Text>
          {labReports.length > 0 ? (
            labReports.map((report, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text>
                  <Text style={styles.label}>Report Type:</Text> {report.reportType}
                </Text>
                <Text>
                  <Text style={styles.label}>Findings:</Text> {report.findings || "-"}
                </Text>
                <Text>
                  <Text style={styles.label}>Values:</Text>{" "}
                  {report.values
                    ? Object.entries(report.values)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", ")
                    : "-"}
                </Text>
                <Text>
                  <Text style={styles.label}>Report Date:</Text>{" "}
                  {new Date(report.reportDate).toLocaleDateString("en-GB") || "-"}
                </Text>
              </View>
            ))
          ) : (
            <Text>-</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Prescription Generated by Suhaim Software</Text>
          <Text>Visit us: www.clinicppm.site</Text>
        </View>
      </Page>
    </Document>
  );
};

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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const location = useLocation();

  const [newMedicine, setNewMedicine] = useState({
    medicine: "",
    dosage: "",
    isTapering: false,
    duration: "",
    instructions: "",
    timing: "",
    tapering: [{ dosage: "", days: "" }],
  });

  const [newLabReport, setNewLabReport] = useState({
    reportType: "",
    findings: "",
    values: [{ name: "", value: "" }],
    reportDate: "",
  });

  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get("patientId");
  const doctorId = queryParams.get("doctorId");
  const appointmentId = queryParams.get("appointmentId");

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        if (doctorId) {
          const doctorResponse = await axiosInstance.get(`/api/doctor/${doctorId}`);
          setDoctor(doctorResponse.data.data);
        }

        if (patientId) {
          const patientResponse = await axiosInstance.get(`/api/patient/${patientId}`);
          setPatient(patientResponse.data.data);
        }

        const medicinesResponse = await axiosInstance.get("/api/medicine");
        setAvailableMedicines(medicinesResponse.data);

        const urlParams = new URLSearchParams(window.location.search);
        const prescId = urlParams.get("id") || localStorage.getItem("currentPrescriptionId");

        if (prescId) {
          setPrescriptionId(prescId);
          const prescriptionResponse = await axiosInstance.get(`/api/prescription/${prescId}`);
          const prescData = prescriptionResponse.data;
          setDiagnosis(prescData.diagnosis || "");
          setNotes(prescData.notes || "");
          setMedicines(prescData.medicines || []);
          setLabReports(prescData.labReports || []);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load initial data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [doctorId, patientId]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filteredResults = availableMedicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredResults);
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
    if (!newMedicine.medicine) {
      toast.error("Please select a medicine");
      return;
    }

    if (!newMedicine.dosage) {
      toast.error("Please enter a dosage");
      return;
    }

    if (newMedicine.isTapering) {
      const invalidSchedule = newMedicine.tapering.some(
        (schedule) => !schedule.dosage || !schedule.days
      );
      if (invalidSchedule) {
        toast.error("Please fill all tapering schedule fields (dosage and days)");
        return;
      }
    }

    try {
      const medicineResponse = await axiosInstance.get(`/api/medicine/${newMedicine.medicine}`);
      const selectedMedicine = medicineResponse.data;

      const medicineToAdd = {
        medicine: selectedMedicine,
        dosage: newMedicine.dosage,
        isTapering: newMedicine.isTapering,
        ...(newMedicine.isTapering
          ? { tapering: newMedicine.tapering }
          : {
              duration: newMedicine.duration,
              instructions: newMedicine.instructions,
              timing: newMedicine.timing,
            }),
      };

      setMedicines([...medicines, medicineToAdd]);
      setNewMedicine({
        medicine: "",
        dosage: "",
        isTapering: false,
        duration: "",
        instructions: "",
        timing: "",
        tapering: [{ dosage: "", days: "" }],
      });
      setSearchTerm("");
    } catch (error) {
      console.error("Error adding medicine:", error);
      toast.error("Failed to add medicine");
    }
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleAddTaperingSchedule = () => {
    setNewMedicine({
      ...newMedicine,
      tapering: [...newMedicine.tapering, { dosage: "", days: "" }],
    });
  };

  const handleUpdateTaperingSchedule = (index, field, value) => {
    const updatedTapering = [...newMedicine.tapering];
    updatedTapering[index] = { ...updatedTapering[index], [field]: value };
    setNewMedicine({ ...newMedicine, tapering: updatedTapering });
  };

  const handleRemoveTaperingSchedule = (index) => {
    setNewMedicine({
      ...newMedicine,
      tapering: newMedicine.tapering.filter((_, i) => i !== index),
    });
  };

  const handleAddLabReportValue = () => {
    setNewLabReport({
      ...newLabReport,
      values: [...newLabReport.values, { name: "", value: "" }],
    });
  };

  const handleUpdateLabReportValue = (index, field, value) => {
    const updatedValues = [...newLabReport.values];
    updatedValues[index] = { ...updatedValues[index], [field]: value };
    setNewLabReport({ ...newLabReport, values: updatedValues });
  };

  const handleRemoveLabReportValue = (index) => {
    setNewLabReport({
      ...newLabReport,
      values: newLabReport.values.filter((_, i) => i !== index),
    });
  };

  const handleAddLabReport = () => {
    if (!newLabReport.reportType) {
      toast.error("Please enter a lab report type");
      return;
    }

    const valuesObject = newLabReport.values.reduce((acc, { name, value }) => {
      if (name && value) acc[name] = value;
      return acc;
    }, {});

    const labReportToAdd = {
      reportType: newLabReport.reportType,
      findings: newLabReport.findings,
      values: valuesObject,
      reportDate: newLabReport.reportDate || new Date(),
    };

    setLabReports([...labReports, labReportToAdd]);
    setNewLabReport({
      reportType: "",
      findings: "",
      values: [{ name: "", value: "" }],
      reportDate: "",
    });
  };

  const handleRemoveLabReport = (index) => {
    setLabReports(labReports.filter((_, i) => i !== index));
  };

  const handleSavePrescription = async () => {
    if (!doctorId || !patientId) {
      toast.error("Doctor or Patient ID is missing");
      return;
    }

    if (!diagnosis) {
      toast.error("Please enter a diagnosis");
      return;
    }

    if (medicines.length === 0) {
      toast.error("Please add at least one medicine");
      return;
    }

    const prescriptionData = {
      doctor: doctorId,
      patient: patientId,
      diagnosis,
      notes,
      medicines: medicines.map((med) => ({
        medicine: med.medicine._id,
        isTapering: med.isTapering,
        dosage: med.dosage,
        ...(med.isTapering
          ? { tapering: med.tapering }
          : {
              duration: med.duration,
              instructions: med.instructions,
              timing: med.timing,
            }),
      })),
      labReports,
    };

    try {
      let response;
      if (prescriptionId) {
        response = await axiosInstance.put(`/api/prescription/${prescriptionId}`, prescriptionData);
        toast.success("Prescription updated successfully");
      } else {
        response = await axiosInstance.post("/api/prescription", prescriptionData);
        await axiosInstance.patch(`/api/booking/complete/${appointmentId}`);
        setPrescriptionId(response.data._id);
        localStorage.setItem("currentPrescriptionId", response.data._id);
        toast.success("Prescription saved successfully");
      }
    } catch (error) {
      console.error("Error saving prescription:", error);
      toast.error("Failed to save prescription");
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
    <>
      <ToastContainer />
      <div className="bg-gray-50 min-h-screen p-4 md:p-6">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold">Medical Prescription</h1>
                <p className="text-blue-100 mt-1">
                  {prescriptionId ? "Edit Prescription" : "Create New Prescription"}
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
                <button
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md flex items-center"
                  onClick={() => setShowPDFModal(true)}
                >
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
              {doctor ? (
                <div className="space-y-2">
                  <p className="text-gray-800">
                    <span className="font-medium">Name:</span> {doctor.name}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">ID:</span> {doctor._id}
                  </p>
                  {doctor.specialization && (
                    <p className="text-gray-800">
                      <span className="font-medium">Specialization:</span> {doctor.specialization}
                    </p>
                  )}
                  {doctor.contact && (
                    <p className="text-gray-800">
                      <span className="font-medium">Contact:</span> {doctor.contact}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Loading doctor details...</p>
              )}
            </div>
            <div className="border rounded-lg p-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Patient</h2>
              {patient ? (
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
                      <span className="font-medium">Gender:</span> {patient.gender}
                    </p>
                  )}
                  {patient.contact && (
                    <p className="text-gray-800">
                      <span className="font-medium">Contact:</span> {patient.contact}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Loading patient details...</p>
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
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Medicines</h2>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newMedicine.isTapering}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, isTapering: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Is Tapering</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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
                  <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  {showMedicineDropdown && searchResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-48 overflow-auto">
                      {searchResults.map((medicine) => (
                        <div
                          key={medicine._id}
                          onClick={() => handleMedicineSelect(medicine)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <div className="font-medium">{medicine.name}</div>
                          <div className="text-xs text-gray-500">{medicine.type}</div>
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
                <select
                  id="dosage"
                  value={newMedicine.dosage}
                  onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select dosage</option>
                  <option value="1-0-0">1-0-0 (Morning only)</option>
                  <option value="0-1-0">0-1-0 (Afternoon only)</option>
                  <option value="0-0-1">0-0-1 (Night only)</option>
                  <option value="1-1-0">1-1-0 (Morning & Afternoon)</option>
                  <option value="1-0-1">1-0-1 (Morning & Night)</option>
                  <option value="0-1-1">0-1-1 (Afternoon & Night)</option>
                  <option value="1-1-1">1-1-1 (Three times daily)</option>
                  <option value="2-0-0">2-0-0 (Two in morning)</option>
                  <option value="0-2-0">0-2-0 (Two in afternoon)</option>
                  <option value="0-0-2">0-0-2 (Two at night)</option>
                  <option value="2-1-1">2-1-1 (Two morning, one afternoon & night)</option>
                  <option value="1-2-1">1-2-1 (One morning, two afternoon, one night)</option>
                  <option value="1-1-2">1-1-2 (One morning & afternoon, two night)</option>
                  <option value="2-2-2">2-2-2 (Two tablets three times daily)</option>
                  <option value="SOS">SOS (As needed)</option>
                  <option value="STAT">STAT (Immediately)</option>
                </select>
              </div>

              {!newMedicine.isTapering && (
                <>
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
                        setNewMedicine({ ...newMedicine, instructions: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. After food"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="timing"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Timing
                    </label>
                    <input
                      type="text"
                      id="timing"
                      value={newMedicine.timing}
                      onChange={(e) =>
                        setNewMedicine({ ...newMedicine, timing: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Morning, Evening"
                    />
                  </div>
                </>
              )}
            </div>

            {newMedicine.isTapering && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tapering Schedule</h3>
                {newMedicine.tapering.map((schedule, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor={`tapering-dosage-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Dosage
                      </label>
                      <input
                        type="text"
                        id={`tapering-dosage-${index}`}
                        value={schedule.dosage}
                        onChange={(e) =>
                          handleUpdateTaperingSchedule(index, "dosage", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 10 mg"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`tapering-days-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Days
                      </label>
                      <input
                        type="text"
                        id={`tapering-days-${index}`}
                        value={schedule.days}
                        onChange={(e) =>
                          handleUpdateTaperingSchedule(index, "days", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 7 days"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => handleRemoveTaperingSchedule(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleAddTaperingSchedule}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center mb-4"
                >
                  <Plus size={16} className="mr-2" />
                  Add Tapering Schedule
                </button>
              </div>
            )}

            <div className="flex items-end">
              <button
                onClick={handleAddMedicine}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
              >
                <Plus size={16} className="mr-2" />
                Add Medicine
              </button>
            </div>

            <div className="overflow-x-auto mt-6">
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
                      Tapering
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicines.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
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
                          <div className="text-xs text-gray-500">{medicine.medicine.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {medicine.dosage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {medicine.isTapering ? "-" : medicine.duration || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {medicine.isTapering ? "-" : medicine.instructions || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {medicine.isTapering ? "-" : medicine.timing || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {medicine.isTapering && medicine.tapering?.length > 0
                            ? medicine.tapering
                                .map((schedule) => `${schedule.dosage} for ${schedule.days}`)
                                .join(", ")
                            : "No"}
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
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Lab Reports</h2>
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="reportType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Report Type
                  </label>
                  <input
                    type="text"
                    id="reportType"
                    value={newLabReport.reportType}
                    onChange={(e) =>
                      setNewLabReport({ ...newLabReport, reportType: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Blood Test"
                  />
                </div>
                <div>
                  <label
                    htmlFor="findings"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Findings
                  </label>
                  <input
                    type="text"
                    id="findings"
                    value={newLabReport.findings}
                    onChange={(e) =>
                      setNewLabReport({ ...newLabReport, findings: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Cholesterol levels slightly elevated"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reportDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Report Date
                  </label>
                  <input
                    type="date"
                    id="reportDate"
                    value={newLabReport.reportDate}
                    onChange={(e) =>
                      setNewLabReport({ ...newLabReport, reportDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Lab Values</h3>
              {newLabReport.values.map((val, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor={`value-name-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id={`value-name-${index}`}
                      value={val.name}
                      onChange={(e) =>
                        handleUpdateLabReportValue(index, "name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Total Cholesterol"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`value-value-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Value
                    </label>
                    <input
                      type="text"
                      id={`value-value-${index}`}
                      value={val.value}
                      onChange={(e) =>
                        handleUpdateLabReportValue(index, "value", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 220 mg/dL"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => handleRemoveLabReportValue(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={handleAddLabReportValue}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center mb-4"
              >
                <Plus size={16} className="mr-2" />
                Add Lab Value
              </button>
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

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Findings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Values
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {labReports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No lab reports added yet
                      </td>
                    </tr>
                  ) : (
                    labReports.map((report, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {report.reportType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.findings || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.values
                            ? Object.entries(report.values)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(report.reportDate).toLocaleDateString("en-GB") || "-"}
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
              onClick={() => setShowPDFModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center"
            >
              <FileText size={16} className="mr-2" />
              See Preview
            </button>
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      {showPDFModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Prescription PDF Preview
              </h2>
              <div className="flex gap-2">
                <PDFDownloadLink
                  document={
                    <PrescriptionPDF
                      doctor={doctor}
                      patient={patient}
                      diagnosis={diagnosis}
                      medicines={medicines}
                      labReports={labReports}
                    />
                  }
                  fileName="prescription.pdf"
                >
                  {({ loading }) =>
                    loading ? (
                      "Loading document..."
                    ) : (
                      <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                        <Download size={16} className="mr-2" />
                        Download PDF
                      </button>
                    )
                  }
                </PDFDownloadLink>
                <button
                  onClick={() => setShowPDFModal(false)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="h-[500px] overflow-auto">
              <PDFViewer width="100%" height="100%">
                <PrescriptionPDF
                  doctor={doctor}
                  patient={patient}
                  diagnosis={diagnosis}
                  medicines={medicines}
                  labReports={labReports}
                />
              </PDFViewer>
            </div>
            <div className="flex justify-end mt-4">
              <PDFDownloadLink
                document={
                  <PrescriptionPDF
                    doctor={doctor}
                    patient={patient}
                    diagnosis={diagnosis}
                    medicines={medicines}
                    labReports={labReports}
                  />
                }
                fileName="prescription.pdf"
              >
                {({ loading }) =>
                  loading ? (
                    "Loading document..."
                  ) : (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                      onClick={handleSavePrescription}
                    >
                      Save Prescription and send Email
                    </button>
                  )
                }
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Prescription;