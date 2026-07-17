<script>

import { actividadesStore } from '$lib/stores/actividades.svelte.js';

import Card from '$lib/components/crm/ui/Card.svelte';


</script>


<div class="grid">


<Card>

<h3>
Pendientes
</h3>

<strong>
{actividadesStore.totalPendientes}
</strong>

</Card>



<Card>

<h3>
Completadas
</h3>

<strong>
{actividadesStore.totalCompletadas}
</strong>

</Card>



<Card>

<h3>
Progreso
</h3>

<strong>
{actividadesStore.progreso}%
</strong>

</Card>


</div>



<style>

.grid{

display:grid;

grid-template-columns:
repeat(auto-fit,minmax(180px,1fr));

gap:16px;

}


h3{

font-size:14px;

opacity:.6;

margin:0;

}


strong{

font-size:32px;

display:block;

margin-top:10px;

}


</style>