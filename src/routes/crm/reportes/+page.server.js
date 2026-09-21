import { supabaseServer } from '$lib/server/supabase';

export async function load() {
	const { data: reportes, error } = await supabaseServer
		.from('reportes')
		.select('*')
		.order('fecha', { ascending: false })
		.order('created_at', { ascending: false });

	console.log('================ REPORTES DEBUG ================');
	console.log('DATA:', reportes);
	console.log('ERROR:', error);
	console.log('=================================================');

	if (error) {
		console.error('Error cargando reportes:', error);

		return {
			reportes: []
		};
	}

	const cotizacionIds = [
		...new Set(
			(reportes ?? [])
				.map((reporte) => reporte.cotizacion_id)
				.filter(Boolean)
		)
	];

	/** @type {{ id: string, cliente_nombre: string, cliente_empresa: string | null, titulo: string, descripcion: string | null }[]} */
let cotizaciones = [];

	if (cotizacionIds.length > 0) {
		const { data, error: cotizacionesError } = await supabaseServer
			.from('cotizaciones')
			.select(`
				id,
				cliente_nombre,
				cliente_empresa,
				titulo,
				descripcion
			`)
			.in('id', cotizacionIds);

		if (cotizacionesError) {
			console.error('Error cargando cotizaciones:', cotizacionesError);
		} else {
			cotizaciones = data ?? [];
		}
	}

	const cotizacionesMap = new Map(
		cotizaciones.map((cotizacion) => [
			cotizacion.id,
			cotizacion
		])
	);

	const reportesConContexto = (reportes ?? []).map((reporte) => ({
		...reporte,
		cotizacion: reporte.cotizacion_id
			? cotizacionesMap.get(reporte.cotizacion_id) ?? null
			: null
	}));

	return {
		reportes: reportesConContexto
	};
}