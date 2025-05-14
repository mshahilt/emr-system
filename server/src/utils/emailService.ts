import nodemailer from "nodemailer";
import { IPrescription } from "../models/prescription.model";
export async function sendPrescriptionEmail(to: string, prescription: IPrescription) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const medicineList = prescription.medicines
    .map((med) => {
      const medName =
        typeof med.medicine === "object" && "name" in med.medicine
          ? med.medicine.name
          : med.medicine;
      return `
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #E0E0E0;">${medName}</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #E0E0E0;">${med.dosage || "-"}</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #E0E0E0;">${med.duration || "-"}</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #E0E0E0;">${med.timing || "-"}</td>
        </tr>`;
    })
    .join("");

  const patient = prescription.patient as any;
  const doctor = prescription.doctor as any;
  
  // Format date for the prescription
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Prescription</title>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Roboto', Arial, sans-serif; color: #333333; background-color: #f6f7f9;">
      <!-- Wrapper for email clients -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f6f7f9;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <!-- Main content container -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 650px; background-color: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 3px 5px rgba(0,0,0,0.04);">
              <!-- Header -->
              <tr>
                <td style="background-color: #2563EB; padding: 25px 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-weight: 600; font-size: 22px; letter-spacing: 0.5px;">CLINIC PPM HEALTH</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0; font-size: 15px;">Prescription Details</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <!-- Date and ID -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                    <tr>
                      <td align="right" style="color: #64748B; font-size: 13px;">
                        <p style="margin: 0;">Issued: ${currentDate}</p>
                        <p style="margin: 5px 0 0;">Prescription ID: #${prescription._id?.toString().slice(-6).toUpperCase() || Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Patient & Doctor Info - Responsive version -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                    <tr>
                      <td valign="top" style="padding-right: 10px; padding-bottom: 10px; width: 50%;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #EBF4FF; border-radius: 6px; border-left: 4px solid #3B82F6;">
                          <tr>
                            <td style="padding: 15px;">
                              <h3 style="margin: 0 0 10px; font-size: 15px; font-weight: 600; color: #1E40AF;">Patient Details</h3>
                              <p style="margin: 0; line-height: 1.6; font-size: 13px;">
                                <strong>Name:</strong> ${patient?.name || "-"}<br/>
                                <strong>Email:</strong> ${patient?.email || "-"}<br/>
                                <strong>Phone:</strong> ${patient?.phone || "-"}<br/>
                                <strong>Gender:</strong> ${patient?.gender || "-"}
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td valign="top" style="padding-left: 10px; padding-bottom: 10px; width: 50%;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F0FDF4; border-radius: 6px; border-left: 4px solid #22C55E;">
                          <tr>
                            <td style="padding: 15px;">
                              <h3 style="margin: 0 0 10px; font-size: 15px; font-weight: 600; color: #166534;">Doctor</h3>
                              <p style="margin: 0; line-height: 1.6; font-size: 13px;">
                                <strong>Name:</strong> ${doctor?.name || "-"}<br/>
                                <strong>Specialization:</strong> ${doctor?.specialization || "-"}
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Diagnosis -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                    <tr>
                      <td style="background-color: #F8FAFC; border-radius: 6px; padding: 15px; border-left: 4px solid #94A3B8;">
                        <h3 style="margin: 0 0 10px; font-size: 15px; font-weight: 600; color: #475569;">Diagnosis</h3>
                        <p style="margin: 0; line-height: 1.6; font-size: 13px;">${prescription.diagnosis || 'No diagnosis provided'}</p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Medicines -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                    <tr>
                      <td>
                        <h3 style="margin: 0 0 15px; font-size: 15px; font-weight: 600; color: #475569;">Prescribed Medications</h3>
                        <div style="overflow-x: auto;">
                          <table style="width: 100%; border-collapse: collapse; font-size: 13px; min-width: 500px;">
                            <thead>
                              <tr style="background-color: #F1F5F9;">
                                <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #E2E8F0;">Medicine</th>
                                <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #E2E8F0;">Dosage</th>
                                <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #E2E8F0;">Duration</th>
                                <th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #E2E8F0;">Timing</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${medicineList || '<tr><td colspan="4" style="padding: 12px 15px; text-align: center;">No medications prescribed</td></tr>'}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Notes -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                    <tr>
                      <td style="background-color: #FEF2F2; border-radius: 6px; padding: 15px; border-left: 4px solid #EF4444;">
                        <h3 style="margin: 0 0 10px; font-size: 15px; font-weight: 600; color: #B91C1C;">Additional Notes</h3>
                        <p style="margin: 0; line-height: 1.6; font-size: 13px;">${prescription.notes || 'No additional notes'}</p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Instructions -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                    <tr>
                      <td style="background-color: #FFFBEB; border-radius: 6px; padding: 15px; border-left: 4px solid #F59E0B;">
                        <h3 style="margin: 0 0 10px; font-size: 15px; font-weight: 600; color: #B45309;">Important Instructions</h3>
                        <ul style="margin: 0; padding-left: 20px; line-height: 1.6; font-size: 13px;">
                          <li>Take medications as prescribed</li>
                          <li>Complete the full course of treatment</li>
                          <li>Contact your doctor if you experience any adverse effects</li>
                          <li>Store medications in a cool, dry place away from direct sunlight</li>
                        </ul>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #1E293B; color: white; padding: 20px; text-align: center; font-size: 13px;">
                  <p style="margin: 0 0 8px;">This is an automated email from CLINIC PPM Health. Please do not reply.</p>
                  <p style="margin: 0; color: #94A3B8;">© ${new Date().getFullYear()} CLINIC PPM Health. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"CLINIC PPM Health" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your Prescription from CLINIC PPM Health",
    html: htmlContent,
  });
}