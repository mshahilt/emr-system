import express from 'express';
import { PatientController } from '../controllers/patient.controller';

const router = express.Router();

router.post('/patients', PatientController.create);
router.get('/patients', PatientController.getAll);
router.get('/patients/search', PatientController.search);
router.get('/patients/:id', PatientController.getById);
router.put('/patients/:id', PatientController.update);
router.delete('/patients/:id', PatientController.delete);

export default router;
