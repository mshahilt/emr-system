
import React, { useState, useEffect } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { axiosInstance } from "../../../API/axiosInstance";
import { toast } from "react-toastify";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Download } from "lucide-react";

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
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: { fontWeight: "bold" },
  labelText: { marginBottom: 4 },
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
    borderRightWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  tableCol: {
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

// PrescriptionPDF Component
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
          <Text style={styles.headerText}>
            Dr {doctor?.name}, MD (PHYSICIAN)
          </Text>
          <Text style={styles.subHeaderText}>
            General Practitioner | Reg No: {doctor?._id} | +91 {doctor?.contact}
          </Text>
          <Text style={styles.subHeaderText}>
            Pathappiriyam | BOOKING NO: +91 8606344694
          </Text>
        </View>

        {/* Patient Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.labelText}>
                <Text style={styles.label}>Name:</Text> {patient?.name || "-"}
              </Text>
              <Text style={styles.labelText}>
                <Text style={styles.label}>Phone:</Text> {patient?.phone || "-"}
              </Text>
              <Text style={styles.labelText}>
                <Text style={styles.label}>Age:</Text> {patient?.age || "-"}
              </Text>
              <Text style={styles.labelText}>
                <Text style={styles.label}>Diagnosis:</Text> {diagnosis || "N/A"}
              </Text>
              <Text style={styles.labelText}>
                <Text style={styles.label}>Date & Time:</Text> {formattedDate}
              </Text>
            </View>
            <View style={{ width: "30%" }}>
              <Text style={styles.labelText}>
                <Text style={styles.label}>SpO2:</Text> -
              </Text>
              <Text style={styles.labelText}>
                <Text style={styles.label}>BP:</Text> -
              </Text>
              <Text style={styles.labelText}>
                <Text style={styles.label}>Pulse:</Text> -
              </Text>
              <Text style={styles.labelText}>
                <Text style={styles.label}>Temp:</Text> -
              </Text>
              <Text style={styles.labelText}>
                <Text style={styles.label}>Weight:</Text> -
              </Text>
            </View>
          </View>
        </View>

        {/* Medicines Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medicines</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: "10%" }]}>
                <Text style={styles.tableCellHeader}>SI</Text>
              </View>
              <View style={[styles.tableColHeader, { width: "20%" }]}>
                <Text style={styles.tableCellHeader}>Medicine</Text>
              </View>
              <View style={[styles.tableColHeader, { width: "15%" }]}>
                <Text style={styles.tableCellHeader}>Dosage</Text>
              </View>
              <View style={[styles.tableColHeader, { width: "15%" }]}>
                <Text style={styles.tableCellHeader}>Duration</Text>
              </View>
              <View style={[styles.tableColHeader, { width: "15%" }]}>
                <Text style={styles.tableCellHeader}>Timing</Text>
              </View>
              <View style={[styles.tableColHeader, { width: "25%" }]}>
                <Text style={styles.tableCellHeader}>Instructions</Text>
              </View>
            </View>
            {medicines.length > 0 ? (
              medicines.map((med, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={[styles.tableCol, { width: "10%" }]}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "20%" }]}>
                    <Text style={styles.tableCell}>{med.medicine.name}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "15%" }]}>
                    <Text style={styles.tableCell}>
                      {med.isTapering ? "See Below" : med.dosage || "-"}
                    </Text>
                  </View>
                  <View style={[styles.tableCol, { width: "15%" }]}>
                    <Text style={styles.tableCell}>
                      {med.isTapering ? "See Below" : med.duration || "-"}
                    </Text>
                  </View>
                  <View style={[styles.tableCol, { width: "15%" }]}>
                    <Text style={styles.tableCell}>
                      {med.isTapering ? "See Below" : med.timing || "-"}
                    </Text>
                  </View>
                  <View style={[styles.tableCol, { width: "25%" }]}>
                    <Text style={styles.tableCell}>
                      {med.isTapering
                        ? med.taperingSchedule
                            ?.map(
                              (s) =>
                                `${s.dosage} for ${s.duration} (${s.timing}, ${s.instructions})`
                            )
                            .join("; ") || "-"
                        : med.instructions || "-"}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: "10%" }]}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
                <View style={[styles.tableCol, { width: "20%" }]}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
                <View style={[styles.tableCol, { width: "15%" }]}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
                <View style={[styles.tableCol, { width: "15%" }]}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
                <View style={[styles.tableCol, { width: "15%" }]}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
                <View style={[styles.tableCol, { width: "25%" }]}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Lab Reports Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lab Reports</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: "25%" }]}>
                <Text style={styles.tableCellHeader}>Report Type</Text>
              </View>
              <View style={[styles.tableColHeader, { width: "30%" }]}>
                <Text style={styles.tableCellHeader}>Findings</Text>
              </View>
              <View style={[styles.tableColHeader, { width: "30%" }]}>
                <Text style={styles.tableCellHeader}>Values</Text>
              </View>
              <View style={[styles.tableColHeader, { width: "15%" }]}>
                <Text style={styles.tableCellHeader}>Report Date</Text>
              </View>
            </View>
            {labReports.length > 0 ? (
              labReports.map((report, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={[styles.tableCol, { width: "25%" }]}>
                    <Text style={styles.tableCell}>{report.reportType || "-"}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "30%" }]}>
                    <Text style={styles.tableCell}>{report.findings || "-"}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "30%" }]}>
                    <Text style={styles.tableCell}>
                      {report.values
                        ? Object.entries(report.values)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")
                        : "-"}
                    </Text>
                  </View>
                  <View style={[styles.tableCol, { width: "15%" }]}>
                    <Text style={styles.tableCell}>
                      {new Date(report.reportDate).toLocaleDateString("en-GB") || "-"}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: "25%" }]}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
                <View style={[styles.tableCol, { width: "30%" }]}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
                <View style={[styles.tableCol, { width: "30%" }]}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
                <View style={[styles.tableCol, { width: "15%" }]}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
              </View>
            )}
          </View>
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

const PrescriptionModal = ({ patientId, onClose }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/api/prescription/patient/${patientId}`
        );
        const prescriptionData = response.data.data || [];
        setPrescriptions(prescriptionData);
        if (prescriptionData.length > 0) {
          setSelectedPrescription(prescriptionData[0]); // Default to first prescription
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
        setError("Failed to load prescriptions. Please try again.");
        setLoading(false);
        toast.error("Failed to load prescriptions.");
      }
    };

    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Prescription Details</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded"
          >
            Close
          </button>
        </div>

        {prescriptions.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No prescriptions found for this patient.
          </div>
        ) : (
          <>
            {/* Prescription Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Prescription
              </label>
              <select
                value={selectedPrescription?._id || ""}
                onChange={(e) =>
                  setSelectedPrescription(
                    prescriptions.find((p) => p._id === e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {prescriptions.map((prescription) => (
                  <option key={prescription._id} value={prescription._id}>
                    Prescription{" "}
                    {new Date(prescription.createdAt).toLocaleDateString(
                      "en-GB"
                    )}
                  </option>
                ))}
              </select>
            </div>

            {/* PDF Viewer */}
            {selectedPrescription && (
              <>
                <div className="h-[500px] overflow-auto">
                  <PDFViewer width="100%" height="100%">
                    <PrescriptionPDF
                      doctor={selectedPrescription.doctor}
                      patient={selectedPrescription.patient}
                      diagnosis={selectedPrescription.diagnosis}
                      medicines={selectedPrescription.medicines}
                      labReports={selectedPrescription.labReports}
                    />
                  </PDFViewer>
                </div>
                <div className="flex justify-end mt-4">
                  <PDFDownloadLink
                    document={
                      <PrescriptionPDF
                        doctor={selectedPrescription.doctor}
                        patient={selectedPrescription.patient}
                        diagnosis={selectedPrescription.diagnosis}
                        medicines={selectedPrescription.medicines}
                        labReports={selectedPrescription.labReports}
                      />
                    }
                    fileName={`prescription-${selectedPrescription._id}.pdf`}
                  >
                    {({ loading }) =>
                      loading ? (
                        "Loading document..."
                      ) : (
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                          <Download size={16} className="mr-2" />
                          Download PDF
                        </button>
                      )
                    }
                  </PDFDownloadLink>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PrescriptionModal;
