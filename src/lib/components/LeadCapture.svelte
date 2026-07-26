<script lang="ts">

let {
	onEnviar = null
} = $props();


let nombre = $state('');
let telefono = $state('');


function enviar(){

	if(!nombre || !telefono){
		return;
	}


	if(onEnviar){

		onEnviar({

			nombre,

			telefono

		});

	}

}

</script>


<div class="
mt-8
bg-white/95
backdrop-blur-md
rounded-3xl
p-6
shadow-xl
border
relative
z-20
">


<h3 class="text-xl font-bold text-gray-900 mb-4">

	Recibe tu cotización detallada

</h3>


<p class="text-sm text-gray-600 mb-5">

	Envíamos la propuesta completa con materiales y recomendaciones.

</p>



<input

	class="
	w-full
	h-14
	rounded-2xl
	border
	px-5
	mb-4
	"

	placeholder="Tu nombre"

	bind:value={nombre}

/>



<input

	class="
	w-full
	h-14
	rounded-2xl
	border
	px-5
	mb-5
	"

	placeholder="WhatsApp"

	type="tel"

	bind:value={telefono}

/>



<button

	class="
	w-full
	h-14
	bg-emerald-600
	text-white
	font-bold
	rounded-2xl
	"

	onclick={enviar}

>

	Recibir cotización

</button>


</div>