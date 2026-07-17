<script>

import ClienteDetalle from '$lib/components/crm/clientes/ClienteDetalle.svelte';
import { obtenerCliente } from '$lib/stores/clientes.svelte';
import ResumenFinanciero from '$lib/components/crm/clientes/finanzas/ResumenFinanciero.svelte';
import MovimientoForm from '$lib/components/crm/clientes/finanzas/MovimientoForm.svelte';
import ListaMovimientos from '$lib/components/crm/clientes/finanzas/ListaMovimientos.svelte';
import HistorialActividades from '$lib/components/crm/clientes/HistorialActividades.svelte';
import ClienteHeader from '$lib/components/crm/clientes/ClienteHeader.svelte';

let { params } = $props();


const cliente = $derived(
    obtenerCliente(Number(params.id))
);


let seccion = $state('informacion');


</script>


{#if cliente}

<ClienteDetalle
    cliente={cliente}
/>

<HistorialActividades
    clienteId={cliente.id}
/>

<ResumenFinanciero
    clienteId={cliente.id}
/>

<MovimientoForm
    clienteId={cliente.id}
/>

<ListaMovimientos
    clienteId={cliente.id}
/>

{/if}