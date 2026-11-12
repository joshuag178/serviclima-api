// src/middlewares/manejar-errores.js
// Manejador central: todos los errores de la API terminan aquí.
// Tiene 4 parámetros: así sabe Express que es el manejador de errores.
// Siempre responde con el mismo formato: { error, detalles }.

import { ErrorHttp } from '../errores.js';

export function manejarErrores(error, req, res, next) {
    // Errores que lanzamos nosotros: ya traen su código
    if (error instanceof ErrorHttp) {
        return res.status(error.estado).json({ error: error.message, detalles: error.detalles });
    }

    // express.json() no pudo leer el cuerpo: JSON mal escrito
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'El cuerpo no es un JSON válido', detalles: [] });
    }

    // Cualquier otro error es un fallo del servidor: el detalle se queda
    // en la terminal y al cliente solo se le dice que algo falló.
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor. Contacte a Soporte', detalles: [] });
}
