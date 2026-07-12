<script>

const stages = [
    {
        title: "Prospectos",
        clients: [
            "Hotel Palma",
            "Restaurante Azul",
            "Taller ABC"
        ]
    },

    {
        title: "Inspección",
        clients: [
            "Oscar Guardado"
        ]
    },

    {
        title: "Cotización",
        clients: [
            "Farmacia Centro",
            "Bodega XYZ"
        ]
    },

    {
        title: "Seguimiento",
        clients: [
            "Constructora Norte"
        ]
    }
];

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