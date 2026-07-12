<script>

import ClienteDetalle from '$lib/components/crm/clientes/ClienteDetalle.svelte';
import { obtenerCliente } from '$lib/stores/clientes.svelte';


let { params } = $props();


const cliente = $derived(
    obtenerCliente(params.id)
);


let seccion = $state('informacion');


</script>


<ClienteDetalle 
    cliente={cliente}
    bind:seccion
/>