import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { timingSafeEqual } from 'node:crypto';
import { supabaseServer } from '$lib/server/supabase.js';

const MAX_BODY_SIZE = 64 * 1024;

/** @param {string} recibido @param {string} esperado */
function tokenValido(recibido, esperado) {
	if (!recibido || !esperado) return false;

	const a = Buffer.from(recibido, 'utf8');
	const b = Buffer.from(esperado, 'utf8');

	return a.length === b.length && timingSafeEqual(a, b);
}

/** @param {unknown} value @param {number} [maxLength] @returns {string | null} */
function textoOpcional(value, maxLength = 200) {
	if (value === null || value === undefined || value === '') {
		return null;
	}

	if (typeof value !== 'string' || value.length > maxLength) {
		throw new Error('Campo de texto inválido.');
	}

	return value;
}

/** @param {unknown} value @returns {number | null} */
function numeroOpcional(value) {
	if (value === null || value === undefined) return null;

	if (typeof value !== 'number' || !Number.isFinite(value)) {
		throw new Error('Campo numérico inválido.');
	}

	return value;
}

/** @param {unknown} value @returns {number | null} */
function tiempoOpcional(value) {
	const number = numeroOpcional(value);

	if (number === null) return null;

	if (!Number.isSafeInteger(number)) {
		throw new Error('Marca de tiempo inválida.');
	}

	return number;
}

/**
 * @param {Record<string, unknown>} event
 * @param {string} ownerId
 * @param {string} loteId
 * @param {string | null} chartTimeframe
 */
function prepararEvento(event, ownerId, loteId, chartTimeframe) {
	if (!event || typeof event !== 'object' || Array.isArray(event)) {
		throw new Error('Evento inválido.');
	}

	const eventId = textoOpcional(event.event_id, 200);
	const market = textoOpcional(event.market, 30);
	const symbol = textoOpcional(event.tv_symbol, 100);
	const eventType = textoOpcional(event.event_type, 100);

	if (!eventId || !market || !symbol || !eventType) {
		throw new Error('Faltan campos obligatorios del evento.');
	}

	let category;

	if (eventType.startsWith('ENTRY_')) {
		category = 'ENTRY';
	} else if (eventType.startsWith('CONTEXT_')) {
		category = 'CONTEXT';
	} else {
		throw new Error('Tipo de evento no reconocido.');
	}

	const side = textoOpcional(event.side, 20);

	if (side !== null && !['BUY', 'SELL'].includes(side)) {
		throw new Error('Dirección del evento inválida.');
	}

	return {
		owner_id: ownerId,
		lote_id: loteId,
		event_id: eventId,
		category,
		market,
		tv_symbol: symbol,
		event_type: eventType,
		side,
		route: textoOpcional(event.route, 100),
		timing: textoOpcional(event.timing, 100),
		event_price: numeroOpcional(event.event_price),
		reference_price: numeroOpcional(event.reference_price),
		confirmation_price: numeroOpcional(event.confirmation_price),
		atr_ratio: numeroOpcional(event.atr_ratio),
		event_time_ms: tiempoOpcional(event.event_time_ms),
		chart_timeframe:
			textoOpcional(event.chart_timeframe, 20) ?? chartTimeframe,
		raw_event: event
	};
}

export async function POST({ request, params }) {
	/** @type {string | null} */
	let loteIdGuardado = null;

	try {
		const expectedToken = env.TRADINGVIEW_WEBHOOK_TOKEN;
		const ownerId = env.TRADING_SIGNAL_OWNER_ID;

		if (!expectedToken || !ownerId) {
			console.error('TradingView: faltan variables privadas.');
			return json(
				{ error: 'Receptor no configurado.' },
				{ status: 500 }
			);
		}

		if (!tokenValido(params.token, expectedToken)) {
			return json(
				{ error: 'No autorizado.' },
				{ status: 401 }
			);
		}

		if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ownerId)) {
			console.error('TradingView: owner_id inválido.');
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

		if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
			return json(
				{ error: 'Formato de mensaje inválido.' },
				{ status: 400 }
			);
		}

		if (
			payload.source !== 'estancia_trading' ||
			payload.schema_version !== 1 ||
			!Array.isArray(payload.events) ||
			payload.events.length > 50
		) {
			return json(
				{ error: 'Estructura de TradingView no reconocida.' },
				{ status: 400 }
			);
		}

		const scriptVersion = textoOpcional(payload.script_version, 100);
		const chartTimeframe = textoOpcional(payload.chart_timeframe, 20);
		const summary = textoOpcional(payload.summary, 2000);
		const barTimeMs = tiempoOpcional(payload.bar_time_ms);

		// Evitar conflictos entre eventos repetidos dentro del mismo lote.
		const eventIds = new Set();

		for (const event of payload.events) {
			const id = textoOpcional(event?.event_id, 200);

			if (!id || eventIds.has(id)) {
				return json(
					{ error: 'El lote contiene identificadores repetidos o inválidos.' },
					{ status: 400 }
				);
			}

			eventIds.add(id);
		}

		// Primero registramos el mensaje original.
		const { data: lote, error: loteError } = await supabaseServer
			.from('trading_lotes')
			.insert({
				owner_id: ownerId,
				source: payload.source,
				schema_version: payload.schema_version,
				script_version: scriptVersion,
				chart_timeframe: chartTimeframe,
				bar_time_ms: barTimeMs,
				summary,
				raw_payload: payload
			})
			.select('id')
			.single();

		if (loteError) {
			console.error('TradingView: error guardando lote:', loteError);
			return json(
				{ error: 'No se pudo registrar el mensaje.' },
				{ status: 500 }
			);
		}

		loteIdGuardado = lote.id;

		/** @type {Record<string, unknown>[]} */
		const rawEvents = payload.events;

		const eventos = rawEvents.map((event) =>
			prepararEvento(event, ownerId, lote.id, chartTimeframe)
		);

		let insertados = 0;

		if (eventos.length > 0) {
			const { data, error: eventosError } = await supabaseServer
				.from('trading_eventos')
				.upsert(eventos, {
					onConflict: 'owner_id,event_id',
					ignoreDuplicates: true
				})
				.select('id');

			if (eventosError) {
				console.error('TradingView: error guardando eventos:', eventosError);

				// Eliminar el lote incompleto y cualquier evento asociado.
				await supabaseServer
					.from('trading_lotes')
					.delete()
					.eq('id', lote.id)
					.eq('owner_id', ownerId);

				return json(
					{ error: 'No se pudieron registrar los eventos.' },
					{ status: 500 }
				);
			}

			insertados = data?.length ?? 0;
		}

		return json({
			success: true,
			lote_id: lote.id,
			eventos_recibidos: eventos.length,
			eventos_nuevos: insertados,
			eventos_duplicados: eventos.length - insertados
		});

	} catch (error) {
		console.error('TradingView: error inesperado:', error);

		if (loteIdGuardado) {
			const { error: limpiezaError } = await supabaseServer
				.from('trading_lotes')
				.delete()
				.eq('id', loteIdGuardado)
				.eq('owner_id', env.TRADING_SIGNAL_OWNER_ID);

			if (limpiezaError) {
				console.error(
					'TradingView: no se pudo limpiar el lote incompleto:',
					limpiezaError
				);
			}
		}

		return json(
			{ error: 'No se pudo procesar el mensaje.' },
			{ status: 500 }
		);
	}
}
