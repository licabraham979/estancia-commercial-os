<script>

import { actualizarCliente } from '$lib/stores/clientes.svelte';

let { cliente } = $props();


let proyecto = $state(cliente.proyecto ?? "");

let valor = $state(cliente.valor ?? "");

let siguienteAccion = $state(cliente.siguienteAccion ?? "");



function guardar(){

    actualizarCliente(
        cliente.id,
        {
            proyecto,
            valor,
            siguienteAccion
        }
    );

}

</script>


<div class="editar">


<h3>
Información comercial
</h3>


<label>
Proyecto
</label>

<input 
bind:value={proyecto}
/>


<label>
Valor estimado
</label>

<input 
bind:value={valor}
/>


<label>
Próxima acción
</label>

<input 
bind:value={siguienteAccion}
/>


<button onclick={guardar}>
Guardar cambios
</button>


</div>



<style>

.editar {

margin-top:var(--space-6);

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius);

padding:var(--space-5);

display:flex;

flex-direction:column;

gap:12px;

}


h3 {

font-size:18px;

margin-bottom:10px;

}


label {

font-size:14px;

color:var(--text-secondary);

}


input {

padding:12px;

border-radius:8px;

border:1px solid var(--border);

font-size:15px;

}



button {

margin-top:10px;

padding:12px;

border:none;

border-radius:8px;

background:var(--primary);

color:white;

cursor:pointer;

}


</style>