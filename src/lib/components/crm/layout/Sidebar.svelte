<script>
	import { page } from '$app/state';

	const menu = [
		{ nombre: 'Dashboard', ruta: '/crm' },
		{ nombre: 'Clientes', ruta: '/crm/clientes' },
		{ nombre: 'Pipeline', ruta: '/crm/pipeline' },
		{ nombre: 'Catálogo Maestro', ruta: '/crm/catalogo' },
		{ nombre: 'Cotizaciones', ruta: '/crm/cotizaciones' },
		{ nombre: 'Propuestas', ruta: '/crm/propuestas' },
		{ nombre: 'Campañas', ruta: '/crm/campanas' },
		{ nombre: 'Actividades', ruta: '/crm/actividades' },
		{ nombre: 'Recibos', ruta: '/crm/recibos' },
		{ nombre: 'Reportes', ruta: '/crm/reportes' },
		{ nombre: 'Dirección para mis clientes — reportes', ruta: '/portal' },
		{ nombre: 'Nuevo Cliente', ruta: '/crm/clientes/nuevo' }
	];

	const herramientas = [
		{ nombre: 'Trading', ruta: '/crm/trading' }
	];

	/** @param {string} ruta */
	function estaActivo(ruta) {
		if (ruta === '/crm') return page.url.pathname === ruta;

		return (
			page.url.pathname === ruta ||
			(ruta === '/crm/trading' &&
				page.url.pathname.startsWith('/crm/trading/'))
		);
	}
</script>

<aside class="sidebar">
	<h2>ESTANCIA <span>COMERCIAL</span></h2>

	<div class="grupo">
		<p>GESTIÓN COMERCIAL</p>
		<nav>
			{#each menu as item}
				<a href={item.ruta} class:activo={estaActivo(item.ruta)}>
					{item.nombre}
				</a>
			{/each}
		</nav>
	</div>

	<div class="grupo herramientas">
		<p>HERRAMIENTAS</p>
		<nav>
			{#each herramientas as item}
				<a
					href={item.ruta}
					class:activo={estaActivo(item.ruta)}
					class="trading-link"
				>
					<span class="trading-icon">↗</span>
					{item.nombre}
					<span class="nuevo">ANÁLISIS</span>
				</a>
			{/each}
		</nav>
	</div>
</aside>

<style>
	.sidebar {
		width: 240px;
		flex-shrink: 0;
		padding: 24px 16px;
		background: #111827;
		color: white;
		min-height: 100vh;
		box-sizing: border-box;
	}

	h2 {
		font-size: 17px;
		letter-spacing: 1px;
		margin: 0 0 34px;
		padding: 0 8px;
	}

	h2 span {
		display: block;
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 2px;
		color: #9ca3af;
		margin-top: 4px;
	}

	.grupo {
		margin-bottom: 28px;
	}

	.grupo p {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 1.3px;
		color: #9ca3af;
		padding: 0 10px;
		margin-bottom: 12px;
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	a {
		display: flex;
		align-items: center;
		gap: 9px;
		color: #d1d5db;
		text-decoration: none;
		padding: 11px 10px;
		border-radius: 8px;
		font-size: 13px;
		transition: background 0.2s, color 0.2s;
	}

	a:hover {
		background: #1f2937;
		color: white;
	}

	a.activo {
		background: #2563eb;
		color: white;
	}

	.trading-link {
		background: rgba(22, 163, 74, 0.10);
		border: 1px solid rgba(74, 222, 128, 0.22);
		color: #bbf7d0;
	}

	.trading-link.activo {
		background: #166534;
		border-color: #22c55e;
		color: white;
	}

	.trading-icon {
		font-size: 18px;
		font-weight: 700;
	}

	.nuevo {
		margin-left: auto;
		font-size: 8px;
		letter-spacing: 0.5px;
		color: #86efac;
	}

	@media (max-width: 760px) {
		.sidebar {
			width: 100%;
			min-height: auto;
		}
	}
</style>
