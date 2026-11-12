// src/controladores/catalogos.js
// Devuelve las listas de src/catalogos.js. Son constantes: no pasan por un servicio.

import { DEPARTAMENTOS, CATEGORIAS } from '../catalogos.js';

// GET /departamentos
export function listarDepartamentos(req, res) {
    res.json(DEPARTAMENTOS);
}

// GET /categorias
export function listarCategorias(req, res) {
    res.json(CATEGORIAS);
}