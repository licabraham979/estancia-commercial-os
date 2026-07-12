<script>

import { obtenerNotas, crearNota } from '$lib/stores/notas.svelte';


let {
    clienteId
}= $props();


let texto = $state("");


let notas = $derived.by(() => {

    return obtenerNotas(clienteId);

});

console.log("cliente:", clienteId);
console.log("notas:", notas);



function agregarNota(){

    if(!texto.trim()) return;


    crearNota({

        clienteId,

        texto

    });


    texto="";

}


</script>



<div class="notas">

    <div class="nueva">


<textarea 
bind:value={texto}
placeholder="Escribe una nota..."
></textarea>


<button onclick={agregarNota}>
Agregar nota
</button>


</div>

<h2>
Notas
</h2>



<div class="lista">


{#each notas as nota}


<div class="nota">


<div class="date">
{nota.fecha}
</div>


<p>
{nota.texto}
</p>


</div>


{/each}


</div>


</div>



<style>

.notas {

margin-top:var(--space-6);

}



h2 {

font-size:18px;

margin-bottom:var(--space-4);

}



.nota {

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius);

padding:var(--space-4);

margin-bottom:var(--space-3);

}



.date {

font-size:13px;

color:var(--text-secondary);

margin-bottom:var(--space-2);

}



.nota p {

font-size:14px;

}



</style>