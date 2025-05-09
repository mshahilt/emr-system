import express from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', BookingController.create);
router.get('/', authMiddleware, BookingController.getAll);
router.get('/slots', BookingController.getAvailableSlots);
router.get('/:id', BookingController.getById);
router.put('/:id', BookingController.update);
router.delete('/:id', BookingController.delete);
router.patch('/cancel/:id', BookingController.cancel);
router.patch('/complete/:id', BookingController.complete);

router.get('/patient/:patientId', BookingController.getByPatient);
router.get('/doctor/:doctorId', BookingController.getByDoctor);
export default router;
