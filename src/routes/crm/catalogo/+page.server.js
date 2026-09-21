import {
	obtenerCatalogoCompleto,
	obtenerCategorias
} from '$lib/server/catalogo';

import {
	obtenerProveedores
} from '$lib/server/proveedores';

export async function load() {
	const categorias = await obtenerCategorias();
	const articulos = await obtenerCatalogoCompleto();
	const proveedores = await obtenerProveedores();

	return {
		categorias,
		articulos,
		proveedores
	};
}