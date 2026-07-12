<script>

import StatCard from '$lib/components/crm/dashboard/StatCard.svelte';

import { obtenerEstadisticas } 
from '$lib/services/dashboard';


const datos = obtenerEstadisticas();


</script>

<h1>
Dashboard Comercial
</h1>


<div class="grid">


<StatCard

title="Clientes"

value={datos.total}

description="Clientes registrados"

/>


<StatCard

title="Cotizaciones"

value={datos.cotizaciones}

description="Propuestas enviadas"

/>


<StatCard

title="Seguimientos"

value={datos.seguimiento}

description="Clientes por contactar"

/>


<StatCard

title="Aprobados"

value={datos.aprobados}

description="Proyectos ganados"

/>


</div>


<div class="valor">


<h2>
Valor potencial
</h2>


<p>
L {datos.valorTotal.toLocaleString()}
</p>


</div>

<style>
    .grid {

display:grid;

grid-template-columns:
repeat(4,1fr);

gap:20px;

margin-top:30px;

}


.valor {

margin-top:30px;

}
</style>