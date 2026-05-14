import { Router } from 'express';
import {getPedidos, createPedido, deletePedido, updatePedido} 
from '../controllers/Pedido.Controller.js';

const router = Router();
router.get('/', getPedidos);
router.post('/create', createPedido);
router.put('/update/:idPedido', updatePedido);
router.delete('/delete/:idPedido', deletePedido);

export default router;
