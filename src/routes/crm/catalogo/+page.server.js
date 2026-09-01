import {
	obtenerCatalogoCompleto,
	obtenerCategorias
} from '$lib/server/catalogo';

export async function load() {
	const [categorias, articulos] = await Promise.all([
		obtenerCategorias(),
		obtenerCatalogoCompleto()
	]);

	return {
		categorias,
		articulos
	};
}