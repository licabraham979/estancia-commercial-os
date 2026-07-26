<script>

	import { obtenerClientes } from '$lib/stores/clientes.svelte.js';
	import { cotizacionesStore } from '$lib/stores/cotizaciones/cotizaciones.svelte.js';


	let {

		servicio,

		onCerrar

	} = $props();



	let clienteId = $state('');

	let cantidad = $state(1);



	let total = $derived(

		(servicio.precio ?? servicio.precioDesde ?? 0) * cantidad

	);



	function guardar(){


		if(!clienteId){

			alert("Selecciona un cliente");

			return;

		}



		cotizacionesStore.crear({

			clienteId,

			fecha:new Date()
				.toISOString()
				.split('T')[0],


			items:[

				{

					id:crypto.randomUUID(),

					tipo:"servicio",

					nombre:servicio.nombre,

					unidad:servicio.unidad,

					cantidad,

					precio:servicio.precio ?? servicio.precioDesde,

					subtotal:total

				}

			],


			subtotal:total,

			utilidad:0,

			descuento:0,

			isv:0,

			total,

			estado:"borrador"

		});


		alert("Cotización creada");


		onCerrar?.();


	}

</script>


<div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-5">


<div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">


<div class="flex justify-between mb-6">

<h2 class="text-2xl font-black">

Cotizar proyecto

</h2>


<button

onclick={()=>onCerrar?.()}

>

✕

</button>

</div>



<div class="mb-5">

<p class="font-bold">

{servicio.nombre}

</p>

<p class="text-gray-500">

L {servicio.precio ?? servicio.precioDesde}

</p>

</div>



<select

class="select select-bordered w-full mb-4"

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



<input

class="input input-bordered w-full"

type="number"

min="1"

bind:value={cantidad}

/>



<div class="text-3xl font-black my-6">

Total:
L {total}

</div>



<button

class="btn btn-primary w-full"

onclick={guardar}

>

Crear Cotización

</button>


</div>

</div>