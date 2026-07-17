<script>

import ClienteHeader from './ClienteHeader.svelte';
import ClienteTimeline from './ClienteTimeline.svelte';
import ClienteArchivos from './ClienteArchivos.svelte';
import ClienteNotas from './ClienteNotas.svelte';
import ClienteEstado from './ClienteEstado.svelte';
import ClienteCambiarEstado from './ClienteCambiarEstado.svelte';
import ClienteProximaAccion from './ClienteProximaAccion.svelte';
import ClienteContacto from './ClienteContacto.svelte';
import ClienteInformacionEditar from './ClienteInformacionEditar.svelte';
import { actividadesStore } from '$lib/stores/actividades.svelte.js';



let {cliente = null} = $props();


function crearSeguimiento(titulo= ''){ 

    actividadesStore.crearActividadCliente(
        titulo,
        cliente.id
    );

}
</script>
{#if !cliente}

<p>
Cliente no encontrado
</p>

{:else}
<div class="detalle">


<div class="header">

    <ClienteContacto

nombre={cliente.nombre}

telefono={cliente.telefono}

correo={cliente.correo}

/>

    <ClienteEstado
    estado={cliente.estado}
/>

<ClienteCambiarEstado

id={cliente.id}

estadoActual={cliente.estado}

/>


<h1>
{cliente.nombre}
</h1>

<p>
{cliente.empresa}
</p>

</div>



<div class="info">


<div class="box">

<span>
Estado
</span>

<strong>
{cliente.estado}
</strong>

</div>

<ClienteEstado
    estado={cliente.estado}
/>

<div class="box">

<span>
Proyecto
</span>

<strong>
{cliente.proyecto}
</strong>

</div>



<div class="box">

<span>
Valor estimado
</span>

<strong>
{cliente.valor}
</strong>

</div>



</div>



<div class="next">

<h3>
Próxima acción
</h3>

<p>
{cliente.siguienteAccion}
</p>

</div>

<div class="acciones">

<h3>
⚡ Acciones rápidas
</h3>


<button onclick={() => crearSeguimiento('Llamar cliente')}>
📞 Registrar llamada
</button>


<button onclick={() => crearSeguimiento('Enviar cotización')}>
📄 Enviar cotización
</button>


<button onclick={() => crearSeguimiento('Programar seguimiento')}>
📅 Seguimiento
</button>


<button onclick={() => crearSeguimiento('Registrar pago')}>
💰 Pago recibido
</button>


</div>

<ClienteInformacionEditar 
    cliente={cliente}
/>

<ClienteTimeline
    actividades={cliente.actividades}
/>

<ClienteArchivos />

<ClienteNotas clienteId={cliente.id} />

</div>
{/if}


<style>

.acciones{

margin-top:20px;

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius);

padding:20px;

display:flex;

gap:12px;

flex-wrap:wrap;

}


.acciones button{

padding:10px 16px;

border-radius:12px;

border:1px solid #ddd;

background:white;

cursor:pointer;

}

.detalle {

padding:var(--space-6);

}


.header h1 {

font-size:32px;

}


.header p {

margin-top:var(--space-2);

}



.info {

margin-top:var(--space-6);

display:grid;

grid-template-columns:repeat(auto-fit,minmax(220px,1fr));

gap:var(--space-4);

}



.box {

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius);

padding:var(--space-4);

}



.box span {

font-size:13px;

color:var(--text-secondary);

}



.box strong {

display:block;

margin-top:var(--space-2);

font-size:18px;

}



.next {

margin-top:var(--space-6);

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius);

padding:var(--space-4);

}



</style>