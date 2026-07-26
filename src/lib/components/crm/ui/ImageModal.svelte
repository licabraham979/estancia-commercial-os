<script>
	import { fade } from 'svelte/transition';

	let {
  imagen = '',
  titulo = '',
  descripcion = ''
} = $props();


	let abierto = $state(false);


	function abrir(){

		abierto = true;

	}


	function cerrar(){

		abierto = false;

	}

</script>


<!-- Imagen pequeña -->
<button 
	onclick={abrir}
	class="group cursor-pointer"
	aria-label="Ver imagen ampliada"
>

	<img
		src={imagen}
		alt={titulo}
		class="
			h-60
			w-auto
			object-contain
			transform
			group-hover:scale-110
			transition-transform
			duration-300
		"
		loading="lazy"
	/>

</button>



<!-- Modal -->
{#if abierto}

<div
	class="
		fixed
		inset-0
		z-50
		bg-black/80
		backdrop-blur-sm
		flex
		items-center
		justify-center
		p-6
	"
	onclick={cerrar}
	transition:fade
>


	<div
		class="
			relative
			max-w-6xl
			max-h-[90vh]
		"
		onclick={(e)=>e.stopPropagation()}
	>


		<button
			onclick={cerrar}
			class="
				absolute
				-right-3
				-top-3
				bg-white
				text-black
				w-10
				h-10
				rounded-full
				font-bold
				text-xl
				z-10
			"
		>
			×
		</button>


		<img
			src={imagen}
			alt={titulo}
			class="
				max-h-[85vh]
				max-w-full
				object-contain
				rounded-xl
				shadow-2xl
			"
		>


		{#if titulo}

		<p
			class="
				text-white
				text-center
				mt-4
				text-xl
				font-bold
			"
		>
			{titulo}
		</p>

		{/if}

        {#if descripcion}

<p class="
  text-white
  text-center
  mt-3
  max-w-3xl
  text-lg
  leading-relaxed
">
  {descripcion}
</p>

{/if}

	</div>


</div>

{/if}