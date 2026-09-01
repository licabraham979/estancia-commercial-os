/** @typedef {import('$lib/types/clientes').Cliente} Cliente */

const STORAGE_KEY = 'crm_clientes';

let clientes = $state(
	/** @type {Cliente[]} */([])
);

/**
 * Genera un ID único para el cliente.
 */
function generarId() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Carga los clientes desde localStorage.
 */
function cargarClientes() {
	if (typeof localStorage === 'undefined') return;

	try {
		const datos = localStorage.getItem(STORAGE_KEY);

		if (!datos) return;

		const parsed = JSON.parse(datos);

		if (Array.isArray(parsed)) {
			clientes = parsed;
		}
	} catch (error) {
		console.error('Error cargando clientes:', error);
		clientes = [];
	}
}

/**
 * Guarda los clientes.
 */
function guardarClientes() {
	if (typeof localStorage === 'undefined') return;

	try {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify(clientes)
		);
	} catch (error) {
		console.error('Error guardando clientes:', error);
	}
}

/**
 * Normaliza un cliente para garantizar
 * que siempre tenga la estructura esperada.
 *
 * @param {Partial<Cliente>} datos
 */
function normalizarCliente(datos) {
	return {
		id: datos.id ?? generarId(),

		nombre: datos.nombre ?? '',
		empresa: datos.empresa ?? '',

		estado: datos.estado ?? 'Nuevo contacto',

		proyecto: datos.proyecto ?? '',

		valor: Number(datos.valor ?? 0),

		telefono: datos.telefono ?? '',

		correo: datos.correo ?? '',

		siguienteAccion: datos.siguienteAccion ?? '',

		actividades: Array.isArray(datos.actividades)
			? datos.actividades
			: [],

		pagos: Array.isArray(datos.pagos)
			? datos.pagos
			: [],

		gastos: Array.isArray(datos.gastos)
			? datos.gastos
			: [],

		ultimaActividad:
			datos.ultimaActividad ?? null,

		nivelSeguimiento:
			datos.nivelSeguimiento ?? {
				etiqueta: 'Cliente nuevo',
				color: 'gris',
				icono: '⚫'
			}
	};
}


/**
 * Obtener todos los clientes.
 */
export function obtenerClientes() {
	return clientes;
}


/**
 * Obtener un cliente por ID.
 *
 * @param {number|string} id
 */
export function obtenerCliente(id) {
	return clientes.find(
		cliente => String(cliente.id) === String(id)
	);
}


/**
 * Crear un cliente.
 *
 * @param {Partial<Cliente>} datos
 */
export function crearCliente(datos) {
	if (!datos.nombre?.trim()) {
		console.warn('No se puede crear un cliente sin nombre.');
		return null;
	}

	const nuevoCliente = normalizarCliente({
		...datos,
		id: generarId()
	});

	clientes.push(nuevoCliente);

	guardarClientes();

	return nuevoCliente;
}


/**
 * Actualizar un cliente.
 *
 * @param {number|string} id
 * @param {Partial<Cliente>} datos
 */
export function actualizarCliente(id, datos) {
	const cliente = obtenerCliente(id);

	if (!cliente) {
		console.warn(`Cliente ${id} no encontrado.`);
		return null;
	}

	Object.assign(cliente, datos);

	if (datos.valor !== undefined) {
		cliente.valor = Number(datos.valor) || 0;
	}

	guardarClientes();

	return cliente;
}


/**
 * Eliminar un cliente.
 *
 * @param {number|string} id
 */
export function eliminarCliente(id) {
	const indice = clientes.findIndex(
		cliente => String(cliente.id) === String(id)
	);

	if (indice === -1) {
		console.warn(`Cliente ${id} no encontrado.`);
		return false;
	}

	clientes.splice(indice, 1);

	guardarClientes();

	return true;
}


/**
 * Cambiar estado del cliente.
 *
 * @param {number|string} id
 * @param {string} nuevoEstado
 */
