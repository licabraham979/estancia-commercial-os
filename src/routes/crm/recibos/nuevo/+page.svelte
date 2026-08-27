<script>
	let { data } = $props();

	/** @type {any[]} */
	let cotizaciones = $state(data?.cotizaciones ?? []);

	/** @type {any[]} */
	let mercados = $state(data?.mercados ?? []);

	/** @type {any[]} */
let configuraciones = $state(
	data?.configuraciones ?? []
);

	let cotizacionId = $state('');
	let mercadoId = $state('');

	let clienteNombre = $state('');
	let clienteEmpresa = $state('');

	let concepto = $state('');
	let monto = $state('');
	let moneda = $state('HNL');
	let metodoPago = $state('');
	let referencia = $state('');
	let observaciones = $state('');

	/*
	 * Datos comerciales que quedarán
	 * congelados dentro del recibo.
	 */
	let empresaNombre = $state('');
	let empresaTelefono = $state('');
	let empresaEmail = $state('');
	let empresaWeb = $state('');
	let empresaDireccion = $state('');

	let cargando = $state(false);
	
	let guardando = $state(false);
	let error = $state('');

	

	

	

	/** @param {string} id */
function seleccionarMercado(id) {
	mercadoId = id;

	if (!id) {
		empresaNombre = '';
		empresaTelefono = '';
		empresaEmail = '';
		empresaWeb = '';
		empresaDireccion = '';
		return;
	}

	const mercado = mercados.find(
		(item) => item.id === id
	);

	console.log(
		'MERCADO SELECCIONADO:',
		mercado
	);

	/*
	 * El mercado propone una moneda inicial,
	 * pero NO obliga la moneda del pago.
	 */
	if (mercado?.moneda) {
		moneda = mercado.moneda;
	}

	const configuracion =
		configuraciones.find(
			(item) => item.mercado_id === id
		);

	console.log(
		'CONFIGURACION RECIBIDA:',
		configuracion
	);

	empresaNombre =
		configuracion?.nombre_comercial ?? '';

	empresaTelefono =
		configuracion?.whatsapp ??
		configuracion?.telefono ??
		'';

	empresaEmail =
		configuracion?.email ?? '';

	empresaWeb =
		configuracion?.sitio_web ?? '';

	empresaDireccion =
		configuracion?.direccion ?? '';
}

	function seleccionarCotizacion() {
		const cotizacion = cotizaciones.find(
			(item) => item.id === cotizacionId
		);

		if (!cotizacion) {
			clienteNombre = '';
			clienteEmpresa = '';
			return;
		}

		clienteNombre =
			cotizacion.cliente_nombre ?? '';

		clienteEmpresa =
			cotizacion.cliente_empresa ?? '';

		/*
		 * La cotización propone la moneda inicial.
		 * El usuario puede cambiarla después.
		 */
		if (cotizacion.moneda) {
			moneda = cotizacion.moneda;
		}

		if (!concepto) {
			concepto =
				`Pago correspondiente a ${cotizacion.titulo}`;
		}
	}

	function volver() {
		window.location.href =
			'/crm/recibos';
	}

	async function guardarRecibo() {
		if (guardando) return;

		error = '';

		if (!mercadoId) {
			error =
				'Selecciona el mercado que emitirá el recibo.';
			return;
		}

		if (!cotizacionId) {
			error =
				'Selecciona una cotización.';
			return;
		}

		if (!clienteNombre.trim()) {
			error =
				'El cliente es obligatorio.';
			return;
		}

		if (!concepto.trim()) {
			error =
				'El concepto es obligatorio.';
			return;
		}

		const montoNumerico =
			Number(monto);

		if (
			!Number.isFinite(montoNumerico) ||
			montoNumerico <= 0
		) {
			error =
				'Ingresa un monto válido mayor a cero.';
			return;
		}

		guardando = true;

		const respuesta = await fetch(
			'/api/recibos',
			{
				method: 'POST',
				headers: {
					'Content-Type':
						'application/json'
				},
				body: JSON.stringify({
					cotizacion_id:
						cotizacionId,

					mercado_id:
						mercadoId,

					cliente_nombre:
						clienteNombre.trim(),

					cliente_empresa:
						clienteEmpresa.trim() ||
						null,

					concepto:
						concepto.trim(),

					monto:
						montoNumerico,

					moneda,

					metodo_pago:
						metodoPago || null,

					referencia:
						referencia.trim() ||
						null,

					observaciones:
						observaciones.trim() ||
						null,

					empresa_nombre:
						empresaNombre.trim() ||
						null,

					empresa_telefono:
						empresaTelefono.trim() ||
						null,

					empresa_email:
						empresaEmail.trim() ||
						null,

					empresa_web:
						empresaWeb.trim() ||
						null,

					empresa_direccion:
						empresaDireccion.trim() ||
						null
				})
			}
		);

		const resultado =
			await respuesta.json();

		if (!respuesta.ok) {
			console.error(
				'Error creando recibo:',
				resultado
			);

			error =
				`No se pudo crear el recibo: ${
					resultado.error ??
					'Error desconocido'
				}`;

			guardando = false;
			return;
		}

		window.location.href =
			`/crm/recibos/${resultado.id}`;
	}
