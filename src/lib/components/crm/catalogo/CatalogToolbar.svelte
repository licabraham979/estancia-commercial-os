<script>

	let {

		totalServicios = 0,

		totalMateriales = 0,

		onNuevoServicio,

		onNuevoMaterial

	} = $props();

</script>

<div class="rounded-3xl bg-gradient-to-r from-emerald-700 to-emerald-500 text-white p-8 shadow-xl mb-8">

	<div class="flex flex-col lg:flex-row lg:justify-between gap-8">

		<div>

			<p class="uppercase tracking-[0.3em] text-emerald-100 text-sm">

				Estancia Commercial

			</p>

			<h1 class="text-4xl font-black mt-2">

				Catálogo Maestro

			</h1>

			<p class="text-emerald-100 mt-3 max-w-2xl">

				Todos los servicios, materiales, precios,
				costos y soluciones comerciales en un solo lugar.

			</p>

		</div>


		<div class="grid grid-cols-2 gap-4">

			<div class="bg-white/15 rounded-2xl p-5">

				<p class="text-sm">

					Servicios

				</p>

				<h2 class="text-3xl font-bold">

					{totalServicios}

				</h2>

			</div>


			<div class="bg-white/15 rounded-2xl p-5">

				<p class="text-sm">

					Materiales

				</p>

				<h2 class="text-3xl font-bold">

					{totalMateriales}

				</h2>

			</div>

		</div>

	</div>


	<div class="flex flex-wrap gap-3 mt-8">

		<button
			class="btn btn-neutral"
			onclick={onNuevoServicio}
		>
			➕ Nuevo Servicio
		</button>

		<button
			class="btn btn-neutral"
			onclick={onNuevoMaterial}
		>
			📦 Nuevo Material
		</button>

		<button class="btn btn-neutral">

			🖨 Imprimir

		</button>

		<button class="btn btn-neutral">

			📄 PDF

		</button>

		<button class="btn btn-neutral">

			🌐 Landing

		</button>

	</div>

</div>