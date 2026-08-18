import { error } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase';

export async function load({ params }) {
	const { data: propuesta, error: errorPropuesta } = await supabaseServer
		.from('cotizaciones')
		.select('*')
		.eq('id', params.id)
		.single();

	if (errorPropuesta || !propuesta) {
		console.error('Error cargando propuesta:', errorPropuesta);

		throw error(404, 'Propuesta no encontrada');
	}

	const { data: opciones, error: errorOpciones } = await supabaseServer
		.from('cotizacion_opciones')
		.select('*')
		.eq('cotizacion_id', propuesta.id)
		.order('orden', { ascending: true });

	if (errorOpciones) {
		console.error('Error cargando opciones:', errorOpciones);

		throw error(500, 'No se pudieron cargar las opciones');
	}

	const { data: fotos, error: errorFotos } = await supabaseServer
		.from('cotizacion_fotos')
		.select('*')
		.eq('cotizacion_id', propuesta.id)
		.order('orden', { ascending: true });

	if (errorFotos) {
		console.error('Error cargando fotos:', errorFotos);

		throw error(500, 'No se pudieron cargar las imágenes');
	}

	return {
		propuesta,
		opciones: opciones ?? [],
		fotos: fotos ?? []
	};
}