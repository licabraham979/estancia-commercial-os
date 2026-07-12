<script>

let {
    accion,
    fecha
} = $props();


</script>



<div class="card">


<h2>
Próxima acción
</h2>


<div class="action">

<span>
📌
</span>


<div>

<h3>
{accion}
</h3>


<p>
Fecha: {fecha}
</p>


</div>


</div>


</div>



<style>

.card {

margin-top:var(--space-6);

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius);

padding:var(--space-4);

}


h2 {

font-size:18px;

margin-bottom:var(--space-4);

}


.action {

display:flex;

gap:12px;

align-items:center;

}


.action span {

font-size:30px;

}


h3 {

font-size:16px;

}


p {

margin-top:5px;

font-size:14px;

color:var(--text-secondary);

}


</style>