</script>
<svelte:head>
	<title>Nuevo recibo | Estancia Comercial</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 p-6 lg:p-8">

	<div class="mx-auto max-w-4xl">

		<div class="mb-8 flex items-center justify-between gap-4">

			<div>
				<p class="text-sm font-bold uppercase tracking-widest text-cyan-600">
					Recibos
				</p>

				<h1 class="mt-1 text-3xl font-black text-slate-900">
					Nuevo recibo
				</h1>

				<p class="mt-2 text-slate-500">
					Registra un pago recibido de un cliente.
				</p>
			</div>

			<button
				type="button"
				onclick={volver}
				class="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
			>
				Cancelar
			</button>

		</div>

		{#if error}

			<div class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">

				<div class="font-black text-red-800">
					No se pudo guardar
				</div>

				<div class="mt-1 text-sm text-red-600">
					{error}
				</div>

			</div>

		{/if}

		<div class="space-y-6">

			<!-- COTIZACIÓN -->

			<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

				<h2 class="text-lg font-black text-slate-900">
					Origen del pago
				</h2>

				<p class="mt-1 text-sm text-slate-500">
					Relaciona el recibo con una cotización existente.
				</p>

				<div class="mt-5">

					<label class="mb-2 block text-sm font-bold text-slate-700">
						Cotización
					</label>

					{#if cargando}

						<div class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
							Cargando cotizaciones...
						</div>

					{:else}

						<select
							bind:value={cotizacionId}
							onchange={seleccionarCotizacion}
							class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
						>

							<option value="">
								Seleccionar cotización
							</option>

							{#each cotizaciones as cotizacion}

								<option value={cotizacion.id}>
									{cotizacion.titulo} — {cotizacion.cliente_nombre} — L {cotizacion.total}
								</option>

							{/each}

						</select>

					{/if}

				</div>

			</section>

<!-- MERCADO EMISOR -->

<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

	<div class="flex items-start gap-4">

		<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg text-white">
			⚙
		</div>

		<div>
			<h2 class="text-lg font-black text-slate-900">
				Mercado emisor
			</h2>

			<p class="mt-1 text-sm text-slate-500">
				Selecciona desde qué operación comercial se emitirá este recibo.
			</p>
		</div>

	</div>

	<div class="mt-5">

		<label class="mb-2 block text-sm font-bold text-slate-700">
			País / mercado
		</label>

		{#if mercados.length === 0}
			<div class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
				Cargando mercados...
			</div>

		{:else}

			<select
				value={mercadoId}
				onchange={(event) => seleccionarMercado(event.currentTarget.value)}
				class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
			>

				<option value="">
					Seleccionar mercado emisor
				</option>

				{#each mercados as mercado}

					<option value={mercado.id}>
						{mercado.bandera ?? ''} {mercado.nombre} — {mercado.codigo_pais}
					</option>

				{/each}

			</select>

		{/if}

	</div>

	{#if mercadoId && empresaNombre}

		<div class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">

			<div class="text-xs font-black uppercase tracking-wider text-slate-400">
				Datos que quedarán en el recibo
			</div>

			<div class="mt-3 font-black text-slate-900">
				{empresaNombre}
			</div>

			{#if empresaTelefono}
				<div class="mt-1 text-sm text-slate-600">
					{empresaTelefono}
				</div>
			{/if}

			{#if empresaEmail}
				<div class="mt-1 text-sm text-slate-600">
					{empresaEmail}
				</div>
			{/if}

		</div>

	{/if}

</section>
			<!-- CLIENTE -->

			<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

				<h2 class="text-lg font-black text-slate-900">
					Cliente
				</h2>

				<div class="mt-5 grid gap-5 md:grid-cols-2">

					<div>

						<label class="mb-2 block text-sm font-bold text-slate-700">
							Nombre
						</label>

						<input
							type="text"
							bind:value={clienteNombre}
							readonly
							class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700"
						/>

					</div>

					<div>

						<label class="mb-2 block text-sm font-bold text-slate-700">
							Empresa
						</label>

						<input
							type="text"
							bind:value={clienteEmpresa}
							readonly
							placeholder="Sin empresa"
							class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700"
						/>

					</div>

				</div>

			</section>


			<!-- PAGO -->

			<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

				<h2 class="text-lg font-black text-slate-900">
					Información del pago
				</h2>

				<div class="mt-5 space-y-5">

					<div>

						<label class="mb-2 block text-sm font-bold text-slate-700">
							Concepto
						</label>

						<input
							type="text"
							bind:value={concepto}
							placeholder="Ej. Anticipo para fabricación de rótulo"
							class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
						/>

					</div>


					<div class="grid gap-5 md:grid-cols-2">

						<div>

							<label class="mb-2 block text-sm font-bold text-slate-700">
								Monto recibido
							</label>

							<input
								type="number"
								min="0.01"
								step="0.01"
								bind:value={monto}
								placeholder="0.00"
								class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
							/>

						</div>


						<div>

							<label class="mb-2 block text-sm font-bold text-slate-700">
								Moneda
							</label>

							<select
								bind:value={moneda}
								class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
							>

								<option value="HNL">
									HNL — Lempiras
								</option>

								<option value="MXN">
									MXN — Pesos mexicanos
								</option>

								<option value="USD">
									USD — Dólares
								</option>

							</select>

						</div>

					</div>


					<div class="grid gap-5 md:grid-cols-2">

						<div>

							<label class="mb-2 block text-sm font-bold text-slate-700">
								Método de pago
							</label>

							<select
								bind:value={metodoPago}
								class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
							>

								<option value="">
									Seleccionar método
								</option>

								<option value="efectivo">
									Efectivo
								</option>

								<option value="transferencia">
									Transferencia bancaria
								</option>

								<option value="deposito">
									Depósito bancario
								</option>

								<option value="tarjeta">
									Tarjeta
								</option>

								<option value="otro">
									Otro
								</option>

							</select>

						</div>


						<div>

							<label class="mb-2 block text-sm font-bold text-slate-700">
								Referencia
							</label>

							<input
								type="text"
								bind:value={referencia}
								placeholder="No. de transferencia, depósito, etc."
								class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
							/>

						</div>

					</div>


					<div>

						<label class="mb-2 block text-sm font-bold text-slate-700">
							Observaciones
						</label>

						<textarea
							bind:value={observaciones}
							rows="4"
							placeholder="Información adicional sobre el pago..."
							class="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
						></textarea>

					</div>

				</div>

			</section>


			<!-- ACCIONES -->

			<div class="flex justify-end">

				<button
					type="button"
					onclick={guardarRecibo}
					disabled={guardando || cargando}
					class="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
				>

					{guardando
						? 'Emitiendo recibo...'
						: '✓ Emitir recibo'}

				</button>

			</div>

		</div>

	</div>

</div>