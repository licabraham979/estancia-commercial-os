<script>

import { dashboardStore } from '$lib/stores/dashboard.svelte.js';


const seguimientos = $derived(
    dashboardStore.seguimientos
);


</script>


<section class="timeline">


<h3>
🕒 Seguimiento Comercial
</h3>


{#if seguimientos.length === 0}

<div class="empty">

No hay seguimientos registrados.

</div>


{:else}


<div class="items">


{#each seguimientos as cliente}


<div class="item">


<div class="icon">
📌
</div>


<div class="content">


<h4>
{cliente.nombre}
</h4>

<p class="estado">
📍 {cliente.estado}
</p>

<p class={`nivel ${cliente.nivelSeguimiento.color}`}>

{cliente.nivelSeguimiento.icono}

{cliente.nivelSeguimiento.etiqueta}

</p>

<p>
🏠 {cliente.proyecto}
</p>




<p>
➡ Próxima acción:
{cliente.siguienteAccion}
</p>

<p>
⏱ {cliente.tiempoSinContacto}
</p>


{#if cliente.valor}

<p>
💰 {cliente.valor}
</p>


{/if}

{#if cliente.diasSinContacto > 0}

<p class="dias">

⏳ {cliente.diasSinContacto}
días sin contacto

</p>


{/if}

{#if cliente.ultimaActividad}

<small>

Última actividad:
{new Date(cliente.ultimaActividad.fecha)
.toLocaleDateString()}

</small>

{/if}


</div>


</div>


{/each}


</div>


{/if}


</section>



<style>

.timeline{

background:white;

padding:20px;

border-radius:20px;

border:1px solid #eee;

}


h3{

margin:0 0 20px;

}


.items{

display:flex;

flex-direction:column;

gap:14px;

}


.item{

display:flex;

gap:14px;

padding:14px;

border-radius:14px;

background:#f8fafc;

}


.icon{

font-size:24px;

}


h4{

margin:0;

}


.estado{

font-size:13px;

opacity:.7;

margin:4px 0;

}


small{

opacity:.6;

}


.empty{

padding:20px;

background:#f8fafc;

border-radius:12px;

}

.nivel{

display:inline-block;

padding:5px 10px;

border-radius:20px;

font-size:13px;

font-weight:600;

margin:8px 0;

}


.verde{

background:#dcfce7;

color:#166534;

}


.amarillo{

background:#fef9c3;

color:#854d0e;

}


.rojo{

background:#fee2e2;

color:#991b1b;

}


.gris{

background:#e5e7eb;

color:#374151;

}

</style>