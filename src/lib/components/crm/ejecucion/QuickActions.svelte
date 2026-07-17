<script>

import { actividadesStore } from '$lib/stores/actividades.svelte.js';


const acciones = [

{
    titulo:'Llamada cliente',
    icono:'📞',
    texto:'Registrar llamada pendiente',
    categoria:1
},

{
    titulo:'Prospectar',
    icono:'👤',
    texto:'Prospectar nuevas empresas',
    categoria:1
},

{
    titulo:'Cotización',
    icono:'📋',
    texto:'Crear cotización',
    categoria:1
},

{
    titulo:'Ejercicio',
    icono:'🏃',
    texto:'Ejercicio del día',
    categoria:3
},

{
    titulo:'Curso',
    icono:'📚',
    texto:'Continuar curso pendiente',
    categoria:2
}

];


function ejecutar(accion){

    if(!accion.texto) return;


    actividadesStore.crearActividad(
        accion.texto,
        accion.categoria
    );

}

</script>



<div class="actions">

{#each acciones as accion}


<button onclick={()=>ejecutar(accion)}>


<span>
{accion.icono}
</span>


<div>

<strong>
{accion.titulo}
</strong>


<small>
{accion.texto}
</small>

</div>


</button>


{/each}

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