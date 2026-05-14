import { Router } from 'express';
import { getTratamientos, createTratamientos, updateTratamientos, deleteTratamientos}
from '../controllers/Tratamientos.Controller.js';

const router = Router();
router.get('/', getTratamientos);
router.post('/create', createTratamientos);
router.put('/update/:idTratamiento', updateTratamientos);
router.delete('/delete/:idTratamiento', deleteTratamientos);

export default router;
