<script>
	import Toolbar from '$lib/components/crm/ui/Toolbar.svelte';
	import Card from '$lib/components/crm/ui/Card.svelte';
	import ArticuloForm from '$lib/components/crm/catalogo/ArticuloForm.svelte';
	import { supabase } from '$lib/supabase/client';

let mostrarFormularioArticulo = $state(false);
/** @type {any} */
let articuloSeleccionado = $state(null);

function nuevoArticulo() {
	articuloSeleccionado = null;
	mostrarFormularioArticulo = true;
}

function cerrarFormularioArticulo() {
	mostrarFormularioArticulo = false;
	articuloSeleccionado = null;
}
/**
 * @param {any} articulo
 */
async function desactivarArticulo(articulo) {
	const confirmar = confirm(
		`¿Desactivar "${articulo.nombre}"?\n\nEl artículo dejará de aparecer en el catálogo activo, pero no se eliminará del sistema.`
	);

	if (!confirmar) return;

	const { error } = await supabase
		.from('catalogo_articulos')
		.update({ activo: false })
		.eq('id', articulo.id);

	if (error) {
		console.error(error);
		alert('No fue posible desactivar el artículo.');
		return;
	}

	location.reload();
}

	let { data } = $props();

	let pestaña = $state('articulos');
	let busqueda = $state('');
	let categoriaSeleccionada = $state('todas');

	let articulos = $derived(data.articulos ?? []);
	let categorias = $derived(data.categorias ?? []);
	let proveedores = $derived(data.proveedores ?? []);
	console.log('DATA CATALOGO EN CLIENTE:', data);
console.log('CATEGORIAS EN CLIENTE:', data.categorias);
	
	let articulosFiltrados = $derived(
		articulos.filter((articulo) => {
			const coincideBusqueda =
				!busqueda.trim() ||
				articulo.nombre
					.toLowerCase()
					.includes(busqueda.toLowerCase()) ||
				(articulo.descripcion ?? '')
					.toLowerCase()
					.includes(busqueda.toLowerCase());

			const coincideCategoria =
				categoriaSeleccionada === 'todas' ||
				articulo.categoria_id === categoriaSeleccionada;

			return coincideBusqueda && coincideCategoria;
		})
	);

	/**
 * @param {any} articulo
 */
function nombreCategoria(articulo) {
	return articulo.categoria?.nombre ?? 'Sin categoría';
}


/**
 * @param {any} variante
 */
function resumenVariante(variante) {
	const medidas =
		variante.ancho && variante.alto
			? `${variante.ancho} × ${variante.alto} ${variante.unidad_medida ?? ''}`
			: '';

	return [variante.nombre, medidas]
		.filter(Boolean)
		.join(' · ');
}


</script>

<div class="p-6 space-y-6">

<Toolbar
	titulo="Catálogo Maestro"
	descripcion="Materiales, servicios, mano de obra, herramientas y proveedores"
	botonTexto="Nuevo artículo"
	onNuevo={nuevoArticulo}
/>

<div class="flex flex-wrap gap-3">

	<button
		class="btn"
		class:btn-primary={pestaña === 'articulos'}
		onclick={() => pestaña = 'articulos'}
	>
		Artículos
	</button>

	<button
		class="btn"
		class:btn-primary={pestaña === 'proveedores'}
		onclick={() => pestaña = 'proveedores'}
	>
		Proveedores
	</button>

	<button
		class="btn"
		class:btn-primary={pestaña === 'plantillas'}
		onclick={() => pestaña = 'plantillas'}
	>
		Plantillas
	</button>

</div>

