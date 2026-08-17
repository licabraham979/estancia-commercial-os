import { json } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase';

export async function GET({ params }) {
	try {
		const conversationId = params.id;

		const { data: conversacion, error: errorConversacion } =
			await supabaseServer
				.from('messenger_conversations')
				.select('*')
				.eq('id', conversationId)
				.single();

		if (errorConversacion) {
			console.error(
				'Error obteniendo conversación:',
				errorConversacion
			);

			return json(
				{
					ok: false,
					error: 'No se encontró la conversación'
				},
				{ status: 404 }
			);
		}

		const { data: mensajes, error: errorMensajes } =
			await supabaseServer
				.from('messenger_messages')
				.select('*')
				.eq('conversation_id', conversationId)
				.order('created_at', {
					ascending: true
				});

		if (errorMensajes) {
			console.error(
				'Error obteniendo mensajes:',
				errorMensajes
			);

			return json(
				{
					ok: false,
					error: 'No se pudieron obtener los mensajes'
				},
				{ status: 500 }
			);
		}

		return json({
			ok: true,
			conversacion,
			mensajes: mensajes ?? []
		});
	} catch (error) {
		console.error(
			'Error en API de conversación:',
			error
		);

		return json(
			{
				ok: false,
				error: 'Error interno del servidor'
			},
			{ status: 500 }
		);
	}
}
