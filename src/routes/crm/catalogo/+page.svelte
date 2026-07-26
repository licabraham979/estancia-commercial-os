<script>
	/** @typedef {import('$lib/types/catalogo').Material} Material */


	import { materialesStore } from '$lib/stores/catalogo/materiales.svelte.js';
	import { serviciosStore } from '$lib/stores/catalogo/servicios.svelte.js';


	import Toolbar from '$lib/components/crm/ui/Toolbar.svelte';
	import Card from '$lib/components/crm/ui/Card.svelte';
	import Modal from '$lib/components/crm/ui/Modal.svelte';


	import MaterialForm from '$lib/components/crm/catalogo/MaterialForm.svelte';
	import ServicioForm from '$lib/components/crm/catalogo/ServicioForm.svelte';
	import CatalogCard from '$lib/components/crm/catalogo/CatalogCard.svelte';
	import CatalogDetail from '$lib/components/crm/catalogo/CatalogDetail.svelte';
	import CotizadorModal from '$lib/components/crm/cotizaciones/CotizadorModal.svelte';


let mostrarModalServicio = $state(false);



let servicioSeleccionado = $state(null);

/**
 * @param {any} servicio
 */
function editarServicio(servicio){

	servicioSeleccionado = servicio;

	mostrarModalServicio = true;

}



function cerrarModalServicio(){

	mostrarModalServicio = false;

	servicioSeleccionado = null;

}



	let pestaña = $state('materiales');

	let mostrarModal = $state(false);


	/** @type {Material|null} */
	let materialSeleccionado = $state(null);



	/**
	 * @param {Material} material
	 */
	function editarMaterial(material){

		materialSeleccionado = material;

		mostrarModal = true;

	}



	function cerrarModal(){

		mostrarModal = false;

		materialSeleccionado = null;

	}

	let servicioDetalle = $state(null);

	let servicioParaCotizar = $state(null);

</script>

<div class="p-6">

	<Toolbar
	titulo="Catálogo Maestro"
	descripcion="Gestión de materiales y servicios comerciales"
	botonTexto="Nuevo Material"
	onNuevo={() => {

	materialSeleccionado = null;

	mostrarModal = true;

}}
/>


	<div class="flex gap-3 mb-6">

		<button
			class="btn"
			class:btn-primary={pestaña === 'materiales'}
			onclick={() => pestaña = 'materiales'}
		>
			Materiales
		</button>


		<button
			class="btn"
			class:btn-primary={pestaña === 'servicios'}
			onclick={() => pestaña = 'servicios'}
		>
			Servicios
		</button>

		<button
	class="btn"
	class:btn-primary={pestaña === 'presentacion'}
	onclick={() => pestaña = 'presentacion'}
>
	Presentación
</button>

		<button
	class="btn btn-primary"
	onclick={() => {

		servicioSeleccionado = null;

		mostrarModalServicio = true;

	}}
>
	Nuevo Servicio
</button>

	</div>



	{#if pestaña === 'materiales'}

		<h2 class="text-xl font-semibold mb-4">
			Materiales
		</h2>


		<div class="overflow-x-auto">

			<Card>
	

			<table class="table">

				<thead>
					<tr>
						<th>Material</th>
						<th>Categoría</th>
						<th>Unidad</th>
						<th>Costo</th>
						<th>Acciones</th>
					</tr>
				</thead>


				<tbody>

					{#each materialesStore.materiales as material}

						<tr>

							<td>
								{material.nombre}
							</td>

							<td>
								{material.categoria}
							</td>

							<td>
								{material.unidad}
							</td>

							<td>
								L {material.costo}
							</td>
							<td>

<button
	class="btn btn-sm"
	onclick={() => editarMaterial(material)}
>
	Editar
</button>


<button
	class="btn btn-sm btn-error"
	onclick={() => materialesStore.eliminar(material.id)}
>
	Eliminar
</button>

</td>

						</tr>

					{/each}

				</tbody>

			</table>
			</Card>

		</div>


		{:else if pestaña === 'servicios'}

	<h2 class="text-xl font-semibold mb-4">
		Servicios comerciales
	</h2>

	<div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

	{#each serviciosStore.servicios as servicio}

		<CatalogCard

	servicio={servicio}

	onEditar={editarServicio}

	onVer={(/** @type {any} */ servicio)=>{

		servicioDetalle = servicio;

	}}

	onCotizar={(/** @type {any} */ servicio)=>{

		servicioParaCotizar = servicio;
	}}

/>

	{/each}

</div>
		{:else}

<h2 class="text-xl font-semibold mb-6">
	Catálogo Comercial
</h2>


<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{#each serviciosStore.servicios as servicio}


<Card>

	<div class="space-y-4">


	<h3 class="text-2xl font-bold">
		{servicio.nombre}
	</h3>


	<p class="text-gray-600">
		{servicio.descripcion ?? 
		"Solución profesional para tu negocio"}
	</p>


	<div class="text-3xl font-bold text-emerald-600">

		L {servicio.precio}

		<span class="text-base text-gray-500">
			/ {servicio.unidad}
		</span>

	</div>


	<button
	class="btn btn-primary w-full"
	onclick={() =>
		location.href =
		`/crm/cotizaciones/nueva?servicio=${servicio.id}`
	}
>
	Solicitar cotización
</button>


	</div>


</Card>

{#if servicioDetalle}

	<CatalogDetail

		servicio={servicioDetalle}

		onCerrar={() => servicioDetalle = null}

	/>

{/if}

{/each}

</div>


	{/if}



	<Modal
	titulo="Nuevo Material"
	abierto={mostrarModal}
	onCerrar={() => mostrarModal = false}
>

	<MaterialForm
	material={materialSeleccionado}
	onGuardar={cerrarModal}
/>

</Modal>

<Modal
	titulo="Nuevo Servicio"
	abierto={mostrarModalServicio}
	onCerrar={cerrarModalServicio}
>

	<ServicioForm
		servicio={servicioSeleccionado}
		onGuardar={cerrarModalServicio}
	/>

</Modal>

{#if servicioParaCotizar}

<CotizadorModal

	servicio={servicioParaCotizar}

	onCerrar={()=>servicioParaCotizar=null}

/>

{/if}
</div>