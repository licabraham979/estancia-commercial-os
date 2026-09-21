import { supabaseServer } from '$lib/server/supabase';

/**
 * Obtiene todos los reportes.
 */
export async function obtenerReportes() {
	const { data, error } = await supabaseServer
		.from('reportes')
		.select('*')
		.order('fecha', { ascending: false })
		.order('created_at', { ascending: false });

	if (error) throw error;

	return data ?? [];
}

/**
 * Obtiene un reporte por ID.
 *
 * @param {string} id
 */
export async function obtenerReporte(id) {
	const { data, error } = await supabaseServer
		.from('reportes')
		.select('*')
		.eq('id', id)
		.single();

	if (error) throw error;

	return data;
}

/**
 * Crea un nuevo reporte.
 *
 * @param {Object} datos
 */
export async function crearReporte(datos) {
	const { data, error } = await supabaseServer
		.from('reportes')
		.insert(datos)
		.select()
		.single();

	if (error) throw error;

	return data;
}

/**
 * Actualiza un reporte existente.
 *
 * @param {string} id
 * @param {Object} datos
 */
export async function actualizarReporte(id, datos) {
	const { data, error } = await supabaseServer
		.from('reportes')
		.update(datos)
		.eq('id', id)
		.select()
		.single();

	if (error) throw error;

	return data;
}

/**
 * Elimina un reporte.
 *
 * @param {string} id
 */
export async function eliminarReporte(id) {
	const { error } = await supabaseServer
		.from('reportes')
		.delete()
		.eq('id', id);

	if (error) throw error;

	return true;
}
