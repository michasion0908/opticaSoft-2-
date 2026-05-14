import { Router } from 'express';
import {getPaquetes, createPaquete, deletePaquete, updatePaquete} 
from '../controllers/Paquete.Controller.js';

const router = Router();
router.get('/', getPaquetes);
router.post('/create', createPaquete);
router.put('/update/:idPaquete', updatePaquete);
router.delete('/delete/:idPaquete', deletePaquete);

export default router;
