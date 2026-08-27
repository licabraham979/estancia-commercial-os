import { supabaseServer } from '$lib/server/supabase.js';

export async function load() {
	const [
		{ data: mercados, error: mercadosError },
		{ data: configuraciones, error: configuracionesError },
		{ data: cotizaciones, error: cotizacionesError }
	] = await Promise.all([
		supabaseServer
			.from('mercados')
			.select(
				'id, nombre, codigo_pais, moneda, bandera, activo'
			)
			.eq('activo', true)
			.order('nombre', {
				ascending: true
			}),

		supabaseServer
			.from('mercado_configuracion')
			.select(
				'mercado_id, nombre_comercial, telefono, whatsapp, email, sitio_web, direccion'
			),

		supabaseServer
			.from('cotizaciones')
			.select(
				'id, cliente_nombre, cliente_empresa, titulo, total, moneda, created_at'
			)
			.order('created_at', {
				ascending: false
			})
	]);

	if (mercadosError) {
		console.error(
			'Error cargando mercados:',
			mercadosError
		);
	}

	if (configuracionesError) {
		console.error(
			'Error cargando configuraciones:',
			configuracionesError
		);
	}

	if (cotizacionesError) {
		console.error(
			'Error cargando cotizaciones:',
			cotizacionesError
		);
	}

	return {
		mercados: mercados ?? [],
		configuraciones: configuraciones ?? [],
		cotizaciones: cotizaciones ?? []
	};
}