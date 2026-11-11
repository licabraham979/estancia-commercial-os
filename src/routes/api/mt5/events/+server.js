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


export async function DELETE({ request }) {
	try {
		const authorization = request.headers.get('authorization');

		if (!authorization?.startsWith('Bearer ')) {
			return json({ error: 'No autorizado.' }, { status: 401 });
		}

		const { data: { user }, error: authError } =
			await supabaseServer.auth.getUser(authorization.slice(7));

		if (authError || !user) {
			return json({ error: 'Sesión no válida.' }, { status: 401 });
		}

		const ownerId = env.TRADING_SIGNAL_OWNER_ID;

		if (!ownerId || user.id !== ownerId) {
			return json({ error: 'Sin permiso para eliminar estos datos.' }, { status: 403 });
		}

		const body = await request.json();
		const ids = [...new Set(body.ids || [])]
			.filter((id) => typeof id === 'string' && id.length > 0);

		if (!ids.length) {
			return json({ error: 'Selecciona al menos un evento.' }, { status: 400 });
		}

		const { data: vinculadas, error: vinculadasError } = await supabaseServer
			.from('trading_operaciones')
			.select('evento_id')
			.eq('owner_id', ownerId)
			.in('evento_id', ids);

		if (vinculadasError) throw vinculadasError;

		if (vinculadas?.length) {
			return json({
				error: 'No se pueden eliminar eventos vinculados a operaciones. Elimina primero las operaciones correspondientes.'
			}, { status: 409 });
		}

		const { data, error } = await supabaseServer
			.from('trading_eventos')
			.delete()
			.eq('owner_id', ownerId)
			.in('id', ids)
			.select('id');

		if (error) throw error;

		return json({ success: true, eliminados: data?.length || 0 });
	} catch (error) {
		console.error('[MT5 events DELETE]', error);
		return json({ error: 'No se pudieron eliminar los eventos seleccionados.' }, { status: 500 });
	}
}
