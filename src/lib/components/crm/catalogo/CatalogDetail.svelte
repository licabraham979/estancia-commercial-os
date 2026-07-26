<script>

	let {

		servicio,

		onCerrar

	} = $props();

</script>


<div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">


	<div class="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden">


		<div class="p-6 bg-emerald-600 text-white flex justify-between items-center">


			<div>

				<h2 class="text-3xl font-black">

					{servicio.nombre}

				</h2>

				<p class="opacity-80">

					{servicio.categoria}

				</p>

			</div>


			<button

				class="btn btn-sm"

				onclick={() => onCerrar?.()}

			>

				✕

			</button>


		</div>



		<div class="p-8 space-y-6">


			<p class="text-gray-600 text-lg">

				{servicio.descripcion ?? 
				"Solución profesional para tu negocio."}

			</p>



			<div class="grid md:grid-cols-3 gap-4">


				<div class="bg-gray-100 rounded-2xl p-4">

					<p class="text-sm text-gray-500">

						Precio desde

					</p>

					<p class="text-2xl font-bold">

						L {servicio.precioDesde ?? servicio.precio}

					</p>

				</div>


				<div class="bg-gray-100 rounded-2xl p-4">

					<p class="text-sm text-gray-500">

						Unidad

					</p>

					<p class="text-2xl font-bold">

						{servicio.unidad}

					</p>

				</div>


				<div class="bg-gray-100 rounded-2xl p-4">

					<p class="text-sm text-gray-500">

						Tiempo

					</p>

					<p class="text-xl font-bold">

						{servicio.tiempo ?? "Por definir"}

					</p>

				</div>


			</div>



			{#if servicio.incluye?.length}


			<div>

				<h3 class="font-bold text-xl mb-3">

					Incluye

				</h3>


				<div class="flex flex-wrap gap-2">


					{#each servicio.incluye as item}

						<span class="badge badge-outline">

							✓ {item}

						</span>

					{/each}


				</div>

			</div>


			{/if}


		</div>


	</div>


</div>