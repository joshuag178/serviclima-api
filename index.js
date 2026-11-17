// index.js
// Punto de entrada de serviclima-api: arma la aplicación y la pone a escuchar.
// Ya no tiene rutas ni datos: eso vive en src/.
// Antes de ejecutar: copie .env.example como .env
// Ejecute: npm run dev

import express from 'express';
import rutasOrdenes from './src/rutas/ordenes.js';
import rutasCatalogos from './src/rutas/catalogos.js';
import rutasResumen from './src/rutas/resumen.js';
import { registrarPeticion } from './src/middlewares/registrar-peticion.js';
import { permitirOrigen } from './src/middlewares/permitir-origen.js';
import { noEncontrado } from './src/middlewares/no-encontrado.js';
import { manejarErrores } from './src/middlewares/manejar-errores.js';

const PUERTO = process.env.PUERTO; // de .env, gracias a --env-file
const app = express();

// Middlewares antes de las rutas, en el orden en que corren
app.use(registrarPeticion); // 1. anota cada petición
app.use(permitirOrigen);    // 2. CORS para el frontend
app.use(express.json());    // 3. cuerpo JSON en req.body

// Rutas
app.use('/ordenes', rutasOrdenes);
app.use(rutasCatalogos); // /departamentos y /categorias
app.use(rutasResumen);   // /resumen

// Middlewares después de las rutas
app.use(noEncontrado);   // 4. ninguna ruta atendió: 404
app.use(manejarErrores); // 5. siempre el último

app.listen(PUERTO, () => {
    console.log(`API de Serviclima en http://localhost:${PUERTO}`);
    console.log(`Origen permitido: ${process.env.ORIGEN_FRONTEND}`);
});