<script>
	import { campanas, guardarCampanas } from '$lib/stores/campanas.js';
	import { goto } from '$app/navigation';


	let nombre = '';
	let descripcion = '';
	let objetivo = '';
	let estado = 'Activa';


	function crear(){

		const nueva = {

			id: Date.now().toString(),

			nombre,
			descripcion,
			estado,
			clientes: 0,
			objetivo,
			mensaje: ''

		};


		campanas.update(lista => {

			const nuevas = [
				...lista,
				nueva
			];


			guardarCampanas(nuevas);


			return nuevas;

		});


		goto('/crm/campanas');

	}

</script>


<div class="container">

<h1>
	Nueva campaña
</h1>


<label>
	Nombre
</label>

<input
	bind:value={nombre}
	placeholder="Ej: Clientes nuevos"
/>


<label>
	Descripción
</label>

<textarea
	rows="4"
	bind:value={descripcion}
	placeholder="Describe la campaña..."
></textarea>


<label>
	Objetivo
</label>

<input
	bind:value={objetivo}
	placeholder="Ej: Generar primeras cotizaciones"
/>


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



<button onclick={crear}>
	Guardar campaña
</button>


</div>



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