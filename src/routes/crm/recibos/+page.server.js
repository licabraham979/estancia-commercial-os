import { supabaseServer } from '$lib/server/supabase.js';

export async function load() {
	const { data: recibos, error } = await supabaseServer
		.from('recibos')
		.select(
			'id, folio, fecha_pago, cliente_nombre, cliente_empresa, concepto, monto, moneda, metodo_pago, referencia, estado, cotizacion_id'
		)
		.order('fecha_pago', {
			ascending: false
		});

	if (error) {
		console.error('Error cargando recibos:', error);

		return {
			recibos: [],
			error: 'No se pudieron cargar los recibos.'
		};
	}

	return {
		recibos: recibos ?? [],
		error: ''
	};
}
