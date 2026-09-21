import { supabaseServer } from '$lib/server/supabase';

/**
 * Obtiene proveedores activos.
 */
export async function obtenerProveedores() {
	const { data, error } = await supabaseServer
		.from('proveedores')
		.select(`
			id,
			nombre,
			telefono,
			whatsapp,
			email,
			categoria,
			activo
		`)
		.eq('activo', true)
		.order('nombre');

	if (error) throw error;

	return data ?? [];
}
