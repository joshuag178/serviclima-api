// reiniciar-db.js
// Borra la tabla ordenes y la vuelve a crear con las 24 órdenes de db.json.
// Úselo cuando sus datos de prueba queden sucios o después de cambiar catalogos.js.
// Ejecute: npm run reiniciar-db

import { db, crearTabla, sembrar } from "./src/db.js";

db.exec("DROP TABLE IF EXISTS ordenes");
crearTabla();
sembrar();
console.log("Base reiniciada");
