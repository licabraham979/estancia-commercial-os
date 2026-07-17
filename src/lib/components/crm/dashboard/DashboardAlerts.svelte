<script>

import { dashboardStore } from '$lib/stores/dashboard.svelte.js';

</script>

<div class="alerts">

<h3>
🚨 Alertas
</h3>

{#if dashboardStore.alertas.length === 0}

<div class="ok">

✅ Todo está bajo control.

</div>

{:else}

{#each dashboardStore.alertas as alerta}

<div class={`alert ${alerta.tipo}`}>

<span>

{alerta.icono}

</span>

<div>

<strong>

{alerta.titulo}

</strong>

<p>

{alerta.texto}

</p>

</div>

</div>

{/each}

{/if}

</div>

<style>

.alerts{

background:white;

padding:20px;

border-radius:18px;

border:1px solid #eee;

}

.alert{

display:flex;

gap:14px;

padding:14px;

margin-top:12px;

border-radius:12px;

align-items:flex-start;

}

.alert.critica{

background:#fff3f3;

border-left:5px solid #dc2626;

}

.alert.advertencia{

background:#fff8e6;

border-left:5px solid #f59e0b;

}

.alert.info{

background:#eef7ff;

border-left:5px solid #2563eb;

}

.ok{

padding:12px;

background:#ecfdf5;

border-radius:10px;

}

p{

margin:4px 0 0;

font-size:14px;

opacity:.8;

}

</style>