export function cambiarEstado(id, nuevoEstado) {
	const cliente = obtenerCliente(id);

	if (!cliente) return null;

	const estadoAnterior = cliente.estado;

	cliente.estado = nuevoEstado;

	cliente.actividades ??= [];

	const ahora = new Date().toISOString();

	cliente.actividades.unshift({
		id: generarId(),

		clienteId: cliente.id,
		campanaId: null,

		fecha: ahora,

		titulo: 'Estado actualizado',

		descripcion:
			`${estadoAnterior} → ${nuevoEstado}`,

		tipo: 'sistema',

		categoriaId: 1,

		estado: 'completada',

		prioridad: 'media',

		responsable: 'usuario',

		origen: 'cliente',

		fechaCreacion: ahora,

		fechaObjetivo: null,

		fechaCompletada: ahora
	});

	cliente.ultimaActividad =
		cliente.actividades[0];

	guardarClientes();

	return cliente;
}

/**
 * @param {number|string} id
 * @param {Partial<import('$lib/types/clientes').Actividad>} datos
 */
export function registrarActividad(id, datos) {
	const cliente = obtenerCliente(id);

	if (!cliente) return null;

	const ahora = new Date().toISOString();

	const actividad = {
		id: generarId(),

		clienteId: cliente.id,

		campanaId: null,

		titulo: datos.titulo ?? 'Actividad',

		descripcion: datos.descripcion ?? '',

		tipo: datos.tipo ?? 'seguimiento',

		categoriaId: datos.categoriaId ?? 1,

		estado: datos.estado ?? 'completada',

		prioridad: datos.prioridad ?? 'media',

		responsable: datos.responsable ?? 'usuario',

		origen: datos.origen ?? 'cliente',

		referencia: datos.referencia ?? null,

		fecha: datos.fecha ?? ahora,

		fechaCreacion: ahora,

		fechaObjetivo: datos.fechaObjetivo ?? null,

		fechaCompletada:
			datos.estado === 'pendiente'
				? null
				: ahora
	};

	cliente.actividades ??= [];

	cliente.actividades.unshift(actividad);

	cliente.ultimaActividad = actividad;

	guardarClientes();

	return actividad;
}


/**
 * Registrar ingreso/pago.
 *
 * @param {number|string} id
 * @param {{concepto:string,monto:number}} datos
 */
export function registrarPago(id, datos) {
	const cliente = obtenerCliente(id);

	if (!cliente) return null;

	/** @type {import('$lib/types/clientes').Movimiento} */
		const pago = {
		id: generarId(),

		tipo: 'ingreso',

		fecha: new Date().toISOString(),

		concepto: datos.concepto,

		monto: Number(datos.monto) || 0,

		clienteId: cliente.id
	};

	cliente.pagos ??= [];

	cliente.pagos.push(pago);

	guardarClientes();

	return pago;
}


/**
 * Registrar gasto.
 *
 * @param {number|string} id
 * @param {{concepto:string,monto:number}} datos
 */
export function registrarGasto(id, datos) {
	const cliente = obtenerCliente(id);

	if (!cliente) return null;

	/** @type {import('$lib/types/clientes').Movimiento} */
const gasto = {
    id: generarId(),
    tipo: 'gasto',
    fecha: new Date().toISOString(),
    concepto: datos.concepto,
    monto: Number(datos.monto) || 0,
    clienteId: cliente.id
};

	cliente.gastos ??= [];

	cliente.gastos.push(gasto);

	guardarClientes();

	return gasto;
}


/**
 * Obtener rentabilidad de un cliente.
 *
 * @param {number|string} id
 */
export function obtenerRentabilidad(id) {
	const cliente = obtenerCliente(id);

	if (!cliente) return null;

	const ingresos =
	cliente.pagos?.reduce(
		/**
		 * @param {number} total
		 * @param {import('$lib/types/clientes').Movimiento} pago
		 */
		(total, pago) =>
			total + Number(pago.monto || 0),
		0
	) ?? 0;

	const gastos =
	cliente.gastos?.reduce(
		/**
		 * @param {number} total
		 * @param {import('$lib/types/clientes').Movimiento} gasto
		 */
		(total, gasto) =>
			total + Number(gasto.monto || 0),
		0
	) ?? 0;

	const valorProyecto =
		Number(cliente.valor || 0);

	return {
		ingresos,

		gastos,

		ganancia:
			ingresos - gastos,

		pendiente:
			valorProyecto - ingresos
	};
}


