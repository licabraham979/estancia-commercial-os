<script>
	import { obtenerClientes } from '$lib/stores/clientes.svelte.js';
	import { serviciosStore } from '$lib/stores/catalogo/servicios.svelte.js';
	import { cotizacionesStore } from '$lib/stores/cotizaciones/cotizaciones.svelte.js';
	import Card from '$lib/components/crm/ui/Card.svelte';
	import { page } from '$app/state';


	let clienteId = $state('');
	let servicioId = $state('');
	let cantidad = $state(1);


	let servicioSeleccionado = $derived(
		serviciosStore.servicios.find(
			s => s.id === servicioId
		)
	);


	let total = $derived(
		servicioSeleccionado
			? servicioSeleccionado.precio * cantidad
			: 0
	);


	$effect(() => {

	const id =
		page.url.searchParams.get('servicio');

	if(id){

		servicioId = id;

	}

});

	function guardarCotizacion(){

		if(!clienteId || !servicioSeleccionado){
			return;
		}


		cotizacionesStore.crear({

	clienteId,

	fecha: new Date()
		.toISOString()
		.split('T')[0],

	items:[
		{
			id: crypto.randomUUID(),

			tipo:'servicio',

			nombre: servicioSeleccionado.nombre,

			unidad: servicioSeleccionado.unidad,

			cantidad,

			precio: servicioSeleccionado.precio,

			subtotal: cantidad * servicioSeleccionado.precio
		}
	],

	subtotal: total,

	utilidad: 0,

	descuento: 0,

	isv: 0,

	total,

	estado:'borrador'

});


		alert('Cotización creada');

	}

</script>


<div class="p-6">

<h1 class="text-2xl font-bold mb-6">
	Nueva Cotización
</h1>


<div class="grid gap-4 max-w-xl">


<select
	class="select select-bordered"
	bind:value={clienteId}
>

<option value="">
	Seleccionar cliente
</option>


{#each obtenerClientes() as cliente}

<option value={cliente.id}>
	{cliente.nombre}
</option>

{/each}

</select>



<select
	class="select select-bordered"
	bind:value={servicioId}
>

<option value="">
	Seleccionar servicio
</option>


{#each serviciosStore.servicios as servicio}

<option value={servicio.id}>
	{servicio.nombre}
</option>

{/each}


</select>



<input
	class="input input-bordered"
	type="number"
	min="1"
	bind:value={cantidad}
/>



<Card>

	<h2 class="text-lg font-bold mb-4">
		Resumen de cotización
	</h2>


	{#if servicioSeleccionado}

		<p>
			Servicio:
			<strong>
				{servicioSeleccionado.nombre}
			</strong>
		</p>


		<p>
			Unidad:
			{servicioSeleccionado.unidad}
		</p>


		<p>
			Cantidad:
			{cantidad}
		</p>


		<p>
			Precio:
			L {servicioSeleccionado.precio}
		</p>


		<hr class="my-3">


		<p class="text-xl font-bold">
			TOTAL:
			L {total}
		</p>


	{:else}

		<p class="text-gray-500">
			Selecciona un servicio para calcular.
		</p>


	{/if}

</Card>



<button
	class="btn btn-primary"
	onclick={guardarCotizacion}
>
	Guardar Cotización
</button>


</div>


</div>