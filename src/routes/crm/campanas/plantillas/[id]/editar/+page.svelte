<script>

    import { plantillas } from '$lib/stores/plantillas.js';

	import { goto } from '$app/navigation';

	let { params } = $props();

	let titulo = "Cliente sin respuesta";
	let mensaje = "Hola {nombre}, seguimos pendientes de tu proyecto.";

	function guardar(){

	plantillas.update(lista => {

		return lista.map(p => {

			if(p.id === Number(params.id)){

				return {
					...p,
					nombre: titulo,
					texto: mensaje
				};

			}

			return p;

		});

	});

	goto(`/crm/campanas/plantillas/${params.id}`);

}

</script>


<div class="container">

<h1>
	Editar plantilla #{params.id}
</h1>


<label>
	Título
</label>

<input bind:value={titulo}>


<label>
	Mensaje
</label>

<textarea rows="6" bind:value={mensaje}></textarea>


<button onclick={guardar}>
	Guardar cambios
</button>


</div>


<style>

.container{
	padding:2rem;
	max-width:700px;
	display:flex;
	flex-direction:column;
	gap:15px;
}


input,
textarea{
	padding:12px;
	border-radius:8px;
	border:1px solid #ccc;
}


button{
	padding:12px;
	border-radius:8px;
	cursor:pointer;
}

</style>