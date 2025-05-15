import { IPrescription } from "../models/prescription.model";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import os from "os";
import { sendEmailWithPDFAttachment } from "./emailService";

/**
 * Sends a prescription as a PDF attachment via email
 */
export async function sendPrescriptionPDF(to: string, prescription: IPrescription): Promise<void> {
  const pdfFilePath = await generatePrescriptionPDF(prescription);
  
  await sendEmailWithPDFAttachment(to, prescription, pdfFilePath);
  
  // Clean up the temporary file
  try {
    fs.unlinkSync(pdfFilePath);
  } catch (error) {
    console.error("Error deleting temporary PDF file:", error);
  }
}

/**
 * Generates a professionally formatted prescription PDF
 */
async function generatePrescriptionPDF(prescription: IPrescription): Promise<string> {
  const tempFilePath = path.join(os.tmpdir(), `prescription-${Date.now()}.pdf`);
  
  // Initialize PDF document with better margins
  const doc = new PDFDocument({
    size: "A4",
    margins: {
      top: 60,
      bottom: 60,
      left: 60,
      right: 60
    }
  });
  
  const stream = fs.createWriteStream(tempFilePath);
  doc.pipe(stream);
  
  const doctor = prescription.doctor as any;
  const patient = prescription.patient as any;
  const prescriptionDate = new Date(prescription.createdAt);

  // Document styling constants
  const colors = {
    primary: "#2563EB",    // Blue
    text: "#1F2937",       // Dark gray for text
    lightGray: "#E5E7EB",  // Light gray for dividers
    accent: "#3B82F6"      // Accent blue
  };
  
  const fonts = {
    titleSize: 22,
    sectionTitleSize: 14,
    bodySize: 10,
    smallSize: 9
  };

  // ========== HEADER ==========
  doc.fillColor(colors.primary)
     .fontSize(fonts.titleSize)
     .font('Helvetica-Bold')
     .text('Medical Prescription', { align: 'center' });
  
  doc.moveDown(0.5);
  
  // Header divider
  doc.strokeColor(colors.primary)
     .lineWidth(2)
     .moveTo(60, doc.y)
     .lineTo(doc.page.width - 60, doc.y)
     .stroke();
  
  doc.moveDown(1);

  // ========== METADATA SECTION ==========
  // Create a two-column layout for doctor and patient info
  const colWidth = (doc.page.width - 120) / 2;
  const leftColX = 60;
  const rightColX = leftColX + colWidth + 20;
  let sectionStartY = doc.y;
  
  // Left column: Doctor information
  doc.fillColor(colors.primary)
     .fontSize(fonts.sectionTitleSize)
     .font('Helvetica-Bold')
     .text('Doctor Information', leftColX, sectionStartY);
  
  doc.moveDown(0.3);
  
  doc.fillColor(colors.text)
     .fontSize(fonts.bodySize)
     .font('Helvetica');
  
  doc.text(`Dr. ${doctor.name}`);
  doc.text(`${doctor.specialization}`);
  doc.text(`Email: ${doctor.email}`);
  doc.text(`Phone: ${doctor.phone}`);
  
  // Right column: Patient information
  doc.fillColor(colors.primary)
     .fontSize(fonts.sectionTitleSize)
     .font('Helvetica-Bold')
     .text('Patient Information', rightColX, sectionStartY);
  
  doc.moveDown(0.3);
  
  doc.fillColor(colors.text)
     .fontSize(fonts.bodySize)
     .font('Helvetica')
     .text(`${patient.name}`, rightColX)
     .text(`Gender: ${patient.gender}`)
     .text(`Email: ${patient.email}`)
     .text(`Phone: ${patient.phone}`);
  
  // Reset position for next section
  doc.moveDown(2);

  // ========== DIAGNOSIS SECTION ==========
  doc.fillColor(colors.primary)
     .fontSize(fonts.sectionTitleSize)
     .font('Helvetica-Bold')
     .text('Diagnosis:');
  
  doc.moveDown(0.3);
  
  doc.fillColor(colors.text)
     .fontSize(fonts.bodySize)
     .font('Helvetica')
     .text(prescription.diagnosis ?? 'Diagnosis not provided');
  
  doc.moveDown(1.5);

  // ========== MEDICATIONS SECTION ==========
  doc.fillColor(colors.primary)
     .fontSize(fonts.sectionTitleSize)
     .font('Helvetica-Bold')
     .text('Medications:');
  
  doc.moveDown(0.5);

  // Medications table
  const tableTop = doc.y;
  const tableLeft = 60;
  const colWidths = [100, 70, 80, 120, 100];
  const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
  
  // Table header background
  doc.fillColor(colors.primary)
     .rect(tableLeft, tableTop, tableWidth, 25)
     .fill();
  
  // Table headers
  doc.fillColor("#FFFFFF")
     .fontSize(fonts.bodySize)
     .font('Helvetica-Bold');
  
  let currentY = tableTop + 8; // Center text vertically in header
  
  doc.text('Medicine', tableLeft + 5, currentY);
  doc.text('Dosage', tableLeft + colWidths[0] + 5, currentY);
  doc.text('Duration', tableLeft + colWidths[0] + colWidths[1] + 5, currentY);
  doc.text('Instructions', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, currentY);
  doc.text('Timing', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, currentY);
  
  currentY = tableTop + 25; // Move below header
  
  // Zebra striping for table rows
  let rowCount = 0;
  
  // Table rows
  doc.fillColor(colors.text)
     .fontSize(fonts.bodySize)
     .font('Helvetica');
  
  prescription.medicines.forEach((med, idx) => {
    // Check if we need a new page
    if (currentY > doc.page.height - 120) {
      doc.addPage();
      currentY = 60;
    }
    
    // Row background for zebra striping
    if (rowCount % 2 === 1) {
      doc.fillColor("#F3F4F6")
         .rect(tableLeft, currentY, tableWidth, 25)
         .fill();
    }
    
    // Medicine name with special handling for object vs string
    const medicineName = typeof med.medicine === "object" && "name" in med.medicine
      ? (med.medicine as any).name
      : med.medicine?.toString() ?? "Unknown";
    
    doc.fillColor(colors.text)
       .text(medicineName, tableLeft + 5, currentY + 7, { width: colWidths[0] - 10 });
    
    doc.text(med.dosage ?? 'N/A', 
             tableLeft + colWidths[0] + 5, currentY + 7, 
             { width: colWidths[1] - 10 });
    
    doc.text(med.duration ?? 'N/A', 
             tableLeft + colWidths[0] + colWidths[1] + 5, currentY + 7, 
             { width: colWidths[2] - 10 });
    
    doc.text(med.instructions ?? 'None', 
             tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, currentY + 7, 
             { width: colWidths[3] - 10 });
    
    doc.text(med.timing ?? 'N/A', 
             tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, currentY + 7, 
             { width: colWidths[4] - 10 });
    
    currentY += 25;
    rowCount++;
  });
  
  // Table border
  doc.strokeColor(colors.primary)
     .lineWidth(1)
     .rect(tableLeft, tableTop, tableWidth, currentY - tableTop)
     .stroke();
  
  doc.moveDown(1.5);

  // ========== ADDITIONAL NOTES ==========
  if (prescription.notes) {
    doc.fillColor(colors.primary)
       .fontSize(fonts.sectionTitleSize)
       .font('Helvetica-Bold')
       .text('Additional Notes:');
    
    doc.moveDown(0.3);
    
    doc.fillColor(colors.text)
       .fontSize(fonts.bodySize)
       .font('Helvetica')
       .text(prescription.notes);
    
    doc.moveDown(1);
  }

  // ========== LAB REPORTS ==========
  if (prescription.labReports && prescription.labReports.length > 0) {
    doc.fillColor(colors.primary)
       .fontSize(fonts.sectionTitleSize)
       .font('Helvetica-Bold')
       .text('Lab Reports:');
    
    doc.moveDown(0.3);
    
    doc.fillColor(colors.text)
       .fontSize(fonts.bodySize)
       .font('Helvetica');
    
    prescription.labReports.forEach((report, index) => {
      const reportDate = new Date(report.reportDate ?? Date.now());
      doc.text(`Report ${index + 1}: ${reportDate.toLocaleDateString()}`);
    });
    
    doc.moveDown(1);
  }

  // ========== FOOTER ==========
  const footerTop = doc.page.height - 100;
  
  // Footer divider
  doc.strokeColor(colors.lightGray)
     .lineWidth(1)
     .moveTo(60, footerTop)
     .lineTo(doc.page.width - 60, footerTop)
     .stroke();
  
  doc.fillColor(colors.text)
     .fontSize(fonts.smallSize)
     .font('Helvetica');
  
  // Date on the left
  doc.text(`Prescription Date: ${prescriptionDate.toLocaleDateString()}`, 
           60, footerTop + 15);
  
  // Signature on the right
  doc.text('Doctor\'s Signature:', 
           doc.page.width - 200, footerTop + 15);
  
  doc.strokeColor(colors.primary)
     .lineWidth(1)
     .moveTo(doc.page.width - 200, footerTop + 35)
     .lineTo(doc.page.width - 60, footerTop + 35)
     .stroke();
  
  // End the document
  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => {
      resolve(tempFilePath);
    });
    
    stream.on("error", reject);
  });
}