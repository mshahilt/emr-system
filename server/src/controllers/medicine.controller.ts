import { Request, Response } from 'express';
import { MedicineService } from '../services/medicine.service';
import { HttpStatusCode } from '../constants/statusCodes';

export class MedicineController {

  static async create(req: Request, res: Response) {
    try {
      const medicine = await MedicineService.createMedicine(req.body);
      res.status(HttpStatusCode.CREATED).json(medicine);
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const medicines = await MedicineService.getAllMedicines();
      res.status(HttpStatusCode.OK).json(medicines);
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const medicine = await MedicineService.getMedicineById(req.params.id);
      if (!medicine) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Medicine not found' });
      }
      res.status(HttpStatusCode.OK).json(medicine);
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await MedicineService.updateMedicine(req.params.id, req.body);
      if (!updated) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Medicine not found' });
      }
      res.status(HttpStatusCode.OK).json(updated);
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await MedicineService.deleteMedicine(req.params.id);
      if (!deleted) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Medicine not found' });
      }
      res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error: error.message });
    }
  }
}
