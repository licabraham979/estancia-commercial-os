import { supabaseServer } from '$lib/server/supabase';

export async function load() {
	const { data: cotizaciones, error } = await supabaseServer
		.from('cotizaciones')
		.select(`
			id,
			cliente_nombre,
			cliente_empresa,
			titulo,
			descripcion,
			estado,
			moneda,
			total,
			forma_pago,
			created_at
		`)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error cargando cotizaciones para reporte:', error);

		return {
			cotizaciones: []
		};
	}

	return {
		cotizaciones: cotizaciones ?? []
	};
}
