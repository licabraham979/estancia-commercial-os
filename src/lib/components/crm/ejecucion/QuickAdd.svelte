<script>

    import { actividadesStore } from '$lib/stores/actividades.svelte.js';

    let titulo = '';

   function agregar(){

    if(!titulo.trim()) return;


    actividadesStore.crearActividad(titulo);


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

    >

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

button{

width:42px;

height:42px;

border:none;

border-radius:12px;

cursor:pointer;

font-size:22px;

}
</style>