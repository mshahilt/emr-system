import { Router } from 'express';
import { MedicineController } from '../controllers/medicine.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', asyncHandler(MedicineController.create));
router.get('/', asyncHandler(MedicineController.getAll));
router.get('/:id', asyncHandler(MedicineController.getById));
router.put('/:id', asyncHandler(MedicineController.update));
router.delete('/:id', asyncHandler(MedicineController.delete));

export default router;
