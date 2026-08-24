<script>
/** @type {{ data: any }} */
let { data } = $props();

const { recibo, cotizacion, resumen } = data;

	/** @param {number | string | null | undefined} valor */
const formatoMoneda = (valor, moneda = 'HNL') => {
	const codigoMoneda =
		moneda === 'L' ? 'HNL' :
		moneda === '$' ? 'USD' :
		moneda === '₱' ? 'MXN' :
		moneda;

	return new Intl.NumberFormat('es-HN', {
		style: 'currency',
		currency: codigoMoneda,
		minimumFractionDigits: 2
	}).format(Number(valor ?? 0));
};

/** @param {string | Date | null | undefined} fecha */
const formatoFecha = (fecha) => {
	if (!fecha) return 'Fecha no disponible';

	return new Intl.DateTimeFormat('es-HN', {
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(new Date(fecha));
};

/** @param {string | null | undefined} metodo */
const metodoPagoNombre = (metodo) => {
	/** @type {Record<string, string>} */
	const metodos = {
		efectivo: 'Efectivo',
		transferencia: 'Transferencia bancaria',
		deposito: 'Depósito bancario',
		tarjeta: 'Tarjeta',
		otro: 'Otro'
	};

	return metodos[metodo ?? ''] ?? metodo ?? 'No especificado';
};

	function volver() {
		window.location.href = '/crm/recibos';
	}

	function imprimir() {
		window.print();
	}
</script>

<svelte:head>
	<title>{recibo.folio} | Estancia Comercial</title>
</svelte:head>

<div class="page">

	<!-- ACCIONES -->
	<div class="actions no-print">

		<button
			type="button"
			onclick={volver}
			class="action secondary"
		>
			← Volver a recibos
		</button>

		<button
			type="button"
			onclick={imprimir}
			class="action primary"
		>
			🖨 Imprimir / Guardar PDF
		</button>

	</div>


	<!-- RECIBO -->
	<div class="sheet">

		<div class="roofline"></div>


		<!-- HEADER -->
		<header class="header">

			<div class="brand-mark">

				<div class="glyph">
					<span class="glyph-line one"></span>
					<span class="glyph-line two"></span>
				</div>

				<div>

					<div class="brand-name">
						ESTANCIA COMERCIAL
					</div>

					<div class="brand-tag">
						MANTENIMIENTO DE LÁMINA · IMAGEN COMERCIAL
					</div>

				</div>

			</div>


			<div class="doc-id">

				<div class="doc-title">
					RECIBO DE PAGO
				</div>

				<div class="doc-num">
					N.° {recibo.folio}
				</div>

				<div class="doc-date">
					Fecha de emisión: {formatoFecha(recibo.fecha_pago)}
				</div>

			</div>

		</header>


		<!-- BODY -->
		<main class="body">


			<!-- CLIENTE / PROYECTO -->
			<div class="grid-two">


				<div class="card">

					<h3>
						Datos del cliente
					</h3>

					<div class="field">
						<span class="lbl">Nombre</span>
						<span class="val">
							{recibo.cliente_nombre}
						</span>
					</div>

					{#if recibo.cliente_empresa}

						<div class="field">
							<span class="lbl">
								Empresa / negocio
							</span>

							<span class="val">
								{recibo.cliente_empresa}
							</span>
						</div>

					{/if}

					{#if cotizacion.cliente_whatsapp}

						<div class="field">
							<span class="lbl">
								WhatsApp
							</span>

							<span class="val">
								{cotizacion.cliente_whatsapp}
							</span>
						</div>

					{/if}

					{#if cotizacion.cliente_email}

						<div class="field">
							<span class="lbl">
								Correo
							</span>

							<span class="val">
								{cotizacion.cliente_email}
							</span>
						</div>

					{/if}

				</div>


				<div class="card alt">

					<h3>
						Datos del proyecto
					</h3>

					<div class="field">

						<span class="lbl">
							Proyecto
						</span>

						<span class="val">
							{cotizacion.titulo}
						</span>

					</div>

					{#if cotizacion.descripcion}

						<div class="field">

							<span class="lbl">
								Descripción
							</span>

							<span class="val">
								{cotizacion.descripcion}
							</span>

						</div>

					{/if}

					<div class="field">

						<span class="lbl">
							Moneda
						</span>

						<span class="val">
							{recibo.moneda}
						</span>

					</div>

				</div>

			</div>


			<!-- DETALLE -->
			<h2 class="section">
				Detalle del pago
			</h2>


			<table class="pay">

				<thead>

					<tr>
						<th>Concepto</th>
						<th>Descripción</th>
						<th>Método / referencia</th>
						<th>Monto</th>
					</tr>

				</thead>


				<tbody>

					<tr>

						<td>
							{recibo.concepto}
						</td>

						<td>
							{cotizacion.titulo}
						</td>

						<td>

							<div>
								{metodoPagoNombre(recibo.metodo_pago)}
							</div>

							{#if recibo.referencia}

								<div class="reference">
									Ref. {recibo.referencia}
								</div>

							{/if}

						</td>

						<td>
							{formatoMoneda(
								recibo.monto,
								recibo.moneda
							)}
						</td>

					</tr>

				</tbody>

			</table>


			<!-- RESUMEN -->
			<div class="summary-wrap">


				<div class="summary-list">

					<div class="field">

						<span class="lbl">
							Total del proyecto
						</span>

						<span class="val">
							{formatoMoneda(
								resumen.totalProyecto,
								cotizacion.moneda
							)}
						</span>

					</div>


					<div class="field">

						<span class="lbl">
							Pagado anteriormente
						</span>

						<span class="val">
							{formatoMoneda(
								resumen.pagadoAnteriormente,
								recibo.moneda
							)}
						</span>

					</div>


					<div class="field">

						<span class="lbl">
							Pago recibido en este recibo
						</span>

						<span class="val">
							{formatoMoneda(
								resumen.pagoActual,
								recibo.moneda
							)}
						</span>

					</div>


					<div class="field">

						<span class="lbl">
							Total pagado acumulado
						</span>

						<span class="val">
							{formatoMoneda(
								resumen.totalPagado,
								recibo.moneda
							)}
						</span>

					</div>


					<div class="field saldo">

						<span class="lbl">
							Saldo pendiente
						</span>

						<span class="val">
							{formatoMoneda(
								resumen.saldoPendiente,
								cotizacion.moneda
							)}
						</span>

					</div>

				</div>


				<div class="total-box">

					<div class="t-lbl">
						Total recibido
					</div>

					<div class="t-val">
						{formatoMoneda(
							recibo.monto,
							recibo.moneda
						)}
					</div>

					<div class="status">
						{recibo.estado === 'emitido'
							? 'PAGO EMITIDO'
							: recibo.estado.toUpperCase()}
					</div>

				</div>

			</div>


			<!-- OBSERVACIONES -->
			<h2 class="section">
				Observaciones
			</h2>


			<div class="obs">

				{#if recibo.observaciones}

					{recibo.observaciones}

				{:else}

					Sin observaciones adicionales.

				{/if}

			</div>


			<div class="legend">

				Este recibo acredita únicamente el pago indicado
				en el presente documento.

			</div>

		</main>


		<!-- FOOTER -->
		<footer class="footer">

            <div class="foot-info">

	<b>
		{recibo.empresa_nombre || 'Estancia Comercial'}
	</b>

	<br>

	{#if recibo.empresa_telefono}
		WhatsApp / Tel: {recibo.empresa_telefono}
	{/if}

	{#if recibo.empresa_telefono && recibo.empresa_email}
		&nbsp;·&nbsp;
	{/if}

	{#if recibo.empresa_email}
		{recibo.empresa_email}
	{/if}

	{#if recibo.empresa_web}

		<br>

		{recibo.empresa_web}

	{/if}

	{#if recibo.empresa_direccion}

		<br>

		{recibo.empresa_direccion}

	{/if}

</div>


			<div class="sign">

				<div class="ln"></div>

				<div class="cap">
					Firma / validación
				</div>

			</div>

		</footer>

	</div>

</div>


<style>

	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
	}

	.page {
		--navy: #162439;
		--navy-soft: #233251;
		--teal: #2DD4B8;
		--teal-deep: #189D87;
		--gold: #E7A146;
		--paper: #FFFFFF;
		--mist: #F5F7F8;
		--line: #E4E8EC;
		--ink: #1B2430;
		--ink-soft: #5B6675;

		min-height: 100vh;
		background: #E9ECEE;
		padding: 28px 20px 50px;

		font-family:
			Inter,
			Arial,
			sans-serif;

		color: var(--ink);
	}


	.actions {
		width: 816px;
		max-width: 100%;
		margin: 0 auto 18px;

		display: flex;
		justify-content: space-between;
		gap: 12px;
	}


	.action {
		border: 0;
		border-radius: 10px;
		padding: 12px 18px;

		font-family:
			Inter,
			Arial,
			sans-serif;

		font-weight: 700;
		cursor: pointer;

		transition:
			transform .15s ease,
			background .15s ease;
	}


	.action:hover {
		transform: translateY(-1px);
	}


	.action.primary {
		background: #162439;
		color: white;
	}


	.action.primary:hover {
		background: #233251;
	}


	.action.secondary {
		background: white;
		color: #162439;
		border: 1px solid #D7DDE3;
	}


	.sheet {
		width: 816px;
		min-height: 1056px;
		max-width: 100%;

		margin: 0 auto;

		background: var(--paper);

		position: relative;

		box-shadow:
			0 10px 40px
			rgba(22,36,57,0.15);

		overflow: hidden;
	}


	.roofline {
		position: absolute;

		top: 0;
		left: 0;
		right: 0;

		height: 6px;

		background:
			linear-gradient(
				90deg,
				var(--teal) 0%,
				var(--teal) 60%,
				var(--gold) 60%,
				var(--gold) 100%
			);
	}


	.header {
		padding: 40px 52px 26px;

		display: flex;
		justify-content: space-between;
		align-items: flex-start;

		border-bottom: 1px solid var(--line);
	}


	.brand-mark {
		display: flex;
		align-items: center;
		gap: 12px;
	}


	.glyph {
		width: 44px;
		height: 44px;

		border-radius: 9px;

		background: var(--navy);

		position: relative;
		flex-shrink: 0;
	}


	.glyph-line {
		position: absolute;

		left: 9px;

		height: 3px;

		background: var(--teal);
	}


	.glyph-line.one {
		top: 14px;
		width: 26px;
	}


	.glyph-line.two {
		top: 22px;
		width: 17px;

		background: var(--gold);
	}


	.brand-name {
		font-family:
			Poppins,
			Arial,
			sans-serif;

		font-weight: 700;
		font-size: 16.5px;

		color: var(--navy);

		letter-spacing: .2px;
	}


	.brand-tag {
		font-size: 10.5px;

		color: var(--ink-soft);

		letter-spacing: .4px;

		margin-top: 2px;
	}


	.doc-id {
		text-align: right;
	}


	.doc-title {
		font-family:
			Poppins,
			Arial,
			sans-serif;

		font-weight: 800;
		font-size: 13px;

		letter-spacing: 2.5px;

		color: var(--teal-deep);
	}


	.doc-num {
		font-family:
			Poppins,
			Arial,
			sans-serif;

		font-weight: 700;
		font-size: 22px;

		color: var(--navy);

		margin-top: 4px;
	}


	.doc-date {
		font-size: 11.5px;
		color: var(--ink-soft);
		margin-top: 5px;
	}


	.body {
		padding: 26px 52px 0;
	}


	.grid-two {
		display: grid;

		grid-template-columns:
			1fr 1fr;

		gap: 20px;

		margin-bottom: 22px;
	}


	.card {
		background: var(--mist);

		border: 1px solid var(--line);

		border-left: 3px solid var(--teal);

		border-radius: 6px;

		padding: 16px 18px;
	}


	.card.alt {
		border-left-color: var(--gold);
	}


	.card h3 {
		font-family:
			Poppins,
			Arial,
			sans-serif;

		font-size: 10px;

		font-weight: 700;

		letter-spacing: 1.4px;

		color: var(--navy);

		text-transform: uppercase;

		margin: 0 0 10px;
	}


	.field {
		display: flex;
		justify-content: space-between;
		gap: 16px;

		font-size: 12.5px;

		padding: 5px 0;

		border-bottom: 1px dashed var(--line);
	}


	.field:last-child {
		border-bottom: none;
	}


	.field .lbl {
		color: var(--ink-soft);
	}


	.field .val {
		font-weight: 600;
		color: var(--ink);

		text-align: right;

		max-width: 65%;
	}


	h2.section {
		font-family:
			Poppins,
			Arial,
			sans-serif;

		font-size: 10px;

		font-weight: 700;

		letter-spacing: 1.4px;

		color: var(--navy);

		text-transform: uppercase;

		margin: 0 0 10px;

		display: flex;
		align-items: center;
		gap: 8px;
	}


	h2.section::before {
		content: "";

		width: 14px;
		height: 2px;

		background: var(--gold);

		display: inline-block;
	}


	table.pay {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 22px;
	}


	table.pay thead th {
		background: var(--navy);
		color: white;

		font-family:
			Poppins,
			Arial,
			sans-serif;

		font-size: 10px;

		letter-spacing: .6px;

		text-transform: uppercase;

		font-weight: 600;

		text-align: left;

		padding: 10px 12px;
	}


	table.pay thead th:last-child {
		text-align: right;
	}


	table.pay tbody td {
		padding: 11px 12px;

		font-size: 12.5px;

		border-bottom: 1px solid var(--line);

		color: var(--ink);

		vertical-align: top;
	}


	table.pay tbody td:last-child {
		text-align: right;

		font-weight: 700;

		white-space: nowrap;
	}


	table.pay tbody tr:nth-child(even) {
		background: var(--mist);
	}


	.reference {
		font-size: 10.5px;
		color: var(--ink-soft);
		margin-top: 4px;
	}


	.summary-wrap {
		display: grid;

		grid-template-columns:
			1fr 250px;

		gap: 20px;

		margin-bottom: 22px;

		align-items: stretch;
	}


	.summary-list {
		background: var(--mist);

		border: 1px solid var(--line);

		border-radius: 6px;

		padding: 14px 18px;
	}


	.summary-list .field {
		font-size: 12.5px;
	}


	.summary-list .field .val {
		font-weight: 700;
	}


	.summary-list .saldo {
		margin-top: 4px;
		padding-top: 8px;

		border-top:
			1px solid #CBD3DA;

		border-bottom: none;
	}


	.total-box {
		background: var(--navy);

		border-radius: 6px;

		padding: 16px 18px;

		color: white;

		display: flex;
		flex-direction: column;
		justify-content: center;

		position: relative;

		overflow: hidden;
	}


	.total-box::after {
		content: "";

		position: absolute;

		right: -18px;
		top: -18px;

		width: 70px;
		height: 70px;

		background: var(--teal);

		opacity: .18;

		border-radius: 50%;
	}


	.total-box .t-lbl {
		font-family:
			Poppins,
			Arial,
			sans-serif;

		font-size: 10px;

		letter-spacing: 1.6px;

		color: var(--gold);

		text-transform: uppercase;

		font-weight: 700;
	}


	.total-box .t-val {
		font-family:
			Poppins,
			Arial,
			sans-serif;

		font-size: 27px;

		font-weight: 800;

		margin-top: 6px;
	}


	.status {
		margin-top: 10px;

		font-size: 9px;

		font-weight: 800;

		letter-spacing: 1px;

		color: var(--teal);
	}


	.obs {
		border: 1px solid var(--line);

		border-radius: 6px;

		padding: 14px 18px;

		margin-bottom: 14px;

		min-height: 54px;

		font-size: 12px;

		color: var(--ink-soft);

		line-height: 1.6;
	}


	.legend {
		font-size: 10.5px;

		color: var(--ink-soft);

		font-style: italic;

		padding: 10px 2px 24px;

		border-bottom: 1px solid var(--line);
	}


	.footer {
		padding: 22px 52px 34px;

		display: flex;

		justify-content: space-between;

		align-items: flex-end;

		gap: 30px;
	}


	.foot-info {
		font-size: 11px;

		color: var(--ink-soft);

		line-height: 1.7;
	}


	.foot-info b {
		color: var(--navy);

		font-family:
			Poppins,
			Arial,
			sans-serif;

		font-size: 12.5px;
	}


	.sign {
		width: 220px;

		text-align: center;

		flex-shrink: 0;
	}


	.sign .ln {
		border-top: 1px solid var(--ink);

		margin-bottom: 6px;

		height: 44px;
	}


	.sign .cap {
		font-size: 10.5px;

		color: var(--ink-soft);
	}


	@media (max-width: 850px) {

		.page {
			padding: 15px 10px 30px;
		}

		.header {
			padding: 32px 28px 22px;
		}

		.body {
			padding: 22px 28px 0;
		}

		.footer {
			padding: 20px 28px 28px;
		}

	}


	@media (max-width: 650px) {

		.actions {
			flex-direction: column;
		}

		.action {
			width: 100%;
		}

		.header {
			flex-direction: column;
			gap: 24px;
		}

		.doc-id {
			text-align: left;
		}

		.grid-two,
		.summary-wrap {
			grid-template-columns: 1fr;
		}

		.field {
			flex-direction: column;
			gap: 3px;
		}

		.field .val {
			max-width: 100%;
			text-align: left;
		}

		table.pay {
			font-size: 11px;
		}

		table.pay thead th,
		table.pay tbody td {
			padding: 8px;
		}

		.footer {
			flex-direction: column;
			align-items: stretch;
		}

		.sign {
			width: 100%;
			margin-top: 15px;
		}

	}


	@media print {

		:global(body) {
			background: white;
		}

		.page {
			background: white;
			padding: 0;
			min-height: auto;
		}

		.no-print {
			display: none !important;
		}

		.sheet {
			width: 100%;
			max-width: none;
			min-height: auto;
			box-shadow: none;
			margin: 0;
		}

		@page {
			size: letter;
			margin: 0;
		}

	}

</style>