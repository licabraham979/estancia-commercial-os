<script>

import { goto } from '$app/navigation';
import { eliminarCliente } from '$lib/stores/clientes.svelte.js';

let {
    id,
    nombre,
    empresa,
    estado,
    valor
} = $props();

function abrirCliente() {
    goto(`/crm/clientes/${id}`);
}

function eliminarClienteDeLista() {
    const confirmado = window.confirm(
        `¿Eliminar a ${nombre} de la lista de clientes? Esta acción no elimina cotizaciones ni propuestas.`
    );

    if (confirmado) {
        eliminarCliente(id);
    }
}

</script>


<div class="card">


<div class="header">

<h3>
{nombre}
</h3>

<p>
{empresa}
</p>

</div>



<div class="status">

{estado}

</div>



<div class="value">

<span>
Valor estimado
</span>

<strong>
{valor}
</strong>

</div>


<button onclick={abrirCliente}>
    Ver ficha
</button>

<button class="eliminar" onclick={eliminarClienteDeLista}>
    Eliminar cliente
</button>

</div>



<style>

.card {

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius);

padding:var(--space-5);

box-shadow:var(--shadow-sm);

transition:.2s ease;

}



.card:hover {

transform:translateY(-3px);

box-shadow:var(--shadow);

}



.header h3 {

font-size:18px;

}



.header p {

margin-top:var(--space-1);

font-size:14px;

color:var(--text-secondary);

}



.status {

display:inline-block;

margin-top:var(--space-4);

padding:6px 12px;

border-radius:20px;

background:#EFF6FF;

color:var(--primary);

font-size:13px;

}



.value {

margin-top:var(--space-5);

display:flex;

flex-direction:column;

}



.value span {

font-size:13px;

color:var(--text-secondary);

}



.value strong {

font-size:22px;

margin-top:4px;

}



button {

margin-top:var(--space-5);

width:100%;

padding:12px;

border:none;

border-radius:var(--radius);

background:var(--primary);

color:white;

cursor:pointer;

}

button.eliminar {
    margin-top: var(--space-2);
    background: #b91c1c;
}



</style>