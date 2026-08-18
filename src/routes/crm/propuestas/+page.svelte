<script>
	import PropuestaCard from '$lib/components/crm/propuestas/PropuestaCard.svelte';

	let propuestas = $state([
		{
			id: 'demo-1',
			titulo: 'Ejemplo de propuesta',
			cliente_nombre: 'Cliente de ejemplo',
			cliente_empresa: 'Empresa',
			estado: 'borrador',
			moneda: 'L',
			total: 0
		}
	]);
</script>

<svelte:head>
	<title>Propuestas | Estancia Comercial</title>
</svelte:head>

<div class="space-y-8 p-8">

	<div class="flex items-center justify-between gap-4">

		<div>
			<h1 class="text-3xl font-black text-slate-900">
				Propuestas
			</h1>

			<p class="mt-2 text-slate-500">
				Crea y administra propuestas comerciales para tus clientes.
			</p>
		</div>

		<a
			href="/crm/propuestas/nueva"
			class="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white transition hover:bg-slate-700"
		>
			+ Nueva propuesta
		</a>

	</div>

	{#if propuestas.length === 0}

		<div class="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

			<div class="text-4xl">
				📄
			</div>

			<h2 class="mt-4 text-xl font-bold text-slate-900">
				Aún no tienes propuestas
			</h2>

			<p class="mx-auto mt-2 max-w-md text-slate-500">
				Crea tu primera propuesta comercial y después podrás compartirla
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
