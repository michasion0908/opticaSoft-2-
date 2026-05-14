import express from "express";
import {
  getCotizaciones, createCotizacion, updateCotizacion, deleteCotizacion} 
  from "../controllers/Cotizacion.Controller.js";

const router = express.Router();

// Obtener todas las cotizaciones
router.get("/", getCotizaciones);
router.post("/create", createCotizacion);
router.put("/update/:idCotizacion", updateCotizacion);
router.delete("/delete/:idCotizacion", deleteCotizacion);

export default router;
