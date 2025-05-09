import { IMedicine, Medicine } from "../models/medicine.model"

export class MedicineService {
  static async createMedicine(data: Partial<IMedicine>) {
    return await Medicine.create(data);
  }

  static async getAllMedicines() {
    return await Medicine.find();
  }

  static async getMedicineById(id: string) {
    return await Medicine.findById(id);
  }

  static async updateMedicine(id: string, data: Partial<IMedicine>) {
    return await Medicine.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteMedicine(id: string) {
    return await Medicine.findByIdAndDelete(id);
  }
}
