<script>

	let {

		servicio,

		onVer,

		onCotizar,

		onEditar

	} = $props();

</script>

<div class="group overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">

	<!-- Imagen -->

	<div class="relative h-56 bg-slate-100">

		{#if servicio.imagen}

			<img
				src={servicio.imagen}
				alt={servicio.nombre}
				class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
			/>

		{:else}

			<div class="w-full h-full flex items-center justify-center text-6xl">

				🛠

			</div>

		{/if}

		<div class="absolute top-4 left-4">

			<span class="badge badge-success">

				{servicio.categoria}

			</span>

		</div>

	</div>

	<div class="p-6">

		<h2 class="text-2xl font-bold">

			{servicio.nombre}

		</h2>

		<p class="text-gray-500 mt-2">

			{servicio.descripcion}

		</p>

		<div class="mt-6">

	<div class="text-sm text-gray-400">
		Precio estimado
	</div>


	<div class="text-2xl font-black text-emerald-600">

		{servicio.rangoPrecio ?? `L ${servicio.precio}`}

	</div>


</div>

		<div class="mt-6 flex flex-wrap gap-2">

			{#each servicio.incluye ?? [] as item}

				<span class="badge badge-outline">

					✓ {item}

				</span>

			{/each}

		</div>

		<div class="mt-6 flex justify-between">

			<button
				class="btn btn-outline"
				onclick={() => onVer?.(servicio)}
			>
				Ver
			</button>

			<button
				class="btn btn-primary"
				onclick={() => onCotizar?.(servicio)}
			>
				Cotizar
			</button>

		</div>

	</div>

</div>