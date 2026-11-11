import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { supabaseServer } from '$lib/server/supabase.js';

export async function GET({ request }) {
	try {
		const authorization = request.headers.get('authorization');

		if (!authorization?.startsWith('Bearer ')) {
			return json({ error: 'No autorizado.' }, { status: 401 });
		}

		const accessToken = authorization.slice(7);
		const { data: { user }, error: authError } =
			await supabaseServer.auth.getUser(accessToken);

		if (authError || !user) {
			return json({ error: 'Sesión no válida.' }, { status: 401 });
		}

		const ownerId = env.TRADING_SIGNAL_OWNER_ID;

		if (!ownerId || user.id !== ownerId) {
			return json({ error: 'Sin permiso para consultar estos datos.' }, { status: 403 });
		}

		const [
			{ data: eventos, error: eventosError, count: totalEventos },
			{ count: entradasConfirmadas, error: confirmadasError },
			{ data: operaciones, error: operacionesError }
		] = await Promise.all([
			supabaseServer
				.from('trading_eventos')
				.select(
					'id, event_id, category, market, tv_symbol, event_type, side, route, timing, event_price, reference_price, confirmation_price, atr_ratio, event_time_ms, chart_timeframe, received_at',
					{ count: 'exact' }
				)
				.eq('owner_id', ownerId)
				.order('event_time_ms', { ascending: false })
				.limit(30),

			supabaseServer
				.from('trading_eventos')
				.select('id', { count: 'exact', head: true })
				.eq('owner_id', ownerId)
				.eq('event_type', 'ENTRY_SETUP_CONFIRMED'),

			supabaseServer
				.from('trading_operaciones')
				.select('id, status, pnl_amount')
				.eq('owner_id', ownerId)
		]);

		if (eventosError) throw eventosError;
		if (confirmadasError) throw confirmadasError;
		if (operacionesError) throw operacionesError;

		const resultadoAcumulado = (operaciones || [])
			.filter((operacion) =>
				operacion.status === 'CLOSED' &&
				operacion.pnl_amount !== null
			)
			.reduce((total, operacion) => total + Number(operacion.pnl_amount), 0);

		return json({
			success: true,
			eventos: eventos || [],
			resumen: {
				eventos_registrados: totalEventos || 0,
				entradas_confirmadas: entradasConfirmadas || 0,
				operaciones_realizadas: operaciones?.length || 0,
				resultado_acumulado: resultadoAcumulado
			}
		});
	} catch (error) {
		console.error('[MT5 events]', error);
		return json(
			{ error: 'No se pudieron consultar los eventos MT5.' },
			{ status: 500 }
		);
	}
}
