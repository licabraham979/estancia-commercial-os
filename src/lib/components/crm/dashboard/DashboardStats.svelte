<script>
    import StatCard from './StatCard.svelte';
    import { dashboardStore } from '$lib/stores/dashboard.svelte.js';

    const stats = $derived([

    {
        title: "Pendientes",
        value: dashboardStore.resumen.pendientes,
        description: "Actividades por realizar"
    },

    {
        title: "Completadas",
        value: dashboardStore.resumen.completadas,
        description: "Actividades terminadas"
    },

    {
        title: "Progreso",
        value: `${dashboardStore.resumen.progreso}%`,
        description: "Avance del día"
    },

    {
        title: "Críticas",
        value: dashboardStore.resumen.prioridadAlta,
        description: "Prioridad alta"
    }

]);

</script>


<div class="stats">

{#each stats as stat}

    <StatCard {...stat}/>

{/each}

</div>



<style>

.stats {

    display:grid;

    grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));

    gap:var(--space-4);

    transition: .2s ease;

}

.card:hover {

    transform: translateY(-2px);

    box-shadow: var(--shadow);

}

</style>