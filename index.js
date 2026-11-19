// index.js
// Punto de entrada de serviclima-api: arma la aplicación y la pone a escuchar.
// Ya no tiene rutas ni datos: eso vive en src/.
// Antes de ejecutar: copie .env.example como .env
// Ejecute: npm run dev

import express from "express";
import helmet from "helmet";
import cors from "cors";
import rutasOrdenes from "./src/rutas/ordenes.js";
import rutasCatalogos from "./src/rutas/catalogos.js";
import rutasResumen from "./src/rutas/resumen.js";
import { registrarPeticion } from "./src/middlewares/registrar-peticion.js";
import { limitarPeticiones } from "./src/middlewares/limitar-peticiones.js";
import { noEncontrado } from "./src/middlewares/no-encontrado.js";
import { manejarErrores } from "./src/middlewares/manejar-errores.js";

// Render asigna el puerto en PORT; en su computadora se usa PUERTO del .env
const PUERTO = process.env.PORT ?? process.env.PUERTO;
const app = express();

// En Render las peticiones llegan a través de un proxy.
// Sin esta línea, todos los clientes tendrían la IP del proxy y compartirían el límite.
app.set("trust proxy", 1);

// Middlewares antes de las rutas, en el orden en que corren
app.use(registrarPeticion); // 1. anota cada petición
app.use(helmet()); // 2. headers de seguridad
app.use(cors({ origin: process.env.ORIGEN_FRONTEND })); // 3. CORS: solo el frontend
app.use(limitarPeticiones); // 4. máximo de peticiones por cliente
app.use(express.json()); // 5. cuerpo JSON en req.body

// Rutas
app.use("/ordenes", rutasOrdenes);
app.use(rutasCatalogos); // /departamentos y /categorias
app.use(rutasResumen); // /resumen

// Middlewares después de las rutas
app.use(noEncontrado); // 6. ninguna ruta atendió: 404
app.use(manejarErrores); // 7. siempre el último

app.listen(PUERTO, () => {
  console.log(`API de Serviclima en el puerto ${PUERTO}`);
  console.log(`Origen permitido: ${process.env.ORIGEN_FRONTEND}`);
});
