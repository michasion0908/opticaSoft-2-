import { Router } from 'express';
import {getPedidosTratamiento, createPedidoTratamiento, deletePedidoTratamiento, updatePedidoTratamiento} 
from '../controllers/PedidosTratamientos.Controller.js';

const router = Router();
router.get('/', getPedidosTratamiento);
router.post('/create', createPedidoTratamiento);
router.put('/update/:idPedidos_Tratamiento', updatePedidoTratamiento);
router.delete('/delete/:idPedidos_Tratamiento', deletePedidoTratamiento);

export default router;
