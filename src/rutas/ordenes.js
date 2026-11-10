// src/rutas/ordenes.js
// Capa de rutas: solo dice qué función atiende cada método y ruta.
// El prefijo /ordenes lo pone index.js.

import { Router } from "express";
import {
  listarOrdenes,
  obtenerOrden,
  crearOrden,
  reemplazarOrden,
  actualizarOrden,
  eliminarOrden,
} from "../controladores/ordenes.js";

const router = Router();

router.get("/", listarOrdenes);
router.get("/:id", obtenerOrden);
router.post("/", crearOrden);
router.put("/:id", reemplazarOrden);
router.patch("/:id", actualizarOrden);
router.delete("/:id", eliminarOrden);

export default router;
