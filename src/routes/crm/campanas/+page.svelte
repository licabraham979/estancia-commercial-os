<script>
	import { campanas } from '$lib/stores/campanas.js';
	import CampanaCard from '$lib/components/crm/campanas/CampanaCard.svelte';
	import { goto } from '$app/navigation';


function nuevaCampana(){

	goto('/crm/campanas/nueva');

}
</script>


<h1>
	Campañas
</h1>

<button onclick={nuevaCampana}>
	+ Nueva campaña
</button>
<div class="grid">

	{#each $campanas as campaña}

		<CampanaCard
			id={campaña.id}
			nombre={campaña.nombre}
			descripcion={campaña.descripcion}
			estado={campaña.estado}
			clientes={campaña.clientes}
		/>

	{/each}

</div>


<style>

.grid {

	display:grid;

	grid-template-columns:
	repeat(auto-fit,minmax(280px,1fr));

	gap:20px;

}

</style>