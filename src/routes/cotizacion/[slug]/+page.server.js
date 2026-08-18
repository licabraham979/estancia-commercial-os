import { error } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase.js';

export async function load({ params }) {
	const { data: cotizacion, error: cotizacionError } = await supabaseServer
		.from('cotizaciones')
		.select('*')
		.eq('slug', params.slug)
		.maybeSingle();

	if (cotizacionError) {
		console.error('Error cargando cotización:', cotizacionError);
		throw error(500, 'No se pudo cargar la cotización');
	}

	if (!cotizacion) {
		throw error(404, 'Cotización no encontrada');
	}

	const { data: opciones, error: opcionesError } = await supabaseServer
		.from('cotizacion_opciones')
		.select('*')
		.eq('cotizacion_id', cotizacion.id)
		.order('orden', { ascending: true });

	if (opcionesError) {
		console.error('Error cargando opciones:', opcionesError);
		throw error(500, 'No se pudieron cargar las opciones');
	}

	const { data: fotos, error: fotosError } = await supabaseServer
		.from('cotizacion_fotos')
		.select('*')
		.eq('cotizacion_id', cotizacion.id)
		.order('orden', { ascending: true });

	if (fotosError) {
		console.error('Error cargando fotos:', fotosError);
		throw error(500, 'No se pudieron cargar las imágenes');
	}

	return {
		cotizacion,
		opciones: opciones ?? [],
		fotos: fotos ?? []
	};
}
