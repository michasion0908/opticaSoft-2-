import { Router } from 'express';
import { getLentesContacto, createLentesContacto, updateLentesContacto, deleteLentesContacto }
from '../controllers/LentesContacto.Controller.js';

const router = Router();
router.get('/', getLentesContacto);
router.post('/create', createLentesContacto);
router.put('/update/:idLentesContacto', updateLentesContacto);
router.delete('/delete/:idLentesContacto', deleteLentesContacto);

export default router;
