<script>
	let { data } = $props();

	const { cotizacion, opciones, fotos } = data;

/** @param {number | string | null | undefined} valor */
const formatoMoneda = (valor) =>
	new Intl.NumberFormat('es-HN', {
		style: 'currency',
		currency: 'HNL',
		minimumFractionDigits: 2
	}).format(Number(valor ?? 0));
</script>

<svelte:head>
	<title>{cotizacion.titulo} | Estancia Comercial</title>
	<meta
		name="description"
		content={`Propuesta comercial para ${cotizacion.cliente_nombre}`}
	/>
</svelte:head>

<div class="min-h-screen bg-slate-50 text-slate-900">

	<header class="border-b border-slate-200 bg-white">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
			<div>
				<div class="text-xl font-black tracking-tight">
					Estancia Comercial
				</div>

				<div class="text-sm text-slate-500">
					Propuesta comercial
				</div>
			</div>

			<div class="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600">
				{cotizacion.estado}
			</div>
		</div>
	</header>


	<main class="mx-auto max-w-6xl px-6 py-10">

		<section class="mb-10">

			<p class="mb-2 text-sm font-bold uppercase tracking-widest text-cyan-600">
				Propuesta para
			</p>

			<h1 class="text-4xl font-black tracking-tight md:text-5xl">
				{cotizacion.titulo}
			</h1>

			<p class="mt-3 text-lg text-slate-600">
				{cotizacion.cliente_nombre}

				{#if cotizacion.cliente_empresa}
					· {cotizacion.cliente_empresa}
				{/if}
			</p>

			{#if cotizacion.descripcion}
				<p class="mt-6 max-w-3xl text-slate-600">
					{cotizacion.descripcion}
				</p>
			{/if}

		</section>


		{#if fotos.length > 0}

			<section class="mb-12 grid gap-5 md:grid-cols-2">

				{#each fotos as foto}
					<div class="overflow-hidden rounded-3xl bg-white shadow-sm">
						<img
							src={foto.url}
							alt="Imagen del proyecto"
							class="h-72 w-full object-cover"
						/>
					</div>
				{/each}

			</section>

		{/if}


		<section>

			<div class="mb-6">

				<p class="text-sm font-bold uppercase tracking-widest text-cyan-600">
					Opciones
				</p>

				<h2 class="mt-1 text-3xl font-black">
					Elige la propuesta que mejor se adapte a tu proyecto
				</h2>

			</div>


			<div class="grid gap-6 md:grid-cols-3">

				{#each opciones as opcion}

					<article
						class:recomendada={opcion.recomendada}
						class="relative overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
					>

						{#if opcion.imagen_url}

							<img
								src={opcion.imagen_url}
								alt={opcion.nombre}
								class="h-52 w-full object-cover"
							/>

						{/if}


						<div class="p-6">

							{#if opcion.recomendada}

								<div class="mb-4 inline-flex rounded-full bg-cyan-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
									Recomendada
								</div>

							{/if}


							<h3 class="text-xl font-black">
								{opcion.nombre}
							</h3>


							{#if opcion.descripcion}

								<p class="mt-3 min-h-12 text-sm leading-relaxed text-slate-600">
									{opcion.descripcion}
								</p>

							{/if}


							<div class="mt-6 text-3xl font-black">
								{formatoMoneda(opcion.precio)}
							</div>

						</div>

					</article>

				{/each}

			</div>

		</section>


		<section class="mt-12 grid gap-6 md:grid-cols-2">

			<div class="rounded-3xl bg-white p-7 shadow-sm">

				<p class="text-xs font-black uppercase tracking-widest text-cyan-600">
					Forma de pago
				</p>

				<p class="mt-3 font-semibold text-slate-700">
					{cotizacion.forma_pago ?? 'Consultar'}
				</p>

			</div>


			<div class="rounded-3xl bg-white p-7 shadow-sm">

				<p class="text-xs font-black uppercase tracking-widest text-cyan-600">
					Vigencia
				</p>

				<p class="mt-3 font-semibold text-slate-700">
					{cotizacion.vigencia ?? 'Consultar'}
				</p>

			</div>

		</section>


		<section class="mt-12 rounded-3xl bg-slate-900 p-8 text-white md:p-10">

			<div class="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

				<div>

					<p class="text-sm font-bold uppercase tracking-widest text-cyan-400">
						Inversión total
					</p>

					<div class="mt-2 text-4xl font-black md:text-5xl">
						{formatoMoneda(cotizacion.total)}
					</div>

					<p class="mt-3 text-sm text-slate-300">
						La propuesta puede incluir diferentes opciones según las necesidades de tu proyecto.
					</p>

				</div>


				<button
					type="button"
					class="rounded-2xl bg-cyan-500 px-8 py-4 font-black text-white shadow-lg transition hover:bg-cyan-400"
				>
					Aceptar propuesta
				</button>

			</div>

		</section>

	</main>


	<footer class="border-t border-slate-200 bg-white py-8">

		<div class="mx-auto max-w-6xl px-6 text-center text-sm text-slate-500">

			Estancia Comercial · Soluciones para espacios comerciales

		</div>

	</footer>

</div>


<style>
	.recomendada {
		border-color: rgb(6 182 212);
		box-shadow: 0 10px 35px rgba(6, 182, 212, 0.12);
	}
</style>
