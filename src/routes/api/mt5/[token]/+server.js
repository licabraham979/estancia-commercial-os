import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { timingSafeEqual } from 'node:crypto';
import { supabaseServer } from '$lib/server/supabase.js';

const MAX_BODY_SIZE = 64 * 1024;

const ALLOWED_MARKETS = [
	'BTCUSD',
	'US100Cash',
	'GOLD',
	'US30Cash'
];

const TIMEFRAMES = [
	'M1',
	'M5',
	'M15',
	'M30',
	'H4',
	'D1'
];

const EMA_PERIODS = ['20', '50', '100', '200'];

/** @param {unknown} recibido @param {unknown} esperado */
function tokenValido(recibido, esperado) {
	if (
		typeof recibido !== 'string' ||
		typeof esperado !== 'string' ||
		!recibido ||
		!esperado
	) {
		return false;
	}

	const a = Buffer.from(recibido, 'utf8');
	const b = Buffer.from(esperado, 'utf8');

	return a.length === b.length && timingSafeEqual(a, b);
}

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function esObjeto(value) {
	return (
		value !== null &&
		typeof value === 'object' &&
		!Array.isArray(value)
	);
}

/** @param {unknown} value @returns {value is number} */
function esNumero(value) {
	return typeof value === 'number' && Number.isFinite(value);
}

