import { json } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	try {
		const { conversationId, mensaje } = await request.json();

		if (!conversationId || !mensaje?.trim()) {
			return json(
				{
					ok: false,
					error: 'Faltan datos'
				},
				{ status: 400 }
			);
		}

		// 1. Obtener la conversación
		const { data: conversacion, error: errorConversacion } =
			await supabaseServer
				.from('messenger_conversations')
				.select('*')
				.eq('id', conversationId)
				.single();

		if (errorConversacion || !conversacion) {
			return json(
				{
					ok: false,
					error: 'No se encontró la conversación'
				},
				{ status: 404 }
			);
		}

		const token = env.META_PAGE_ACCESS_TOKEN;

		if (!token) {
			console.error('❌ META_PAGE_ACCESS_TOKEN no configurado');

			return json(
				{
					ok: false,
					error: 'Token de Messenger no configurado'
				},
				{ status: 500 }
			);
		}

		// 2. Enviar mensaje a Meta
const respuestaMeta = await fetch(
	`https://graph.facebook.com/v26.0/me/messages?access_token=${encodeURIComponent(token)}`,
	{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			recipient: {
				id: conversacion.meta_user_id
			},
			message: {
				text: mensaje.trim()
			},
			messaging_type: 'RESPONSE'
		})
	}
);

		const resultadoMeta = await respuestaMeta.json();
		if (!respuestaMeta.ok) {
			console.error(
				'❌ Error enviando mensaje a Meta:',
				resultadoMeta
			);

			return json(
				{
					ok: false,
					error: 'Meta rechazó el mensaje',
					detalle: resultadoMeta
				},
				{ status: 502 }
			);
		}

		// 3. Guardar respuesta enviada en CRM
		const { data: nuevoMensaje, error: errorMensaje } =
			await supabaseServer
				.from('messenger_messages')
				.insert({
					conversation_id: conversacion.id,
					meta_message_id:
						resultadoMeta.message_id ?? null,
					direccion: 'outbound',
					contenido: mensaje.trim(),
					tipo: 'text'
				})
				.select()
				.single();

		if (errorMensaje) {
			console.error(
				'⚠️ Mensaje enviado a Meta pero no guardado en CRM:',
				errorMensaje
			);

			return json({
				ok: true,
				enviado: true,
				guardado: false,
				message_id: resultadoMeta.message_id ?? null
			});
		}

		// 4. Actualizar conversación
		await supabaseServer
			.from('messenger_conversations')
			.update({
				ultimo_mensaje: mensaje.trim(),
				ultima_fecha: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			.eq('id', conversacion.id);

		console.log(
			'✅ MENSAJE ENVIADO A MESSENGER:',
			nuevoMensaje.id
		);

		return json({
			ok: true,
			enviado: true,
			guardado: true,
			mensaje: nuevoMensaje
		});
	} catch (error) {
		console.error(
			'❌ Error enviando mensaje:',
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
