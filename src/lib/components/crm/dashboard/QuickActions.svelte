<script>

const actions = [

    {
        title:"Nuevo cliente",
        description:"Registrar prospecto"
    },

    {
        title:"Nueva cotización",
        description:"Crear propuesta comercial"
    },

    {
        title:"Nueva visita",
        description:"Agendar inspección"
    },

    {
        title:"Registrar pago",
        description:"Actualizar cobros"
    }

];

</script>



<div class="actions">

<h2>
Acciones rápidas
</h2>


<div class="grid">

{#each actions as action}

<button class="action">

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