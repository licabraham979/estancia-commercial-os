<script>

import { actividadesStore } from '$lib/stores/actividades.svelte.js';


const actions = [

{
title:"Nuevo cliente",
description:"Registrar prospecto",
texto:"Registrar nuevo cliente",
categoriaId:1
},

{
title:"Nueva cotización",
description:"Crear propuesta comercial",
texto:"Crear nueva cotización",
categoriaId:2
},

{
title:"Nueva visita",
description:"Agendar inspección",
texto:"Nueva visita",
categoriaId:3
},

{
title:"Registrar pago",
description:"Actualizar cobros",
texto:"Registrar pago",
categoriaId:4
}

];

/**
 * @param {{
 *  texto:string,
 *  categoriaId:number
 * }} accion
 */
function ejecutar(accion){

    if(!accion.texto) return;

    actividadesStore.crearActividad(
        accion.texto,
        accion.categoriaId
    );

}

</script>


<div class="actions">

<h2>
Acciones rápidas
</h2>


<div class="grid">

{#each actions as action}

<button 
class="action"
onclick={() => ejecutar(action)}
>

<div class="title">
{action.title}
</div>

<div class="description">
{action.description}
</div>

</button>

{/each}

</div>

</div>



<style>

.actions{

display:grid;

grid-template-columns:
repeat(auto-fit,minmax(180px,1fr));

gap:12px;

}


button{

display:flex;

align-items:center;

gap:12px;

padding:14px;

background:white;

border:1px solid #eee;

border-radius:16px;

cursor:pointer;

}


span{

font-size:24px;

}


small{

display:block;

opacity:.6;

}

</style>
