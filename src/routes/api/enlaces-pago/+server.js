import { json } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase.js';

export async function POST({ request }) {
	try {
		const body = await request.json();

		const {
			cotizacion_id,
			pais
		} = body;

		if (!cotizacion_id || !pais) {
			return json(
				{
					error: 'Faltan datos para generar el enlace'
				},
				{ status: 400 }
			);
		}

		if (!['HN', 'MX'].includes(pais)) {
			return json(
				{
					error: 'País de pago no válido'
				},
				{ status: 400 }
			);
		}

		/*
		 * Verificar que la cotización exista.
		 */
		const { data: cotizacion, error: cotizacionError } =
			await supabaseServer
				.from('cotizaciones')
				.select('id')
				.eq('id', cotizacion_id)
				.maybeSingle();

		if (cotizacionError) {
			console.error(
				'Error verificando cotización:',
				cotizacionError
			);

			return json(
				{
					error: 'No se pudo verificar la cotización'
				},
				{ status: 500 }
			);
		}

		if (!cotizacion) {
			return json(
				{
					error: 'La cotización no existe'
				},
				{ status: 404 }
			);
		}

		/*
		 * Generar token único.
		 */
		const token = crypto.randomUUID();

		/*
		 * El enlace será válido durante 2 horas.
		 */
		const expiraAt = new Date(
			Date.now() + 2 * 60 * 60 * 1000
		);

		const { data: enlace, error: enlaceError } =
			await supabaseServer
				.from('enlaces_pago')
				.insert({
					cotizacion_id,
					token,
					pais,
					expira_at: expiraAt.toISOString(),
					usado: false
				})
				.select('id, token, pais, expira_at')
				.single();

		if (enlaceError) {
			console.error(
				'Error creando enlace de pago:',
				enlaceError
			);

			return json(
				{
					error: 'No se pudo crear el enlace de pago'
				},
				{ status: 500 }
			);
		}

		return json({
			success: true,
			enlace: {
				id: enlace.id,
				token: enlace.token,
				pais: enlace.pais,
				expira_at: enlace.expira_at,
				url: `/pago/${enlace.token}`
			}
		});

	} catch (err) {
		console.error(
			'Error inesperado generando enlace:',
			err
		);

		return json(
			{
				error: 'Error interno al generar el enlace de pago'
			},
			{ status: 500 }
		);
	}
}
