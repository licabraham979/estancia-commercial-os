<script>
	import { supabase } from '$lib/supabase/client';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const { propuesta, opciones, fotos } = data;

	let clonando = $state(false);

	let mostrandoPago = $state(false);
let cargandoPago = $state(false);
let paisPago = $state('');
/** @type {Array<Record<string, any>>} */
let cuentasPago = $state([]);
let errorPago = $state('');
let generandoEnlace = $state(false);
let enlacePago = $state('');

function abrirDatosPago() {
	mostrandoPago = true;
	paisPago = '';
	cuentasPago = [];
	errorPago = '';
}

function cerrarDatosPago() {
	mostrandoPago = false;
	paisPago = '';
	cuentasPago = [];
	errorPago = '';
}

/** @param {string} pais */
async function seleccionarPaisPago(pais) {
	paisPago = pais;
	cargandoPago = true;
	cuentasPago = [];
	errorPago = '';

	try {
		const { data: cuentas, error } = await supabase
			.from('cuentas_pago')
			.select('*')
			.eq('pais', pais)
			.eq('activa', true)
			.order('orden', { ascending: true });

		if (error) {
			throw new Error(
				`No se pudieron cargar los datos de pago: ${error.message}`
			);
		}

		cuentasPago = cuentas ?? [];

	} catch (err) {
		console.error('Error cargando datos de pago:', err);

		errorPago =
			err instanceof Error
				? err.message
				: 'No se pudieron cargar los datos de pago.';

	} finally {
		cargandoPago = false;
	}
}

async function generarEnlacePago() {
	if (!propuesta?.id || !paisPago || generandoEnlace) return;

	generandoEnlace = true;
	errorPago = '';
	enlacePago = '';

	try {
		const response = await fetch('/api/enlaces-pago', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				cotizacion_id: propuesta.id,
				pais: paisPago
			})
		});

		const resultado = await response.json();

		if (!response.ok) {
			throw new Error(
				resultado?.error ??
					'No se pudo generar el enlace de pago.'
			);
		}

		enlacePago = new URL(
			resultado.enlace.url,
			window.location.origin
		).href;

	} catch (err) {
		console.error(
			'Error generando enlace de pago:',
			err
		);

		errorPago =
			err instanceof Error
				? err.message
				: 'No se pudo generar el enlace de pago.';

	} finally {
		generandoEnlace = false;
	}
}
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

	async function clonarPropuesta() {
		if (clonando) return;

		const confirmar = confirm(
			'¿Quieres clonar esta propuesta?\\n\\nSe creará una nueva propuesta en estado borrador con toda la información actual.'
		);

		if (!confirmar) return;

		clonando = true;

		try {
			/*
			 * 1. Generar un nuevo slug.
			 *
			 * Conservamos exactamente el mismo título.
			 * El timestamp garantiza que sea único.
			 */
			const slugBase = propuesta.titulo
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '');

			const nuevoSlug = `${slugBase}-${Date.now()}`;

			/*
			 * 2. Crear la nueva propuesta.
			 *
			 * NO copiamos:
			 * - id
			 * - created_at
			 *
			 * Supabase genera esos valores.
			 *
			 * El estado vuelve a borrador.
			 */
			const { data: nuevaPropuesta, error: errorPropuesta } =
				await supabase
					.from('cotizaciones')
					.insert({
						cliente_nombre: propuesta.cliente_nombre,
						cliente_empresa: propuesta.cliente_empresa,
						cliente_whatsapp: propuesta.cliente_whatsapp,
						cliente_email: propuesta.cliente_email,
						titulo: propuesta.titulo,
						descripcion: propuesta.descripcion,
						estado: 'borrador',
						moneda: propuesta.moneda,
						subtotal: propuesta.subtotal,
						descuento: propuesta.descuento,
						total: propuesta.total,
						forma_pago: propuesta.forma_pago,
						vigencia: propuesta.vigencia,
						slug: nuevoSlug
					})
					.select()
					.single();

			if (errorPropuesta) {
				console.error('Error clonando propuesta:', errorPropuesta);
				throw new Error(
					`No se pudo crear la propuesta: ${errorPropuesta.message}`
				);
			}

			/*
			 * 3. Clonar las opciones.
			 *
			 * Se crean registros completamente nuevos.
			 * El cotizacion_id apunta a la nueva propuesta.
			 */
			if (opciones.length > 0) {
				const opcionesClonadas = opciones.map((opcion) => ({
					cotizacion_id: nuevaPropuesta.id,
					nombre: opcion.nombre,
					descripcion: opcion.descripcion,
					precio: opcion.precio,
					imagen_url: opcion.imagen_url,
					recomendada: opcion.recomendada,
					orden: opcion.orden
				}));

				const { error: errorOpciones } = await supabase
					.from('cotizacion_opciones')
					.insert(opcionesClonadas);

				if (errorOpciones) {
					console.error(
						'Error clonando opciones:',
						errorOpciones
					);

					/*
					 * Si falla una relación, eliminamos la propuesta
					 * recién creada para no dejar basura.
					 */
					await supabase
						.from('cotizaciones')
						.delete()
						.eq('id', nuevaPropuesta.id);

					throw new Error(
						`La propuesta se creó, pero no se pudieron copiar las opciones: ${errorOpciones.message}`
					);
				}
			}

			/*
			 * 4. Clonar fotografías.
			 */
			if (fotos.length > 0) {
				const fotosClonadas = fotos.map((foto) => ({
					cotizacion_id: nuevaPropuesta.id,
					url: foto.url,
					orden: foto.orden,
					tipo: foto.tipo
				}));

				const { error: errorFotos } = await supabase
					.from('cotizacion_fotos')
					.insert(fotosClonadas);

				if (errorFotos) {
					console.error(
						'Error clonando fotos:',
						errorFotos
					);

					/*
					 * Limpiamos las relaciones ya creadas.
					 */
					await supabase
						.from('cotizacion_opciones')
						.delete()
						.eq('cotizacion_id', nuevaPropuesta.id);

					await supabase
						.from('cotizaciones')
						.delete()
						.eq('id', nuevaPropuesta.id);

					throw new Error(
						`La propuesta se creó, pero no se pudieron copiar las imágenes: ${errorFotos.message}`
					);
				}
			}

			alert('¡Propuesta clonada correctamente!');

			/*
			 * Abrimos la nueva propuesta.
			 */
			goto(`/crm/propuestas/${nuevaPropuesta.id}`);

		} catch (error) {
			console.error(error);

			alert(
				error instanceof Error
					? error.message
					: 'Ocurrió un error al clonar la propuesta.'
			);

		} finally {
			clonando = false;
		}
	}
