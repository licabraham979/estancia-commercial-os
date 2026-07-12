<script>
    import StatCard from './StatCard.svelte';


    const stats = [
        {
            title: "Prospectos",
            value: 8,
            description: "Nuevos clientes potenciales"
        },

        {
            title: "Cotizaciones",
            value: 4,
            description: "Pendientes de respuesta"
        },

        {
            title: "Proyectos",
            value: 2,
            description: "En ejecución"
        },

        {
            title: "Cobros",
            value: 1,
            description: "Pendientes"
        }
    ];

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