import express from "express";
import {
  getPaqueteDetalles, createPaqueteDetalle, updatePaqueteDetalle, deletePaqueteDetalle} 
  from "../controllers/PaqueteDetalle.Controller.js";

const router = express.Router();


router.get("/", getPaqueteDetalles);
router.post("/create", createPaqueteDetalle);
router.put("/update/:idPaqueteDetalle", updatePaqueteDetalle);
router.delete("/delete/:idPaqueteDetalle", deletePaqueteDetalle);

export default router;
