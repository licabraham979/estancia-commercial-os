<script>
	const mercados = [
		{
			nombre: 'US30',
			simbolo: 'CAPITALCOM:US30',
			descripcion: 'Dow Jones',
			inicial: '30',
			color: 'blue'
		},
		{
			nombre: 'US100',
			simbolo: 'SKILLING:US100',
			descripcion: 'Nasdaq 100',
			inicial: '100',
			color: 'purple'
		},
		{
			nombre: 'ORO',
			simbolo: 'OANDA:XAUUSD',
			descripcion: 'Gold / USD',
			inicial: 'Au',
			color: 'gold'
		},
		{
			nombre: 'BITCOIN',
			simbolo: 'CRYPTO:BTCUSD',
			descripcion: 'Bitcoin / USD',
			inicial: '₿',
			color: 'orange'
		}
	];
</script>

<svelte:head>
	<title>Trading | Estancia Comercial</title>
	<meta
		name="description"
		content="Centro de análisis, seguimiento y registro de operaciones de trading."
	/>
</svelte:head>

<main class="trading-page">
	<header class="page-header">
		<div>
			<div class="eyebrow">
				<span class="status-dot"></span>
				CENTRO DE ANÁLISIS
			</div>
			<h1>Trading</h1>
			<p>Seguimiento de mercados, eventos y rendimiento operativo.</p>
		</div>

		<div class="header-status">
			<span class="status-label">TradingView</span>
			<span class="pending">Conexión pendiente</span>
		</div>
	</header>

	<section class="market-section">
		<div class="section-heading">
			<div>
				<h2>Mercados vigilados</h2>
				<p>Activos incluidos en el indicador Estancia Trading.</p>
			</div>
			<span class="section-count">04 MERCADOS</span>
		</div>

		<div class="market-grid">
			{#each mercados as mercado}
				<article class={`market-card ${mercado.color}`}>
					<div class="market-top">
						<div class="market-symbol">{mercado.inicial}</div>
						<span class="market-state">EN SEGUIMIENTO</span>
					</div>

					<h3>{mercado.nombre}</h3>
					<p>{mercado.descripcion}</p>
					<div class="market-footer">
						<span>{mercado.simbolo}</span>
						<span class="market-arrow">↗</span>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section class="stats-section">
		<div class="section-heading">
			<div>
				<h2>Resumen operativo</h2>
				<p>Indicadores basados en registros reales.</p>
			</div>
		</div>

		<div class="stats-grid">
			<article class="stat-card">
				<span>Eventos registrados</span>
				<strong>—</strong>
				<small>Contexto y entradas</small>
			</article>

			<article class="stat-card">
				<span>Entradas confirmadas</span>
				<strong>—</strong>
				<small>Según el indicador</small>
			</article>

			<article class="stat-card">
				<span>Operaciones realizadas</span>
				<strong>—</strong>
				<small>Registro manual</small>
			</article>

			<article class="stat-card">
				<span>Resultado acumulado</span>
				<strong>—</strong>
				<small>Ganancias y pérdidas</small>
			</article>
		</div>
	</section>

	<section class="bottom-grid">
		<article class="panel">
			<div class="panel-heading">
				<div>
					<h2>Actividad reciente</h2>
					<p>Últimos eventos recibidos desde TradingView.</p>
				</div>
				<span class="panel-icon">◷</span>
			</div>

			<div class="empty-state">
				<div class="empty-icon">⌁</div>
				<strong>Esperando los primeros eventos</strong>
				<p>
					Aquí aparecerán las transiciones, rupturas,
					confirmaciones y señales detectadas.
				</p>
			</div>
		</article>

		<article class="panel">
			<div class="panel-heading">
				<div>
					<h2>Estado del sistema</h2>
					<p>Componentes de la integración.</p>
				</div>
				<span class="panel-icon">⚙</span>
			</div>

			<div class="system-list">
				<div class="system-row">
					<div>
						<strong>Indicador Pine Script</strong>
						<small>Versión 5.8</small>
					</div>
					<span class="system-badge ready">Compilado</span>
				</div>

				<div class="system-row">
					<div>
						<strong>API de recepción</strong>
						<small>Webhook de TradingView</small>
					</div>
					<span class="system-badge pending">Pendiente</span>
				</div>

				<div class="system-row">
					<div>
						<strong>Base de datos</strong>
						<small>Historial de eventos</small>
					</div>
					<span class="system-badge pending">Pendiente</span>
				</div>

				<div class="system-row">
					<div>
						<strong>Historial y análisis</strong>
						<small>Estadísticas y resultados</small>
					</div>
					<span class="system-badge pending">Pendiente</span>
				</div>
			</div>
		</article>
	</section>

	<footer>
		ESTANCIA TRADING <span>·</span> HERRAMIENTA DE ANÁLISIS Y SEGUIMIENTO
	</footer>
</main>

<style>
	.trading-page {
		width: 100%;
		max-width: 1500px;
		margin: 0 auto;
		padding: 8px 4px 28px;
		color: #111827;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		margin-bottom: 34px;
	}

	.eyebrow {
		display: flex;
		align-items: center;
		gap: 8px;
		color: #64748b;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 1.5px;
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #16a34a;
	}

	h1 {
		margin: 9px 0 5px;
		font-size: clamp(28px, 4vw, 36px);
		font-weight: 800;
		letter-spacing: -1.5px;
	}

	.page-header p,
	.section-heading p,
	.panel-heading p {
		margin: 0;
		color: #64748b;
		font-size: 13px;
	}

	.header-status {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 7px;
	}

	.status-label {
		font-size: 11px;
		color: #64748b;
		font-weight: 600;
	}

	.pending {
		padding: 7px 11px;
		border: 1px solid #fde68a;
		background: #fffbeb;
		border-radius: 20px;
		color: #92400e;
		font-size: 11px;
		font-weight: 700;
	}

	.market-section,
	.stats-section {
		margin-bottom: 32px;
	}

	.section-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		margin-bottom: 16px;
	}

	.section-heading h2,
	.panel-heading h2 {
		margin: 0 0 5px;
		font-size: 17px;
		font-weight: 750;
		letter-spacing: -0.4px;
	}

	.section-count {
		color: #64748b;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 1px;
	}

	.market-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 15px;
	}

	.market-card {
		min-width: 0;
		padding: 19px;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 13px;
		box-shadow: 0 2px 5px rgba(15, 23, 42, 0.025);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.market-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(15, 23, 42, 0.07);
	}

	.market-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-bottom: 19px;
	}

	.market-symbol {
		display: grid;
		place-items: center;
		width: 39px;
		height: 39px;
		border-radius: 11px;
		font-size: 17px;
		font-weight: 800;
		background: #eff6ff;
		color: #2563eb;
	}

	.market-state {
		font-size: 8px;
		font-weight: 800;
		letter-spacing: 0.6px;
		color: #64748b;
	}

	.market-card h3 {
		margin: 0 0 4px;
		font-size: 17px;
		font-weight: 800;
	}

	.market-card > p {
		margin: 0;
		font-size: 12px;
		color: #64748b;
	}

	.market-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 5px;
		margin-top: 19px;
		padding-top: 12px;
		border-top: 1px solid #f1f5f9;
		color: #94a3b8;
		font-size: 9px;
		overflow-wrap: anywhere;
	}

	.market-arrow {
		color: #64748b;
		font-size: 16px;
	}

	.purple .market-symbol {
		background: #f5f3ff;
		color: #7c3aed;
	}

	.gold .market-symbol {
		background: #fffbeb;
		color: #b45309;
	}

	.orange .market-symbol {
		background: #fff7ed;
		color: #ea580c;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 15px;
	}

	.stat-card {
		display: flex;
		flex-direction: column;
		padding: 19px;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
	}

	.stat-card > span {
		color: #64748b;
		font-size: 12px;
		font-weight: 600;
	}

	.stat-card strong {
		margin: 12px 0 5px;
		font-size: 30px;
		letter-spacing: -1px;
	}

	.stat-card small {
		color: #94a3b8;
		font-size: 11px;
	}

	.bottom-grid {
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: 16px;
	}

	.panel {
		min-width: 0;
		padding: 21px;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 13px;
	}

	.panel-heading {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
	}

	.panel-icon {
		font-size: 22px;
		color: #64748b;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 33px 15px 24px;
	}

	.empty-icon {
		display: grid;
		place-items: center;
		width: 45px;
		height: 45px;
		margin-bottom: 13px;
		border-radius: 50%;
		background: #f1f5f9;
		color: #64748b;
		font-size: 27px;
	}

	.empty-state strong {
		font-size: 13px;
	}

	.empty-state p {
		max-width: 310px;
		margin: 7px 0 0;
		color: #94a3b8;
		font-size: 11px;
		line-height: 1.6;
	}

	.system-list {
		margin-top: 17px;
	}

	.system-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		padding: 12px 0;
		border-bottom: 1px solid #f1f5f9;
	}

	.system-row:last-child {
		border-bottom: 0;
	}

	.system-row strong,
	.system-row small {
		display: block;
	}

	.system-row strong {
		font-size: 12px;
	}

	.system-row small {
		margin-top: 4px;
		color: #94a3b8;
		font-size: 10px;
	}

	.system-badge {
		flex-shrink: 0;
		padding: 5px 8px;
		border-radius: 20px;
		font-size: 9px;
		font-weight: 750;
	}

	.system-badge.ready {
		background: #dcfce7;
		color: #166534;
	}

	.system-badge.pending {
		background: #f1f5f9;
		color: #64748b;
	}

	footer {
		margin-top: 30px;
		color: #94a3b8;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 1.2px;
		text-align: right;
	}

	footer span {
		padding: 0 5px;
	}

	@media (max-width: 1050px) {
		.market-grid,
		.stats-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 760px) {
		.page-header {
			align-items: flex-start;
			flex-direction: column;
		}

		.header-status {
			align-items: flex-start;
		}

		.bottom-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 460px) {
		.market-grid,
		.stats-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
