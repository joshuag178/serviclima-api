// src/controladores/resumen.js
// Devuelve los totales de las órdenes. Los cálculos los hace SQLite en el servicio.

import * as servicio from "../servicios/ordenes.js";

// GET /resumen
export function obtenerResumen(req, res) {
  res.json(servicio.resumen());
}
