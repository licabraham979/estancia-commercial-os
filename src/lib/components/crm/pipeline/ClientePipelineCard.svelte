<script>

import { goto } from '$app/navigation';


let {
    cliente
} = $props();


function abrirCliente(){

    goto(`/crm/clientes/${cliente.id}`);

}
</script>


<div

class="card"

role="button"

tabindex="0"

draggable="true"

ondragstart={(e)=>{

e.dataTransfer?.setData(
"clienteId",
cliente.id
);

}}

onclick={abrirCliente}

onkeydown={(e)=>{

if(e.key==="Enter"){

abrirCliente();

}

}}

>

<h3>
{cliente.nombre}
</h3>


<p>
{cliente.empresa}
</p>


<span>
{cliente.valor}
</span>


</div>



<style>

.card {

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius);

padding:15px;

margin-bottom:12px;

cursor:pointer;

}

.card:hover {

transform:translateY(-3px);

}



h3 {

font-size:15px;

}


p {

font-size:13px;

margin-top:5px;

}


span {

font-weight:bold;

font-size:14px;

}

</style>