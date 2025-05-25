import mongoose, { Schema, Document, Types, model } from 'mongoose';

interface ILabReport {
  name?: string;
  reportType?: string;
  findings?: string;
  values?: Record<string, string>;
  reportDate?: Date;
}

interface ITaperingSchedule {
  dosage: string;
  duration: string;
  timing?: string;
  instructions?: string;
}

interface IMedicineEntry {
  medicine: Types.ObjectId;
  isTapering?: boolean;
  taperingSchedule?: ITaperingSchedule[];
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

const LabReportSchema = new Schema<ILabReport>(
  {
    reportType: { type: String },
    findings: { type: String },
    values: { type: Map, of: String },
    reportDate: { type: Date, default: Date.now },
  },
  { _id: false }
);

const TaperingScheduleSchema = new Schema<ITaperingSchedule>(
  {
    dosage: { type: String, required: true },
    duration: { type: String, required: true },
    timing: { type: String },
    instructions: { type: String },
  },
  { _id: false }
);

const PrescriptionSchema = new Schema<IPrescription>(
  {
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    medicines: [
      {
        medicine: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
        isTapering: { type: Boolean, default: false },
        taperingSchedule: { type: [TaperingScheduleSchema], default: undefined },
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
