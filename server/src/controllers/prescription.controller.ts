import { Request, Response } from "express";
import { PrescriptionService } from "../services/prescription.service";
import { HttpStatusCode } from "../constants/statusCodes";

export class PrescriptionController {
  static async create(req: Request, res: Response) {
    try {
      const { body } = req;
      const prescription = await PrescriptionService.createPrescription(body);
      return res.status(HttpStatusCode.CREATED).json({ success: true, data: prescription });
    } catch (error: any) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const prescription = await PrescriptionService.getPrescriptionById(req.params.id);
      if (!prescription) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: "Prescription not found" });
      }
      return res.status(HttpStatusCode.OK).json({ success: true, data: prescription });
    } catch (error: any) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: error.message });
    }
  }

  static async getByPatient(req: Request, res: Response) {
    try {
      const prescriptions = await PrescriptionService.getPrescriptionsByPatient(req.params.patientId);
      return res.status(HttpStatusCode.OK).json({ success: true, data: prescriptions });
    } catch (error: any) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: error.message });
    }
  }

  static async getByDoctor(req: Request, res: Response) {
    try {
      const prescriptions = await PrescriptionService.getPrescriptionsByDoctor(req.params.doctorId);
      return res.status(HttpStatusCode.OK).json({ success: true, data: prescriptions });
    } catch (error: any) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await PrescriptionService.updatePrescription(req.params.id, req.body);
      return res.status(HttpStatusCode.OK).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await PrescriptionService.deletePrescription(req.params.id);
      return res.status(HttpStatusCode.OK).json({ success: true, data: deleted });
    } catch (error: any) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: error.message });
    }
  }
}
