<script>
	let {
		propuesta
	} = $props();

const estados = {
	borrador: 'Borrador',
	publicada: 'Publicada',
	vista: 'Vista',
	aceptada: 'Aceptada',
	rechazada: 'Rechazada',
	vencida: 'Vencida'
};

/** @type {Record<string, string>} */
const estadosTipados = estados;

</script>

<article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

	<div class="flex items-start justify-between gap-4">

		<div>
			<h2 class="text-lg font-bold text-slate-900">
				{propuesta.titulo}
			</h2>

			<p class="mt-1 text-sm text-slate-500">
				{propuesta.cliente_nombre}
				{#if propuesta.cliente_empresa}
					· {propuesta.cliente_empresa}
				{/if}
			</p>
		</div>

		<span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
			{estadosTipados[propuesta.estado] ?? propuesta.estado}
		</span>

	</div>

	<div class="mt-5 flex items-end justify-between">

		<div>
			<p class="text-xs uppercase tracking-wide text-slate-400">
				Total
			</p>

			<p class="text-2xl font-black text-slate-900">
				{propuesta.moneda} {Number(propuesta.total ?? 0).toLocaleString('es-HN', {
					minimumFractionDigits: 2
				})}
			</p>
		</div>

		<a
			href={`/crm/propuestas/${propuesta.id}`}
			class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
		>
			Ver propuesta
		</a>

	</div>

</article>