{#if pestaña === 'articulos'}

	<Card>

		<div class="p-5 space-y-5">

			<div class="flex flex-col lg:flex-row gap-3">

				<input
					class="input input-bordered flex-1"
					placeholder="Buscar artículo..."
					bind:value={busqueda}
				/>

				<select
					class="select select-bordered"
					bind:value={categoriaSeleccionada}
				>
					<option value="todas">
						Todas las categorías
					</option>
					
					{#each categorias as categoria}

						<option value={categoria.id}>
							{categoria.nombre}
						</option>

					{/each}

				</select>

			</div>

			<div class="text-sm text-gray-500">
				{articulosFiltrados.length}
				{articulosFiltrados.length === 1 ? ' artículo' : ' artículos'}
			</div>

		</div>

	</Card>


	{#if articulosFiltrados.length === 0}

		<Card>

			<div class="p-12 text-center">

				<div class="text-5xl mb-4">
					📦
				</div>

				<h2 class="text-xl font-bold">
					No hay artículos
				</h2>

				<p class="text-gray-500 mt-2">
					Crea el primer artículo del catálogo maestro.
				</p>

			</div>

		</Card>

	{:else}

		<div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

			{#each articulosFiltrados as articulo}

				<Card>

					<div class="p-6 space-y-5">

						<div class="flex items-start justify-between gap-3">

							<div>

								<span class="badge badge-success mb-2">
									{nombreCategoria(articulo)}
								</span>

								<h2 class="text-2xl font-black">
									{articulo.nombre}
								</h2>

							</div>

							<span class="badge badge-outline">
								{articulo.tipo}
							</span>

						</div>


						{#if articulo.descripcion}

							<p class="text-gray-500">
								{articulo.descripcion}
							</p>

						{/if}


						<div>

							<div class="flex justify-between items-center mb-3">

								<h3 class="font-bold">
									Variantes
								</h3>

								<span class="text-sm text-gray-400">
									{articulo.variantes?.length ?? 0}
								</span>

							</div>


							{#if articulo.variantes?.length}

								<div class="space-y-2">

									{#each articulo.variantes as variante}

										<div class="rounded-xl border border-gray-200 p-3">

											<div class="font-semibold">
												{resumenVariante(variante)}
											</div>

											<div class="text-sm text-gray-500 mt-1">

												Unidad:
												{variante.unidad}

											</div>

										</div>

									{/each}

								</div>

							{:else}

								<div class="text-sm text-gray-400">
									Sin variantes registradas.
								</div>

							{/if}

						</div>


						<div class="flex gap-2">

	<button
		class="btn btn-outline flex-1"
		onclick={() => {
			articuloSeleccionado = articulo;
			mostrarFormularioArticulo = true;
		}}
	>
		Editar
	</button>

	<button
		class="btn btn-error btn-outline"
		onclick={() => desactivarArticulo(articulo)}
	>
		Desactivar
	</button>

	<button
		class="btn btn-primary flex-1"
		onclick={() => {
			alert(
				`Próximamente: cotizar ${articulo.nombre}`
			);
		}}
	>
		Cotizar
	</button>

</div>

					</div>

				</Card>

			{/each}

		</div>

	{/if}


{:else if pestaña === 'proveedores'}

	<Card>
	<div class="p-5 space-y-5">

		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

			<div>
				<h2 class="text-2xl font-bold">
					Proveedores
				</h2>

				<p class="text-sm text-gray-500 mt-1">
					Proveedores registrados y relacionados con tu catálogo.
				</p>
			</div>

			<a
				class="btn btn-primary"
				href="/crm/proveedores/nuevo"
			>
				+ Nuevo proveedor
			</a>

		</div>

		<div class="text-sm text-gray-500">
			{proveedores.length}
			{proveedores.length === 1 ? ' proveedor' : ' proveedores'}
		</div>

	</div>
</Card>


{#if proveedores.length === 0}

	<Card>

		<div class="p-12 text-center">

			<div class="text-5xl mb-4">
				🏢
			</div>

			<h2 class="text-xl font-bold">
				No hay proveedores
			</h2>

			<p class="text-gray-500 mt-2">
				Agrega tu primer proveedor para relacionarlo con los productos del catálogo.
			</p>

			<a
				class="btn btn-primary mt-5"
				href="/crm/proveedores/nuevo"
			>
				+ Agregar proveedor
			</a>

		</div>

	</Card>

{:else}

	<div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

		{#each proveedores as proveedor}

			<Card>

				<div class="p-6 space-y-4">

					<div class="flex items-start justify-between gap-3">

						<div>

							<div class="text-3xl mb-2">
								🏢
							</div>

							<h3 class="text-xl font-bold">
								{proveedor.nombre}
							</h3>

						</div>

						{#if proveedor.categoria}

							<span class="badge badge-outline">
								{proveedor.categoria}
							</span>

						{/if}

					</div>


					<div class="space-y-2 text-sm text-gray-600">

						{#if proveedor.telefono}

							<div>
								📞 {proveedor.telefono}
							</div>

						{/if}

						{#if proveedor.whatsapp}

							<div>
								💬 {proveedor.whatsapp}
							</div>

						{/if}

						{#if proveedor.email}

							<div class="truncate">
								✉️ {proveedor.email}
							</div>

						{/if}

					</div>


					<div class="border-t pt-4">

						<div class="text-sm text-gray-500">
							Productos relacionados
						</div>

						<div class="text-lg font-bold">
							Próximamente
						</div>

					</div>


					<a
						class="btn btn-outline w-full"
						href={`/crm/proveedores/${proveedor.id}`}
					>
						Ver proveedor
					</a>

				</div>

			</Card>

		{/each}

	</div>

{/if}

{:else}

	<Card>

		<div class="p-10 text-center">

			<div class="text-5xl mb-4">
				📋
			</div>

			<h2 class="text-xl font-bold">
				Plantillas de cotización
			</h2>

			<p class="text-gray-500 mt-2">
				Aquí aparecerán las plantillas creadas automáticamente desde las cotizaciones.
			</p>

		</div>

	</Card>

{/if}
{#if mostrarFormularioArticulo}

	<div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

		<div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

			<div class="p-6 border-b flex justify-between items-center">

				<div>
					<h2 class="text-2xl font-black">
						{articuloSeleccionado
							? 'Editar artículo'
							: 'Nuevo artículo'}
					</h2>

					<p class="text-sm text-gray-500">
						Define el artículo y sus variantes.
					</p>
				</div>

				<button
					class="btn btn-sm"
					onclick={cerrarFormularioArticulo}
				>
					✕
				</button>

			</div>

			<div class="p-6">

				<ArticuloForm
	categorias={categorias}
	proveedores={proveedores}
	articulo={articuloSeleccionado}
	onGuardar={() => {
		cerrarFormularioArticulo();
		location.reload();
	}}
	onCancelar={cerrarFormularioArticulo}
/>

			</div>

		</div>

	</div>

{/if}
</div>
