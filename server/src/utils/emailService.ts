import { Types } from "mongoose";
import nodemailer from "nodemailer";
import { IPrescription } from "../models/prescription.model";

export async function sendEmailWithPDFAttachment(to: string, prescription: IPrescription, pdfFilePath: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const patient = typeof prescription.patient === 'object' ? prescription.patient : { _id: prescription.patient };
  const doctor = typeof prescription.doctor === 'object' ? prescription.doctor : { _id: prescription.doctor };
  
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
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f6f7f9;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 650px; background-color: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 3px 5px rgba(0,0,0,0.04);">
              <!-- Header -->
              <tr>
                <td style="background-color: #2563EB; padding: 25px 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-weight: 600; font-size: 22px; letter-spacing: 0.5px;">CLINIC PARAPARA HEALTH</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0; font-size: 15px;">Your Prescription Details</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <p style="font-size: 16px; line-height: 1.6;">Dear Patient,</p>
                  
                  <p style="font-size: 16px; line-height: 1.6;">Thank you for visiting CLINIC PARAPARA HEALTH. Your prescription details have been attached to this email as a PDF document.</p>
                  
                  <p style="font-size: 16px; line-height: 1.6;">Please find your prescription details in the attached PDF file.</p>
                  
                  <div style="background-color: #F0FDF4; border-radius: 6px; padding: 15px; margin: 20px 0; border-left: 4px solid #22C55E;">
                    <h3 style="margin: 0 0 10px; font-size: 16px; font-weight: 600; color: #166534;">Important Instructions</h3>
                    <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
                      <li>Take medications as prescribed</li>
                      <li>Complete the full course of treatment</li>
                      <li>Contact your doctor if you experience any adverse effects</li>
                      <li>Keep this prescription for your records</li>
                    </ul>
                  </div>
                  
                  <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">Warm regards,<br>Dr. MANSOOR ALI.VP<br>CLINIC PARAPARA HEALTH</p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #1E293B; color: white; padding: 20px; text-align: center; font-size: 13px;">
                  <p style="margin: 0 0 8px;">This is an automated email from CLINIC PARAPA Health. Please do not reply.</p>
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

  const prescriptionId = prescription._id ? 
    prescription._id.toString().slice(-6).toUpperCase() : 
    Math.random().toString(36).substring(2, 8).toUpperCase();

  await transporter.sendMail({
    from: `"CLINIC PPM Health" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your Prescription from CLINIC PPM Health",
    html: htmlContent,
    attachments: [
      {
        filename: `prescription-${prescriptionId}.pdf`,
        path: pdfFilePath,
        contentType: 'application/pdf'
      }
    ]
  });
}