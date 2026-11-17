// src/servicios/ordenes.js
// Capa de servicios: el ÚNICO archivo que sabe dónde viven las órdenes.
// Desde la sesión 5 viven en SQLite (datos/serviclima.db).

// Las funciones se llaman igual y devuelven lo mismo que la versión en memoria:
// por eso las rutas y los controladores no cambian.
// node:sqlite es síncrono: no hay async ni await.

import { db } from "../db.js";

// Los campos que el cliente puede escribir. id y codigo los pone el servidor.
const CAMPOS = [
  "cliente",
  "nit",
  "departamento",
  "categoria",
  "tecnico",
  "fecha",
  "horas",
  "monto",
  "estado",
];

// Los únicos campos por los que se puede filtrar el listado
const FILTROS = ["estado", "tecnico", "departamento"];

// El codigo depende del id: 25 queda como OS-2026-025
function generarCodigo(id) {
  return "OS-2026-" + String(id).padStart(3, "0");
}

// GET /ordenes?estado=pendiente&tecnico=Mario Ixcot
// Arma el WHERE solo con los filtros que vienen. Los valores siempre van en ?
export function listar(filtros = {}) {
  const condiciones = [];
  const valores = [];

  for (const campo of FILTROS) {
    const valor = filtros[campo];
    // typeof descarta ?estado=a&estado=b, que llega como arreglo
    if (typeof valor === "string") {
      condiciones.push(`${campo} = ?`); // campo sale de FILTROS, no del usuario
      valores.push(valor);
    }
  }

  let sql = "SELECT * FROM ordenes";
  if (condiciones.length > 0) {
    sql += " WHERE " + condiciones.join(" AND ");
  }
  sql += " ORDER BY id";

  return db.prepare(sql).all(...valores);
}

// Devuelve la orden o undefined si no existe
export function buscarPorId(id) {
  return db.prepare("SELECT * FROM ordenes WHERE id = ?").get(id);
}

// El servidor asigna id y codigo. Si el cliente los envía, la validación ya los quitó.
export function crear(datos) {
  const resultado = db
    .prepare(
      `
        INSERT INTO ordenes (cliente, nit, departamento, categoria, tecnico, fecha, horas, monto, estado)
        VALUES (:cliente, :nit, :departamento, :categoria, :tecnico, :fecha, :horas, :monto, :estado)
    `,
    )
    .run(datos);

  // El id lo asigna SQLite; con él se arma el codigo
  const id = Number(resultado.lastInsertRowid);
  db.prepare("UPDATE ordenes SET codigo = ? WHERE id = ?").run(
    generarCodigo(id),
    id,
  );

  return buscarPorId(id);
}

// PUT: reemplaza la orden completa. Conserva id y codigo.
export function reemplazar(id, datos) {
  const resultado = db
    .prepare(
      `
        UPDATE ordenes
        SET cliente = :cliente, nit = :nit, departamento = :departamento, categoria = :categoria,
            tecnico = :tecnico, fecha = :fecha, horas = :horas, monto = :monto, estado = :estado
        WHERE id = :id
    `,
    )
    .run({ ...datos, id });

  // changes = 0: no había una orden con ese id
  if (resultado.changes === 0) return undefined;
  return buscarPorId(id);
}

// PATCH: cambia solo los campos que vienen. Conserva id y codigo.
export function actualizar(id, cambios) {
  // Solo campos conocidos: el nombre de la columna sí va dentro del texto del SQL
  const campos = Object.keys(cambios).filter((campo) => CAMPOS.includes(campo));

  // Sin campos (el PATCH { codigo } del frontend): no hay nada que cambiar
  if (campos.length === 0) return buscarPorId(id);

  // ['estado', 'horas'] queda como "estado = :estado, horas = :horas"
  const asignaciones = campos.map((campo) => `${campo} = :${campo}`).join(", ");

  const valores = { id };
  for (const campo of campos) {
    valores[campo] = cambios[campo];
  }

  const resultado = db
    .prepare(`UPDATE ordenes SET ${asignaciones} WHERE id = :id`)
    .run(valores);
  if (resultado.changes === 0) return undefined;
  return buscarPorId(id);
}

// Devuelve true si la eliminó y false si no existía
export function eliminar(id) {
  const resultado = db.prepare("DELETE FROM ordenes WHERE id = ?").run(id);
  return resultado.changes > 0;
}

// GET /resumen: totales calculados por SQLite con GROUP BY
export function resumen() {
  const total = db
    .prepare(
      `
        SELECT COUNT(*) AS ordenes, ROUND(SUM(monto), 2) AS monto
        FROM ordenes
    `,
    )
    .get();

  const porEstado = db
    .prepare(
      `
        SELECT estado, COUNT(*) AS ordenes, ROUND(SUM(monto), 2) AS monto
        FROM ordenes
        GROUP BY estado
        ORDER BY ordenes DESC
    `,
    )
    .all();

  const porTecnico = db
    .prepare(
      `
        SELECT tecnico, COUNT(*) AS ordenes, ROUND(SUM(horas), 2) AS horas, ROUND(SUM(monto), 2) AS monto
        FROM ordenes
        GROUP BY tecnico
        ORDER BY monto DESC
    `,
    )
    .all();

  return { total, porEstado, porTecnico };
}
