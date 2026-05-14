import { Router } from 'express';
import { getRecetas, createReceta, updateReceta, deleteReceta }
from '../controllers/Receta.Controller.js';

const router = Router();
router.get('/', getRecetas);
router.post('/create', createReceta);
router.put('/update/:idReceta', updateReceta);
router.delete('/delete/:idReceta', deleteReceta);

export default router;
