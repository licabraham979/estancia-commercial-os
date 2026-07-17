<script>

let {
    actividades = []
} = $props();



function iconoActividad(actividad){

    if(actividad.titulo.includes('Estado')){
        return '🔄';
    }


    if(actividad.titulo.includes('Llamada')){
        return '📞';
    }


    if(actividad.titulo.includes('Cotización')){
        return '📄';
    }


    if(actividad.titulo.includes('Pago')){
        return '💰';
    }


    if(actividad.titulo.includes('Visita')){
        return '📍';
    }


    return '👤';

}



function fechaBonita(fecha){

    if(!fecha) return '';

    return new Date(fecha)
    .toLocaleString(
        'es-HN',
        {
            day:'numeric',
            month:'short',
            hour:'2-digit',
            minute:'2-digit'
        }
    );

}



</script>

<div class="timeline">


<h2>
Historial
</h2>


<div class="items">


{#each actividades as actividad}


<div class="item">


<div class="point">

{iconoActividad(actividad)}

</div>

<div class="content">


<span>
{fechaBonita(actividad.fecha)}
</span>

<h3>
{actividad.titulo}
</h3>


<p>
{actividad.descripcion}
</p>


</div>


</div>


{/each}


</div>


</div>



<style>

.timeline {

margin-top:var(--space-6);

}


h2 {

font-size:18px;

margin-bottom:var(--space-5);

}



.item {

display:flex;

gap:var(--space-4);

position:relative;

padding-bottom:var(--space-5);

}



.point {

width:34px;

height:34px;

border-radius:50%;

background:var(--primary);

display:flex;

align-items:center;

justify-content:center;

font-size:16px;

flex-shrink:0;

}


.content {

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius);

padding:var(--space-4);

width:100%;

}



.content span {

font-size:13px;

color:var(--text-secondary);

}



.content h3 {

margin-top:var(--space-2);

font-size:16px;

}



.content p {

margin-top:var(--space-2);

font-size:14px;

}



</style>