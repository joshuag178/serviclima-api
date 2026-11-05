// src/index.js
// Punto de entrada de la API. Por ahora solo lee los datos iniciales y muestra un resumen.
// En la sesión 2 este archivo levanta el servidor con Express.

import { readFile } from "node:fs/promises";
import path from "node:path";

// Ruta absoluta a datos/db.json, armada desde la carpeta de este archivo (src/)
const rutaDatos = path.join(import.meta.dirname, "..", "datos", "db.json");

try {
  // Leer el archivo como texto y convertirlo en objeto
  const contenido = await readFile(rutaDatos, "utf8");
  const datos = JSON.parse(contenido);

  // db.json tiene la forma { "ordenes": [ ... ] }, igual que en json-server
  const ordenes = datos.ordenes;
  console.log(
    `Serviclima API: ${ordenes.length} órdenes cargadas desde db.json`,
  );

  // Conteo de órdenes por estado
  const porEstado = {};
  for (const orden of ordenes) {
    porEstado[orden.estado] = (porEstado[orden.estado] ?? 0) + 1;
  }

  console.log("Órdenes por estado:");
  for (const [estado, cantidad] of Object.entries(porEstado)) {
    console.log(` ${estado}: ${cantidad}`);
  }
} catch (error) {
  // Si falla la lectura, se muestra el motivo y el proceso termina con código de error
  console.error(`No se pudieron cargar las órdenes: ${error.message}`);
  process.exitCode = 1;
}
