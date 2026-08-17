import { json } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase';
import { env } from '$env/dynamic/private';


export async function GET({ url }) {
	const mode = url.searchParams.get('hub.mode');
	const token = url.searchParams.get('hub.verify_token');
	const challenge = url.searchParams.get('hub.challenge');

	const verifyToken = env.META_VERIFY_TOKEN;
console.log('🔐 META_VERIFY_TOKEN existe:', !!verifyToken);
console.log('🔐 Longitud META_VERIFY_TOKEN:', verifyToken?.length);
console.log('🔐 Token recibido existe:', !!token);
console.log('🔐 Longitud token recibido:', token?.length);
console.log('🔐 Mode:', mode);	
	if (
		mode === 'subscribe' &&
		token === verifyToken
	) {
		return new Response(challenge, {
			status: 200
		});
	}

	return new Response('Forbidden', {
		status: 403
	});
}

export async function POST({ request }) {
	console.log('🔥 WEBHOOK MESSENGER RECIBIDO');
	console.log('Headers:', Object.fromEntries(request.headers));

	try {
		const datos = await request.json();

		console.log('📦 BODY META:');
		console.log(JSON.stringify(datos, null, 2));

		// Meta envía: object → entry[] → messaging[]
		if (datos.object !== 'page') {
			return json({ ok: true });
		}

		for (const entry of datos.entry ?? []) {
			for (const evento of entry.messaging ?? []) {
				const metaUserId = evento.sender?.id;
				const metaMessageId = evento.message?.mid;
				const mensaje = evento.message?.text;

				// Ignorar eventos que no sean mensajes de texto
				if (!metaUserId || !mensaje) {
					console.log('ℹ️ Evento ignorado:', evento);
					continue;
				}

				console.log('👤 Usuario:', metaUserId);
				console.log('💬 Mensaje:', mensaje);
				console.log('🆔 Message ID:', metaMessageId);

				// 1. Buscar si ya existe la conversación
				let { data: conversacion, error: errorBusqueda } =
					await supabaseServer
						.from('messenger_conversations')
						.select('*')
						.eq('meta_user_id', metaUserId)
						.maybeSingle();

				if (errorBusqueda) {
					console.error('Error buscando conversación:', errorBusqueda);
					return json(
						{
							ok: false,
							error: 'Error buscando conversación'
						},
						{ status: 500 }
					);
				}

				// 2. Si no existe, crearla
				if (!conversacion) {
					const { data: nuevaConversacion, error: errorConversacion } =
						await supabaseServer
							.from('messenger_conversations')
							.insert({
								meta_user_id: metaUserId,
								nombre: `Messenger ${metaUserId}`,
								estado: 'nuevo',
								asignado_a: 'usuario',
								ultimo_mensaje: mensaje,
								ultima_fecha: new Date().toISOString()
							})
							.select()
							.single();

					if (errorConversacion) {
						console.error(
							'Error creando conversación:',
							errorConversacion
						);

						return json(
							{
								ok: false,
								error: 'No se pudo crear la conversación'
							},
							{ status: 500 }
						);
					}

					conversacion = nuevaConversacion;
				} else {
					// 3. Actualizar conversación existente
					const { error: errorActualizacion } = await supabaseServer
						.from('messenger_conversations')
						.update({
							ultimo_mensaje: mensaje,
							ultima_fecha: new Date().toISOString(),
							estado: 'nuevo',
							updated_at: new Date().toISOString()
						})
						.eq('id', conversacion.id);

					if (errorActualizacion) {
						console.error(
							'Error actualizando conversación:',
							errorActualizacion
						);
					}
				}

				// 4. Guardar mensaje
				const { data: nuevoMensaje, error: errorMensaje } =
					await supabaseServer
						.from('messenger_messages')
						.insert({
							conversation_id: conversacion.id,
							meta_message_id: metaMessageId ?? null,
							direccion: 'inbound',
							contenido: mensaje,
							tipo: 'text'
						})
						.select()
						.single();

				if (errorMensaje) {
					console.error(
						'Error guardando mensaje:',
						errorMensaje
					);

					return json(
						{
							ok: false,
							error: 'No se pudo guardar el mensaje'
						},
						{ status: 500 }
					);
				}

				console.log('✅ MENSAJE GUARDADO EN CRM:', nuevoMensaje.id);
			}
		}

		return json({ ok: true });
	} catch (error) {
		console.error('❌ Error procesando webhook:', error);

		return json(
			{
				ok: false,
				error: 'Petición inválida'
			},
			{ status: 400 }
		);
	}
}
