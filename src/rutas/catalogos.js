// src/rutas/catalogos.js
// Rutas de los catálogos. index.js monta este Router sin prefijo,
// por eso aquí sí se escribe la ruta completa.

import { Router } from 'express';
import { listarDepartamentos, listarCategorias } from '../controladores/catalogos.js';

const router = Router();

router.get('/departamentos', listarDepartamentos);
router.get('/categorias', listarCategorias);

export default router;