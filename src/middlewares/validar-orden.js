// src/middlewares/validar-orden.js
// Dos middlewares que van en las rutas, antes del controlador.
// Si la orden es inválida lanzan un 400 con los detalles.
// Si es válida dejan en req.body solo los campos conocidos.

import { validarOrden } from '../validaciones/ordenes.js';
import { ErrorHttp } from '../errores.js';

// POST y PUT: la orden completa, todos los campos obligatorios
export function validarOrdenCompleta(req, res, next) {
    // Sin Content-Type: application/json, req.body llega undefined
    const { limpios, detalles } = validarOrden(req.body ?? {});
    if (detalles.length > 0) {
        throw new ErrorHttp(400, 'La orden tiene datos inválidos', detalles);
    }
    req.body = limpios;
    next();
}

// PATCH: solo los campos que vienen.
// Un PATCH sin campos conocidos (como el { codigo } que manda el frontend
// después de crear) queda vacío y no cambia nada: no es un error.
export function validarOrdenParcial(req, res, next) {
    const { limpios, detalles } = validarOrden(req.body ?? {}, { parcial: true });
    if (detalles.length > 0) {
        throw new ErrorHttp(400, 'La orden tiene datos inválidos', detalles);
    }
    req.body = limpios;
    next();
}