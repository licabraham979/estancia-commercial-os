import { json } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase';
import { env } from '$env/dynamic/private';

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

export async function POST({ params, request }) {
	try {
		const conversationId = params.id;

		const { mensaje } = await request.json();

		if (!mensaje || !mensaje.trim()) {
			return json(
				{
					ok: false,
					error: 'El mensaje está vacío'
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

		const token = env.META_PAGE_ACCESS_TOKEN;

		if (!token) {
			console.error(
				'META_PAGE_ACCESS_TOKEN no está configurado'
			);

			return json(
				{
					ok: false,
					error: 'Token de Meta no configurado'
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
					meta: resultadoMeta
				},
				{ status: 502 }
			);
		}

		console.log(
			'✅ MENSAJE ENVIADO A META:',
			resultadoMeta
		);

		// 3. Guardar mensaje enviado en el CRM
		const { data: nuevoMensaje, error: errorMensaje } =
			await supabaseServer
				.from('messenger_messages')
				.insert({
					conversation_id: conversationId,
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
				'❌ Error guardando mensaje enviado:',
				errorMensaje
			);

			return json(
				{
					ok: false,
					error: 'El mensaje se envió a Meta pero no se pudo guardar en el CRM'
				},
				{ status: 500 }
			);
		}

		// 4. Actualizar último mensaje de la conversación
		const { error: errorActualizacion } =
			await supabaseServer
				.from('messenger_conversations')
				.update({
					ultimo_mensaje: mensaje.trim(),
					ultima_fecha: new Date().toISOString(),
					updated_at: new Date().toISOString()
				})
				.eq('id', conversationId);

		if (errorActualizacion) {
			console.error(
				'Error actualizando conversación:',
				errorActualizacion
			);
		}

		console.log(
			'✅ MENSAJE OUTBOUND GUARDADO EN CRM:',
			nuevoMensaje.id
		);

		return json({
			ok: true,
			mensaje: nuevoMensaje,
			meta: resultadoMeta
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