// src/servicios/ordenes.js
// Capa de servicios: el ÚNICO archivo que sabe dónde viven las órdenes.
// Hoy viven en un arreglo en memoria; en la sesión 5 este archivo cambia a SQLite
// y las rutas y los controladores no se tocan.
// No sabe nada de HTTP: no usa req ni res. Recibe datos y devuelve datos.

import { readFile } from 'node:fs/promises';
import path from 'node:path';

// import.meta.dirname es src/servicios: se suben dos niveles hasta la raíz
const rutaDatos = path.join(
  import.meta.dirname,
  "..",
  "..",
  "datos",
  "db.json"
);
const contenido = await readFile(rutaDatos, "utf8");
const { ordenes } = JSON.parse(contenido);

// El codigo depende del id: 25 => OS-2026-025
function generarCodigo(id) {
  return "OS-2026-" + String(id).padStart(3, "0");
}

export function listar() {
  return ordenes;
}

// Devuelve la orden o undefined si no existe
export function buscarPorId(id) {
  return ordenes.find((orden) => orden.id === id);
}

// El servidor asigna id y codigo. Si el cliente los envía, se ignoran.
export function crear(datos) {
  const id = Math.max(0, ...ordenes.map((orden) => orden.id)) + 1;
  const nueva = { ...datos, id, codigo: generarCodigo(id) };
  ordenes.push(nueva);
  return nueva;
}

// PUT: reemplaza la orden completa. Conserva id y codigo.
export function reemplazar(id, datos) {
  const posicion = ordenes.findIndex((orden) => orden.id === id);
  if (posicion === -1) return undefined;

  const actual = ordenes[posicion];
  ordenes[posicion] = { ...datos, id: actual.id, codigo: actual.codigo };
  return ordenes[posicion];
}

// PATCH: combina los cambios con la orden actual. Conserva id y codigo.
export function actualizar(id, cambios) {
  const posicion = ordenes.findIndex((orden) => orden.id === id);
  if (posicion === -1) return undefined;

  const actual = ordenes[posicion];
  ordenes[posicion] = {
    ...actual,
    ...cambios,
    id: actual.id,
    codigo: actual.codigo,
  };
  return ordenes[posicion];
}

// Devuelve true si la eliminó y false si no existía
export function eliminar(id) {
  const posicion = ordenes.findIndex((orden) => orden.id === id);
  if (posicion === -1) return false;
  ordenes.splice(posicion, 1); // quita 1 elemento en esa posición
  return true;
}
