import { Router } from "express";
import {
  getGastos,
  getGastosByMes,
  createGasto,
  updateGasto,
  deleteGasto,
  getResumenMensual
} from "../controllers/Gasto.Controller.js";

const router = Router();

router.get("/", getGastos);
router.get("/mes/:mes/:anio", getGastosByMes);
router.get("/resumen/:mes/:anio", getResumenMensual);
router.post("/create", createGasto);
router.put("/update/:id_Gasto", updateGasto);
router.delete("/delete/:id_Gasto", deleteGasto);

export default router;