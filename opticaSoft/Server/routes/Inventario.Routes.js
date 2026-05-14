import { Router } from "express";
import {getInventario, createInventario, updateInventario, deleteInventario}
from "../controllers/Inventario.Controller.js";

const router = Router();
router.get("/",getInventario);
router.post("/create",createInventario);
router.put("/update/:idInventario", updateInventario);
router.delete("/delete/:idInventario", deleteInventario);

export default router;