</script>

<svelte:head>
	<title>{propuesta.titulo} | Estancia Comercial</title>
</svelte:head>
{#if mostrandoPago}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
	>
		<div
			class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="titulo-datos-pago"
		>
			<!-- ENCABEZADO -->
			<div class="flex items-start justify-between border-b border-slate-200 p-6">
				<div>
					<p class="text-xs font-black uppercase tracking-widest text-emerald-600">
						Estancia Comercial
					</p>

					<h2
						id="titulo-datos-pago"
						class="mt-1 text-2xl font-black text-slate-900"
					>
						Enviar datos de pago
					</h2>

					<p class="mt-2 text-sm text-slate-500">
						Selecciona el país donde realizará el pago el cliente.
					</p>
				</div>

				<button
					type="button"
					onclick={cerrarDatosPago}
					class="rounded-lg px-3 py-2 text-xl font-bold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
					aria-label="Cerrar"
				>
					×
				</button>
			</div>

			<div class="space-y-6 p-6">

				<!-- PAÍSES -->
				{#if !paisPago}
					<div class="grid gap-4 sm:grid-cols-2">

						<button
							type="button"
							onclick={() => seleccionarPaisPago('HN')}
							class="rounded-2xl border-2 border-slate-200 p-6 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
						>
							<div class="text-4xl">🇭🇳</div>

							<div class="mt-4 text-lg font-black text-slate-900">
								Honduras
							</div>

							<div class="mt-1 text-sm text-slate-500">
								Mostrar RTN y cuentas bancarias en lempiras.
							</div>
						</button>

						<button
							type="button"
							onclick={() => seleccionarPaisPago('MX')}
							class="rounded-2xl border-2 border-slate-200 p-6 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
						>
							<div class="text-4xl">🇲🇽</div>

							<div class="mt-4 text-lg font-black text-slate-900">
								México
							</div>

							<div class="mt-1 text-sm text-slate-500">
								Mostrar RFC y cuenta bancaria en pesos mexicanos.
							</div>
						</button>

					</div>
				{:else}

					<!-- VOLVER -->
					<button
						type="button"
						onclick={() => {
							paisPago = '';
							cuentasPago = [];
						}}
						class="text-sm font-bold text-slate-500 transition hover:text-slate-900"
					>
						← Cambiar país
					</button>

					{#if cargandoPago}
						<div class="rounded-xl bg-slate-50 p-8 text-center">
							<div class="font-bold text-slate-700">
								Cargando datos de pago...
							</div>
						</div>

					{:else if errorPago}

						<div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
							{errorPago}
						</div>

					{:else if cuentasPago.length === 0}

						<div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-700">
							No hay cuentas de pago activas configuradas para este país.
						</div>

					{:else}

						<!-- DATOS FISCALES -->
						<div class="rounded-xl border border-slate-200 bg-slate-50 p-5">
							<div class="text-xs font-black uppercase tracking-widest text-slate-500">
								Datos fiscales
							</div>

							<div class="mt-3 flex items-center justify-between">
								<span class="text-sm text-slate-500">
									{paisPago === 'HN' ? 'RTN' : 'RFC'}
								</span>

								<span class="font-bold text-slate-900">
									{cuentasPago[0]?.rfc_rtn ?? 'No configurado'}
								</span>
							</div>
						</div>

					<!-- CUENTAS -->
<div>
	<div class="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
		{paisPago === 'HN'
			? 'Cuentas disponibles'
			: 'Cuenta disponible'}
	</div>

	<div class="space-y-3">
		{#each cuentasPago as cuenta}
			<div class="rounded-xl border border-slate-200 p-5">

				<div class="flex items-start justify-between gap-4">
					<div>
						<div class="font-black text-slate-900">
							{cuenta.banco}
						</div>

						{#if cuenta.titular}
							<div class="mt-1 text-sm text-slate-500">
								{cuenta.titular}
							</div>
						{/if}
					</div>

					<span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
						{cuenta.moneda}
					</span>
				</div>

				<div class="mt-4 space-y-2 text-sm">

					{#if cuenta.numero_cuenta}
						<div class="flex justify-between gap-4">
							<span class="text-slate-500">
								Número de cuenta
							</span>
							<span class="font-bold text-slate-900">
								{cuenta.numero_cuenta}
							</span>
						</div>
					{/if}

					{#if cuenta.clabe}
						<div class="flex justify-between gap-4">
							<span class="text-slate-500">
								CLABE Interbancaria
							</span>
							<span class="font-bold text-slate-900">
								{cuenta.clabe}
							</span>
						</div>
					{/if}

					{#if cuenta.iban}
						<div class="flex justify-between gap-4">
							<span class="text-slate-500">
								IBAN
							</span>
							<span class="break-all text-right font-bold text-slate-900">
								{cuenta.iban}
							</span>
						</div>
					{/if}

				</div>
			</div>
		{/each}
	</div>
</div>

<!-- GENERAR ENLACE DE PAGO -->
<div class="border-t border-slate-200 pt-6">

	<button
		type="button"
		onclick={generarEnlacePago}
		disabled={generandoEnlace}
		class="w-full rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
	>
		{generandoEnlace
			? 'Generando enlace...'
			: '🔗 Generar enlace de pago'}
	</button>

	{#if enlacePago}
		<div class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">

			<div class="text-sm font-bold text-emerald-800">
				Enlace generado
			</div>

			<div class="mt-2 break-all text-sm text-emerald-700">
				{enlacePago}
			</div>

			<button
				type="button"
				onclick={() => navigator.clipboard.writeText(enlacePago)}
				class="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
			>
				📋 Copiar enlace
			</button>

		</div>
	{/if}

</div>

					{/if}
				{/if}

			</div>

			<!-- PIE -->
			<div class="flex justify-end border-t border-slate-200 p-6">
				<button
					type="button"
					onclick={cerrarDatosPago}
					class="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
				>
					Cerrar
				</button>
			</div>

		</div>
	</div>
{/if}
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

			<button
	type="button"
	onclick={clonarPropuesta}
	disabled={clonando}
	class="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
>
	{clonando ? 'Clonando...' : 'Clonar propuesta'}
</button>

<a
	href={`/crm/propuestas/${propuesta.id}/editar`}
	class="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-bold text-slate-700 transition hover:bg-slate-50"
>
	Editar propuesta
</a>
<button
	type="button"
	onclick={abrirDatosPago}
	class="rounded-xl bg-emerald-600 px-6 py-3 text-center font-bold text-white transition hover:bg-emerald-700"
>
	💳 Enviar datos de pago
</button>
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
