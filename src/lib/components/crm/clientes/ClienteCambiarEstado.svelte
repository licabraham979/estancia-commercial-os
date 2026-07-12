<script>

import { cambiarEstado } from '$lib/stores/clientes.svelte';


let {
    id,
    estadoActual
} = $props();



let nuevoEstado = $state();


$effect(() => {

    nuevoEstado = estadoActual;

});

const estados = [

    "Nuevo contacto",

    "Inspección pendiente",

    "Cotización enviada",

    "Seguimiento",

    "Proyecto aprobado",

    "Finalizado"

];



function actualizar(){

    cambiarEstado(id, nuevoEstado);

}


</script>

<div class="estado">


<h3>
Cambiar estado
</h3>


<select bind:value={nuevoEstado}>

{#each estados as estado}

<option value={estado}>
{estado}
</option>

{/each}

</select>


<button onclick={actualizar}>
Actualizar
</button>


</div>



<style>

.estado {

margin-top:var(--space-6);

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius);

padding:var(--space-4);

}



h3 {

font-size:16px;

margin-bottom:var(--space-3);

}



select {

width:100%;

padding:10px;

border-radius:var(--radius);

border:1px solid var(--border);

}



button {

margin-top:var(--space-3);

padding:10px 16px;

border:none;

border-radius:var(--radius);

background:var(--primary);

color:white;

cursor:pointer;

}


</style>