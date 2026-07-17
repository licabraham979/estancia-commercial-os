<script>

import { actividadesStore } from '$lib/stores/actividades.svelte.js';

let { clienteId } = $props();


const historial = $derived(
    actividadesStore.actividades
        .filter(
            actividad => 
            actividad.clienteId === clienteId
        )
        .sort(
            (a,b)=> 
            new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
        ) 
);


function formatoFecha(fecha = ''){

    return new Date(fecha)
    .toLocaleDateString(
        'es-HN',
        {
            day:'2-digit',
            month:'short',
            year:'numeric'
        }
    );

}

</script>


<section class="historial">

<header>
    <h2>
        Historial comercial
    </h2>

    <span>
        {historial.length} actividades
    </span>
</header>



{#if historial.length === 0}

<div class="vacio">

    No hay actividades registradas para este cliente.

</div>


{:else}


<div class="timeline">


{#each historial as actividad}


<div class="item">


<div class="marcador"></div>


<div class="contenido">


<div class="titulo">

{actividad.titulo}

</div>


<p>

{actividad.descripcion || 
'Sin descripción'}

</p>


<div class="meta">

{actividad.tipo}
•
{actividad.estado}
•
{formatoFecha(actividad.fechaCreacion)}

</div>


</div>


</div>


{/each}


</div>


{/if}


</section>



<style>

.historial{
margin-top:2rem;
padding:1.5rem;
background:white;
border-radius:16px;
}


header{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:1.5rem;
}


.timeline{
border-left:2px solid #e5e7eb;
padding-left:20px;
}


.item{
position:relative;
margin-bottom:1.5rem;
}


.marcador{

position:absolute;
left:-29px;
top:6px;

width:12px;
height:12px;

border-radius:50%;
background:#2563eb;

}


.titulo{
font-weight:700;
}


.meta{

font-size:.85rem;
color:#64748b;

margin-top:.5rem;

}


.vacio{

color:#64748b;
padding:2rem;
text-align:center;

}

</style>