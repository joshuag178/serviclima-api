// src/rutas/resumen.js
// Ruta del resumen. index.js monta este Router sin prefijo,
// por eso aquí sí se escribe la ruta completa.

import { Router } from "express";
import { obtenerResumen } from "../controladores/resumen.js";

const router = Router();

router.get("/resumen", obtenerResumen);

export default router;
