import { Router } from 'express';
import {getCitas, createCita, deleteCita, updateCita} 
from '../controllers/Cita.Controller.js';

const router = Router();
router.get('/', getCitas);
router.post('/create', createCita);
router.put('/update/:idCita', updateCita);
router.delete('/delete/:idCita', deleteCita);

export default router;