/**
 * Clientes sin próxima acción.
 */
export function obtenerClientesSinAccion() {
	return clientes.filter(
		cliente => !cliente.siguienteAccion
	);
}


/**
 * Información de seguimiento.
 */
export function obtenerSeguimientos() {
	return clientes
		.map(cliente => {
			const ultima =
				cliente.actividades?.[0] ?? null;

			return {
				id: cliente.id,

				nombre: cliente.nombre,

				empresa: cliente.empresa,

				estado: cliente.estado,

				siguienteAccion:
					cliente.siguienteAccion,

				valor: cliente.valor,

				proyecto: cliente.proyecto,

				ultimaActividad: ultima,

				tiempoSinContacto:
					calcularTiempoSinContacto(
						ultima?.fecha
					),

				nivelSeguimiento:
					calcularNivelSeguimiento(
						ultima?.fecha
					),

				accionRecomendada:
					calcularAccionSeguimiento(
						ultima?.fecha,
						cliente.estado
					)
			};
		})
		.sort((a, b) => {
			const fechaA =
				a.ultimaActividad?.fecha ?? 0;

			const fechaB =
				b.ultimaActividad?.fecha ?? 0;

			return (
				new Date(fechaB).getTime() -
				new Date(fechaA).getTime()
			);
		});
}


/**
 * Tiempo desde el último contacto.
 *
 * @param {string|Date|null|undefined} fecha
 */
function calcularTiempoSinContacto(fecha) {
	if (!fecha) return 'Sin contacto';

	const diferencia =
		Date.now() -
		new Date(fecha).getTime();

	const horas = Math.floor(
		diferencia /
			(1000 * 60 * 60)
	);

	if (horas < 1) {
		return 'Hace menos de 1 hora';
	}

	if (horas < 24) {
		return `Hace ${horas} horas`;
	}

	const dias = Math.floor(
		horas / 24
	);

	return `Hace ${dias} días`;
}


/**
 * Nivel de seguimiento.
 *
 * @param {string|Date|null|undefined} fecha
 */
function calcularNivelSeguimiento(fecha) {
	if (!fecha) {
		return {
			etiqueta: 'Sin contacto',
			color: 'gris',
			icono: '⚫'
		};
	}

	const horas =
		(Date.now() -
			new Date(fecha).getTime()) /
		(1000 * 60 * 60);

	if (horas < 24) {
		return {
			etiqueta: 'Activo',
			color: 'verde',
			icono: '🟢'
		};
	}

	if (horas < 72) {
		return {
			etiqueta: 'Atención',
			color: 'amarillo',
			icono: '🟡'
		};
	}

	return {
		etiqueta: 'Riesgo',
		color: 'rojo',
		icono: '🔴'
	};
}


/**
 * Acción recomendada.
 *
 * @param {string|Date|null|undefined} fecha
 * @param {string} estado
 */
function calcularAccionSeguimiento(
	fecha,
	estado = ''
) {
	const horas = fecha
		?
			(Date.now() -
				new Date(fecha).getTime()) /
			(1000 * 60 * 60)
		: 999;

	if (!fecha) {
		return 'Registrar primer contacto';
	}

	if (horas < 1) {
		return 'Continuar negociación';
	}

	if (horas < 24) {
		return 'Enviar seguimiento';
	}

	if (horas < 72) {
		return 'Realizar llamada';
	}

	if (estado === 'Cotización enviada') {
		return 'Confirmar decisión del cliente';
	}

	return 'Reactivar cliente';
}


/*
 * Cargar datos al iniciar la aplicación.
 */
if (typeof window !== 'undefined') {
	cargarClientes();
}
