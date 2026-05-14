import { Router } from 'express';
import {getExamenVista, createExamenVista, updateExamenVista, deleteExamenVista} 
from '../controllers/ExamenVista.Controller.js';

const router = Router();
router.get('/', getExamenVista);
router.post('/create', createExamenVista);
router.put('/update/:idExamenVista', updateExamenVista);
router.delete('/delete/:idExamenVista', deleteExamenVista);

export default router;
