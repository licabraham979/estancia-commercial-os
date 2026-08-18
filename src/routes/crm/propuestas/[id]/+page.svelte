<script>
	let { data } = $props();

	const { propuesta, opciones, fotos } = data;

	/** @param {number|string|null|undefined} valor */
const formatoMoneda = (valor) =>
		new Intl.NumberFormat('es-HN', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(Number(valor ?? 0));

		/** @type {Record<string, string>} */
	const estadoTexto = {
		borrador: 'Borrador',
		publicada: 'Publicada',
		vista: 'Vista',
		aceptada: 'Aceptada',
		rechazada: 'Rechazada',
		vencida: 'Vencida'
	};
</script>

<svelte:head>
	<title>{propuesta.titulo} | Estancia Comercial</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 p-6 lg:p-8">

	<div class="mx-auto max-w-6xl space-y-8">

		<!-- ENCABEZADO -->

		<div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

			<div>

				<a
					href="/crm/propuestas"
					class="text-sm font-bold text-slate-500 transition hover:text-slate-900"
				>
					← Volver a propuestas
				</a>

				<div class="mt-5 flex flex-wrap items-center gap-3">

					<h1 class="text-3xl font-black text-slate-900">
						{propuesta.titulo}
					</h1>

					<span class="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
						{estadoTexto[propuesta.estado] ?? propuesta.estado}
					</span>

				</div>

				<p class="mt-2 text-slate-500">
					Propuesta creada el
					{new Date(propuesta.created_at).toLocaleDateString('es-HN')}
				</p>

			</div>

			<a
				href={`/cotizacion/${propuesta.slug}`}
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-xl bg-slate-900 px-5 py-3 text-center font-bold text-white transition hover:bg-slate-700"
			>
				Ver propuesta pública ↗
			</a>

		</div>


		<!-- CLIENTE -->

		<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

			<h2 class="text-xl font-black text-slate-900">
				Cliente
			</h2>

			<div class="mt-5 grid gap-5 md:grid-cols-2">

				<div>
					<p class="text-xs font-bold uppercase tracking-wide text-slate-400">
						Nombre
					</p>

					<p class="mt-1 font-bold text-slate-900">
						{propuesta.cliente_nombre}
					</p>
				</div>

				{#if propuesta.cliente_empresa}

					<div>
						<p class="text-xs font-bold uppercase tracking-wide text-slate-400">
							Empresa / negocio
						</p>

						<p class="mt-1 font-bold text-slate-900">
							{propuesta.cliente_empresa}
						</p>
					</div>

				{/if}

				{#if propuesta.cliente_whatsapp}

					<div>
						<p class="text-xs font-bold uppercase tracking-wide text-slate-400">
							WhatsApp
						</p>

						<p class="mt-1 font-bold text-slate-900">
							{propuesta.cliente_whatsapp}
						</p>
					</div>

				{/if}

				{#if propuesta.cliente_email}

					<div>
						<p class="text-xs font-bold uppercase tracking-wide text-slate-400">
							Correo
						</p>

						<p class="mt-1 font-bold text-slate-900">
							{propuesta.cliente_email}
						</p>
					</div>

				{/if}

			</div>

		</section>


		<!-- PROYECTO -->

		<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

			<h2 class="text-xl font-black text-slate-900">
				Proyecto
			</h2>

			{#if propuesta.descripcion}

				<p class="mt-4 whitespace-pre-line leading-relaxed text-slate-600">
					{propuesta.descripcion}
				</p>

			{:else}

				<p class="mt-4 text-slate-400">
					Sin descripción.
				</p>

			{/if}

		</section>


		<!-- FOTOS -->

		{#if fotos.length > 0}

			<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

				<div class="mb-5">

					<h2 class="text-xl font-black text-slate-900">
						Imágenes del proyecto
					</h2>

				</div>

				<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

					{#each fotos as foto}

						<a
							href={foto.url}
							target="_blank"
							rel="noopener noreferrer"
							class="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
						>

							<img
								src={foto.url}
								alt="Imagen del proyecto"
								class="aspect-video w-full object-cover transition duration-300 group-hover:scale-105"
							/>

						</a>

					{/each}

				</div>

			</section>

		{/if}


		<!-- OPCIONES -->

		<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

			<div class="mb-6">

				<h2 class="text-xl font-black text-slate-900">
					Opciones de propuesta
				</h2>

				<p class="mt-1 text-sm text-slate-500">
					Alternativas presentadas al cliente.
				</p>

			</div>

			<div class="grid gap-5 lg:grid-cols-2">

				{#each opciones as opcion, index}

					<article
						class:border-slate-900={opcion.recomendada}
						class="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
					>

						{#if opcion.imagen_url}

							<img
								src={opcion.imagen_url}
								alt={opcion.nombre}
								class="aspect-video w-full object-cover"
							/>

						{/if}

						<div class="p-6">

							<div class="flex items-start justify-between gap-4">

								<div>

									<p class="text-xs font-bold uppercase tracking-wide text-slate-400">
										Opción {index + 1}
									</p>

									<h3 class="mt-1 text-xl font-black text-slate-900">
										{opcion.nombre}
									</h3>

								</div>

								{#if opcion.recomendada}

									<span class="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
										Recomendada
									</span>

								{/if}

							</div>

							{#if opcion.descripcion}

								<p class="mt-4 whitespace-pre-line leading-relaxed text-slate-600">
									{opcion.descripcion}
								</p>

							{/if}

							<div class="mt-6">

								<p class="text-xs font-bold uppercase tracking-wide text-slate-400">
									Precio
								</p>

								<p class="mt-1 text-3xl font-black text-slate-900">
									{propuesta.moneda} {formatoMoneda(opcion.precio)}
								</p>

							</div>

						</div>

					</article>

				{/each}

			</div>

		</section>


		<!-- RESUMEN -->

		<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

			<div class="grid gap-8 lg:grid-cols-2">

				<div>

					<h2 class="text-xl font-black text-slate-900">
						Condiciones
					</h2>

					<div class="mt-5 space-y-5">

						{#if propuesta.forma_pago}

							<div>

								<p class="text-xs font-bold uppercase tracking-wide text-slate-400">
									Forma de pago
								</p>

								<p class="mt-1 whitespace-pre-line text-slate-700">
									{propuesta.forma_pago}
								</p>

							</div>

						{/if}

						{#if propuesta.vigencia}

							<div>

								<p class="text-xs font-bold uppercase tracking-wide text-slate-400">
									Vigencia
								</p>

								<p class="mt-1 font-bold text-slate-900">
									{propuesta.vigencia}
								</p>

							</div>

						{/if}

					</div>

				</div>


				<div class="rounded-2xl bg-slate-900 p-6 text-white">

					<p class="text-sm font-bold uppercase tracking-wide text-slate-400">
						Total de la propuesta
					</p>

					<p class="mt-2 text-4xl font-black">
						{propuesta.moneda} {formatoMoneda(propuesta.total)}
					</p>

					<div class="mt-5 space-y-2 border-t border-white/10 pt-5 text-sm">

						<div class="flex justify-between">
							<span class="text-slate-400">Subtotal</span>
							<span>{propuesta.moneda} {formatoMoneda(propuesta.subtotal)}</span>
						</div>

						<div class="flex justify-between">
							<span class="text-slate-400">Descuento</span>
							<span>{propuesta.moneda} {formatoMoneda(propuesta.descuento)}</span>
						</div>

					</div>

				</div>

			</div>

		</section>


		<!-- ACCIONES -->

		<div class="flex flex-col gap-3 sm:flex-row sm:justify-end">

			<a
				href="/crm/propuestas"
				class="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-bold text-slate-700 transition hover:bg-slate-50"
			>
				← Volver a propuestas
			</a>

			<a
				href={`/cotizacion/${propuesta.slug}`}
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-xl bg-slate-900 px-6 py-3 text-center font-bold text-white transition hover:bg-slate-700"
			>
				Abrir propuesta pública ↗
			</a>

		</div>

	</div>

</div>
