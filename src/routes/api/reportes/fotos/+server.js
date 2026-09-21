import { json } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase';

export async function GET({ url }) {
	const cotizacionId = url.searchParams.get('cotizacion_id');

	if (!cotizacionId) {
		return json(
			{ error: 'Falta cotizacion_id' },
			{ status: 400 }
		);
	}

	const { data: fotos, error } = await supabaseServer
		.from('cotizacion_fotos')
		.select('id, url, orden, tipo')
		.eq('cotizacion_id', cotizacionId)
		.eq('tipo', 'proyecto')
		.order('orden', { ascending: true });

	if (error) {
		console.error(
			'Error obteniendo fotos de la cotización:',
			error
		);

		return json(
			{ error: 'No se pudieron cargar las fotos' },
			{ status: 500 }
		);
	}

	return json({
		fotos: fotos ?? []
	});
}
