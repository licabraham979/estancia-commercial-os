<script>
	import ReporteCubierta from '$lib/components/reportes/ReporteCubierta.svelte';

	let { data } = $props();

	let reporte = $derived(data.reporte);
</script>

<svelte:head>
	<title>
		{reporte?.titulo || 'Reporte | Estancia Comercial'}
	</title>
</svelte:head>

<ReporteCubierta {reporte} />
