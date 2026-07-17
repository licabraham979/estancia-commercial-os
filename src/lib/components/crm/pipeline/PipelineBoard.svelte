<script>

import PipelineColumn from './PipelineColumn.svelte';

/**
 * @typedef {{
 * id:string|number,
 * nombre:string,
 * empresa:string,
 * estado:string,
 * valor:number
 * }} Cliente
 */


/** @type {{clientes: Cliente[]}} */
let { clientes } = $props();


</script>

<div class="board">


<PipelineColumn
    titulo="Nuevo contacto"
    clientes={
        clientes.filter(
            (c) => c.estado === "Nuevo contacto"
        )
    }
/>



<PipelineColumn
    titulo="Nuevo contacto"
    clientes={
        clientes.filter(
            (c) => c.estado === "Inspección pendiente"
        )
    }
/>



<PipelineColumn
    titulo="Nuevo contacto"
    clientes={
        clientes.filter(
            (c) => c.estado === "Cotización enviada"
        )
    }
/>



<PipelineColumn
    titulo="Nuevo contacto"
    clientes={
        clientes.filter(
            (c) => c.estado === "Proyecto aprobado"
        )
    }
/>




</div>



<style>

.board {

display:grid;

grid-template-columns:
repeat(4,1fr);

gap:20px;

}

</style>