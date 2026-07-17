<script>

import { actividadesStore } from '$lib/stores/actividades.svelte.js';


let { actividad } = $props();


const categoria = $derived(
    actividadesStore.categorias.find(
        item => item.id === actividad.categoriaId
    )
);



function completar(){

    actividadesStore.completarActividad(
        actividad.id
    );

}

</script>

<div 
class="card"
class:completada={actividad.estado === 'completada'}
>


<button 
class="check"
onclick={completar}
>

{actividad.estado === 'completada'
? '✓'
: '○'}

</button>



<div class="content">

<h3>
{actividad.titulo}
</h3>


<div class="meta">

{#if categoria}

<span class="categoria">

{categoria.icono}

{categoria.nombre}

</span>

{/if}


<span>
{actividad.prioridad}
</span>

</div>
</div>


</div>



<style>

.card{

display:flex;

align-items:center;

gap:14px;

padding:16px;

background:white;

border-radius:16px;

border:1px solid #eee;

transition:.2s ease;

}


.card:hover{

transform:translateY(-2px);

}


.check{

border:none;

background:none;

font-size:24px;

cursor:pointer;

}


.content{

flex:1;

}


h3{

margin:0;

font-size:16px;

}


.meta{

display:flex;

gap:8px;

margin-top:8px;

}


.meta span{

font-size:12px;

padding:4px 10px;

border-radius:20px;

background:#f1f1f1;

}


.completada h3{

text-decoration:line-through;

opacity:.5;

}

.categoria{

border:1px solid;

background:white;

}

</style>