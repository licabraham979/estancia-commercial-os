import { supabaseServer } from '$lib/server/supabase';

/**
 * Obtiene las categorías activas del catálogo.
 */
export async function obtenerCategorias() {
	const { data, error } = await supabaseServer
		.from('catalogo_categorias')
		.select('*')
		.eq('activo', true)
		.order('nombre');

	if (error) throw error;

	return data ?? [];
}

/**
 * Obtiene artículos activos junto con su categoría.
 */
export async function obtenerArticulos() {
	const { data, error } = await supabaseServer
		.from('catalogo_articulos')
		.select(`
			*,
			categoria:catalogo_categorias(
				id,
				nombre
			)
		`)
		.eq('activo', true)
		.order('nombre');

	if (error) throw error;

	return data ?? [];
}

/**
 * Obtiene variantes activas de un artículo.
 * @param {string} articuloId
 */
export async function obtenerVariantes(articuloId) {
	const { data, error } = await supabaseServer
		.from('catalogo_variantes')
		.select('*')
		.eq('articulo_id', articuloId)
		.eq('activo', true)
		.order('nombre');

	if (error) throw error;

	return data ?? [];
}

/**
 * Obtiene el catálogo completo preparado para el cotizador.
 */
export async function obtenerCatalogoCompleto() {
	const { data, error } = await supabaseServer
		.from('catalogo_articulos')
		.select(`
			id,
			nombre,
			descripcion,
			tipo,
			categoria_id,
			categoria:catalogo_categorias(
				id,
				nombre
			),
			variantes:catalogo_variantes(
	id,
	nombre,
	descripcion,
	unidad,
	ancho,
	alto,
	unidad_medida,
	precio,
	atributos,
	activo,
	proveedores:catalogo_proveedor_variantes(
		id,
		proveedor_id,
		precio_compra,
		moneda,
		notas,
		activo
	)
)
		`)
		.eq('activo', true)
		.order('nombre');

	if (error) throw error;

	return (data ?? []).map((articulo) => ({
		...articulo,
		variantes: (articulo.variantes ?? [])
			.filter((variante) => variante.activo)
			.sort((a, b) =>
				a.nombre.localeCompare(b.nombre)
			)
	}));
}