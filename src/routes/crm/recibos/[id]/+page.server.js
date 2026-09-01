import { error } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase.js';

export async function load({ params }) {
	const { id } = params;

	if (!id) {
		throw error(400, 'Recibo inválido');
	}

	/*
	 * 1. Obtener el recibo
	 */
	const { data: recibo, error: reciboError } =
		await supabaseServer
			.from('recibos')
			.select('*')
			.eq('id', id)
			.single();

	if (reciboError) {
		console.error('Error cargando recibo:', reciboError);

		if (reciboError.code === 'PGRST116') {
			throw error(404, 'Recibo no encontrado');
		}

		throw error(500, 'No se pudo cargar el recibo');
	}

	/*
	 * 2. Obtener la cotización relacionada
	 */
	const { data: cotizacion, error: cotizacionError } =
		await supabaseServer
			.from('cotizaciones')
			.select('*')
			.eq('id', recibo.cotizacion_id)
			.single();

	if (cotizacionError) {
		console.error(
			'Error cargando cotización del recibo:',
			cotizacionError
		);

		throw error(
			500,
			'No se pudo cargar el proyecto relacionado'
		);
	}

	/*
	 * 3. Obtener historial de recibos
	 */
	const { data: recibosProyecto, error: recibosError } =
		await supabaseServer
			.from('recibos')
			.select(
				'id, folio, fecha_pago, monto, moneda, estado'
			)
			.eq('cotizacion_id', recibo.cotizacion_id)
			.eq('estado', 'emitido')
			.order('fecha_pago', { ascending: true });

	if (recibosError) {
		console.error(
			'Error cargando historial de recibos:',
			recibosError
		);

		throw error(
			500,
			'No se pudo cargar el historial de pagos'
		);
	}


const historial = recibosProyecto ?? [];

/*
 * 4. Normalizar monedas
 *
 * L y HNL representan la misma moneda.
 * $ y USD representan la misma moneda.
 * ₱ y MXN representan la misma moneda.
 *
 * Esto evita que un pago quede fuera del saldo
 * solamente porque fue registrado con otro formato.
 */
/** @param {string | null | undefined} moneda */
const normalizarMoneda = (moneda) => {
	if (moneda === 'L' || moneda === 'HNL') return 'HNL';
	if (moneda === '$' || moneda === 'USD') return 'USD';
	if (moneda === '₱' || moneda === 'MXN') return 'MXN';

	return moneda;
};

const monedaCotizacion =
	normalizarMoneda(cotizacion.moneda);

const monedaRecibo =
	normalizarMoneda(recibo.moneda);

const historialMonedaCotizacion =
	historial.filter(
		(item) =>
			normalizarMoneda(item.moneda) ===
			monedaCotizacion
	);

/*
 * 5. Pagos anteriores en la moneda de la cotización
 */
const pagadoAnteriormente =
	historialMonedaCotizacion
		.filter((item) => item.id !== recibo.id)
		.reduce((total, item) => {
			return total + Number(item.monto ?? 0);
		}, 0);

/*
 * 6. Pago actual
 */
const pagoActual =
	Number(recibo.monto ?? 0);

/*
 * 7. Total del proyecto
 */
const totalProyecto =
	Number(cotizacion.total ?? 0);

/*
 * 8. Determinar si el recibo participa
 *    en el saldo de la cotización.
 */
const pagoParticipaEnSaldo =
	monedaRecibo === monedaCotizacion;

const totalPagado =
	pagoParticipaEnSaldo
		? pagadoAnteriormente + pagoActual
		: pagadoAnteriormente;

const saldoPendiente = Math.max(
	0,
	totalProyecto - totalPagado
);

	/*
	 * 9. Entregar datos al +page.svelte
	 */
	return {
		recibo: {
			id: recibo.id,
			folio: recibo.folio,
			fecha_pago: recibo.fecha_pago,

			cliente_nombre: recibo.cliente_nombre,
			cliente_empresa: recibo.cliente_empresa,

			concepto: recibo.concepto,
			monto: pagoActual,
			moneda: recibo.moneda,

			metodo_pago: recibo.metodo_pago,
			referencia: recibo.referencia,
			observaciones: recibo.observaciones,
			estado: recibo.estado,

			mercado_id: recibo.mercado_id,

			empresa_nombre: recibo.empresa_nombre,
			empresa_telefono: recibo.empresa_telefono,
			empresa_email: recibo.empresa_email,
			empresa_web: recibo.empresa_web,
			empresa_direccion: recibo.empresa_direccion
		},

		cotizacion: {
			id: cotizacion.id,
			titulo: cotizacion.titulo,
			descripcion: cotizacion.descripcion,

			cliente_nombre: cotizacion.cliente_nombre,
			cliente_empresa: cotizacion.cliente_empresa,

			total: totalProyecto,
			moneda: cotizacion.moneda,

			forma_pago: cotizacion.forma_pago,

			cliente_whatsapp:
				cotizacion.cliente_whatsapp,

			cliente_email:
				cotizacion.cliente_email
		},

		resumen: {
			totalProyecto,
			pagadoAnteriormente,
			pagoActual,
			totalPagado,
			saldoPendiente
		},

		historial
	};
}