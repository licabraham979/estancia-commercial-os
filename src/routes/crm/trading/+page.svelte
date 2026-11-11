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
	/** @type {Array<any>} */
	let operaciones = $state([]);
	let cargandoOperaciones = $state(false);
	let errorOperaciones = $state('');
	let mensajeOperaciones = $state('');
	let nuevoMercado = $state('GOLD');
	let nuevoLado = $state('BUY');
	let nuevoPrecio = $state('');
	let nuevoComentario = $state('');
	/** @type {Record<string, string>} */
	let preciosSalida = $state({});
	/** @type {string[]} */
	let seleccionEventos = $state([]);
	/** @type {string[]} */
	let seleccionOperaciones = $state([]);
	let pestanaTrading = $state('registros');


	let snapshotActual = $derived(
		snapshots.find((item) => item.market === mercadoSeleccionado)?.snapshot ?? null
	);
	let datosTF = $derived(
		snapshotActual?.timeframes?.[temporalidadSeleccionada] ?? null
	);

	let rendimiento = $derived(calcularRendimiento());

	/** @returns {{ positivas: number, negativas: number, be: number, tasa: number | null }} */
	function calcularRendimiento() {
		const resultado = { positivas: 0, negativas: 0, be: 0, tasa: /** @type {number | null} */ (null) };
		for (const op of operaciones) {
			if (op.status !== 'CLOSED') continue;
			const entrada = Number(op.entry_price);
			const salida = Number(op.exit_price);
			if (!Number.isFinite(entrada) || !Number.isFinite(salida)) continue;
			if (entrada === salida) {
				resultado.be++;
			} else if (
				(op.side === 'BUY' && salida > entrada) ||
				(op.side === 'SELL' && salida < entrada)
			) {
				resultado.positivas++;
			} else {
				resultado.negativas++;
			}
		}
		const evaluadas = resultado.positivas + resultado.negativas;
		resultado.tasa = evaluadas
			? (resultado.positivas / evaluadas) * 100
			: null;
		return resultado;
	}

	onMount(() => {
		actualizarTodo();
		const intervalo = setInterval(actualizarTodo, 15000);
		return () => clearInterval(intervalo);
	});

	async function actualizarTodo() {
		await Promise.all([cargarSnapshots(), cargarEventos(), cargarOperaciones()]);
	}

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


	async function cargarOperaciones() {
		cargandoOperaciones = true;
		errorOperaciones = '';
		try {
			const { data: { session } } = await supabase.auth.getSession();
			if (!session?.access_token) throw new Error('No se encontró una sesión activa.');

			const response = await fetch('/api/mt5/operations', {
				headers: { Authorization: `Bearer ${session.access_token}` }
			});
			const resultado = await response.json();
			if (!response.ok || !resultado.success) {
				throw new Error(resultado.error || 'No se pudieron cargar las operaciones.');
			}
			operaciones = resultado.operaciones || [];
			resumenEventos = {
				...resumenEventos,
				operaciones_realizadas: operaciones.length
			};
		} catch (error) {
			errorOperaciones = error instanceof Error ? error.message : 'Error de conexión.';
		} finally {
			cargandoOperaciones = false;
		}
	}

	async function tokenActual() {
		const { data: { session } } = await supabase.auth.getSession();
		if (!session?.access_token) throw new Error('No se encontró una sesión activa.');
		return session.access_token;
	}

	/** @param {any} evento */
	async function tomarEvento(evento) {
		mensajeOperaciones = '';
		errorOperaciones = '';
		try {
			const response = await fetch('/api/mt5/operations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${await tokenActual()}`
				},
				body: JSON.stringify({ evento_id: evento.id })
			});
			const resultado = await response.json();
			if (!response.ok || !resultado.success) {
				throw new Error(resultado.error || 'No se pudo tomar la oportunidad.');
			}
			mensajeOperaciones = `Oportunidad ${evento.market} registrada como operación.`;
			await Promise.all([cargarOperaciones(), cargarEventos()]);
		} catch (error) {
			errorOperaciones = error instanceof Error ? error.message : 'No se pudo tomar la oportunidad.';
		}
	}

	async function registrarOperacion() {
		mensajeOperaciones = '';
		errorOperaciones = '';
		try {
			const response = await fetch('/api/mt5/operations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${await tokenActual()}`
				},
				body: JSON.stringify({
					market: nuevoMercado,
					side: nuevoLado,
					entry_price: nuevoPrecio,
					notes: nuevoComentario
				})
			});
			const resultado = await response.json();
			if (!response.ok || !resultado.success) {
				throw new Error(resultado.error || 'No se pudo registrar la operación.');
			}
			nuevoPrecio = '';
			nuevoComentario = '';
			mensajeOperaciones = 'Operación manual registrada.';
			await cargarOperaciones();
		} catch (error) {
			errorOperaciones = error instanceof Error ? error.message : 'No se pudo registrar la operación.';
		}
	}

	/** @param {string} id */
	async function cerrarOperacion(id) {
		const precio = Number(preciosSalida[id]);
		if (!Number.isFinite(precio) || precio <= 0) {
			errorOperaciones = 'Introduce un precio de salida válido.';
			return;
		}
		mensajeOperaciones = '';
		errorOperaciones = '';
		try {
			const response = await fetch(`/api/mt5/operations/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${await tokenActual()}`
				},
				body: JSON.stringify({ exit_price: precio })
			});
			const resultado = await response.json();
			if (!response.ok || !resultado.success) {
				throw new Error(resultado.error || 'No se pudo cerrar la operación.');
			}
			mensajeOperaciones = 'Operación cerrada con el precio de salida indicado.';
			await cargarOperaciones();
		} catch (error) {
			errorOperaciones = error instanceof Error ? error.message : 'No se pudo cerrar la operación.';
		}
	}

	/** @param {string} id @param {'evento' | 'operacion'} tipo */
	function alternarSeleccion(id, tipo) {
		const actual = tipo === 'evento' ? seleccionEventos : seleccionOperaciones;
		const siguiente = actual.includes(id)
			? actual.filter((item) => item !== id)
			: [...actual, id];
		if (tipo === 'evento') seleccionEventos = siguiente;
		else seleccionOperaciones = siguiente;
	}

	async function borrarEventosSeleccionados() {
		if (!seleccionEventos.length) return;
		errorEventos = '';
		try {
			const response = await fetch('/api/mt5/events', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${await tokenActual()}`
				},
				body: JSON.stringify({ ids: seleccionEventos })
			});
			const resultado = await response.json();
			if (!response.ok || !resultado.success) {
				throw new Error(resultado.error || 'No se pudieron eliminar los eventos.');
			}
			seleccionEventos = [];
			await cargarEventos();
		} catch (error) {
			errorEventos = error instanceof Error ? error.message : 'No se pudieron eliminar los eventos.';
		}
	}

	async function borrarOperacionesSeleccionadas() {
		if (!seleccionOperaciones.length) return;
		errorOperaciones = '';
		try {
			const response = await fetch('/api/mt5/operations', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${await tokenActual()}`
				},
				body: JSON.stringify({ ids: seleccionOperaciones })
			});
			const resultado = await response.json();
			if (!response.ok || !resultado.success) {
				throw new Error(resultado.error || 'No se pudieron eliminar las operaciones.');
			}
			seleccionOperaciones = [];
			await Promise.all([cargarOperaciones(), cargarEventos()]);
		} catch (error) {
			errorOperaciones = error instanceof Error ? error.message : 'No se pudieron eliminar las operaciones.';
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

	/** @param {unknown} valor */
	function siNo(valor) {
		if (valor === true) return 'Sí';
		if (valor === false) return 'No';
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
			<button class="refresh-button" on:click={actualizarTodo} disabled={cargandoSnapshots || cargandoEventos}>
				{cargandoSnapshots || cargandoEventos ? 'Actualizando…' : '↻ Actualizar'}
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
				<span>Operaciones positivas</span>
				<strong>{rendimiento.positivas}</strong>
				<small>Salida favorable según BUY / SELL</small>
			</article>

			<article class="stat-card">
				<span>Operaciones negativas</span>
				<strong>{rendimiento.negativas}</strong>
				<small>Salida desfavorable según BUY / SELL</small>
			</article>

			<article class="stat-card">
				<span>Break even (BE)</span>
				<strong>{rendimiento.be}</strong>
				<small>Entrada y salida al mismo precio</small>
			</article>

			<article class="stat-card">
				<span>Porcentaje de acierto</span>
				<strong>{rendimiento.tasa === null ? '—' : `${rendimiento.tasa.toFixed(1)}%`}</strong>
				<small>Positivas / (positivas + negativas)</small>
			</article>
		</div>
		<p class="stats-note">Solo operaciones cerradas. Los BE y las operaciones abiertas no entran en el porcentaje de acierto.</p>
	</section>

	<section class="records-section">
		<div class="trading-tabs" role="tablist" aria-label="Gestión de trading">
			<button
				class:active={pestanaTrading === 'registros'}
				class="trading-tab"
				role="tab"
				aria-selected={pestanaTrading === 'registros'}
				on:click={() => pestanaTrading = 'registros'}
			>
				Registros
				<span>{eventos.length}</span>
			</button>
			<button
				class:active={pestanaTrading === 'ejecuciones'}
				class="trading-tab"
				role="tab"
				aria-selected={pestanaTrading === 'ejecuciones'}
				on:click={() => pestanaTrading = 'ejecuciones'}
			>
				Ejecuciones
				<span>{operaciones.length}</span>
			</button>
		</div>

		{#if pestanaTrading === 'registros'}
			<div class="tab-content">
				<div class="panel">
					<div class="panel-heading">
						<div>
							<h2>Actividad reciente</h2>
							<p>Últimas transiciones recibidas y guardadas desde MT5.</p>
						</div>
						<div class="panel-actions">
							{#if seleccionEventos.length > 0}
								<button class="danger-button" on:click={borrarEventosSeleccionados}>
									Eliminar ({seleccionEventos.length})
								</button>
							{/if}
							<span class="panel-icon">◷</span>
						</div>
					</div>

					{#if errorEventos}
						<div class="mt5-message error">{errorEventos}</div>
					{:else if cargandoEventos && eventos.length === 0}
						<div class="empty-state"><strong>Cargando historial MT5…</strong></div>
					{:else if eventos.length > 0}
						<div class="event-list">
							{#each eventos as evento (evento.id)}
								<div class="event-row">
									<input
										class="row-check"
										type="checkbox"
										checked={seleccionEventos.includes(evento.id)}
										on:change={() => alternarSeleccion(evento.id, 'evento')}
										aria-label="Seleccionar evento"
									/>
									<div class="event-main">
										<strong>{nombreEvento(evento.event_type)}</strong>
										<span>{evento.market} · {evento.side || '—'} · {evento.route || '—'}</span>
									</div>
									<div class="event-detail">
										<strong>{formato(evento.event_price, 2)}</strong>
										<small>{fecha(evento.event_time_ms)}</small>
									</div>
									{#if evento.event_type === 'ENTRY_SETUP_STARTED' || evento.event_type === 'ENTRY_SETUP_CONFIRMED'}
										{#if operaciones.some((op) => op.evento_id === evento.id)}
											<span class="taken-label">Tomada</span>
										{:else}
											<button class="take-button" on:click={() => tomarEvento(evento)}>Tomar</button>
										{/if}
									{/if}
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
				</div>

				{#if errorOperaciones}
					<div class="mt5-message error">{errorOperaciones}</div>
				{/if}
				{#if mensajeOperaciones}
					<div class="mt5-message success">{mensajeOperaciones}</div>
				{/if}

				<div class="panel system-panel">
					<div class="panel-heading">
						<div>
							<h2>Estado del sistema</h2>
							<p>Componentes de la integración.</p>
						</div>
						<span class="panel-icon">⚙</span>
					</div>
					<div class="system-list">
						<div class="system-row">
							<div><strong>Indicador Pine Script</strong><small>Versión 5.8</small></div>
							<span class="system-badge ready">Compilado</span>
						</div>
						<div class="system-row">
							<div><strong>API de recepción</strong><small>Webhook MT5</small></div>
							<span class="system-badge pending">Pendiente</span>
						</div>
						<div class="system-row">
							<div><strong>Base de datos</strong><small>Historial de eventos</small></div>
							<span class="system-badge pending">Pendiente</span>
						</div>
						<div class="system-row">
							<div><strong>Historial y análisis</strong><small>Estadísticas y resultados</small></div>
							<span class="system-badge pending">Pendiente</span>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="tab-content">
				<div class="panel">
					<div class="panel-heading">
						<div>
							<h2>Nueva operación manual</h2>
							<p>Registra una operación que no provenga de una oportunidad MT5.</p>
						</div>
					</div>

					<form class="operation-form" on:submit|preventDefault={registrarOperacion}>
						<label>
							<span>Mercado</span>
							<select bind:value={nuevoMercado}>
								<option value="BTCUSD">BTCUSD</option>
								<option value="US100Cash">US100Cash</option>
								<option value="GOLD">GOLD</option>
								<option value="US30Cash">US30Cash</option>
							</select>
						</label>
						<label>
							<span>Dirección</span>
							<select bind:value={nuevoLado}>
								<option value="BUY">BUY</option>
								<option value="SELL">SELL</option>
							</select>
						</label>
						<label>
							<span>Precio de entrada</span>
							<input type="number" min="0" step="any" bind:value={nuevoPrecio} placeholder="Precio de entrada" required />
						</label>
						<label class="notes-field">
							<span>Nota (opcional)</span>
							<input type="text" bind:value={nuevoComentario} placeholder="Contexto de la operación" />
						</label>
						<button class="take-button form-submit" type="submit">Registrar operación</button>
					</form>
				</div>

				{#if errorOperaciones}
					<div class="mt5-message error">{errorOperaciones}</div>
				{/if}
				{#if mensajeOperaciones}
					<div class="mt5-message success">{mensajeOperaciones}</div>
				{/if}

				<div class="panel">
					<div class="panel-heading">
						<div>
							<h2>Operaciones</h2>
							<p>Entradas tomadas desde Registros y operaciones manuales.</p>
						</div>
						{#if seleccionOperaciones.length > 0}
							<button class="danger-button" on:click={borrarOperacionesSeleccionadas}>
								Eliminar ({seleccionOperaciones.length})
							</button>
						{/if}
					</div>

					{#if cargandoOperaciones && operaciones.length === 0}
						<div class="empty-state"><strong>Cargando operaciones…</strong></div>
					{:else if operaciones.length > 0}
						<div class="operation-list">
							{#each operaciones as operacion (operacion.id)}
								<div class="operation-row">
									<input
										class="row-check"
										type="checkbox"
										checked={seleccionOperaciones.includes(operacion.id)}
										on:change={() => alternarSeleccion(operacion.id, 'operacion')}
										aria-label="Seleccionar operación"
									/>
									<div class="operation-main">
										<strong>{operacion.market} · {operacion.side}</strong>
										<span>Entrada: {formato(operacion.entry_price, 2)} · {fecha(operacion.opened_at)}</span>
										{#if operacion.notes}
											<small>{operacion.notes}</small>
										{/if}
										{#if operacion.contexto_evento?.context}
											{@const ctx = operacion.contexto_evento.context}
											<details class="context-details">
												<summary>Ver contexto técnico de entrada</summary>
												<div class="context-grid">
													<section class="context-block">
														<strong>M1 · EMAs y RSI</strong>
														<span>Tendencia: {tendencia(ctx.M1?.trend_state)}</span>
														<span>RSI: {formato(ctx.M1?.rsi)} · Media: {formato(ctx.M1?.rsi_ma)}</span>
														<span>Separación: {separacionRSI(ctx.M1?.rsi_separation)} · {direccionRSI(ctx.M1?.rsi_direction)}</span>
														<span>EMA 20: {formato(ctx.M1?.ema?.['20'])} · 50: {formato(ctx.M1?.ema?.['50'])}</span>
														<span>EMA 100: {formato(ctx.M1?.ema?.['100'])} · 200: {formato(ctx.M1?.ema?.['200'])}</span>
													</section>
													<section class="context-block">
														<strong>M5 · Estructura y ATR</strong>
														<span>Tendencia: {tendencia(ctx.M5?.trend_state)}</span>
														<span>RSI: {formato(ctx.M5?.rsi)} · Media: {formato(ctx.M5?.rsi_ma)}</span>
														<span>Separación: {separacionRSI(ctx.M5?.rsi_separation)} · {direccionRSI(ctx.M5?.rsi_direction)}</span>
														<span>Velas rojas: {ctx.M5?.red_count ?? '—'} · Verdes: {ctx.M5?.green_count ?? '—'}</span>
														<span>Reacción EMA200: {ctx.M5?.ema200_reaction ?? '—'} · Antigüedad: {ctx.M5?.ema200_reaction_age ?? '—'}</span>
														<span>ATR: {formato(ctx.M5?.atr_value)} · Ratio: {formato(ctx.M5?.atr_ratio)} · {estadoATR(ctx.M5?.atr_state)}</span>
													</section>
													<section class="context-block">
														<strong>M15 · Velas y liquidez</strong>
														<span>Tendencia: {tendencia(ctx.M15?.trend_state)}</span>
														<span>RSI: {formato(ctx.M15?.rsi)} · Media: {formato(ctx.M15?.rsi_ma)}</span>
														<span>Separación: {separacionRSI(ctx.M15?.rsi_separation)} · {direccionRSI(ctx.M15?.rsi_direction)}</span>
														<span>Mecha superior: {formato(ctx.M15?.upper_wick)} · Inferior: {formato(ctx.M15?.lower_wick)}</span>
														<span>Barrido máximo: {siNo(ctx.M15?.sweep_high)} · mínimo: {siNo(ctx.M15?.sweep_low)}</span>
														<span>Rojas: {ctx.M15?.red_closed ?? '—'} · Verdes: {ctx.M15?.green_closed ?? '—'} · Impulso: {siNo(ctx.M15?.impulse)}</span>
														<span>Corona: {ctx.M15?.crown ?? '—'}</span>
													</section>
													<section class="context-block">
														<strong>M30 · Transición</strong>
														<span>Tendencia: {tendencia(ctx.M30?.trend_state)}</span>
														<span>RSI: {formato(ctx.M30?.rsi)} · Media: {formato(ctx.M30?.rsi_ma)}</span>
														<span>Separación: {separacionRSI(ctx.M30?.rsi_separation)} · {direccionRSI(ctx.M30?.rsi_direction)}</span>
														<span>Transición: {ctx.M30?.transition ?? '—'}</span>
														<span>EMA20 bajo EMA100: {siNo(ctx.M30?.ema20_below100)} · Cerca: {siNo(ctx.M30?.ema20_near100)}</span>
														<span>EMA20 cayendo: {siNo(ctx.M30?.ema20_falling)} · RSI cayendo: {siNo(ctx.M30?.rsi_falling)}</span>
														<span>Cruce EMA100 abajo: {siNo(ctx.M30?.cross_down100)} · arriba: {siNo(ctx.M30?.cross_up100)}</span>
													</section>
												</div>
											</details>
										{/if}
									</div>
									{#if operacion.status === 'OPEN'}
										<div class="exit-control">
											<input
												type="number"
												min="0"
												step="any"
												bind:value={preciosSalida[operacion.id]}
												placeholder="Precio salida"
												aria-label="Precio de salida"
											/>
											<button class="close-button" on:click={() => cerrarOperacion(operacion.id)}>Cerrar</button>
										</div>
									{:else}
										<div class="operation-closed">
											<strong>Salida: {formato(operacion.exit_price, 2)}</strong>
											<span>Cerrada · {fecha(operacion.closed_at)}</span>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{:else}
						<div class="empty-state">
							<div class="empty-icon">↗</div>
							<strong>Sin operaciones registradas</strong>
							<p>Toma una oportunidad desde Registros o agrega una operación manual.</p>
						</div>
					{/if}
				</div>
			</div>
		{/if}
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

	.stats-note {
		margin: 10px 2px 0;
		color: #64748b;
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


	.records-section {
		margin: 28px 0 32px;
		border: 1px solid #e2e8f0;
		border-radius: 14px;
		background: #f8fafc;
		overflow: hidden;
	}
	.trading-tabs {
		display: flex;
		gap: 6px;
		padding: 10px 14px 0;
		border-bottom: 1px solid #e2e8f0;
		background: #fff;
	}
	.trading-tab {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		padding: 12px 16px;
		border: 0;
		border-bottom: 2px solid transparent;
		background: transparent;
		color: #64748b;
		font-size: 12px;
		font-weight: 700;
		cursor: pointer;
	}
	.trading-tab.active {
		border-bottom-color: #2563eb;
		color: #1d4ed8;
	}
	.trading-tab span {
		padding: 2px 7px;
		border-radius: 20px;
		background: #f1f5f9;
		font-size: 10px;
	}
	.tab-content {
		display: grid;
		gap: 14px;
		padding: 16px;
	}
	.tab-content .panel {
		min-width: 0;
		padding: 18px;
		border: 1px solid #e2e8f0;
		border-radius: 10px;
		background: #fff;
	}
	.panel-actions {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.row-check {
		width: 15px;
		height: 15px;
		flex: 0 0 auto;
		accent-color: #2563eb;
		cursor: pointer;
	}
	.take-button, .close-button, .danger-button {
		padding: 8px 12px;
		border: 0;
		border-radius: 7px;
		font-size: 11px;
		font-weight: 700;
		cursor: pointer;
		white-space: nowrap;
	}
	.take-button {
		background: #dbeafe;
		color: #1d4ed8;
	}
	.close-button {
		background: #dcfce7;
		color: #166534;
	}
	.danger-button {
		background: #fee2e2;
		color: #b91c1c;
	}
	.taken-label {
		color: #64748b;
		font-size: 10px;
		font-weight: 700;
	}
	.operation-form {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
		align-items: end;
	}
	.operation-form label, .exit-control {
		display: grid;
		gap: 6px;
		min-width: 0;
	}
	.operation-form label span {
		color: #64748b;
		font-size: 10px;
		font-weight: 700;
	}
	.operation-form input, .operation-form select, .exit-control input {
		width: 100%;
		min-width: 0;
		min-height: 38px;
		padding: 0 10px;
		border: 1px solid #cbd5e1;
		border-radius: 7px;
		background: #fff;
		color: #0f172a;
		font-size: 12px;
	}
	.notes-field { grid-column: span 2; }
	.form-submit { min-height: 38px; }
	.operation-list { display: grid; }
	.operation-row {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) minmax(150px, auto);
		align-items: center;
		gap: 14px;
		padding: 13px 0;
		border-bottom: 1px solid #f1f5f9;
	}
	.operation-row:last-child { border-bottom: 0; }
	.operation-main { display: grid; gap: 5px; min-width: 0; }
	.operation-main strong { color: #0f172a; font-size: 12px; }
	.operation-main span, .operation-main small,
	.operation-closed span {
		color: #64748b;
		font-size: 10px;
		overflow-wrap: anywhere;
	}
	.exit-control { grid-template-columns: minmax(100px, 1fr) auto; align-items: center; }
	.operation-closed { display: grid; gap: 5px; text-align: right; }
	.operation-closed strong { color: #166534; font-size: 11px; }

	.context-details {
		margin-top: 7px;
		padding: 8px 10px;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		background: #f8fafc;
	}
	.context-details summary {
		color: #334155;
		font-size: 10px;
		font-weight: 700;
		cursor: pointer;
	}
	.context-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 9px;
		margin-top: 10px;
	}
	.context-block {
		display: grid;
		gap: 4px;
		min-width: 0;
		padding: 8px;
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		background: white;
	}
	.context-block strong {
		color: #0f172a;
		font-size: 10px;
	}
	.context-block span {
		color: #64748b;
		font-size: 9px;
		overflow-wrap: anywhere;
	}
	.mt5-message.success {
		color: #166534;
		border-color: #bbf7d0;
		background: #f0fdf4;
	}
	@media (max-width: 760px) {
		.operation-form { grid-template-columns: repeat(2, minmax(0, 1fr)); }
		.operation-row { grid-template-columns: auto minmax(0, 1fr); }
		.exit-control, .operation-closed { grid-column: 2; text-align: left; }
	}
	@media (max-width: 460px) {
		.tab-content { padding: 10px; }
		.tab-content .panel { padding: 13px; }
		.operation-form { grid-template-columns: 1fr; }
		.notes-field { grid-column: auto; }
		.event-row { flex-wrap: wrap; }
		.event-detail { margin-left: auto; }
	}

</style>
