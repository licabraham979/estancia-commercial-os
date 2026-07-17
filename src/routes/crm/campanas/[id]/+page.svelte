<script>

	import { page } from '$app/state';
	import { campanas } from '$lib/stores/campanas.js';
	import { plantillas } from '$lib/stores/plantillas.js';
	import { goto } from '$app/navigation';


	let id = $derived(page.params.id);


	let campaña = $derived(
		$campanas.find(
			c => c.id === id
		)
	);


	let mensajes = $derived(
		$plantillas.filter(
			p => p.campana === id
		)
	);

	function copiarMensaje(texto = ''){

		navigator.clipboard.writeText(texto);

		alert('Mensaje copiado');

	}

	function editarPlantilla(id = 0){

	console.log('plantilla', id);

	goto(`/crm/campanas/plantillas/${id}`);

}
	function nuevaPlantilla() {
    goto(`/crm/campanas/plantillas/nueva?campana=${id}`);
}
</script>


{#if campaña}

<h1>
	{campaña.nombre}
</h1>


<p>
	{campaña.descripcion}
</p>



<div class="grid">


<div class="panel">

<h3>
	Objetivo
</h3>

<p>
	{campaña.objetivo}
</p>

</div>



<div class="panel">

<h3>
	Estado
</h3>

<p>
	{campaña.estado}
</p>

</div>

<h2>
	Plantillas de mensajes
</h2>

<button class="agregar" onclick={nuevaPlantilla}>
    + Agregar plantilla
</button>

<div class="plantillas">

	{#each mensajes as mensaje}


		<div class="card">


			<h3>
				{mensaje.nombre}
			</h3>


			<span>
				{mensaje.tipo}
			</span>


			<p>
				{mensaje.texto}
			</p>


		<button onclick={() => copiarMensaje(mensaje.texto)}>
			Copiar
		</button>

		<button onclick={() => editarPlantilla(mensaje.id)}>
	Editar
</button>

		
		</div>


	{/each}

</div>

<div class="panel mensaje">

<h3>
	Mensaje
</h3>

<p>
	{campaña.mensaje}
</p>

</div>


</div>




{/if}

<style>
.card button {

	margin-right:10px;

}

.plantillas {

	display:grid;

	grid-template-columns:
	repeat(auto-fit,minmax(280px,1fr));

	gap:20px;

	margin-top:20px;

}


.card {

	background:white;

	padding:20px;

	border-radius:15px;

	box-shadow:0 5px 15px rgba(0,0,0,.08);

}


button {

	background:#111827;

	color:white;

	border:none;

	padding:10px;

	border-radius:8px;

}


.panel {

	background:white;

	padding:25px;

	border-radius:15px;

	margin-top:30px;

}

</style>