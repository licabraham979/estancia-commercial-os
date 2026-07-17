<script>

import { goto } from '$app/navigation';


let {
    nombre,
    empresa,
    estado
} = $props();

</script>

<button
onclick={() => goto('/crm/clientes')}
>
← Volver a clientes
</button>

<div class="header">


<!-- <ClienteHeader
    nombre={cliente.nombre}
    empresa={cliente.empresa}
    estado={cliente.estado}
/> -->


<div class="badge">

{estado}

</div>


</div>



<style>

.header {

display:flex;

justify-content:space-between;

align-items:center;

gap:var(--space-4);

}

button {

background:none;

border:none;

cursor:pointer;

color:var(--primary);

margin-bottom:var(--space-4);

font-size:14px;

}

h1 {

font-size:32px;

}



p {

margin-top:var(--space-2);

}



.badge {

padding:8px 16px;

border-radius:20px;

background:#EFF6FF;

color:var(--primary);

font-size:14px;

font-weight:600;

}


</style>