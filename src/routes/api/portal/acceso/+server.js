import { json } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase';
import { crearAccesoPortal } from '$lib/server/portal';

export async function POST({ request }) {
	try {
		const authHeader = request.headers.get('authorization');

		if (!authHeader?.startsWith('Bearer ')) {
			return json(
				{ error: 'No autorizado.' },
				{ status: 401 }
			);
		}

		const accessToken = authHeader.slice(7);

		const {
			data: { user },
			error: authError
		} = await supabaseServer.auth.getUser(accessToken);

		if (authError || !user) {
			return json(
				{ error: 'Sesión no válida.' },
				{ status: 401 }
			);
		}

		const datos = await request.json();

		const resultado = await crearAccesoPortal(datos);

		return json({
	ok: true,
	portalCliente: resultado.portalCliente,
	cotizacion: resultado.cotizacion,
	esNuevoAcceso: resultado.esNuevoAcceso,
	passwordTemporal: resultado.passwordTemporal
});
	} catch (error) {
		console.error('Error creando acceso de portal:', error);

		return json(
			{
				error:
					error instanceof Error
						? error.message
						: 'No se pudo crear el acceso'
			},
			{ status: 500 }
		);
	}
}
