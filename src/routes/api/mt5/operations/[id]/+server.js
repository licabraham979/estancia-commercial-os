import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { supabaseServer } from '$lib/server/supabase.js';

export async function PATCH({ request, params }) {
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
            return json({ error: 'Sin permiso para estos datos.' }, { status: 403 });
        }

        const body = await request.json();
        const exitPrice = Number(body.exit_price);

        if (!Number.isFinite(exitPrice) || exitPrice <= 0) {
            return json({ error: 'Introduce un precio de salida válido.' }, { status: 400 });
        }

        const { data, error } = await supabaseServer
            .from('trading_operaciones')
            .update({
                status: 'CLOSED',
                exit_price: exitPrice,
                closed_at: new Date().toISOString()
            })
            .eq('id', params.id)
            .eq('owner_id', ownerId)
            .eq('status', 'OPEN')
            .select('id, status, entry_price, exit_price, opened_at, closed_at')
            .maybeSingle();

        if (error) throw error;
        if (!data) {
            return json({ error: 'No se encontró una operación abierta con ese ID.' }, { status: 404 });
        }

        return json({ success: true, operacion: data });
    } catch (error) {
        console.error('[MT5 operations PATCH]', error);
        return json({ error: 'No se pudo cerrar la operación.' }, { status: 500 });
    }
}
