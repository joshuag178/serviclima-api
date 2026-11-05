// index.js
// Punto de entrada de serviclima-api.
// Carga las órdenes de datos/db.json en memoria y las sirve por HTTP.
// Ejecute: npm run dev

import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";

// El mismo puerto que usaba json-server: el frontend ya apunta aquí
const PUERTO = 3001;

// Ruta absoluta a datos/db.json, armada desde la carpeta de este archivo
const rutaDatos = path.join(import.meta.dirname, "datos", "db.json");

// Se lee una sola vez, al arrancar. Desde aquí los datos viven en memoria.
const contenido = await readFile(rutaDatos, "utf8");
const { ordenes } = JSON.parse(contenido);

const app = express();

// GET /ordenes y GET /ordenes?estado=pendiente
app.get("/ordenes", (req, res) => {
  const { estado } = req.query;
  if (estado) {
    return res.json(ordenes.filter((o) => o.estado === estado));
  }

  res.json(ordenes);
});

// GET /ordenes/:id: una orden; 404 si no existe
app.get("/ordenes/:id", (req, res) => {
  const id = Number(req.params.id); // params llega como texto: "8", no 8
  const orden = ordenes.find((o) => o.id === id);

  if (!orden) {
    return res
      .status(404)
      .json({ error: `No existe la orden ${req.params.id}` });
  }

  res.json(orden);
});

app.listen(PUERTO, () => {
  console.log(`Órdenes cargadas: ${ordenes.length}`);
  console.log(`API de Serviclima en http://localhost:${PUERTO}`);
});
