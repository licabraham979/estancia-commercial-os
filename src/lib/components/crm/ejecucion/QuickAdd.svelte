<script>

import { actividadesStore } from '$lib/stores/actividades.svelte.js';


let titulo = '';

let categoriaId = 1;

let prioridad = 'media';



function agregar(){

    if(!titulo.trim()) return;


    actividadesStore.crearActividad(
        titulo,
        categoriaId,
        prioridad
    );


    titulo='';

}



</script>



<div class="quick-add">


<input

bind:value={titulo}

placeholder="¿Qué vas a ejecutar?"

onkeydown={(e)=>{

    if(e.key==='Enter') agregar();

}}

/>



<select bind:value={categoriaId}>

{#each actividadesStore.categorias as categoria}

<option value={categoria.id}>

{categoria.icono} {categoria.nombre}

</option>

{/each}

</select>



<select bind:value={prioridad}>

<option value="alta">
Alta
</option>

<option value="media">
Media
</option>

<option value="baja">
Baja
</option>

</select>



<button onclick={agregar}>

+

</button>


</div>



<style>

.quick-add{

display:flex;

gap:12px;

padding:18px;

background:white;

border-radius:16px;

box-shadow:0 2px 10px rgba(0,0,0,.05);

}



input{

flex:1;

border:none;

outline:none;

font-size:16px;

background:transparent;

}



select{

border:1px solid #ddd;

border-radius:10px;

padding:8px;

background:white;

}



button{

width:42px;

height:42px;

border:none;

border-radius:12px;

cursor:pointer;

font-size:22px;

}

</style>