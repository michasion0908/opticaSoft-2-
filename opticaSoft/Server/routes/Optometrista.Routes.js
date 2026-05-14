import { Router } from 'express';
import {
  getOptometrista,
  createOptometrista,
  updateOptometrista,
  deleteOptometrista
} from '../controllers/Optometrista.Controller.js';

const router = Router();

// Listado de optometristas
router.get('/', getOptometrista);

// Crear un nuevo optometrista
router.post('/create', createOptometrista);

// Actualizar un optometrista (nota los dos puntos antes del parámetro)
router.put('/update/:idOptometrista', updateOptometrista);

// Eliminar un optometrista (nota los dos puntos antes del parámetro)
router.delete('/delete/:idOptometrista', deleteOptometrista);

export default router;
