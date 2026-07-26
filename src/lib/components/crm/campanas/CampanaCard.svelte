<script>
	import { goto } from '$app/navigation';

	let {
		id,
		nombre,
		descripcion,
		estado,
		clientes
	} = $props();


	function abrirCampana(){

		console.log('click campaña', id);

		goto(`/crm/campanas/${id}`);

	}

	function editarCampana(){

	goto(`/crm/campanas/${id}/editar`);

}

function colorEstado(){

	if(estado === 'Activa'){
		return 'activa';
	}

	if(estado === 'Borrador'){
		return 'borrador';
	}

	if(estado === 'Pausada'){
		return 'pausada';
	}

	return '';

}

</script>


<div class="card">


	<div class="header">

		<h3>
			{nombre}
		</h3>

		<span class={colorEstado()}>
	{estado}
</span>

	</div>



	<p>
		{descripcion}
	</p>



	<div class="footer">

	<p>
		Clientes: {clientes}
	</p>


	<div class="acciones">

		<button onclick={abrirCampana}>
			Abrir
		</button>


		<button onclick={editarCampana}>
			Editar
		</button>

	</div>

</div>


</div>



<style>

.card {

	background:white;

	padding:20px;

	border-radius:15px;

	box-shadow:0 5px 15px rgba(0,0,0,.08);

}



.header {

	display:flex;

	justify-content:space-between;

	align-items:center;

	margin-bottom:15px;

}



h3 {

	margin:0;

}



span {

	color:white;

	padding:5px 10px;

	border-radius:20px;

	font-size:12px;

}


.activa {

	background:#16a34a;

}


.borrador {

	background:#6b7280;

}


.pausada {

	background:#ca8a04;

}



.footer {

	display:flex;

	justify-content:space-between;

	align-items:center;

	margin-top:20px;

}



button {

	background:#111827;

	color:white;

	border:none;

	padding:10px 15px;

	border-radius:8px;

	cursor:pointer;

}


button:hover {

	background:#2563eb;

}

.acciones{

	display:flex;
	gap:10px;

}

</style>