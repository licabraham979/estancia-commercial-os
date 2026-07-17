<script>
	import { plantillas } from '$lib/stores/plantillas.js';

	let { params } = $props();

	let plantilla = $derived(
		$plantillas.find(
			p => p.id === Number(params.id)
		)
	);

</script>


{#if plantilla}

<div class="container">

	<div class="header">

		<h1>
			{plantilla.nombre}
		</h1>

		<span>
			{plantilla.tipo}
		</span>

	</div>


	<div class="info">

		<p>
			<strong>Campaña:</strong>
			{plantilla.campana}
		</p>


		<p>
			<strong>ID:</strong>
			{params.id}
		</p>

	</div>



	<div class="card">

		<h3>
			Mensaje
		</h3>

		<p>
			{plantilla.texto}
		</p>

	</div>



	<div class="card">

		<h3>
			Variables disponibles
		</h3>


		{#each plantilla.variables as variable}

			<span class="tag">
				{variable}
			</span>

		{/each}

	</div>



	<div class="actions">

		<button>
			Copiar mensaje
		</button>


		<a href={`/crm/campanas/plantillas/${params.id}/editar`}>
	Editar plantilla
</a>
	</div>


</div>


{:else}

<h1>
	Plantilla no encontrada
</h1>

{/if}



<style>

.container{
	padding:2rem;
	max-width:800px;
}


.header{
	display:flex;
	justify-content:space-between;
	align-items:center;
}


.header span{
	background:#222;
	color:white;
	padding:6px 12px;
	border-radius:20px;
}


.info{
	margin-top:20px;
}


.card{
	margin-top:20px;
	padding:20px;
	border-radius:12px;
	background:#f5f5f5;
}


.tag{
	display:inline-block;
	margin:5px;
	padding:6px 10px;
	background:white;
	border-radius:8px;
}


.actions{
	margin-top:25px;
	display:flex;
	gap:15px;
}


button{
	padding:10px 18px;
	border-radius:8px;
	border:none;
	cursor:pointer;
}


</style>