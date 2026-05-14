import { Router } from 'express';
import {getHistorialClinico, createHistorialClinico, updateHistorialClinico, deleteHistorialClinico} 
from '../controllers/HistorialClinico.Controller.js';

const router = Router();
router.get('/', getHistorialClinico);
router.post('/create', createHistorialClinico);
router.put('/update/:idHistorialClinico', updateHistorialClinico);
router.delete('/delete/:idHistorialClinico', deleteHistorialClinico);

export default router;
