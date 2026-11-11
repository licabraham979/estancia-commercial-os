import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { supabaseServer } from '$lib/server/supabase.js';

const MERCADOS = ['BTCUSD', 'US100Cash', 'GOLD', 'US30Cash'];

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

		const resultados = await Promise.all(
			MERCADOS.map(async (market) => {
				const { data, error } = await supabaseServer
					.from('trading_lotes')
					.select('id, script_version, bar_time_ms, raw_payload, received_at')
					.eq('owner_id', ownerId)
					.eq('source', 'estancia_mt5')
					.filter('raw_payload->>market', 'eq', market)
					.order('received_at', { ascending: false })
					.limit(1)
					.maybeSingle();

				if (error) throw error;

				if (!data) return { market, snapshot: null };

				return {
					market,
					snapshot: {
						script_version: data.script_version,
						bar_time_ms: data.bar_time_ms,
						received_at: data.received_at,
						timeframes: data.raw_payload.timeframes,
						atr_m5: data.raw_payload.atr_m5
					}
				};
			})
		);

		return json({ success: true, snapshots: resultados });
	} catch (error) {
		console.error('[MT5 snapshots]', error);
		return json({ error: 'No se pudieron consultar los snapshots MT5.' }, { status: 500 });
	}
}
