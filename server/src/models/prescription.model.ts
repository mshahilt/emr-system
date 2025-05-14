import mongoose, { Schema, Document, Types, model } from 'mongoose';

interface ILabReport {
  reportType?: string;
  findings?: string;
  values?: Record<string, string>; 
  reportDate?: Date;
}

interface IMedicineEntry {
  medicine: Types.ObjectId;
  dosage?: string;
  duration?: string;
  instructions?: string;
  timing?: string;
}

export interface IPrescription extends Document {
  doctor: Types.ObjectId;
  patient: Types.ObjectId;
  medicines: IMedicineEntry[];
  diagnosis?: string;
  notes?: string;
  labReports?: ILabReport[];
  createdAt: Date;
  updatedAt: Date;
}

const LabReportSchema = new Schema<ILabReport>({
  reportType: { type: String },
  findings: { type: String },
  values: { type: Map, of: String },
  reportDate: { type: Date, default: Date.now },
}, { _id: false });

const PrescriptionSchema = new Schema<IPrescription>(
  {
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
   medicines: [
        {
            medicine: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
            dosage: { type: String },
            duration: { type: String },
            instructions: { type: String },
            timing: { type: String },
        }
        ],
    diagnosis: { type: String },
    notes: { type: String },
    labReports: [LabReportSchema],
  },
  { timestamps: true }
);

export const Prescription = model<IPrescription>('Prescription', PrescriptionSchema);
