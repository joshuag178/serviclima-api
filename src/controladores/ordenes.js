// src/controladores/ordenes.js
// Capa de controladores: traduce entre HTTP y el servicio.
// Lee req (params, body), llama al servicio y decide el código de estado.
// No sabe dónde se guardan las órdenes.
// Cuando algo sale mal lanza un ErrorHttp: la respuesta la arma manejar-errores.js.
// Cuando llega aquí, req.body ya pasó por validar-orden.js.

import * as servicio from '../servicios/ordenes.js';
import { ErrorHttp } from '../errores.js';

// Error 404 compartido por varias funciones
function noExiste(id) {
    return new ErrorHttp(404, `No existe la orden ${id}`);
}

// GET /ordenes y GET /ordenes?estado=pendiente
// req.query trae los filtros; el servicio decide cuáles usa
export function listarOrdenes(req, res) {
    res.json(servicio.listar(req.query));
}


// GET /ordenes/:id
export function obtenerOrden(req, res) {
    const orden = servicio.buscarPorId(Number(req.params.id));
    if (!orden) throw noExiste(req.params.id);
    res.json(orden);
}

// POST /ordenes: 201 con la orden creada
export function crearOrden(req, res) {
    const nueva = servicio.crear(req.body);
    res.status(201).json(nueva);
}

// PUT /ordenes/:id
export function reemplazarOrden(req, res) {
    const orden = servicio.reemplazar(Number(req.params.id), req.body);
    if (!orden) throw noExiste(req.params.id);
    res.json(orden);
}

// PATCH /ordenes/:id
export function actualizarOrden(req, res) {
    const orden = servicio.actualizar(Number(req.params.id), req.body);
    if (!orden) throw noExiste(req.params.id);
    res.json(orden);
}

// DELETE /ordenes/:id: 200 con {} porque el frontend siempre llama a .json()
export function eliminarOrden(req, res) {
    const eliminada = servicio.eliminar(Number(req.params.id));
    if (!eliminada) throw noExiste(req.params.id);
    res.json({});
}