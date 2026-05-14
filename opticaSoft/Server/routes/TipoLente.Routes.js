import { Router } from 'express';
import { getTipoLente, createTipoLente, updateTipoLente, deleteTipoLente}
from '../controllers/TipoLente.Controller.js';

const router = Router();
router.get('/', getTipoLente);
router.post('/create', createTipoLente);
router.put('/update/:idTipoLente', updateTipoLente);
router.delete('/delete/:idTipoLente', deleteTipoLente);

export default router;

