<script>

import ClienteCard from './ClienteCard.svelte';
import { obtenerClientes } from '$lib/stores/clientes.svelte';


const clientes = obtenerClientes();


</script>

<div class="container">


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