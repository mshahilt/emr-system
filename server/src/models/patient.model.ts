import mongoose, { Schema, model, Document } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: string;
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    age: { type: String, required: true},
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    dob: { type: Date },
  },
  { timestamps: true }
);

export const PatientModel = model<IPatient>('Patient', patientSchema);
