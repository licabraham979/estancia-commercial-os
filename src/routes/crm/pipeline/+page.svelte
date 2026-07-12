<script>

import PipelineBoard 
from '$lib/components/crm/pipeline/PipelineBoard.svelte';


import { obtenerClientes } 
from '$lib/stores/clientes.svelte';



const clientes = obtenerClientes();


</script>



<h1>
Pipeline Comercial
</h1>


<PipelineBoard
clientes={clientes}
/>