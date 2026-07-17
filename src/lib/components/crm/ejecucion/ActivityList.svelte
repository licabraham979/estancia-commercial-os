<script>

import { actividadesStore } from '$lib/stores/actividades.svelte.js';

import ActivityCard from './ActivityCard.svelte';

</script>


<section>

<h2>
⚡ Prioridad Alta
</h2>


{#each actividadesStore.prioridadAlta as actividad (actividad.id)}

<ActivityCard {actividad}/>

{/each}


</section>



<section>

<h2>
📋 Pendientes
</h2>


{#each actividadesStore.pendientes as actividad (actividad.id)}

<ActivityCard {actividad}/>

{/each}


</section>



<section>

<h2>
✅ Completadas
</h2>


{#each actividadesStore.completadas as actividad (actividad.id)}

<ActivityCard {actividad}/>

{/each}


</section>

<style>
    section{

margin-bottom:30px;

}


h2{

font-size:18px;

margin-bottom:14px;

}
</style>