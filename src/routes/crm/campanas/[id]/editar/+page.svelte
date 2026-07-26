<script>
	import { campanas, guardarCampanas } from '$lib/stores/campanas.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';


	let id = $derived(page.params.id);


	let campana = $derived(
		$campanas.find(
			c => c.id === id
		)
	);


	let nombre = '';
	let descripcion = '';
	let objetivo = '';
	let estado = 'Activa';



	$effect(() => {

		if(campana){

			nombre = campana.nombre;
			descripcion = campana.descripcion;
			objetivo = campana.objetivo;
			estado = campana.estado;

		}

	});



	function guardar(){

		campanas.update(lista => {

			const nuevas = lista.map(c => {

				if(c.id === id){

					return {

						...c,
						nombre,
						descripcion,
						objetivo,
						estado

					};

				}


				return c;

			});


			guardarCampanas(nuevas);


			return nuevas;

		});


		goto(`/crm/campanas/${id}`);

	}

</script>



{#if campana}

<div class="container">

<h1>
	Editar campaña
</h1>


<label>
	Nombre
</label>

<input bind:value={nombre}>


<label>
	Descripción
</label>

<textarea
	rows="4"
	bind:value={descripcion}
></textarea>


<label>
	Objetivo
</label>

<input bind:value={objetivo}>


<label>
	Estado
</label>

<select bind:value={estado}>

	<option>
		Activa
	</option>

	<option>
		Borrador
	</option>

	<option>
		Pausada
	</option>

</select>



<button onclick={guardar}>
	Guardar cambios
</button>


</div>

{/if}



<style>

.container{

	padding:2rem;
	max-width:700px;
	display:flex;
	flex-direction:column;
	gap:15px;

}


input,
textarea,
select{

	padding:12px;
	border-radius:8px;
	border:1px solid #ccc;

}


button{

	padding:12px;
	border-radius:8px;
	cursor:pointer;

}

</style>