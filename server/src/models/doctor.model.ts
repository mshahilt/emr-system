import { Schema, model, Document } from 'mongoose';

export interface ISlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface IDoctor extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  profileImage: string;
  specialization: string;
  experience: number;
  availableSlots: ISlot[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    availableSlots: [
      {
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
      }
    ],
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

export const DoctorModel = model<IDoctor>('Doctor', doctorSchema);
