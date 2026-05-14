import { Router } from 'express';
import { getMaterial, createMaterial, updateMaterial, deleteMaterial}
from '../controllers/Material.Controller.js';

const router = Router();
router.get('/', getMaterial);
router.post('/create', createMaterial);
router.put('/update/:idMaterial', updateMaterial);
router.delete('/delete/:idMaterial', deleteMaterial);

export default router;
