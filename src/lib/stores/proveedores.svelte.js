import { supabase } from '$lib/supabase/client';

/**
 * @typedef {Object} Proveedor
 * @property {string} id
 * @property {string} nombre
 * @property {string|null} telefono
 * @property {string|null} whatsapp
 * @property {string|null} email
 * @property {string|null} direccion
 * @property {string|null} sitio_web
 * @property {string|null} notas
 * @property {string|null} categoria
 * @property {string|null} productos
 * @property {string|null} condiciones_pago
 * @property {string|null} tiempo_entrega
 * @property {boolean} activo
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Obtener todos los proveedores activos.
 *
 * @returns {Promise<Proveedor[]>}
 */
export async function obtenerProveedores() {
	const { data, error } = await supabase
		.from('proveedores')
		.select('*')
		.eq('activo', true)
		.order('nombre');

	if (error) {
		console.error('Error cargando proveedores:', error);
		return [];
	}

	return data ?? [];
}

/**
 * Obtener un proveedor por ID.
 *
 * @param {string} id
 * @returns {Promise<Proveedor|null>}
 */
export async function obtenerProveedor(id) {
	const { data, error } = await supabase
		.from('proveedores')
		.select('*')
		.eq('id', id)
		.eq('activo', true)
		.single();

	if (error) {
		console.error('Error cargando proveedor:', error);
		return null;
	}

	return data;
}

/**
 * Crear un proveedor.
 *
 * @param {Partial<Proveedor>} datos
 * @returns {Promise<Proveedor|null>}
 */
export async function crearProveedor(datos) {
	if (!datos.nombre?.trim()) {
		console.warn('No se puede crear un proveedor sin nombre.');
		return null;
	}

	const { data, error } = await supabase
		.from('proveedores')
		.insert({
			nombre: datos.nombre.trim(),
			telefono: datos.telefono?.trim() || null,
			whatsapp: datos.whatsapp?.trim() || null,
			email: datos.email?.trim() || null,
			direccion: datos.direccion?.trim() || null,
			sitio_web: datos.sitio_web?.trim() || null,
			notas: datos.notas?.trim() || null,
			categoria: datos.categoria?.trim() || null,
			productos: datos.productos?.trim() || null,
			condiciones_pago: datos.condiciones_pago?.trim() || null,
			tiempo_entrega: datos.tiempo_entrega?.trim() || null,
			activo: true
		})
		.select()
		.single();

	if (error) {
		console.error('Error creando proveedor:', error);
		return null;
	}

	return data;
}

/**
 * Actualizar un proveedor.
 *
 * @param {string} id
 * @param {Partial<Proveedor>} datos
 * @returns {Promise<Proveedor|null>}
 */
export async function actualizarProveedor(id, datos) {
	const { data, error } = await supabase
		.from('proveedores')
		.update({
			nombre: datos.nombre?.trim(),
			telefono: datos.telefono?.trim() || null,
			whatsapp: datos.whatsapp?.trim() || null,
			email: datos.email?.trim() || null,
			direccion: datos.direccion?.trim() || null,
			sitio_web: datos.sitio_web?.trim() || null,
			notas: datos.notas?.trim() || null,
			categoria: datos.categoria?.trim() || null,
			productos: datos.productos?.trim() || null,
			condiciones_pago: datos.condiciones_pago?.trim() || null,
			tiempo_entrega: datos.tiempo_entrega?.trim() || null,
			updated_at: new Date().toISOString()
		})
		.eq('id', id)
		.select()
		.single();

	if (error) {
		console.error('Error actualizando proveedor:', error);
		return null;
	}

	return data;
}

/**
 * Desactivar un proveedor.
 *
 * No eliminamos físicamente el registro.
 *
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function eliminarProveedor(id) {
	const { error } = await supabase
		.from('proveedores')
		.update({
			activo: false,
			updated_at: new Date().toISOString()
		})
		.eq('id', id);

	if (error) {
		console.error('Error desactivando proveedor:', error);
		return false;
	}

	return true;
}
