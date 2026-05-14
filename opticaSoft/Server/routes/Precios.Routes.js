import { Router } from 'express';
import {getPrecios, createPrecios, updatePrecios, deletePrecios}
 from '../controllers/Precios.Controller.js';

const router = Router();

router.get('/', getPrecios);
router.post('/create', createPrecios);
router.put('/update/:idPrecio', updatePrecios);
router.delete('/delete/:idPrecio', deletePrecios);

export default router;