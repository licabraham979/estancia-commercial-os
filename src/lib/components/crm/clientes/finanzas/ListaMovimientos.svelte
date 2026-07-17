<script>

import { obtenerMovimientosCliente } from '$lib/stores/finanzas.svelte.js';


let {
    clienteId
} = $props();



const movimientos = $derived(
    obtenerMovimientosCliente(clienteId)
);


</script>


<section class="movimientos">


<h3>
📋 Historial financiero
</h3>



{#if movimientos.length === 0}

<div class="empty">

No hay movimientos registrados.

</div>



{:else}



{#each movimientos as movimiento}


<div class="movimiento">


<div class="icono">

{movimiento.tipo === "ingreso"
? "💰"
: "📦"}

</div>



<div class="detalle">


<strong>
{movimiento.concepto}
</strong>


<small>

{new Date(movimiento.fecha)
.toLocaleDateString()}

</small>


</div>



<div class:ingreso={movimiento.tipo==="ingreso"}
     class:gasto={movimiento.tipo==="gasto"}
>


{movimiento.tipo==="ingreso"
? "+"
: "-"
}

L {movimiento.monto}


</div>



</div>


{/each}



{/if}



</section>



<style>


.movimientos{

margin-top:20px;

background:white;

padding:20px;

border-radius:20px;

border:1px solid var(--border);

}



.movimiento{

display:flex;

align-items:center;

gap:15px;

padding:14px;

margin-top:10px;

background:#f8fafc;

border-radius:14px;

}



.icono{

font-size:25px;

}



.detalle{

flex:1;

display:flex;

flex-direction:column;

}



small{

color:#64748b;

}



.ingreso{

font-weight:700;

color:#16a34a;

}



.gasto{

font-weight:700;

color:#dc2626;

}



.empty{

padding:15px;

background:#f8fafc;

border-radius:12px;

}



</style>