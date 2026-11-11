<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase/client';

	const mercados = [
		{ nombre: 'US30', simbolo: 'CAPITALCOM:US30', descripcion: 'Dow Jones', inicial: '30', color: 'blue' },
		{ nombre: 'US100', simbolo: 'SKILLING:US100', descripcion: 'Nasdaq 100', inicial: '100', color: 'purple' },
		{ nombre: 'ORO', simbolo: 'OANDA:XAUUSD', descripcion: 'Gold / USD', inicial: 'Au', color: 'gold' },
		{ nombre: 'BITCOIN', simbolo: 'CRYPTO:BTCUSD', descripcion: 'Bitcoin / USD', inicial: '₿', color: 'orange' }
	];

	/** @type {Array<{market: string, snapshot: any}>} */
	let snapshots = $state([]);
	let mercadoSeleccionado = $state('BTCUSD');
	let temporalidadSeleccionada = $state('M1');
	let cargandoSnapshots = $state(false);
	let errorSnapshots = $state('');
	/** @type {Array<any>} */
	let eventos = $state([]);
	let resumenEventos = $state({ eventos_registrados: 0, entradas_confirmadas: 0, operaciones_realizadas: 0, resultado_acumulado: 0 });
	let cargandoEventos = $state(false);
	let errorEventos = $state('');

	let snapshotActual = $derived(
		snapshots.find((item) => item.market === mercadoSeleccionado)?.snapshot ?? null
	);
	let datosTF = $derived(
		snapshotActual?.timeframes?.[temporalidadSeleccionada] ?? null
	);

	onMount(() => {
		cargarSnapshots();
		cargarEventos();
	});

	async function cargarSnapshots() {
		cargandoSnapshots = true;
		errorSnapshots = '';

		try {
			const { data: { session } } = await supabase.auth.getSession();

			if (!session?.access_token) {
				throw new Error('No se encontró una sesión activa.');
			}

			const response = await fetch('/api/mt5/snapshots', {
				headers: { Authorization: `Bearer ${session.access_token}` }
			});

			const resultado = await response.json();

			if (!response.ok || !resultado.success) {
				throw new Error(resultado.error || 'No se pudieron cargar los datos MT5.');
			}

			snapshots = resultado.snapshots || [];
		} catch (error) {
			errorSnapshots = error instanceof Error
				? error.message
				: 'Error de conexión.';
		} finally {
			cargandoSnapshots = false;
		}
	}

	async function cargarEventos() {
		cargandoEventos = true;
		errorEventos = '';
		try {
			const { data: { session } } = await supabase.auth.getSession();
			if (!session?.access_token) throw new Error('No se encontró una sesión activa.');
			const response = await fetch('/api/mt5/events', {
				headers: { Authorization: `Bearer ${session.access_token}` }
			});
			const resultado = await response.json();
			if (!response.ok || !resultado.success) {
				throw new Error(resultado.error || 'No se pudieron cargar los eventos MT5.');
			}
			eventos = resultado.eventos || [];
			resumenEventos = resultado.resumen || resumenEventos;
		} catch (error) {
			errorEventos = error instanceof Error ? error.message : 'Error de conexión.';
		} finally {
			cargandoEventos = false;
		}
	}

	/** @param {string | null | undefined} tipo */
	function nombreEvento(tipo) {
		/** @type {Record<string, string>} */
		const nombres = {
			ENTRY_SETUP_STARTED: 'Oportunidad detectada',
			ENTRY_SETUP_CONFIRMED: 'Entrada confirmada',
			ENTRY_SETUP_CANCELLED: 'Oportunidad cancelada',
			ENTRY_SETUP_EXPIRED: 'Oportunidad expirada',
			ENTRY_SETUP_MAX_MOVE: 'Movimiento máximo alcanzado'
		};
		const clave = tipo || '';
		return nombres[clave] || String(tipo || 'Evento recibido').replaceAll('_', ' ');
	}

	/** @param {unknown} valor @param {number} [decimales=2] */
	function formato(valor, decimales = 2) {
		if (valor === null || valor === undefined || valor === '') return '—';
		const numero = Number(valor);
		return Number.isFinite(numero) ? numero.toFixed(decimales) : '—';
	}

	/** @param {unknown} estado */
	function tendencia(estado) {
		if (estado === 1) return 'Alcista';
		if (estado === -1) return 'Bajista';
		if (estado === 0) return 'EMAs mezcladas';
		return 'Sin datos';
	}

	/** @param {unknown} direccion */
	function direccionRSI(direccion) {
		if (direccion === 1) return 'Morada sobre amarilla';
		if (direccion === -1) return 'Morada bajo amarilla';
		if (direccion === 0) return 'Líneas iguales';
		return 'Sin datos';
	}

	/** @param {unknown} valor */
	function separacionRSI(valor) {
		if (valor === null || valor === undefined || valor === '') return 'Sin datos';
		const numero = Number(valor);
		if (!Number.isFinite(numero)) return 'Sin datos';
		if (numero < 4) return 'Juntas';
		if (Math.abs(numero - 4) < 0.000001) return 'Normal';
		return 'Separadas';
	}

	/** @param {unknown} estado */
	function estadoATR(estado) {
		if (estado === -1) return 'Bajo';
		if (estado === 0) return 'Normal';
		if (estado === 1) return 'Expansión';
		if (estado === 2) return 'Muy alto';
		return 'Sin datos';
	}

	/** @param {string | number | null | undefined} valor */
	function fecha(valor) {
		if (!valor) return 'Sin recepción';
		return new Date(valor).toLocaleString('es-HN');
	}
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


	<section class="mt5-section">
		<div class="section-heading">
			<div>
				<h2>Lectura multitemporal MT5</h2>
				<p>Datos recibidos desde el EA · Análisis contextual, sin señales automáticas.</p>
			</div>
			<button class="refresh-button" on:click={cargarSnapshots} disabled={cargandoSnapshots}>
				{cargandoSnapshots ? 'Actualizando…' : '↻ Actualizar'}
			</button>
		</div>

		<div class="mt5-toolbar">
			<label>
				<span>Mercado</span>
				<select bind:value={mercadoSeleccionado}>
					<option value="BTCUSD">BTCUSD · Bitcoin</option>
					<option value="US100Cash">US100Cash · Nasdaq 100</option>
					<option value="GOLD">GOLD · Oro</option>
					<option value="US30Cash">US30Cash · Dow Jones</option>
				</select>
			</label>
			<label>
				<span>Temporalidad</span>
				<select bind:value={temporalidadSeleccionada}>
					<option value="M1">M1</option>
					<option value="M5">M5</option>
					<option value="M15">M15</option>
					<option value="M30">M30</option>
					<option value="H4">H4</option>
					<option value="D1">D1</option>
				</select>
			</label>
			<div class="mt5-version">
				<span>EA</span>
				<strong>{snapshotActual?.script_version || '—'}</strong>
			</div>
		</div>

		{#if errorSnapshots}
			<div class="mt5-message error">{errorSnapshots}</div>
		{:else if cargandoSnapshots && !snapshotActual}
			<div class="mt5-message">Consultando los últimos datos recibidos…</div>
		{:else if !snapshotActual}
			<div class="mt5-message">Todavía no hay snapshots disponibles para este mercado.</div>
		{:else}
			<div class="mt5-meta">
				<span>Última recepción: {fecha(snapshotActual.received_at)}</span>
				<span>Vela: {fecha(snapshotActual.bar_time_ms)}</span>
			</div>

			{#if datosTF}
				<div class="mt5-overview">
					<div class="mt5-metric">
						<span>Precio de cierre</span>
						<strong>{formato(datosTF.close, 2)}</strong>
					</div>
					<div class="mt5-metric">
						<span>Orden de EMAs</span>
						<strong>{tendencia(datosTF.trend_state)}</strong>
					</div>
					<div class="mt5-metric">
						<span>Dirección RSI</span>
						<strong>{datosTF.rsi_direction === 1 ? 'Alcista' : datosTF.rsi_direction === -1 ? 'Bajista' : 'Neutral'}</strong>
					</div>
				</div>

				<div class="mt5-data-grid">
					<article class="mt5-card">
						<h3>Medias móviles exponenciales</h3>
						<div class="mt5-values">
							<div><span>EMA 20</span><strong>{formato(datosTF.ema?.['20'], 2)}</strong></div>
							<div><span>EMA 50</span><strong>{formato(datosTF.ema?.['50'], 2)}</strong></div>
							<div><span>EMA 100</span><strong>{formato(datosTF.ema?.['100'], 2)}</strong></div>
							<div><span>EMA 200</span><strong>{formato(datosTF.ema?.['200'], 2)}</strong></div>
						</div>
					</article>

					<article class="mt5-card">
						<h3>RSI · 14</h3>
						<div class="mt5-values">
							<div><span>RSI morado</span><strong>{formato(datosTF.rsi)}</strong></div>
							<div><span>Media amarilla</span><strong>{formato(datosTF.rsi_ma)}</strong></div>
							<div><span>Separación</span><strong>{formato(datosTF.rsi_separation)}</strong></div>
							<div><span>Lectura</span><strong>{separacionRSI(datosTF.rsi_separation)}</strong></div>
						</div>
						<p class="mt5-note">{direccionRSI(datosTF.rsi_direction)}</p>
					</article>
				</div>

				<article class="mt5-card atr-card">
					<div>
						<h3>Volatilidad · ATR M5</h3>
						<p>Contexto de volatilidad del mercado, independiente de la temporalidad seleccionada.</p>
					</div>
					<div class="atr-values">
						<div><span>ATR actual</span><strong>{formato(snapshotActual.atr_m5?.value, 4)}</strong></div>
						<div><span>Promedio</span><strong>{formato(snapshotActual.atr_m5?.average, 4)}</strong></div>
						<div><span>Relación</span><strong>{formato(snapshotActual.atr_m5?.ratio, 2)}×</strong></div>
						<div><span>Estado</span><strong>{estadoATR(snapshotActual.atr_m5?.state)}</strong></div>
					</div>
				</article>
			{:else}
				<div class="mt5-message">No hay datos para la temporalidad seleccionada.</div>
			{/if}
		{/if}
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
				<strong>{resumenEventos.eventos_registrados}</strong>
				<small>Contexto y entradas recibidos</small>
			</article>

			<article class="stat-card">
				<span>Entradas confirmadas</span>
				<strong>{resumenEventos.entradas_confirmadas}</strong>
				<small>Confirmaciones del indicador</small>
			</article>

			<article class="stat-card">
				<span>Operaciones realizadas</span>
				<strong>{resumenEventos.operaciones_realizadas}</strong>
				<small>Operaciones registradas</small>
			</article>

			<article class="stat-card">
				<span>Resultado acumulado</span>
				<strong>{formato(resumenEventos.resultado_acumulado, 2)}</strong>
				<small>Resultado de operaciones cerradas</small>
			</article>
		</div>
	</section>

	<section class="bottom-grid">
		<article class="panel">
			<div class="panel-heading">
				<div>
					<h2>Actividad reciente</h2>
					<p>Últimas transiciones recibidas y guardadas desde MT5.</p>
				</div>
				<span class="panel-icon">◷</span>
			</div>

			{#if errorEventos}
				<div class="mt5-message error">{errorEventos}</div>
			{:else if cargandoEventos && eventos.length === 0}
				<div class="empty-state"><strong>Cargando historial MT5…</strong></div>
			{:else if eventos.length > 0}
				<div class="event-list">
					{#each eventos as evento (evento.id)}
						<div class="event-row">
							<div class="event-main">
								<strong>{nombreEvento(evento.event_type)}</strong>
								<span>{evento.market} · {evento.side || '—'} · {evento.route || '—'}</span>
							</div>
							<div class="event-detail">
								<strong>{formato(evento.event_price, 2)}</strong>
								<small>{fecha(evento.event_time_ms)}</small>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="empty-state">
					<div class="empty-icon">⌁</div>
					<strong>Sin eventos registrados todavía</strong>
					<p>Cuando el EA detecte una transición de oportunidad, aparecerá aquí.</p>
				</div>
			{/if}
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

	.event-list { margin-top: 15px; }
	.event-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 13px 0; border-bottom: 1px solid #f1f5f9; }
	.event-row:last-child { border-bottom: 0; }
	.event-main, .event-detail { display: grid; gap: 5px; min-width: 0; }
	.event-main strong, .event-detail strong { color: #0f172a; font-size: 12px; }
	.event-main span, .event-detail small { color: #64748b; font-size: 10px; }
	.event-detail { flex-shrink: 0; text-align: right; }

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

	.mt5-section {
		margin-bottom: 32px;
		padding: 22px;
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 14px;
	}
	.refresh-button {
		padding: 9px 13px;
		border: 1px solid #cbd5e1;
		border-radius: 8px;
		background: white;
		color: #334155;
		font-size: 11px;
		font-weight: 700;
		cursor: pointer;
	}
	.refresh-button:disabled { opacity: .6; cursor: wait; }
	.mt5-toolbar {
		display: flex;
		align-items: end;
		gap: 14px;
		flex-wrap: wrap;
		margin: 20px 0 14px;
	}
	.mt5-toolbar label { display: grid; gap: 6px; min-width: 170px; }
	.mt5-toolbar label span, .mt5-version span {
		color: #64748b; font-size: 10px; font-weight: 700;
	}
	.mt5-toolbar select {
		min-height: 38px; padding: 0 10px; border: 1px solid #cbd5e1;
		border-radius: 8px; background: white; color: #0f172a; font-size: 12px;
	}
	.mt5-version { display: grid; gap: 5px; padding: 0 4px 7px; }
	.mt5-version strong { font-size: 12px; }
	.mt5-meta {
		display: flex; flex-wrap: wrap; justify-content: space-between;
		gap: 8px; margin: 12px 0; color: #64748b; font-size: 10px;
	}
	.mt5-message {
		padding: 22px; border: 1px dashed #cbd5e1; border-radius: 10px;
		color: #64748b; background: white; font-size: 12px;
	}
	.mt5-message.error { color: #b91c1c; border-color: #fecaca; }
	.mt5-overview {
		display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px; margin-bottom: 14px;
	}
	.mt5-metric, .mt5-card {
		padding: 16px; border: 1px solid #e2e8f0;
		border-radius: 10px; background: white; min-width: 0;
	}
	.mt5-metric span, .mt5-values span, .atr-values span {
		display: block; color: #64748b; font-size: 10px;
	}
	.mt5-metric strong {
		display: block; margin-top: 8px; color: #0f172a;
		font-size: 17px; overflow-wrap: anywhere;
	}
	.mt5-data-grid {
		display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px; margin-bottom: 14px;
	}
	.mt5-card h3 { margin: 0 0 15px; font-size: 13px; }
	.mt5-values, .atr-values {
		display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
	}
	.mt5-values strong, .atr-values strong {
		display: block; margin-top: 5px; color: #0f172a;
		font-size: 13px; overflow-wrap: anywhere;
	}
	.mt5-note {
		margin: 14px 0 0; padding-top: 10px; border-top: 1px solid #f1f5f9;
		color: #64748b; font-size: 10px;
	}
	.atr-card {
		display: flex; align-items: center; justify-content: space-between;
		gap: 20px; flex-wrap: wrap;
	}
	.atr-card h3 { margin-bottom: 5px; }
	.atr-card p { margin: 0; color: #64748b; font-size: 10px; }
	.atr-values { min-width: min(100%, 390px); flex: 1; }
	@media (max-width: 760px) {
		.mt5-overview, .mt5-data-grid { grid-template-columns: 1fr; }
		.atr-card { align-items: stretch; }
	}

</style>
