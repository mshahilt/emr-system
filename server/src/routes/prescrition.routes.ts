import { Router } from "express";
import { PrescriptionController } from "../controllers/prescription.controller";
import { asyncHandler } from "../utils/asyncHandler";
const router = Router();

router.post("/", asyncHandler(PrescriptionController.create));
router.get("/:id", asyncHandler(PrescriptionController.getById));
router.get("/patient/:patientId",asyncHandler( PrescriptionController.getByPatient));
router.get("/doctor/:doctorId", asyncHandler(PrescriptionController.getByDoctor));
router.put("/:id", asyncHandler(PrescriptionController.update));
router.delete("/:id", asyncHandler(PrescriptionController.delete));

export default router;
