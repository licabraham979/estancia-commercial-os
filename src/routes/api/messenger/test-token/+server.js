import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET() {
	const token = env.META_PAGE_ACCESS_TOKEN;

	if (!token) {
		return json(
			{
				ok: false,
				error: 'META_PAGE_ACCESS_TOKEN no está configurado'
			},
			{ status: 500 }
		);
	}

	try {
		const respuesta = await fetch(
			`https://graph.facebook.com/v26.0/me?access_token=${encodeURIComponent(token)}`
		);

		const datos = await respuesta.json();

		if (!respuesta.ok) {
			console.error('Meta rechazó el token:', datos);

			return json(
				{
					ok: false,
					error: 'Meta rechazó el token'
				},
				{ status: 401 }
			);
		}

		return json({
			ok: true,
			meta: {
				id: datos.id ?? null,
				nombre: datos.name ?? null
			}
		});
	} catch (error) {
		console.error('Error comprobando token de Meta:', error);

		return json(
			{
				ok: false,
				error: 'No se pudo conectar con Meta'
			},
			{ status: 500 }
		);
	}
}
