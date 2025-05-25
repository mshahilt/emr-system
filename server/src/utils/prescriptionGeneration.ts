import { IPrescription } from "../models/prescription.model";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import os from "os";

import { sendEmailWithPDFAttachment } from "./emailService";

/**
 * Sends a prescription as a PDF attachment via email.
 */
export async function sendPrescriptionPDF(
  to: string,
  prescription: IPrescription
): Promise<void> {
  const pdfFilePath = await generatePrescriptionPDF(prescription);
  await sendEmailWithPDFAttachment(to, prescription, pdfFilePath);

  // Clean up temporary file
  try {
    fs.unlinkSync(pdfFilePath);
  } catch (error) {
    console.error("Error deleting temporary PDF file:", error);
  }
}

/**
 * Generates a styled PDF from a prescription object.
 */
async function generatePrescriptionPDF(prescription: IPrescription): Promise<string> {
  const tempFilePath = path.join(os.tmpdir(), `prescription-${Date.now()}.pdf`);
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 30, bottom: 30, left: 30, right: 30 },
  });

  const stream = fs.createWriteStream(tempFilePath);
  doc.pipe(stream);

  const colors = {
    primary: "#0c6170",
    text: "#000000",
    lightText: "#444444",
    border: "#000000",
    secondary: "#555555",
  };

  const fonts = {
    headerSize: 12,
    bodySize: 10,
    smallSize: 9,
  };

  const doctor = prescription.doctor as any;
  const patient = prescription.patient as any;
  const prescriptionDate = new Date(prescription.createdAt);

  // --- HEADER SECTION ---
  // Doctor Info
  doc
    .font("Helvetica-Bold")
    .fontSize(fonts.headerSize)
    .fillColor(colors.primary)
    .text("Dr. Onkar Bhave", 30, 40);

  doc
    .font("Helvetica")
    .fontSize(fonts.smallSize)
    .fillColor(colors.lightText)
    .text("M.B.B.S, M.D, M.S | Reg. No: 2131231 |", 30, 55)
    .text("Mob. No: 93812093", 30, 70);

  // Clinic Logo Placeholder
  doc.rect(doc.page.width - 100, 35, 30, 30).fillAndStroke(colors.primary);
  doc
    .fillColor(colors.primary)
    .fontSize(fonts.smallSize)
    .text("CLINIC", doc.page.width - 65, 42)
    .text("LOGO", doc.page.width - 65, 54);

  // Clinic Info
  doc
    .font("Helvetica-Bold")
    .fontSize(fonts.headerSize)
    .fillColor(colors.primary)
    .text("Clinic Parapara", doc.page.width - 180, 40);

  doc
    .font("Helvetica")
    .fontSize(fonts.smallSize)
    .fillColor(colors.lightText)
    .text("Kozhikode, Kerala, India", doc.page.width - 180, 55)
    .text("Ph: 93812093, Booking: 329120931", doc.page.width - 180, 70)
    .text("Timing: 09:00 AM - 02:00 PM | Closed: Thursday", doc.page.width - 180, 85);

  // Divider Line
  doc
    .strokeColor(colors.border)
    .lineWidth(1)
    .moveTo(30, 105)
    .lineTo(doc.page.width - 30, 105)
    .stroke();

  // Barcode Placeholder
  doc
    .rect(30, 115, 80, 20)
    .lineWidth(0.5)
    .fillAndStroke("#ffffff", colors.border);

  for (let i = 35; i < 105; i += 3) {
    doc.moveTo(i, 115).lineTo(i, 135).stroke();
  }

  // Prescription Date
  doc
    .font("Helvetica-Bold")
    .fontSize(fonts.smallSize)
    .fillColor(colors.text)
    .text(
      `Date: ${prescriptionDate.toLocaleDateString()} ${new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      doc.page.width - 200,
      120,
      { align: "right" }
    );

  // Patient Details
  doc
    .font("Helvetica-Bold")
    .fontSize(fonts.smallSize)
    .fillColor(colors.text)
    .text(`ID: ${patient.patientId || "N/A"} - ${patient.name} (${patient.gender}) / ${patient.age || "N/A"} Y`, 30, 145);

  doc
    .font("Helvetica")
    .fontSize(fonts.smallSize)
    .fillColor(colors.lightText)
    .text(`Address: ${patient.address || "N/A"}`, 30, 160);

  // Vitals if available
  if (patient.weight || patient.height || patient.bp) {
    const vitals = [`Weight(kg): ${patient.weight || "N/A"}`];
    if (patient.height) vitals.push(`Height (cms): ${patient.height}`);
    if (patient.bp) vitals.push(`BP: ${patient.bp}`);
    doc.text(vitals.join(", "), 30, 175);
  }

  // Referring Doctor
  if (doctor.referredBy) {
    doc.text(`Referred By: ${doctor.referredBy}`, 30, 190);
  }

  doc.moveDown(0.5);

  // Known History Section
  drawSectionDivider(doc, colors);
  doc
    .font("Helvetica-Bold")
    .fontSize(fonts.smallSize)
    .fillColor(colors.text)
    .text("Known History Of", 30, doc.y + 10);

  const history = doctor.patientHistory || ["* PQR"];
  doc
    .font("Helvetica")
    .fontSize(fonts.smallSize)
    .text(history[0] || "* PQR", 30, doc.y + 15);

  // Chief Complaints & Clinical Findings (Two Columns)
  drawSectionDivider(doc, colors);
  const colWidth = (doc.page.width - 60) / 2;

  doc
    .font("Helvetica-Bold")
    .fontSize(fonts.smallSize)
    .text("Chief Complaints", 30, doc.y + 20)
    .text("Clinical Findings", 30 + colWidth, doc.y - 12);


  // Notes
  drawSectionDivider(doc, colors);
  doc
    .font("Helvetica-Bold")
    .fontSize(fonts.smallSize)
    .text("Notes:", 30, doc.y + 20)
    .font("Helvetica")
    .text(prescription.notes || "SAMPLE INTERNAL NOTE", 30, doc.y + 15);

  // Diagnosis
  drawSectionDivider(doc, colors);
  doc
    .font("Helvetica-Bold")
    .fontSize(fonts.smallSize)
    .text("Diagnosis:", 30, doc.y + 20)
    .font("Helvetica")
    .text(`* ${prescription.diagnosis || "FEVER"}`, 30, doc.y + 15);

 

  // Medication Table
  drawSectionDivider(doc, colors);
  doc
    .font("Helvetica-Bold")
    .fontSize(fonts.bodySize)
    .text("R", 30, doc.y + 20);

  const medicineY = doc.y + 35;
  const medColWidths = [(doc.page.width - 60) * 0.4, (doc.page.width - 60) * 0.35, (doc.page.width - 60) * 0.25];

  doc
    .font("Helvetica-Bold")
    .fontSize(fonts.smallSize)
    .text("Medicine Name", 30, medicineY)
    .text("Dosage", 30 + medColWidths[0], medicineY)
    .text("Duration", 30 + medColWidths[0] + medColWidths[1], medicineY);

  doc
    .strokeColor(colors.border)
    .lineWidth(0.5)
    .moveTo(30, medicineY + 15)
    .lineTo(doc.page.width - 30, medicineY + 15)
    .stroke();

  let currentY = medicineY + 25;
  prescription.medicines.forEach((med, idx) => {
    const name = typeof med.medicine === "object" && "name" in med.medicine
      ? (med.medicine as any).name
      : med.medicine?.toString() ?? `DEMO MEDICINE ${idx + 1}`;

    const dosage = med.dosage || (idx % 2 === 0
      ? "1 Morning, 1 Night\n(Before Food)"
      : "1 Morning, 1 Night\n(After Food)");

    const duration = med.duration || `8 Days\n(${idx % 2 === 0 ? "Tab" : "Cap"}:20 ${idx % 2 === 0 ? "Tab" : "Cap"})`;

    doc
      .font("Helvetica")
      .fontSize(fonts.smallSize)
      .text(`${idx + 1}) ${name}`, 30, currentY)
      .text(dosage, 30 + medColWidths[0], currentY)
      .text(duration, 30 + medColWidths[0] + medColWidths[1], currentY);

    currentY += 40;

    doc
      .strokeColor(colors.border)
      .lineWidth(0.25)
      .dash(1, { space: 1 })
      .moveTo(30, currentY - 10)
      .lineTo(doc.page.width - 30, currentY - 10)
      .stroke()
      .undash();
  });

  // Investigations
  drawSectionDivider(doc, colors);
  doc
    .font("Helvetica-Bold")
    .fontSize(fonts.smallSize)
    .text("Investigations:", 30, currentY + 10);

  const investigations = prescription.labReports?.map((r) => r.name) || ["X-RAY", "P-53"];
  let invY = currentY + 25;

  investigations.forEach((inv, idx) => {
    doc
      .font("Helvetica")
      .fontSize(fonts.smallSize)
      .text(`* ${inv}`, 30, invY + idx * 15);
  });

  // Advice Given
  invY += 40;
  drawSectionDivider(doc, colors);
  doc
    .font("Helvetica-Bold")
    .fontSize(fonts.smallSize)
    .text("Advice Given:", 30, invY + 10)
    .font("Helvetica")
    .text(`* ${"AVOID OILY AND SPICY FOOD"}`, 30, invY + 25);

  // Follow-up Date
  invY += 50;
  drawSectionDivider(doc, colors);
  const followUpDate = new Date(prescriptionDate);
  followUpDate.setDate(followUpDate.getDate() + 15);

  doc
    .font("Helvetica-Bold")
    .fontSize(fonts.smallSize)
    .text("Follow Up:", 30, invY + 10)
    .font("Helvetica")
    .text(followUpDate.toLocaleDateString(), 30, invY + 25);

  // Signature
  doc
    .font("Helvetica-Bold")
    .fontSize(fonts.smallSize)
    .text("Signature", doc.page.width - 100, invY + 40, { align: "center" })
    .text("Dr. Onkar Bhave", doc.page.width - 100, invY + 65, { align: "center" })
    .font("Helvetica")
    .text("M.B.B.S., M.D., M.S.", doc.page.width - 100, invY + 80, { align: "center" });

  // Legal Disclaimer
  const footerTop = doc.page.height - 50;
  doc
    .fontSize(fonts.smallSize - 1)
    .fillColor(colors.lightText)
    .text(
      "This prescription is valid only when signed by the issuing doctor. Please follow all medication instructions carefully.",
      40,
      footerTop,
      { width: doc.page.width - 80, align: "center" }
    );

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(tempFilePath));
    stream.on("error", reject);
  });
}

/**
 * Draws a divider line below the current Y position.
 */
function drawSectionDivider(doc: PDFKit.PDFDocument, colors: Record<string, string>) {
  doc
    .strokeColor(colors.border)
    .lineWidth(0.75)
    .moveTo(30, doc.y + 10)
    .lineTo(doc.page.width - 30, doc.y + 10)
    .stroke();
}