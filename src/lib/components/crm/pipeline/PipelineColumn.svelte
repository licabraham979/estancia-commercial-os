<script>

import { cambiarEstado } from '$lib/stores/clientes.svelte';
import ClientePipelineCard from './ClientePipelineCard.svelte';


let {

titulo,

clientes

} = $props();



// function soltar(event){


// const clienteId =
// event.dataTransfer.getData(
// "clienteId"
// );



// cambiarEstado(
// clienteId,
// titulo
// );



// }
function soltar(event){

    event.preventDefault();

    const clienteId =
        event.dataTransfer.getData("clienteId");

    console.log("DROP CLIENTE:", clienteId);
    console.log("NUEVO ESTADO:", titulo);

    cambiarEstado(
        clienteId,
        titulo
    );

}
</script>


<div

class="column"

role="region"

ondragover={(e)=>e.preventDefault()}

ondrop={soltar}

>
<h2>
{titulo}
</h2>



{#each clientes as cliente}


<ClientePipelineCard
cliente={cliente}
/>


{/each}



</div>



<style>

.column {

background:var(--surface);

padding:20px;

border-radius:12px;

min-height:300px;

}


h2 {

font-size:16px;

margin-bottom:20px;

}

</style>