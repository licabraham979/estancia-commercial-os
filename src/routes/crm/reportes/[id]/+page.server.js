import { error } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/supabase';

export async function load({ params }) {
	const { data: reporte, error: reporteError } = await supabaseServer
		.from('reportes')
		.select('*')
		.eq('id', params.id)
		.single();

	if (reporteError || !reporte) {
		console.error('Error cargando reporte:', reporteError);

		throw error(404, 'Reporte no encontrado');
	}

	let cotizacion = null;

	if (reporte.cotizacion_id) {
		const { data, error: cotizacionError } = await supabaseServer
			.from('cotizaciones')
			.select(`
				id,
				cliente_nombre,
				cliente_empresa,
				cliente_whatsapp,
				cliente_email,
				titulo,
				descripcion
			`)
			.eq('id', reporte.cotizacion_id)
			.single();

		if (cotizacionError) {
			console.error(
				'Error cargando cotización del reporte:',
				cotizacionError
			);
		} else {
			cotizacion = data;
		}
	}

	return {
		reporte: {
			...reporte,
			cotizacion
		}
	};
}
