<script>

import { obtenerClientes } from '$lib/stores/clientes.svelte.js';


const estados = [
    {
        title: "Prospectos",
        estado: "Nuevo contacto"
    },
    {
        title: "Inspección",
        estado: "Inspección pendiente"
    },
    {
        title: "Cotización",
        estado: "Cotización enviada"
    },
    {
        title: "Seguimiento",
        estado: "Proyecto aprobado"
    }
];


let stages = $derived(
    estados.map(etapa => ({
        title: etapa.title,

        clients: obtenerClientes()
            .filter(
                cliente => cliente.estado === etapa.estado
            )
            .map(
                cliente => cliente.nombre
            )
    }))
);


</script>
<div class="pipeline">

{#each stages as stage}

<div class="column">

<h3>
{stage.title}
</h3>


{#each stage.clients as client}

<div class="card">

{client}

</div>

{/each}


</div>

{/each}

</div>



<style>

.pipeline {

display:grid;

grid-template-columns:repeat(auto-fit,minmax(220px,1fr));

gap:var(--space-4);

}


.column {

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius);

padding:var(--space-4);

}


h3 {

font-size:16px;

margin-bottom:var(--space-4);

}


.card {

background:var(--background);

border-radius:var(--radius-sm);

padding:var(--space-3);

margin-bottom:var(--space-2);

font-size:14px;

border:1px solid var(--border);

}

</style>