// src/errores.js
// Error con código HTTP. Cualquier capa puede lanzarlo:
//   throw new ErrorHttp(404, 'No existe la orden 99');
// y el manejador central (middlewares/manejar-errores.js) arma la respuesta.

export class ErrorHttp extends Error {
    constructor(estado, mensaje, detalles = []) {
        super(mensaje);           // Error guarda el mensaje en this.message
        this.estado = estado;     // código HTTP: 400, 404, ...
        this.detalles = detalles; // lista de { campo, mensaje }; vacía si no aplica
    }
}
