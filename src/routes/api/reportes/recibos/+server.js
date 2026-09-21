import { json } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase';

export async function GET({ url }) {
	const cotizacionId = url.searchParams.get('cotizacion_id');

	if (!cotizacionId) {
		return json(
			{ error: 'Falta cotizacion_id' },
			{ status: 400 }
		);
	}

	// 1. Obtener la cotización
	const { data: cotizacion, error: cotizacionError } =
		await supabaseServer
			.from('cotizaciones')
			.select('id, cliente_nombre, cliente_empresa, titulo, total, moneda')
			.eq('id', cotizacionId)
			.single();

	if (cotizacionError || !cotizacion) {
		console.error(
			'Error obteniendo cotización para reporte:',
			cotizacionError
		);

		return json(
			{ error: 'Cotización no encontrada' },
			{ status: 404 }
		);
	}

	// 2. Obtener recibos emitidos de esa cotización
	const { data: recibos, error: recibosError } =
		await supabaseServer
			.from('recibos')
			.select(`
				id,
				folio,
				fecha_pago,
				monto,
				moneda,
				estado,
				concepto,
				metodo_pago,
				referencia
			`)
			.eq('cotizacion_id', cotizacionId)
			.eq('estado', 'emitido')
			.order('fecha_pago', { ascending: true });

	if (recibosError) {
		console.error(
			'Error obteniendo recibos para reporte:',
			recibosError
		);

		return json(
			{ error: 'No se pudieron cargar los recibos' },
			{ status: 500 }
		);
	}

	const normalizarMoneda = (/** @type {string|null|undefined} */ moneda) => {
		const valor = (moneda ?? '').toUpperCase();

		if (valor === 'L' || valor === 'HNL') return 'HNL';
		if (valor === '$' || valor === 'USD') return 'USD';
		if (valor === '₱' || valor === 'MXN') return 'MXN';

		return valor || 'HNL';
	};

	const monedaProyecto = normalizarMoneda(cotizacion.moneda);

	const totalProyecto = Number(cotizacion.total ?? 0);

	const totalPagado = (recibos ?? [])
		.filter(
			(recibo) =>
				normalizarMoneda(recibo.moneda) === monedaProyecto
		)
		.reduce(
			(total, recibo) => total + Number(recibo.monto ?? 0),
			0
		);

	const saldoPendiente = Math.max(
		totalProyecto - totalPagado,
		0
	);

	return json({
		cotizacion: {
			id: cotizacion.id,
			cliente_nombre: cotizacion.cliente_nombre,
			cliente_empresa: cotizacion.cliente_empresa,
			titulo: cotizacion.titulo,
			total: totalProyecto,
			moneda: monedaProyecto
		},

		recibos: recibos ?? [],

		resumen: {
			totalProyecto,
			totalPagado,
			saldoPendiente,
			moneda: monedaProyecto
		}
	});
}
