<script>
	import { materialesStore } from '$lib/stores/catalogo/materiales.svelte.js';


	let {
		material = null,
		onGuardar
	} = $props();



	let nombre = $state(material?.nombre ?? '');
	let categoria = $state(material?.categoria ?? '');
	let unidad = $state(material?.unidad ?? '');
	let costo = $state(material?.costo ?? 0);
	let desperdicio = $state(material?.desperdicio ?? 0);
	let proveedor = $state(material?.proveedor ?? '');



	function guardar(){

		const datos = {

			nombre,
			categoria,
			unidad,
			costo:Number(costo),
			desperdicio:Number(desperdicio),
			proveedor,
			activo:true

		};


		if(material){

			materialesStore.actualizar(
				material.id,
				datos
			);

		}else{

			materialesStore.crear(
				datos
			);

		}


		onGuardar?.();

	}

</script>


<div class="grid gap-3">


<input
	class="input input-bordered"
	placeholder="Nombre material"
	bind:value={nombre}
/>


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
	placeholder="Costo"
	bind:value={costo}
/>


<input
	class="input input-bordered"
	type="number"
	placeholder="Desperdicio %"
	bind:value={desperdicio}
/>


<input
	class="input input-bordered"
	placeholder="Proveedor"
	bind:value={proveedor}
/>


<button
	class="btn btn-primary"
	onclick={guardar}
>
	{material ? 'Actualizar material' : 'Guardar material'}
</button>

</div>