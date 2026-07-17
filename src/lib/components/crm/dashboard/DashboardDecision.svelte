<script>

import { dashboardStore }
from '$lib/stores/dashboard.svelte.js';

</script>

<div class="decision">

<h2>

{dashboardStore.decision.icono}

{dashboardStore.decision.titulo}

</h2>

<p>

{dashboardStore.decision.texto}

</p>

</div>

<style>

.decision{

background:linear-gradient(
135deg,
#2563eb,
#1d4ed8
);

color:white;

padding:24px;

border-radius:20px;

}

.decision h2{

margin:0;

}

.decision p{

margin-top:10px;

opacity:.9;

}

</style>