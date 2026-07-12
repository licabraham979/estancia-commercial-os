<script>

import { crearCliente } from '$lib/stores/clientes.svelte';
let nombre = $state("");
let empresa = $state("");
let telefono = $state("");
let correo = $state("");
function guardar(){


crearCliente({

nombre,

empresa,

telefono,

correo

});


}
</script>


<div class="form">


<h1>
Nuevo Cliente
</h1>


<input
placeholder="Nombre del cliente"
bind:value={nombre}
/>


<input
placeholder="Empresa"
bind:value={empresa}
/>


<input
placeholder="Teléfono"
bind:value={telefono}
/>


<input
placeholder="Correo"
bind:value={correo}
/>


<button onclick={guardar}>

Guardar cliente

</button>

</div>



<style>

.form{

display:flex;

flex-direction:column;

gap:15px;

max-width:400px;

}


input{

padding:10px;

border-radius:8px;

border:1px solid var(--border);

}


button{

padding:10px;

border-radius:8px;

cursor:pointer;

}


</style>