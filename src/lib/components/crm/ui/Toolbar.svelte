<script>
	let {
		titulo = '',
		descripcion = '',
		botonTexto = '',
		onNuevo = null
	} = $props();
</script>


<div class="flex justify-between items-center mb-6">

	<div>
		<h1 class="text-2xl font-bold">
			{titulo}
		</h1>

		{#if descripcion}
			<p class="text-sm text-gray-500">
				{descripcion}
			</p>
		{/if}
	</div>


	{#if botonTexto}

		<button
			class="btn btn-primary"
			onclick={onNuevo}
		>
			{botonTexto}
		</button>

	{/if}

</div>