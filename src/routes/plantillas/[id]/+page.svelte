<script>

	import { page } from '$app/state';
	import { plantillas } from '$lib/stores/plantillas.js';


	let id = $derived(page.params.id);


	const plantilla = $derived(
		$plantillas.find(
			p => p.id === Number(id)
		)
	);


</script>


{#if plantilla}

	<h1>
		Editar plantilla
	</h1>


	<div class="form">


		<label>
			Nombre
		</label>

		<input 
			value={plantilla.nombre}
		>



		<label>
			Tipo
		</label>

		<input 
			value={plantilla.tipo}
		>



		<label>
			Mensaje
		</label>

		<textarea>{plantilla.texto}</textarea>



		<button>
			Guardar cambios
		</button>


	</div>


{:else}

	<h1>
		Plantilla no encontrada
	</h1>

{/if}



<style>

.form {

	background:white;

	padding:25px;

	border-radius:15px;

	display:flex;

	flex-direction:column;

	gap:15px;

}


input,
textarea {

	padding:12px;

	border-radius:8px;

	border:1px solid #ddd;

}


textarea {

	min-height:150px;

}


button {

	background:#2563eb;

	color:white;

	border:none;

	padding:12px;

	border-radius:8px;

	cursor:pointer;

}

</style>