<script>

import { resumenCliente } from '$lib/stores/finanzas.svelte.js';
import { obtenerCliente } from '$lib/stores/clientes.svelte.js';


let {
    clienteId
} = $props();



const resumen = $derived(
    resumenCliente(clienteId)
);



const cliente = $derived(
    obtenerCliente(clienteId)
);



const valorProyecto = $derived(
    Number(
        String(cliente?.valor ?? 0)
            .replace(/[^0-9.-]/g, '')
    )
);



const pendiente = $derived(
    valorProyecto - resumen.ingresos
);



const margen = $derived(
    resumen.ingresos - resumen.gastos
);


</script>


<section class="finanzas">


<h3>
💰 Estado financiero
</h3>


<div class="grid">


<div>
<span>
Valor proyecto
</span>

<strong>
L {valorProyecto}
</strong>

</div>



<div>
<span>
Cobrado
</span>

<strong>
L {resumen.ingresos}
</strong>

</div>



<div>
<span>
Pendiente
</span>

<strong>
L {pendiente}
</strong>

</div>



<div>
<span>
Utilidad actual
</span>

<strong>
L {margen}
</strong>

</div>


</div>


</section>

<style>


.finanzas{

background:white;

border:1px solid var(--border);

border-radius:20px;

padding:20px;

}



.grid{

display:grid;

grid-template-columns:
repeat(auto-fit,minmax(180px,1fr));

gap:16px;

margin-top:15px;

}



.card{

padding:18px;

background:#f8fafc;

border-radius:15px;

}



span{

display:block;

font-size:13px;

color:#64748b;

}



strong{

display:block;

font-size:25px;

margin-top:8px;

}



.ganancia{

background:#ecfdf5;

}


</style>