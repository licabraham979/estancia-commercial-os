<script>
	let { data } = $props();

	let recibos = $derived(data?.recibos ?? []);
	let error = $derived(data?.error ?? '');

	

	function nuevoRecibo() {
		window.location.href = '/crm/recibos/nuevo';
	}

	/** @param {string} id */
	function verRecibo(id) {
		window.location.href = `/crm/recibos/${id}`;
	}

	/** @param {number|string|null|undefined} monto
	 * @param {string|null|undefined} moneda
	 */
	function formatearMonto(monto, moneda) {
		return new Intl.NumberFormat('es-HN', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(Number(monto ?? 0)) + ` ${moneda ?? ''}`;
	}

	/** @param {string|null|undefined} fecha */
	function formatearFecha(fecha) {
		if (!fecha) return '—';

		return new Intl.DateTimeFormat('es-HN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		}).format(new Date(fecha));
	}
</script>

<svelte:head>
	<title>Recibos | Estancia Comercial</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 p-6 lg:p-8">

	<div class="mx-auto max-w-7xl">

		<!-- ENCABEZADO -->

		<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

			<div>
				<p class="text-sm font-bold uppercase tracking-widest text-cyan-600">
					Administración
				</p>

				<h1 class="mt-1 text-3xl font-black text-slate-900">
					Recibos
				</h1>

				<p class="mt-2 text-slate-500">
					Consulta y administra los pagos recibidos de tus clientes.
				</p>
			</div>

			<button
				type="button"
				onclick={nuevoRecibo}
				class="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
			>
				+ Crear recibo
			</button>

		</div>

		<!-- ERROR -->

		{#if error}

			<div class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">

				<div class="font-black text-red-800">
					No se pudieron cargar los recibos
				</div>

				<div class="mt-1 text-sm text-red-600">
					{error}
				</div>

			</div>

		{/if}

		<!-- RESUMEN -->

		<div class="mb-6 grid gap-4 sm:grid-cols-3">

			<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
				<p class="text-sm font-bold text-slate-500">
					Recibos emitidos
				</p>

				<p class="mt-2 text-3xl font-black text-slate-900">
					{recibos.length}
				</p>
			</div>

			<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
				<p class="text-sm font-bold text-slate-500">
					Recibos HNL
				</p>

				<p class="mt-2 text-3xl font-black text-slate-900">
					{recibos.filter((r) => r.moneda === 'HNL').length}
				</p>
			</div>

			<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
				<p class="text-sm font-bold text-slate-500">
					Último recibo
				</p>

				<p class="mt-2 text-lg font-black text-slate-900">
					{recibos.length
						? formatearFecha(recibos[0].fecha_pago)
						: '—'}
				</p>
			</div>

		</div>

		<!-- LISTADO -->

		<section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

			<div class="border-b border-slate-200 px-6 py-5">

				<h2 class="text-lg font-black text-slate-900">
					Historial de recibos
				</h2>

				<p class="mt-1 text-sm text-slate-500">
					Selecciona un recibo para consultar su detalle.
				</p>

			</div>

			{#if recibos.length === 0}

				<div class="px-6 py-16 text-center">

					<div class="text-5xl">
						🧾
					</div>

					<h3 class="mt-4 text-lg font-black text-slate-900">
						Aún no hay recibos
					</h3>

					<p class="mx-auto mt-2 max-w-md text-sm text-slate-500">
						Cuando registres un pago, aparecerá aquí su historial.
					</p>

					<button
						type="button"
						onclick={nuevoRecibo}
						class="mt-6 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800"
					>
						Crear primer recibo
					</button>

				</div>

			{:else}

				<div class="overflow-x-auto">

					<table class="w-full min-w-[900px]">

						<thead class="bg-slate-50">

							<tr class="border-b border-slate-200 text-left">

								<th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
									Folio
								</th>

								<th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
									Cliente
								</th>

								<th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
									Fecha
								</th>

								<th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
									Concepto
								</th>

								<th class="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-500">
									Monto
								</th>

								<th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
									Método
								</th>

								<th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
									Estado
								</th>

								<th class="px-6 py-4"></th>

							</tr>

						</thead>

						<tbody>

							{#each recibos as recibo}

								<tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50">

									<td class="px-6 py-5">

										<span class="font-black text-slate-900">
											{recibo.folio ?? '—'}
										</span>

									</td>

									<td class="px-6 py-5">

										<div class="font-bold text-slate-900">
											{recibo.cliente_nombre ?? '—'}
										</div>

										{#if recibo.cliente_empresa}

											<div class="mt-1 text-sm text-slate-500">
												{recibo.cliente_empresa}
											</div>

										{/if}

									</td>

									<td class="px-6 py-5 text-sm text-slate-600">
										{formatearFecha(recibo.fecha_pago)}
									</td>

									<td class="max-w-xs px-6 py-5 text-sm text-slate-600">
										{recibo.concepto ?? '—'}
									</td>

									<td class="px-6 py-5 text-right font-black text-slate-900">
										{formatearMonto(recibo.monto, recibo.moneda)}
									</td>

									<td class="px-6 py-5 text-sm text-slate-600">
										{recibo.metodo_pago ?? '—'}
									</td>

									<td class="px-6 py-5">

										<span class="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
											{recibo.estado ?? '—'}
										</span>

									</td>

									<td class="px-6 py-5 text-right">

										<button
											type="button"
											onclick={() => verRecibo(recibo.id)}
											class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
										>
											Ver
										</button>

									</td>

								</tr>

							{/each}

						</tbody>

					</table>

				</div>

			{/if}

		</section>

	</div>

</div>
