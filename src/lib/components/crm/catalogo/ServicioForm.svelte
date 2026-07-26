<script>
	import { serviciosStore } from '$lib/stores/catalogo/servicios.svelte.js';


	let {
		servicio = null,
		onGuardar
	} = $props();


	let nombre = $state(servicio?.nombre ?? '');
	let descripcion = $state(servicio?.descripcion ?? '');
	let categoria = $state(servicio?.categoria ?? '');
	let unidad = $state(servicio?.unidad ?? '');
	let precio = $state(servicio?.precio ?? 0);

	let tiempo = $state(servicio?.tiempo ?? '');

	let rangoPrecio = $state(servicio?.rangoPrecio ?? '');

	let incluyeTexto = $state(
		servicio?.incluye?.join(', ') ?? ''
	);


	/**
	 * @param {string} texto
	 */
	function convertirIncluye(texto){

		return texto
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean);

	}


	function guardar(){

		const datos = {

			nombre,

			descripcion,

			categoria,

			unidad,

			precio:Number(precio),

			tiempo,

			rangoPrecio,

			incluye: convertirIncluye(incluyeTexto),

			activo:true,

			imagen: ''

		};


		if(servicio){

			serviciosStore.actualizar(
				servicio.id,
				datos
			);

		}else{

			serviciosStore.crear(
				datos
			);

		}


		onGuardar?.();

	}

</script>

<div class="grid gap-3">


<input
	class="input input-bordered"
	placeholder="Nombre servicio"
	bind:value={nombre}
/>

<textarea
	class="textarea textarea-bordered"
	placeholder="Descripción comercial"
	bind:value={descripcion}
></textarea>

<input
	class="input input-bordered"
	placeholder="Categoría"
	bind:value={categoria}
/>


<input
	class="input input-bordered"
	placeholder="Unidad"
	bind:value={unidad}
/>


<input
	class="input input-bordered"
	type="number"
	placeholder="Precio"
	bind:value={precio}
/>

<input
	class="input input-bordered"
	placeholder="Rango de precio"
	bind:value={rangoPrecio}
/>


<input
	class="input input-bordered"
	placeholder="Tiempo de ejecución"
	bind:value={tiempo}
/>


<textarea
	class="textarea textarea-bordered"
	placeholder="Incluye (separado por comas)"
	bind:value={incluyeTexto}
></textarea>


<button
	class="btn btn-primary"
	onclick={guardar}
>
	{servicio ? 'Actualizar servicio' : 'Guardar servicio'}
</button>


</div>