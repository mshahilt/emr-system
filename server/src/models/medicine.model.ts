import { Schema, model, Document } from 'mongoose';

export interface IMedicine extends Document {
  name: string;
  dosageForm: string;
  strength: string; 
}

const MedicineSchema = new Schema<IMedicine>(
  {
    name: { type: String, required: true, trim: true },
    dosageForm: { type: String, required: true },
    strength: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Medicine = model<IMedicine>('Medicine', MedicineSchema);
