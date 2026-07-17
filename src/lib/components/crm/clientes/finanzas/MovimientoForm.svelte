<script>

import { agregarMovimiento } from '$lib/stores/finanzas.svelte.js';


let {
    clienteId
} = $props();



/** @type {"ingreso" | "gasto"} */
let tipo = $state("ingreso");
let concepto = $state("");
let monto = $state("");



function guardar(){


    if(!concepto || !monto){
        return;
    }



    agregarMovimiento({

        clienteId,

        tipo,

        concepto,

        monto:Number(monto)

    });



    concepto="";
    monto="";

}



</script>


<section class="form">


<h3>
➕ Registrar movimiento
</h3>


<div class="campos">


<select bind:value={tipo}>

<option value="ingreso">
💰 Cobro / Ingreso
</option>


<option value="gasto">
📦 Gasto
</option>


</select>



<input
placeholder="Concepto"
bind:value={concepto}
/>



<input
type="number"
placeholder="Monto"
bind:value={monto}
/>



<button onclick={guardar}>
Guardar movimiento
</button>


</div>


</section>



<style>


.form{

margin-top:20px;

background:white;

padding:20px;

border-radius:20px;

border:1px solid var(--border);

}



.campos{

display:grid;

gap:12px;

margin-top:15px;

}



input,
select{

padding:12px;

border-radius:10px;

border:1px solid #ddd;

}



button{

padding:12px;

border-radius:10px;

border:none;

cursor:pointer;

background:#111827;

color:white;

}


</style>