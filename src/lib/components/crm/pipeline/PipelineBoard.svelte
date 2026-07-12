<script>

import PipelineColumn 
from './PipelineColumn.svelte';


let {
    clientes
} = $props();



</script>



<div class="board">


<PipelineColumn

titulo="Nuevo contacto"

clientes={
clientes.filter(
c => c.estado==="Nuevo contacto"
)
}

/>



<PipelineColumn

titulo="Inspección pendiente"

clientes={
clientes.filter(
c => c.estado==="Inspección pendiente"
)
}

/>



<PipelineColumn

titulo="Cotización enviada"

clientes={
clientes.filter(
c => c.estado==="Cotización enviada"
)
}

/>



<PipelineColumn

titulo="Proyecto aprobado"

clientes={
clientes.filter(
c => c.estado==="Proyecto aprobado"
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