/** @param {unknown} value @returns {value is number} */
/** @param {unknown} value */
function esTiempo(value) {
	return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

/** @param {unknown} tf @param {string} nombre */
function validarTemporalidad(tf, nombre) {
	if (!esObjeto(tf)) {
		throw new Error(`Temporalidad ${nombre} inválida.`);
	}

	if (tf.complete !== true) {
		throw new Error(`Temporalidad ${nombre} incompleta.`);
	}

	if (!esTiempo(tf.bar_time_ms)) {
		throw new Error(`Hora de vela inválida en ${nombre}.`);
	}

	if (!esNumero(tf.close) || tf.close <= 0) {
		throw new Error(`Precio de cierre inválido en ${nombre}.`);
	}

	if (!esObjeto(tf.ema)) {
		throw new Error(`EMAs inválidas en ${nombre}.`);
	}

	for (const period of EMA_PERIODS) {
		const value = tf.ema[period];

		if (!esNumero(value) || value <= 0) {
			throw new Error(`EMA ${period} inválida en ${nombre}.`);
		}
	}

	if (!esNumero(tf.rsi) || tf.rsi < 0 || tf.rsi > 100) {
		throw new Error(`RSI inválido en ${nombre}.`);
	}

	if (
		!esNumero(tf.rsi_ma) ||
		tf.rsi_ma < 0 ||
		tf.rsi_ma > 100
	) {
		throw new Error(`Media RSI inválida en ${nombre}.`);
	}

	if (!esNumero(tf.rsi_separation) || tf.rsi_separation < 0) {
		throw new Error(`Separación RSI inválida en ${nombre}.`);
	}

	if (typeof tf.rsi_direction !== 'number' || ![-1, 0, 1].includes(tf.rsi_direction)) {
		throw new Error(`Dirección RSI inválida en ${nombre}.`);
	}

	if (typeof tf.trend_state !== 'number' || ![-1, 0, 1].includes(tf.trend_state)) {
		throw new Error(`Tendencia inválida en ${nombre}.`);
	}
}

/** @param {unknown} payload */
function validarSnapshot(payload) {
	if (!esObjeto(payload)) {
		throw new Error('Formato de mensaje inválido.');
	}

	if (
		payload.source !== 'estancia_mt5' ||
		payload.schema_version !== 1
	) {
		throw new Error('Origen o versión del mensaje inválidos.');
	}

	if (
		typeof payload.script_version !== 'string' ||
		payload.script_version.length < 1 ||
		payload.script_version.length > 100
	) {
		throw new Error('Versión del EA inválida.');
	}

	if (typeof payload.market !== 'string' || !ALLOWED_MARKETS.includes(payload.market)) {
		throw new Error('Mercado no autorizado.');
	}

	if (!esTiempo(payload.bar_time_ms)) {
		throw new Error('Hora principal del snapshot inválida.');
	}

	if (!esObjeto(payload.timeframes)) {
		throw new Error('No se recibieron las temporalidades.');
	}

	for (const name of TIMEFRAMES) {
		validarTemporalidad(payload.timeframes[name], name);
	}

	if (!esObjeto(payload.atr_m5) || payload.atr_m5.valid !== true) {
		throw new Error('Contexto ATR M5 inválido.');
	}

	const atr = payload.atr_m5;

	if (
		!esNumero(atr.value) ||
		atr.value <= 0 ||
		!esNumero(atr.average) ||
		atr.average <= 0 ||
		!esNumero(atr.ratio) ||
		atr.ratio <= 0 ||
		typeof atr.state !== 'number' || ![-1, 0, 1, 2].includes(atr.state)
	) {
		throw new Error('Valores ATR M5 inválidos.');
	}

	const m1 = payload.timeframes.M1;

	if (!esObjeto(m1) || m1.bar_time_ms !== payload.bar_time_ms) {
		throw new Error('La hora principal no coincide con el cierre M1.');
	}
}


/** @param {unknown} payload */
function validarEvento(payload) {
	if (!esObjeto(payload)) {
		throw new Error('Formato de evento inválido.');
	}

	if (
		payload.source !== 'estancia_mt5' ||
		payload.message_type !== 'event' ||
		payload.schema_version !== 1
	) {
		throw new Error('Origen, tipo o versión del evento inválidos.');
	}

	if (
		typeof payload.script_version !== 'string' ||
		payload.script_version.length < 1 ||
		payload.script_version.length > 100
	) {
		throw new Error('Versión del EA inválida.');
	}

	if (typeof payload.market !== 'string' || !ALLOWED_MARKETS.includes(payload.market)) {
		throw new Error('Mercado no autorizado.');
	}

	if (
		typeof payload.tv_symbol !== 'string' ||
		payload.tv_symbol.length < 1 ||
		payload.tv_symbol.length > 100
	) {
		throw new Error('Símbolo del evento inválido.');
	}

	if (
		typeof payload.event_id !== 'string' ||
		payload.event_id.length < 1 ||
		payload.event_id.length > 200 ||
		typeof payload.setup_id !== 'string' ||
		payload.setup_id.length < 1 ||
		payload.setup_id.length > 200
	) {
		throw new Error('Identificador del evento o setup inválido.');
	}

	const eventTypes = [
		'ENTRY_SETUP_STARTED',
		'ENTRY_SETUP_CONFIRMED',
		'ENTRY_SETUP_CANCELLED',
		'ENTRY_SETUP_EXPIRED',
		'ENTRY_SETUP_MAX_MOVE'
	];

	if (
		typeof payload.event_type !== 'string' ||
		!eventTypes.includes(payload.event_type) ||
		payload.category !== 'ENTRY'
	) {
		throw new Error('Tipo o categoría del evento inválidos.');
	}

	if (typeof payload.side !== 'string' || !['BUY', 'SELL'].includes(payload.side)) {
		throw new Error('Dirección del evento inválida.');
	}

	if (typeof payload.route !== 'string' || !['TRADITIONAL', 'EARLY'].includes(payload.route)) {
		throw new Error('Ruta del evento inválida.');
	}

	if (
		payload.timing !== 'M1_CLOSE' ||
		payload.chart_timeframe !== 'M1'
	) {
		throw new Error('Temporalidad o momento del evento inválidos.');
	}

	if (
		typeof payload.reason !== 'string' ||
		payload.reason.length < 1 ||
		payload.reason.length > 500
	) {
		throw new Error('Motivo del evento inválido.');
	}

	for (const field of ['previous_state', 'new_state', 'wait_bars']) {
		if (!Number.isSafeInteger(payload[field])) {
			throw new Error(`Campo ${field} inválido.`);
		}
	}

	if (typeof payload.wait_bars !== 'number' || payload.wait_bars < 0) {
		throw new Error('Espera de velas inválida.');
	}

	if (
		!esNumero(payload.event_price) ||
		payload.event_price <= 0 ||
		!esNumero(payload.reference_price) ||
		payload.reference_price <= 0
	) {
		throw new Error('Precios del evento inválidos.');
	}

	if (
		payload.confirmation_price !== null &&
		(!esNumero(payload.confirmation_price) || payload.confirmation_price <= 0)
	) {
		throw new Error('Precio de confirmación inválido.');
	}

	if (!esNumero(payload.move_pct)) {
		throw new Error('Movimiento porcentual inválido.');
	}

	if (typeof payload.preferred_move_reached !== 'boolean') {
		throw new Error('Estado del movimiento preferido inválido.');
	}

	if (!esTiempo(payload.event_time_ms)) {
		throw new Error('Hora del evento inválida.');
	}

	if (
		payload.atr_ratio !== null &&
		(!esNumero(payload.atr_ratio) || payload.atr_ratio <= 0)
	) {
		throw new Error('Relación ATR inválida.');
	}

	if (!esObjeto(payload.context)) {
		throw new Error('Contexto del evento inválido.');
	}

	for (const name of ['M1', 'M5', 'M15', 'M30']) {
		if (!esObjeto(payload.context[name])) {
			throw new Error(`Falta el contexto ${name}.`);
		}
	}
}

export async function POST({ request, params }) {
	try {
		const expectedToken = env.MT5_WEBHOOK_TOKEN;
		const ownerId = env.TRADING_SIGNAL_OWNER_ID;

		if (!expectedToken || !ownerId) {
			console.error('MT5: faltan variables privadas.');
			return json(
				{ error: 'Receptor MT5 no configurado.' },
				{ status: 500 }
			);
		}

		if (!tokenValido(params.token, expectedToken)) {
			return json(
				{ error: 'No autorizado.' },
				{ status: 401 }
			);
		}

		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ownerId)
		) {
			console.error('MT5: owner_id inválido.');
			return json(
				{ error: 'Configuración de propietario inválida.' },
				{ status: 500 }
			);
		}

		const rawBody = await request.text();

		if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_SIZE) {
			return json(
				{ error: 'El mensaje supera el tamaño permitido.' },
				{ status: 413 }
			);
		}

		let payload;

		try {
			payload = JSON.parse(rawBody);
		} catch {
			return json(
				{ error: 'El mensaje no contiene JSON válido.' },
				{ status: 400 }
			);
		}


		if (esObjeto(payload) && payload.message_type === 'event') {
			try {
				validarEvento(payload);
			} catch (error) {
				return json(
					{
						error: error instanceof Error
							? error.message
							: 'Evento inválido.'
					},
					{ status: 400 }
				);
			}

			const evento = {
				owner_id: ownerId,
				lote_id: null,
				event_id: payload.event_id,
				category: payload.category,
				market: payload.market,
				tv_symbol: payload.tv_symbol,
				event_type: payload.event_type,
				side: payload.side,
				route: payload.route,
				timing: payload.timing,
				event_price: payload.event_price,
				reference_price: payload.reference_price,
				confirmation_price: payload.confirmation_price,
				atr_ratio: payload.atr_ratio,
				event_time_ms: payload.event_time_ms,
				chart_timeframe: payload.chart_timeframe,
				raw_event: payload
			};

			const { data, error: eventoError } = await supabaseServer
				.from('trading_eventos')
				.upsert(evento, {
					onConflict: 'owner_id,event_id',
					ignoreDuplicates: true
				})
				.select('id');

			if (eventoError) {
				console.error('MT5: error guardando evento:', eventoError);
				return json(
					{ error: 'No se pudo guardar el evento.' },
					{ status: 500 }
				);
			}

			const eventoNuevo = data?.length > 0;

			return json({
				success: true,
				duplicate: !eventoNuevo,
				evento_id: eventoNuevo ? data[0].id : null,
				event_id: payload.event_id,
				market: payload.market,
				event_type: payload.event_type
			});
		}

		try {
			validarSnapshot(payload);

		} catch (error) {
			return json(
				{
					error: error instanceof Error
						? error.message
						: 'Snapshot inválido.'
				},
				{ status: 400 }
			);
		}

		const sourceKey = `${payload.market}:${payload.bar_time_ms}`;

		const { data: lote, error: loteError } = await supabaseServer
			.from('trading_lotes')
			.insert({
				owner_id: ownerId,
				source: 'estancia_mt5',
				source_key: sourceKey,
				schema_version: 1,
				script_version: payload.script_version,
				chart_timeframe: 'M1',
				bar_time_ms: payload.bar_time_ms,
				summary: `Snapshot MT5 ${payload.market}`,
				raw_payload: payload
			})
			.select('id')
			.single();

		if (loteError) {
			// Un reintento de la misma vela puede chocar con el índice único.
			if (loteError.code === '23505') {
				const { data: existente, error: consultaError } =
					await supabaseServer
						.from('trading_lotes')
						.select('id')
						.eq('owner_id', ownerId)
						.eq('source', 'estancia_mt5')
						.eq('source_key', sourceKey)
						.maybeSingle();

				if (!consultaError && existente) {
					return json({
						success: true,
						duplicate: true,
						lote_id: existente.id,
						market: payload.market,
						bar_time_ms: payload.bar_time_ms
					});
				}
			}

			console.error('MT5: error guardando snapshot:', loteError);

			return json(
				{ error: 'No se pudo guardar el snapshot.' },
				{ status: 500 }
			);
		}

		return json({
			success: true,
			duplicate: false,
			lote_id: lote.id,
			market: payload.market,
			bar_time_ms: payload.bar_time_ms
		});

	} catch (error) {
		console.error('MT5: error inesperado:', error);

		return json(
			{ error: 'No se pudo procesar el snapshot.' },
			{ status: 500 }
		);
	}
}
