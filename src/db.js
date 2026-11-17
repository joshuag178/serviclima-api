// src/db.js
// Conexión a SQLite, esquema de la tabla ordenes y datos iniciales (seed).
// Lo importa la capa de servicios. Ningún otro archivo habla con la base.
// node:sqlite viene con Node: no hay nada que instalar con npm.

import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ESTADOS, DEPARTAMENTOS, CATEGORIAS } from "./catalogos.js";

// import.meta.dirname es src: se sube un nivel hasta la raíz
const rutaDb = path.join(import.meta.dirname, "..", "datos", "serviclima.db");
const rutaSeed = path.join(import.meta.dirname, "..", "datos", "db.json");

// Si serviclima.db no existe, SQLite lo crea vacío
export const db = new DatabaseSync(rutaDb);

// Convierte ['a', 'b'] en "'a', 'b'" para usarlo dentro de IN (...).
// Los valores salen de catalogos.js, no del usuario: aquí sí se puede armar el texto.
function lista(valores) {
  return valores.map((valor) => `'${valor}'`).join(", ");
}

// CHECK es la segunda barrera: aunque la validación fallara, la base rechaza el dato.
// La tabla se crea una sola vez: si cambia catalogos.js, ejecute npm run reiniciar-db.
export function crearTabla() {
  db.exec(`
        CREATE TABLE IF NOT EXISTS ordenes (
            id           INTEGER PRIMARY KEY,
            codigo       TEXT UNIQUE,
            cliente      TEXT NOT NULL,
            nit          TEXT NOT NULL,
            departamento TEXT NOT NULL CHECK (departamento IN (${lista(DEPARTAMENTOS)})),
            categoria    TEXT NOT NULL CHECK (categoria IN (${lista(CATEGORIAS)})),
            tecnico      TEXT NOT NULL,
            fecha        TEXT NOT NULL,
            horas        REAL NOT NULL CHECK (horas > 0 AND horas <= 24),
            monto        REAL NOT NULL CHECK (monto > 0),
            estado       TEXT NOT NULL CHECK (estado IN (${lista(ESTADOS)}))
        )
    `);
}

// Seed: copia las órdenes de db.json, solo si la tabla está vacía.
// En Render el archivo .db se borra en cada reinicio: así la API nunca arranca vacía.
export function sembrar() {
  const { total } = db.prepare("SELECT COUNT(*) AS total FROM ordenes").get();
  if (total > 0) return;

  const { ordenes } = JSON.parse(readFileSync(rutaSeed, "utf8"));
  // :cliente, :nit... son parámetros con nombre: se llenan con las claves del objeto
  const insertar = db.prepare(`
        INSERT INTO ordenes (id, codigo, cliente, nit, departamento, categoria, tecnico, fecha, horas, monto, estado)
        VALUES (:id, :codigo, :cliente, :nit, :departamento, :categoria, :tecnico, :fecha, :horas, :monto, :estado)
    `);

  for (const orden of ordenes) {
    insertar.run(orden);
  }
  console.log(`Seed: ${ordenes.length} órdenes copiadas de db.json`);
}

// Al importar este archivo la base queda lista para usarse
crearTabla();
sembrar();
