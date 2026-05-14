import { Router } from 'express';
import { getVentas, createVenta, updateVenta, deleteVenta }
from '../controllers/Venta.Controller.js';

const router = Router();
router.get('/', getVentas);
router.post('/create', createVenta);
router.put('/update/:idVenta', updateVenta);
router.delete('/delete/:idVenta', deleteVenta);

export default router;
