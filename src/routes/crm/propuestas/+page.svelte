<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase/client';
	import PropuestaCard from '$lib/components/crm/propuestas/PropuestaCard.svelte';

	/** @type {any[]} */
let propuestas = $state([]);
	let cargando = $state(true);
	let error = $state('');

	onMount(async () => {
		await cargarPropuestas();
	});

	async function cargarPropuestas() {
		cargando = true;
		error = '';

		const { data, error: errorSupabase } = await supabase
			.from('cotizaciones')
			.select('*')
			.order('created_at', { ascending: false });

		if (errorSupabase) {
			console.error(errorSupabase);
			error = errorSupabase.message;
			cargando = false;
			return;
		}

		propuestas = data ?? [];
		cargando = false;
	}
</script>

<svelte:head>
	<title>Propuestas | Estancia Comercial</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 p-8">

	<div class="mx-auto max-w-7xl">

		<div class="mb-8 flex items-center justify-between gap-4">

			<div>
				<h1 class="text-3xl font-black text-slate-900">
					Propuestas
				</h1>

				<p class="mt-2 text-slate-500">
					Crea, revisa y comparte tus propuestas comerciales.
				</p>
			</div>

			<a
				href="/crm/propuestas/nueva"
				class="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white transition hover:bg-slate-700"
			>
				+ Nueva propuesta
			</a>

		</div>

		{#if cargando}

			<div class="rounded-2xl border border-slate-200 bg-white p-12 text-center">
				<div class="text-lg font-bold text-slate-700">
					Cargando propuestas...
				</div>
			</div>

		{:else if error}

			<div class="rounded-2xl border border-red-200 bg-red-50 p-6">

				<h2 class="font-black text-red-800">
					No se pudieron cargar las propuestas
				</h2>

				<p class="mt-2 text-sm text-red-600">
					{error}
				</p>

			</div>

		{:else if propuestas.length === 0}

			<div class="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

				<div class="text-4xl">
					📄
				</div>

				<h2 class="mt-4 text-xl font-bold text-slate-900">
					Aún no tienes propuestas
				</h2>

				<p class="mx-auto mt-2 max-w-md text-slate-500">
					Crea tu primera propuesta comercial y podrás compartirla
					con tu cliente mediante una liga.
				</p>

				<a
					href="/crm/propuestas/nueva"
					class="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 font-bold text-white"
				>
					Crear primera propuesta
				</a>

			</div>

		{:else}

			<div class="grid gap-5 lg:grid-cols-2">

				{#each propuestas as propuesta}
					<PropuestaCard {propuesta} />
				{/each}

			</div>

		{/if}

	</div>

</div>