<script>
	import { plantillas } from '$lib/stores/plantillas.js';
	import { goto } from '$app/navigation';


	let nombre = '';
	import { page } from '$app/state';

    let campana = $derived(page.url.searchParams.get('campana') ?? '');
	let tipo = 'WhatsApp';
	let texto = '';


	function crear(){

		const nueva = {

			id: Date.now(),

			campana,
			nombre,
			tipo,
			texto

		};


		plantillas.update(lista => [

			...lista,
			nueva

		]);


		goto(`/crm/campanas/plantillas/${nueva.id}`);

	}

    function nuevaPlantilla(){

    goto('/crm/campanas/plantillas/nueva');

}

</script>


<div class="container">

<h1>
	Nueva plantilla
</h1>


<label>
	Nombre
</label>

<input 
	bind:value={nombre}
	placeholder="Ej: Día 9 - Último contacto"
/>



<label>
	Campaña
</label>

<select bind:value={campana}>

	<option value="clientes-inactivos">
		Clientes inactivos
	</option>

	<option value="clientes-nuevos">
		Clientes nuevos
	</option>

</select>



<label>
	Canal
</label>

<select bind:value={tipo}>

	<option>
		WhatsApp
	</option>

	<option>
		Email
	</option>

</select>



<label>
	Mensaje
</label>


<textarea
	rows="6"
	bind:value={texto}
	placeholder="Escribe el mensaje..."
></textarea>



<button onclick={crear}>
	Guardar plantilla
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