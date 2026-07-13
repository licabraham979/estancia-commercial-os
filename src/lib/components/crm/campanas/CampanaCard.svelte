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

</script>


<div class="card">


	<div class="header">

		<h3>
			{nombre}
		</h3>

		<span>
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


		<button onclick={abrirCampana}>
	Abrir campaña
</button>

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

	background:#2563eb;

	color:white;

	padding:5px 10px;

	border-radius:20px;

	font-size:12px;

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

</style>