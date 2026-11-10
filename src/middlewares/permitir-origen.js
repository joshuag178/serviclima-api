// src/middlewares/permitir-origen.js
// CORS escrito a mano: autoriza al frontend a llamar a la API desde otro origen.
// En la sesión 6 se reemplaza por el paquete cors.

export function permitirOrigen(req, res, next) {
  res.set("Access-Control-Allow-Origin", process.env.ORIGEN_FRONTEND);
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  
  // Preflight: el navegador pregunta con OPTIONS antes de la petición real.
  // Se contesta 204 aquí y no sigue a las rutas.
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
}
