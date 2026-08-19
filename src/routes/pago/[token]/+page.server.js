import { error } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase.js';

export async function load({ params, setHeaders }) {
	setHeaders({
		'cache-control': 'private, no-store, no-cache, must-revalidate',
		'pragma': 'no-cache',
		'expires': '0'
	});
	const { token } = params;

	if (!token) {
		throw error(400, 'Enlace de pago inválido');
	}

	/*
	 * 1. Buscar el enlace mediante su token.
	 */
	const { data: enlace, error: enlaceError } = await supabaseServer
		.from('enlaces_pago')
		.select('*')
		.eq('token', token)
		.maybeSingle();

	if (enlaceError) {
		console.error('Error buscando enlace de pago:', enlaceError);
		throw error(500, 'No se pudo validar el enlace de pago');
	}

	if (!enlace) {
		throw error(404, 'Enlace de pago no encontrado');
	}

	/*
	 * 2. Verificar si ya fue utilizado.
	 */
	if (enlace.usado) {
		throw error(
			410,
			'Este enlace de pago ya fue utilizado'
		);
	}

	/*
	 * 3. Verificar expiración.
	 */
	const ahora = new Date();
	const expiraAt = new Date(enlace.expira_at);

	if (expiraAt <= ahora) {
		throw error(
			410,
			'Este enlace de pago ha expirado'
		);
	}

	/*
	 * 4. Obtener la cotización relacionada.
	 */
	const { data: cotizacion, error: cotizacionError } =
		await supabaseServer
			.from('cotizaciones')
			.select('*')
			.eq('id', enlace.cotizacion_id)
			.maybeSingle();

	if (cotizacionError) {
		console.error(
			'Error cargando cotización del enlace:',
			cotizacionError
		);

		throw error(
			500,
			'No se pudo cargar la información de la propuesta'
		);
	}

	if (!cotizacion) {
		throw error(
			404,
			'La propuesta asociada al enlace no existe'
		);
	}

	/*
	 * 5. Obtener únicamente las cuentas activas
	 *    correspondientes al país elegido.
	 */
	const { data: cuentas, error: cuentasError } =
		await supabaseServer
			.from('cuentas_pago')
			.select(
				'banco, titular, moneda, numero_cuenta, clabe, iban, rfc_rtn, orden'
			)
			.eq('pais', enlace.pais)
			.eq('activa', true)
			.order('orden', { ascending: true });

	if (cuentasError) {
		console.error(
			'Error cargando cuentas de pago:',
			cuentasError
		);

		throw error(
			500,
			'No se pudieron cargar los datos de pago'
		);
	}

	return {
		enlace: {
			pais: enlace.pais,
			expira_at: enlace.expira_at
		},
		cotizacion: {
			id: cotizacion.id,
			titulo: cotizacion.titulo,
			cliente_nombre: cotizacion.cliente_nombre,
			total: cotizacion.total,
			moneda: cotizacion.moneda
		},
		cuentas: cuentas ?? []
	};
}
