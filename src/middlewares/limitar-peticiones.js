// src/middlewares/limitar-peticiones.js
// Límite de peticiones por cliente: protege la API de abusos y de scripts que la saturan.
// Al pasarse del límite responde 429 con el mismo formato de error de la API.

import { rateLimit } from "express-rate-limit";

export const limitarPeticiones = rateLimit({
  windowMs: 15 * 60 * 1000, // ventana de 15 minutos
  limit: 100, // peticiones permitidas por cliente en la ventana
  standardHeaders: "draft-7", // header RateLimit: cuántas quedan
  legacyHeaders: false, // sin los headers viejos X-RateLimit-*
  message: {
    error: "Demasiadas peticiones. Intente de nuevo en unos minutos",
    detalles: [],
  },
});
