<script>

import { actividadesStore } from '$lib/stores/actividades.svelte.js';


const activities = $derived(
    actividadesStore.actividades.slice(0,5)
);


function formatoFecha(fecha = ''){

    if(!fecha) return '';

    return new Date(fecha).toLocaleDateString(
        'es-HN',
        {
            day:'2-digit',
            month:'short'
        }
    );

}

</script>

<div class="activity">

<h2>
Actividad reciente
</h2>


<div class="list">

{#each activities as activity}

<div class="item">

<div class="title">
{activity.title}
</div>


<div class="client">
{activity.client}
</div>


<div class="time">
{activity.time}
</div>

</div>

{/each}

</div>

</div>



<style>

.activity {

margin-top:var(--space-6);

}


h2 {

font-size:18px;

margin-bottom:var(--space-4);

}


.item {

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius);

padding:var(--space-4);

margin-bottom:var(--space-3);

}


.title {

font-weight:600;

color:var(--text);

}


.client {

margin-top:var(--space-1);

color:var(--text-secondary);

font-size:14px;

}


.time {

margin-top:var(--space-2);

font-size:13px;

color:var(--text-secondary);

}


</style>