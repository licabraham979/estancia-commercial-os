<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase/client';

	/** @type {any[]} */
	let mercados = $state([]);

	let cargando = $state(true);
	let guardando = $state(false);
	let error = $state('');
	let mensaje = $state('');

	onMount(async () => {
		await cargarMercados();
	});

	async function cargarMercados() {
		cargando = true;
		error = '';

		const { data, error: errorSupabase } = await supabase
			.from('mercados')
			.select('*')
			.order('es_mercado_operativo', { ascending: false })
			.order('nombre', { ascending: true });

		if (errorSupabase) {
			console.error('Error cargando mercados:', errorSupabase);
			error = 'No se pudo cargar la configuración comercial.';
			cargando = false;
			return;
		}

		mercados = data ?? [];
		cargando = false;
	}
	/** @param {string} id */
	async function seleccionarMercado(id) {
		if (guardando) return;

		const mercadoActual = mercados.find(
			(mercado) => mercado.es_mercado_operativo
		);

		if (mercadoActual?.id === id) return;

		guardando = true;
		error = '';
		mensaje = '';

		const { error: errorReset } = await supabase
			.from('mercados')
			.update({ es_mercado_operativo: false })
			.eq('es_mercado_operativo', true);

		if (errorReset) {
			console.error('Error desactivando mercado anterior:', errorReset);
			error = 'No se pudo cambiar el mercado operativo.';
			guardando = false;
			return;
		}

		const { error: errorNuevo } = await supabase
			.from('mercados')
			.update({ es_mercado_operativo: true })
			.eq('id', id);

		if (errorNuevo) {
			console.error('Error seleccionando mercado:', errorNuevo);
			error = 'No se pudo seleccionar el nuevo mercado.';
			guardando = false;
			await cargarMercados();
			return;
		}

		await cargarMercados();

		mensaje = 'Mercado operativo actualizado.';
		guardando = false;

		setTimeout(() => {
			mensaje = '';
		}, 3000);
	}
</script>

<svelte:head>
	<title>Configuración comercial | Estancia Comercial</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 p-6 lg:p-10">

	<div class="mx-auto max-w-6xl">

		<!-- ENCABEZADO -->

		<div class="mb-10">

			<div class="flex items-center gap-4">

				<div
					class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-2xl shadow-sm"
				>
					⚙️
				</div>

				<div>

					<p class="text-xs font-black uppercase tracking-[0.22em] text-cyan-600">
						Configuración
					</p>

					<h1 class="mt-1 text-3xl font-black tracking-tight text-slate-900">
						Configuración comercial
					</h1>

				</div>

			</div>

			<p class="mt-4 max-w-2xl text-slate-500">
				Administra el mercado desde el cual opera actualmente tu empresa.
				El CRM utilizará esta configuración para documentos, recibos,
				moneda y canales comerciales.
			</p>

		</div>


		<!-- MENSAJES -->

		{#if error}

			<div class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">

				<div class="font-black text-red-800">
					No se pudo actualizar
				</div>

				<div class="mt-1 text-sm text-red-600">
					{error}
				</div>

			</div>

		{/if}


		{#if mensaje}

			<div class="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

				<div class="font-bold text-emerald-800">
					✓ {mensaje}
				</div>

			</div>

		{/if}


		<!-- MERCADO OPERATIVO -->

		<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">

			<div class="mb-7 flex items-start justify-between gap-6">

				<div>

					<div class="flex items-center gap-2">

						<div class="h-2 w-2 rounded-full bg-cyan-500"></div>

						<h2 class="text-lg font-black text-slate-900">
							Mercado operativo
						</h2>

					</div>

					<p class="mt-2 text-sm text-slate-500">
						Selecciona el país que actualmente representa la operación
						comercial de tu empresa.
					</p>

				</div>

				<div
					class="hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 sm:block"
				>
					Configuración central
				</div>

			</div>


			{#if cargando}

				<div class="grid gap-4 md:grid-cols-3">

					{#each [1, 2, 3] as item}

						<div
							class="h-40 animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
						></div>

					{/each}

				</div>

			{:else}

				<div class="grid gap-4 md:grid-cols-3">

					{#each mercados as mercado}

						<button
							type="button"
							onclick={() => seleccionarMercado(mercado.id)}
							disabled={guardando}
							class={`group relative rounded-2xl border p-5 text-left transition duration-200 ${
								mercado.es_mercado_operativo
									? 'border-cyan-400 bg-cyan-50/50 shadow-md shadow-cyan-100'
									: 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md'
							}`}
						>

							{#if mercado.es_mercado_operativo}

								<div
									class="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-sm font-black text-white"
								>
									✓
								</div>

							{/if}


							<div class="text-4xl">
								{mercado.bandera}
							</div>


							<div class="mt-5">

								<div class="text-lg font-black text-slate-900">
									{mercado.nombre}
								</div>

								<div class="mt-1 text-sm font-semibold text-slate-500">
									{mercado.moneda}
								</div>

							</div>


							<div class="mt-5">

								{#if mercado.es_mercado_operativo}

									<span
										class="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700"
									>
										Mercado actual
									</span>

								{:else if mercado.activo}

									<span
										class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500"
									>
										Disponible
									</span>

								{/if}

							</div>

						</button>

					{/each}

				</div>

			{/if}

		</section>


		<!-- INFORMACIÓN -->

		<section class="mt-6 grid gap-6 lg:grid-cols-2">

			<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

				<div class="flex items-center gap-3">

					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
						🌎
					</div>

					<div>

						<h3 class="font-black text-slate-900">
							Contexto comercial
						</h3>

						<p class="text-sm text-slate-500">
							Una sola selección controla el contexto del CRM.
						</p>

					</div>

				</div>

				<div class="mt-5 space-y-3 text-sm text-slate-600">

					<div class="flex items-center justify-between border-b border-slate-100 pb-3">
						<span>Moneda</span>
						<span class="font-bold text-slate-900">
							Automática
						</span>
					</div>

					<div class="flex items-center justify-between border-b border-slate-100 pb-3">
						<span>Documentos</span>
						<span class="font-bold text-slate-900">
							Automático
						</span>
					</div>

					<div class="flex items-center justify-between">
						<span>Canales comerciales</span>
						<span class="font-bold text-slate-900">
							Por mercado
						</span>
					</div>

				</div>

			</div>


			<div class="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">

				<div class="flex items-center gap-3">

					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
						🔐
					</div>

					<div>

						<h3 class="font-black">
							Información protegida
						</h3>

						<p class="text-sm text-slate-400">
							Los datos sensibles permanecen fuera de esta interfaz.
						</p>

					</div>

				</div>

				<p class="mt-5 text-sm leading-6 text-slate-300">
					Las cuentas bancarias, identificadores de plataformas de pago
					y demás información sensible serán administrados de forma
					separada y no se expondrán innecesariamente en el CRM.
				</p>

			</div>

		</section>

	</div>

</div>
