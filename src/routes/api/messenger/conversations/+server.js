import { json } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase';

export async function GET() {
	try {
		const { data, error } = await supabaseServer
			.from('messenger_conversations')
			.select('*')
			.order('ultima_fecha', { ascending: false });

		if (error) {
			console.error('Error obteniendo conversaciones:', error);

			return json(
				{
					ok: false,
					error: 'No se pudieron obtener las conversaciones'
				},
				{ status: 500 }
			);
		}

		return json({
			ok: true,
			conversaciones: data ?? []
		});
	} catch (error) {
		console.error('Error en API de conversaciones:', error);

		return json(
			{
				ok: false,
				error: 'Error interno del servidor'
			},
			{ status: 500 }
		);
	}
}
