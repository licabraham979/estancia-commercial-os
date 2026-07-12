<script>

let {
    actividades
} = $props();

</script>


<div class="timeline">


<h2>
Historial
</h2>


<div class="items">


{#each actividades as actividad}


<div class="item">


<div class="point"></div>


<div class="content">


<span>
{actividad.fecha}
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

width:12px;

height:12px;

border-radius:50%;

background:var(--primary);

margin-top:6px;

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