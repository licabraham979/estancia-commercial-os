import { json } from '@sveltejs/kit';
import { crearReporte } from '$lib/server/reportes';

export async function POST({ request }) {
	try {
		const datos = await request.json();

		if (!datos.cotizacion_id) {
			return json(
				{ error: 'Falta cotizacion_id' },
				{ status: 400 }
			);
		}

		if (!datos.cliente_nombre) {
			return json(
				{ error: 'Falta cliente_nombre' },
				{ status: 400 }
			);
		}

		if (!datos.titulo) {
			return json(
				{ error: 'Falta titulo' },
				{ status: 400 }
			);
		}

		const reporte = await crearReporte(datos);

		return json({
			ok: true,
			reporte
		});
	} catch (error) {
		console.error('Error creando reporte:', error);

		return json(
			{
				error:
					error instanceof Error
						? error.message
						: 'No se pudo crear el reporte'
			},
			{ status: 500 }
		);
	}
}
