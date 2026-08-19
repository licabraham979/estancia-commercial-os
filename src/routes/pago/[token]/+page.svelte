<script>
	let { data } = $props();

	const { enlace, cotizacion, cuentas } = data;

	let segundosRestantes = $state(0);
	let enlaceExpirado = $state(false);

	const calcularSegundosRestantes = () => {
		const expira = new Date(enlace.expira_at).getTime();
		const ahora = Date.now();

		return Math.max(0, Math.floor((expira - ahora) / 1000));
	};

	const actualizarContador = () => {
		segundosRestantes = calcularSegundosRestantes();

		if (segundosRestantes <= 0) {
			enlaceExpirado = true;
		}
	};

	$effect(() => {
		actualizarContador();

		const intervalo = setInterval(actualizarContador, 1000);

		return () => clearInterval(intervalo);
	});

	/** @param {number | string | null | undefined} valor */
	const formatoMoneda = (valor) =>
		new Intl.NumberFormat('es-HN', {
			style: 'currency',
			currency: 'HNL',
			minimumFractionDigits: 2
		}).format(Number(valor ?? 0));

	/** @param {string | Date | null | undefined} fecha */
	const formatoFecha = (fecha) => {
		if (!fecha) return 'Fecha no disponible';

		return new Intl.DateTimeFormat('es-HN', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(fecha));
	};

	/** @param {number} segundos */
	const formatoTiempoRestante = (segundos) => {
		const horas = Math.floor(segundos / 3600);
		const minutos = Math.floor((segundos % 3600) / 60);
		const segundosFinales = segundos % 60;

		return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundosFinales).padStart(2, '0')}`;
	};

	const paisNombre = enlace.pais === 'HN' ? 'Honduras' : 'México';
	const documentoFiscal = enlace.pais === 'HN' ? 'RTN' : 'RFC';
</script>

<svelte:head>
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
	<title>Datos de pago | Estancia Comercial</title>

	<meta
		name="description"
		content="Datos seguros para realizar el pago de tu proyecto."
	/>
</svelte:head>

<div class="min-h-screen bg-slate-50 text-slate-900">

	<header class="border-b border-slate-200 bg-white">
		<div class="mx-auto max-w-4xl px-6 py-5">

			<div class="flex items-center justify-between gap-4">

				<div>
					<div class="text-xl font-black tracking-tight">
						Estancia Comercial
					</div>

					<div class="text-sm text-slate-500">
						Datos de pago
					</div>
				</div>

				<div class="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-700">
					Enlace seguro
				</div>

			</div>

		</div>
	</header>


	<main class="mx-auto max-w-4xl px-6 py-10">

		<!-- ENCABEZADO -->

		<section class="mb-8">

			<div class="mb-3 text-sm font-black uppercase tracking-widest text-emerald-600">
				Instrucciones de pago
			</div>

			<h1 class="text-3xl font-black tracking-tight md:text-4xl">
				Datos para realizar tu pago
			</h1>

			<p class="mt-3 max-w-2xl text-slate-600">
				Utiliza los siguientes datos para realizar el pago correspondiente
				a tu proyecto con Estancia Comercial.
			</p>

		</section>


		<!-- PROPUESTA -->

		<section class="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

			<div class="text-xs font-black uppercase tracking-widest text-slate-400">
				Proyecto
			</div>

			<div class="mt-2 text-xl font-black text-slate-900">
				{cotizacion.titulo}
			</div>

			<div class="mt-1 text-sm text-slate-500">
				{cotizacion.cliente_nombre}
			</div>

			<div class="mt-5 border-t border-slate-100 pt-5">

				<div class="flex items-end justify-between gap-4">

					<div>
						<div class="text-xs font-bold uppercase tracking-wider text-slate-400">
							Importe de referencia
						</div>
					</div>

					<div class="text-3xl font-black text-slate-900">
						{formatoMoneda(cotizacion.total)}
					</div>

				</div>

			</div>

		</section>


		<!-- DATOS FISCALES -->

		<section class="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

			<div class="text-xs font-black uppercase tracking-widest text-slate-400">
				Datos fiscales
			</div>

			<div class="mt-4 flex items-center justify-between gap-4">

				<span class="text-sm text-slate-500">
					{documentoFiscal}
				</span>

				<span class="font-black text-slate-900">
					{cuentas[0]?.rfc_rtn ?? 'No configurado'}
				</span>

			</div>

		</section>


		<!-- CUENTAS -->

		<section class="mb-6">

			<div class="mb-4">

				<div class="text-xs font-black uppercase tracking-widest text-emerald-600">
					Cuenta de pago
				</div>

				<h2 class="mt-1 text-2xl font-black">
					Realiza tu transferencia
				</h2>

				<p class="mt-2 text-sm text-slate-500">
					Realiza el pago utilizando una de las cuentas disponibles.
				</p>

			</div>


			<div class="space-y-4">

				{#each cuentas as cuenta}

					<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

						<div class="flex items-start justify-between gap-4">

							<div>

								<div class="text-lg font-black text-slate-900">
									{cuenta.banco}
								</div>

								{#if cuenta.titular}

									<div class="mt-1 text-sm text-slate-500">
										{cuenta.titular}
									</div>

								{/if}

							</div>

							<div class="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
								{cuenta.moneda}
							</div>

						</div>


						<div class="mt-6 space-y-3">

							{#if cuenta.numero_cuenta}

								<div class="rounded-xl bg-slate-50 p-4">

									<div class="text-xs font-bold uppercase tracking-wider text-slate-400">
										Número de cuenta
									</div>

									<div class="mt-1 break-all text-lg font-black text-slate-900">
										{cuenta.numero_cuenta}
									</div>

								</div>

							{/if}


							{#if cuenta.clabe}

								<div class="rounded-xl bg-slate-50 p-4">

									<div class="text-xs font-bold uppercase tracking-wider text-slate-400">
										CLABE interbancaria
									</div>

									<div class="mt-1 break-all text-lg font-black text-slate-900">
										{cuenta.clabe}
									</div>

								</div>

							{/if}


							{#if cuenta.iban}

								<div class="rounded-xl bg-slate-50 p-4">

									<div class="text-xs font-bold uppercase tracking-wider text-slate-400">
										IBAN
									</div>

									<div class="mt-1 break-all text-lg font-black text-slate-900">
										{cuenta.iban}
									</div>

								</div>

							{/if}

						</div>

					</div>

				{/each}

			</div>

		</section>


		<!-- SEGURIDAD -->

		<section class="rounded-3xl border border-amber-200 bg-amber-50 p-6">

			<div class="flex gap-4">

				<div class="text-2xl">
					⏱️
				</div>

				<div>

					<div class="font-black text-amber-900">
						Enlace temporal
					</div>

					<p class="mt-1 text-sm leading-relaxed text-amber-800">
						Este enlace es válido únicamente hasta:
					</p>

					<div class="mt-2 font-black text-amber-900">
						{formatoFecha(enlace.expira_at)}
					</div>

					<p class="mt-3 text-xs leading-relaxed text-amber-700">
						Por seguridad, no compartas este enlace públicamente.
						Si ha expirado, solicita un nuevo enlace de pago.
					</p>

				</div>

			</div>

		</section>


		<!-- PIE -->

		<footer class="py-8 text-center">

			<div class="text-sm font-bold text-slate-500">
				Estancia Comercial
			</div>

			<div class="mt-1 text-xs text-slate-400">
				Datos de pago proporcionados de forma segura.
			</div>

		</footer>

	</main>

</div>
