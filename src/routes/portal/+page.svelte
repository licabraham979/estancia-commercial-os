<script>
	import { supabase } from '$lib/supabase/client';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ReporteCubierta from '$lib/components/reportes/ReporteCubierta.svelte';
let cargando = $state(true);
let cargandoDatos = $state(true);

/** @type {any} */
let reporte = $state(null);

/** @type {any[]} */
let recibos = $state([]);

/** @type {any} */
let resumenPagos = $state(null);

let error = $state('');
	onMount(async () => {
		const {
			data: { session }
		} = await supabase.auth.getSession();

		if (!session) {
			await goto('/portal/login');
			return;
		}

		try {
			const response = await fetch(
				'/api/portal/mantenimiento',
				{
					headers: {
						Authorization:
							`Bearer ${session.access_token}`
					}
				}
			);

			const resultado = await response.json();

			if (!response.ok) {
				throw new Error(
					resultado.error ||
					'No se pudo cargar el mantenimiento.'
				);
			}

			reporte = resultado.reporte;
			recibos = resultado.recibos ?? [];
			resumenPagos = resultado.resumen;
		} catch (err) {
			console.error(
				'Error cargando portal:',
				err
			);

			error =
				err instanceof Error
					? err.message
					: 'No se pudo cargar tu mantenimiento.';
		} finally {
			cargandoDatos = false;
			cargando = false;
		}
	});

	async function cerrarSesion() {
		await supabase.auth.signOut();
		await goto('/portal/login');
	}
</script>

<svelte:head>
	<title>
		{reporte?.titulo || 'Mantenimiento | Estancia Comercial'}
	</title>
</svelte:head>

{#if cargando}
	<div class="loading">
		Cargando...
	</div>
{:else if error}
	<main class="mensaje">
		<h1>No pudimos cargar tu mantenimiento</h1>
		<p>{error}</p>

		<button onclick={cerrarSesion}>
			Cerrar sesión
		</button>
	</main>
{:else if cargandoDatos}
	<div class="loading">
		Cargando tu mantenimiento...
	</div>
{:else if reporte}
	<div class="portal-barra">
		<strong>ESTANCIA COMERCIAL</strong>

		<button onclick={cerrarSesion}>
			Cerrar sesión
		</button>
	</div>

	<ReporteCubierta
		{reporte}
		modoPortal={true}
		{recibos}
		resumenPagos={resumenPagos}
	/>
{:else}
	<main class="mensaje">
		<h1>Aún no hay un mantenimiento disponible</h1>
		<p>
			Tu acceso está activo, pero todavía no hay un
			reporte de mantenimiento asociado.
		</p>

		<button onclick={cerrarSesion}>
			Cerrar sesión
		</button>
	</main>
{/if}

<style>
	:global(body) {
		margin: 0;
		background: #f5f6f8;
	}

	.portal-barra {
		max-width: 850px;
		margin: 0 auto;
		padding: 14px 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-family: 'Segoe UI', Arial, sans-serif;
	}

	.portal-barra strong {
		color: #162439;
		font-size: 12px;
		letter-spacing: .5px;
	}

	.portal-barra button,
	.mensaje button {
		border: none;
		border-radius: 8px;
		padding: 9px 13px;
		background: #162439;
		color: white;
		cursor: pointer;
		font-weight: 600;
	}

	.loading,
	.mensaje {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 10px;
		font-family: 'Segoe UI', Arial, sans-serif;
		color: #162439;
		text-align: center;
	}

	.mensaje p {
		color: #687386;
	}
</style>