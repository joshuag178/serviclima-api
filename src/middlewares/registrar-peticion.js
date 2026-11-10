// src/middlewares/registrar-peticion.js
// Anota en la terminal cada petición con su código de estado y su duración.

export function registrarPeticion(req, res, next) {
  const inicio = performance.now();

  // 'finish': la respuesta ya salió y su código de estado ya se conoce
  res.on("finish", () => {
    const ms = (performance.now() - inicio).toFixed(1);
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms} ms`);
  });
  
  next();
}
