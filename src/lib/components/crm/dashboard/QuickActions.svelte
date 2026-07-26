<script>

import NuevoClienteModal from '$lib/components/crm/clientes/NuevoClienteModal.svelte';


let mostrarNuevoCliente = $state(false);


const actions = [
    {
        id: "nuevo-cliente",
        title: "Nuevo cliente",
        description: "Registrar prospecto"
    },

    {
        id: "nueva-cotizacion",
        title: "Nueva cotización",
        description: "Crear propuesta comercial"
    },

    {
        id: "nueva-visita",
        title: "Nueva visita",
        description: "Agendar inspección"
    },

    {
        id: "registrar-pago",
        title: "Registrar pago",
        description: "Actualizar cobros"
    }
];



/**
 * Ejecuta acciones rápidas del dashboard CRM
 * @param {string} id
 */
function ejecutarAccion(id) {

    switch(id) {

        case "nuevo-cliente":

            mostrarNuevoCliente = true;

            break;


        case "nueva-cotizacion":

            console.log("Nueva cotización");

            break;


        case "nueva-visita":

            console.log("Nueva visita");

            break;

    }
}

</script>
<div class="actions">

<h2>
Acciones rápidas
</h2>


<div class="grid">

{#each actions as action}

<button
    class="action"
    on:click={() => ejecutarAccion(action.id)}
>

<div class="title">
{action.title}
</div>

<div class="description">
{action.description}
</div>

</button>

{/each}

</div>


</div>


<NuevoClienteModal
    bind:open={mostrarNuevoCliente}
/>


<style>

.actions {

margin-top:var(--space-6);

}


h2 {

font-size:18px;

margin-bottom:var(--space-4);

}



.grid {

display:grid;

grid-template-columns:repeat(auto-fit,minmax(220px,1fr));

gap:var(--space-4);

}



.action {

text-align:left;

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius);

padding:var(--space-4);

cursor:pointer;

transition:.2s ease;

}



.action:hover {

border-color:var(--primary);

transform:translateY(-2px);

}



.title {

font-weight:600;

color:var(--text);

}



.description {

margin-top:var(--space-2);

font-size:14px;

color:var(--text-secondary);

}



</style>