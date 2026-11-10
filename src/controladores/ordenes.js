// src/controladores/ordenes.js
// Capa de controladores: traduce entre HTTP y el servicio.
// Lee req (params, body), llama al servicio y decide el código de estado.
// No sabe dónde se guardan las órdenes.

import * as servicio from "../servicios/ordenes.js";

// Respuesta 404 compartida por varias funciones
function noExiste(req, res) {
  return res.status(404).json({ error: `No existe la orden ${req.params.id}` });
}

// GET /ordenes
export function listarOrdenes(req, res) {
  res.json(servicio.listar());
}

// GET /ordenes/:id
export function obtenerOrden(req, res) {
  const orden = servicio.buscarPorId(Number(req.params.id));
  if (!orden) return noExiste(req, res);
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
  if (!orden) return noExiste(req, res);
  res.json(orden);
}

// PATCH /ordenes/:id
export function actualizarOrden(req, res) {
  const orden = servicio.actualizar(Number(req.params.id), req.body);
  if (!orden) return noExiste(req, res);
  res.json(orden);
}

// DELETE /ordenes/:id: 200 con {} porque el frontend siempre llama a .json()
export function eliminarOrden(req, res) {
  const eliminada = servicio.eliminar(Number(req.params.id));
  if (!eliminada) return noExiste(req, res);
  res.json({});
}
