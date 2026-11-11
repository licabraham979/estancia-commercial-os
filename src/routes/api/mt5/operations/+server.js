import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { supabaseServer } from '$lib/server/supabase.js';

const MERCADOS = ['BTCUSD', 'US100Cash', 'GOLD', 'US30Cash'];

/** @param {Request} request */
async function autenticar(request) {
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
        return { error: json({ error: 'No autorizado.' }, { status: 401 }) };
    }

    const { data: { user }, error } =
        await supabaseServer.auth.getUser(authorization.slice(7));

    if (error || !user) {
        return { error: json({ error: 'Sesión no válida.' }, { status: 401 }) };
    }

    const ownerId = env.TRADING_SIGNAL_OWNER_ID;
    if (!ownerId || user.id !== ownerId) {
        return { error: json({ error: 'Sin permiso para estos datos.' }, { status: 403 }) };
    }

    return { ownerId };
}

export async function GET({ request }) {
    try {
        const auth = await autenticar(request);
        if (auth.error) return auth.error;

        const { data, error } = await supabaseServer
            .from('trading_operaciones')
            .select('id, evento_id, market, tv_symbol, side, status, entry_price, exit_price, opened_at, closed_at, notes, created_at')
            .eq('owner_id', auth.ownerId)
            .order('opened_at', { ascending: false });

        if (error) throw error;

        const operaciones = data || [];
        const eventoIds = [...new Set(
            operaciones.map((op) => op.evento_id).filter(Boolean)
        )];

        /** @type {Record<string, any>} */
        let eventosPorId = {};

        if (eventoIds.length) {
            const { data: eventos, error: eventosError } = await supabaseServer
                .from('trading_eventos')
                .select('id, raw_event')
                .eq('owner_id', auth.ownerId)
                .in('id', eventoIds);

            if (eventosError) throw eventosError;

            eventosPorId = Object.fromEntries(
                (eventos || []).map((evento) => [evento.id, evento.raw_event])
            );
        }

        return json({
            success: true,
            operaciones: operaciones.map((op) => ({
                ...op,
                contexto_evento: op.evento_id
                    ? eventosPorId[op.evento_id] || null
                    : null
            }))
        });
    } catch (error) {
        console.error('[MT5 operations GET]', error);
        return json({ error: 'No se pudieron consultar las operaciones.' }, { status: 500 });
    }
}

export async function POST({ request }) {
    try {
        const auth = await autenticar(request);
        if (auth.error) return auth.error;

        const body = await request.json();
        let operacion;

        if (body.evento_id) {
            const { data: evento, error: eventoError } = await supabaseServer
                .from('trading_eventos')
                .select('id, market, tv_symbol, event_type, side, route, timing, event_price, event_time_ms')
                .eq('id', body.evento_id)
                .eq('owner_id', auth.ownerId)
                .maybeSingle();

            if (eventoError) throw eventoError;
            if (!evento) return json({ error: 'No se encontró el evento.' }, { status: 404 });

            if (!['ENTRY_SETUP_STARTED', 'ENTRY_SETUP_CONFIRMED'].includes(evento.event_type)) {
                return json({ error: 'Este evento no representa una oportunidad de entrada.' }, { status: 400 });
            }

            if (!['BUY', 'SELL'].includes(evento.side) ||
                !Number.isFinite(Number(evento.event_price)) ||
                Number(evento.event_price) <= 0) {
                return json({ error: 'El evento no tiene dirección o precio de entrada válido.' }, { status: 400 });
            }

            const { data: existente, error: existenteError } = await supabaseServer
                .from('trading_operaciones')
                .select('id')
                .eq('owner_id', auth.ownerId)
                .eq('evento_id', evento.id)
                .maybeSingle();

            if (existenteError) throw existenteError;
            if (existente) {
                return json({ error: 'Esta oportunidad ya fue tomada.' }, { status: 409 });
            }

            const openedAt = Number.isFinite(Number(evento.event_time_ms))
                ? new Date(Number(evento.event_time_ms)).toISOString()
                : new Date().toISOString();

            operacion = {
                owner_id: auth.ownerId,
                evento_id: evento.id,
                market: evento.market,
                tv_symbol: evento.tv_symbol,
                side: evento.side,
                entry_price: Number(evento.event_price),
                opened_at: openedAt,
                notes: [evento.route, evento.timing].filter(Boolean).join(' · ') || null
            };
        } else {
            const market = String(body.market || '');
            const side = String(body.side || '');
            const entryPrice = Number(body.entry_price);

            if (!MERCADOS.includes(market)) {
                return json({ error: 'Selecciona un mercado válido.' }, { status: 400 });
            }
            if (!['BUY', 'SELL'].includes(side)) {
                return json({ error: 'Selecciona BUY o SELL.' }, { status: 400 });
            }
            if (!Number.isFinite(entryPrice) || entryPrice <= 0) {
                return json({ error: 'Introduce un precio de entrada válido.' }, { status: 400 });
            }

            operacion = {
                owner_id: auth.ownerId,
                market,
                tv_symbol: body.tv_symbol || null,
                side,
                entry_price: entryPrice,
                notes: body.notes ? String(body.notes).slice(0, 1000) : null
            };
        }

        const { data, error } = await supabaseServer
            .from('trading_operaciones')
            .insert(operacion)
            .select('id, evento_id, market, tv_symbol, side, status, entry_price, exit_price, opened_at, closed_at, notes, created_at')
            .single();

        if (error) {
            if (error.code === '23505') {
                return json({ error: 'Esta oportunidad ya fue tomada.' }, { status: 409 });
            }
            throw error;
        }

        return json({ success: true, operacion: data }, { status: 201 });
    } catch (error) {
        console.error('[MT5 operations POST]', error);
        return json({ error: 'No se pudo registrar la operación.' }, { status: 500 });
    }
}

export async function DELETE({ request }) {
    try {
        const auth = await autenticar(request);
        if (auth.error) return auth.error;

        const body = await request.json();
        const ids = [...new Set(body.ids || [])].filter((id) => typeof id === 'string' && id);

        if (!ids.length) {
            return json({ error: 'Selecciona al menos una operación.' }, { status: 400 });
        }

        const { data, error } = await supabaseServer
            .from('trading_operaciones')
            .delete()
            .eq('owner_id', auth.ownerId)
            .in('id', ids)
            .select('id');

        if (error) throw error;
        return json({ success: true, eliminadas: data?.length || 0 });
    } catch (error) {
        console.error('[MT5 operations DELETE]', error);
        return json({ error: 'No se pudieron eliminar las operaciones seleccionadas.' }, { status: 500 });
    }
}
