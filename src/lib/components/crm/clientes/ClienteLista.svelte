<script>

import ClienteCard from './ClienteCard.svelte';
import { obtenerClientes } from '$lib/stores/clientes.svelte';


const clientes = obtenerClientes();


</script>

<div class="container">

<a class="nuevo" href="/crm/clientes/nuevo">
    + Nuevo Cliente
</a>

<h1>
Clientes
</h1>


<p>
Gestiona tus oportunidades comerciales.
</p>



<div class="grid">


{#each clientes as cliente}


<ClienteCard {...cliente}/>


{/each}


</div>


</div>



<style>

.container {

padding:var(--space-6);

}

.nuevo {

display:inline-block;

margin-top:20px;

padding:12px 18px;

background:#2563eb;

color:white;

text-decoration:none;

border-radius:8px;

}

h1 {

font-size:32px;

}


p {

margin-top:var(--space-2);

}



.grid {

margin-top:var(--space-6);

display:grid;

grid-template-columns:repeat(auto-fit,minmax(280px,1fr));

gap:var(--space-4);

}




</style>