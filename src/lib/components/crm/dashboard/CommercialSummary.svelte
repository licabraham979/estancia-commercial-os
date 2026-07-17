<script>

import StatCard from './StatCard.svelte';
import { dashboardStore } from '$lib/stores/dashboard.svelte.js';


const stats = $derived([

    {
        title:"Clientes",
        value:dashboardStore.clientesResumen.sinAccion,
        description:"Clientes registrados"
    },

    {
        title:"Nuevos",
        value:dashboardStore.clientesResumen.sinAccion,
        description:"Nuevos contactos"
    },

    {
        title:"Proyectos",
        value:dashboardStore.clientesResumen.sinAccion,
        description:"Clientes con proyecto"
    },

    {
        title:"Sin acción",
        value:dashboardStore.clientesResumen.sinAccion,
        description:"Clientes sin seguimiento"
    }

]);

</script>


<div class="stats">

{#each stats as stat}

    <StatCard {...stat}/>

{/each}

</div>


<style>

.stats{

display:grid;

grid-template-columns:repeat(
auto-fit,
minmax(220px,1fr)
);

gap:var(--space-4);

}

</style>