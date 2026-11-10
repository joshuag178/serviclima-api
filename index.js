// index.js
// Punto de entrada de serviclima-api: arma la aplicación y la pone a escuchar.
// Ya no tiene rutas ni datos: eso vive en src/.
// Antes de ejecutar: copie .env.example como .env
// Ejecute: npm run dev

import express from "express";
import rutasOrdenes from "./src/rutas/ordenes.js";
import { registrarPeticion } from "./src/middlewares/registrar-peticion.js";
import { permitirOrigen } from "./src/middlewares/permitir-origen.js";

const PUERTO = process.env.PUERTO; // de .env, gracias a --env-file
const app = express();

// Middlewares, en el orden en que corren
app.use(registrarPeticion);   // 1. anota cada petición
app.use(permitirOrigen);      // 2. CORS para el frontend
app.use(express.json());      // 3. cuerpo JSON en req.body

// Rutas
app.use("/ordenes", rutasOrdenes);

app.listen(PUERTO, () => {
  console.log(`API de Serviclima en http://localhost:${PUERTO}`);
  console.log(`Origen permitido: ${process.env.ORIGEN_FRONTEND}`);
});
