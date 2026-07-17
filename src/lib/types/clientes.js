/**
 * @typedef {Object} Actividad
 * @property {number|string} id
 * @property {number|string|null} [clienteId]
 * @property {number|string|null} [campanaId]
 * @property {string} titulo
 * @property {string} [descripcion]
 * @property {string} fecha
 * @property {string} estado
 * @property {string} prioridad
 * @property {number} categoriaId
 * @property {string} tipo
 * @property {string} responsable
 * @property {string} origen
 * @property {string|number|null} [referencia]
 * @property {string} [fechaCreacion]
 * @property {string|null} [fechaObjetivo]
 * @property {string|null} [fechaCompletada]
 */

/**
 * @typedef {Object} Movimiento
 * @property {number|string} id
 * @property {number} monto
 * @property {string} fecha
 * @property {string} concepto
 * @property {"ingreso"|"gasto"} tipo
 * @property {number|string} [clienteId]
 */

  /**
 * @typedef {Object} Pago
 * @property {number|string} id
 * @property {number} monto
 * @property {string} fecha
 * @property {string} concepto
 * @property {"ingreso"|"gasto"} tipo
 * @property {number|string} [clienteId]
 */


/**
 * @typedef {Object} Gasto
 * @property {number|string} id
 * @property {number} monto
 * @property {string} fecha
 * @property {string} concepto
 * @property {number|string} [clienteId]
 */

/**
 * @typedef {Object} NivelSeguimiento
 * @property {string} etiqueta
 * @property {string} color
 * @property {string} icono
 */


/**
 * @typedef {Object} Nota
 * @property {number|string} id
 * @property {number|string} clienteId
 * @property {string} texto
 * @property {string} fecha
 */


/**
 * @typedef {Object} Cliente
 * @property {number|string} id
 * @property {string} nombre
 * @property {string} empresa
 * @property {string} estado
 * @property {string} proyecto
 * @property {number} valor
 * @property {string} [telefono]
 * @property {string} [correo]
 * @property {string} [siguienteAccion]
 * @property {Actividad[]} actividades
 * @property {Movimiento[]} pagos
 * @property {Movimiento[]} gastos
 * 
 * @property {Actividad|null} ultimaActividad
 * @property {NivelSeguimiento} nivelSeguimiento
 * @property {number} [diasSinContacto]
 * @property {string} [tiempoSinContacto]
 * @property {string} [accionRecomendada]
 */
export {};