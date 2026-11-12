// src/catalogos.js
// Listas cerradas de Serviclima: los únicos valores que acepta la API.
// Las usan la validación y las rutas /departamentos y /categorias.
// Para aceptar un departamento nuevo basta con agregarlo aquí.

export const ESTADOS = ['pendiente', 'en proceso', 'completada', 'cancelada'];

export const DEPARTAMENTOS = [
    'Guatemala',
    'Sacatepéquez',
    'Chimaltenango',
    'Quetzaltenango',
    'Escuintla',
    'Alta Verapaz',
    'Baja Verapaz',
    'El Progreso',
];

export const CATEGORIAS = [
    'Instalación',
    'Mantenimiento preventivo',
    'Reparación',
    'Diagnóstico',
];
