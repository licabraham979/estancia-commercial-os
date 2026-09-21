<script>
import { actividadesStore } from '$lib/stores/actividades.svelte.js';
import { supabase } from '$lib/supabase/client';

let mostrarAccesoPortal = $state(false);

let creandoAccesoPortal = $state(false);
/** @type {{ esNuevoAcceso: boolean, passwordTemporal: string | null } | null} */
let resultadoPortal = $state(null);
let errorPortal = $state('');

function abrirAccesoPortal() {
	
	resultadoPortal = null;
	errorPortal = '';
	mostrarAccesoPortal = true;
}

function cerrarAccesoPortal() {
	if (creandoAccesoPortal) return;

	mostrarAccesoPortal = false;
	
	resultadoPortal = null;
	errorPortal = '';
}
async function crearAccesoPortal() {
	errorPortal = '';
	resultadoPortal = null;

	if (!reporte.cotizacion?.cliente_whatsapp) {
		errorPortal = 'Esta cotización no tiene teléfono registrado.';
		return;
	}

	if (!reporte.cotizacion_id) {
		errorPortal = 'Este reporte no tiene una cotización vinculada.';
		return;
	}

	creandoAccesoPortal = true;

	try {
		const {
			data: { session }
		} = await supabase.auth.getSession();

		if (!session) {
			errorPortal = 'Tu sesión ha expirado. Vuelve a iniciar sesión.';
			return;
		}

		const response = await fetch('/api/portal/acceso', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session.access_token}`
			},
			body: JSON.stringify({
				nombre: reporte.cotizacion.cliente_nombre,
				telefono: reporte.cotizacion.cliente_whatsapp,
				cotizacion_id: reporte.cotizacion_id
			})
		});

		const resultado = await response.json();

		if (!response.ok) {
			throw new Error(
				resultado.error || 'No se pudo crear el acceso.'
			);
		}

		resultadoPortal = resultado;
	} catch (error) {
		console.error('Error creando acceso:', error);

		errorPortal =
			error instanceof Error
				? error.message
				: 'No se pudo crear el acceso.';
	} finally {
		creandoAccesoPortal = false;
	}
}
	let {
	reporte = {},
	modoPortal = false,
	recibos = [],
	resumenPagos = null
} = $props();

	let zonas = $derived(reporte.zonas ?? []);
let mantenimiento = $derived(reporte.mantenimiento ?? []);
let alertas = $derived(reporte.alertas ?? []);

let limpieza = $derived(
	reporte.limpieza ?? {
		recomendado: [],
		evitar: []
	}
);

let diagnostico = $derived(
	typeof reporte.diagnostico === 'string'
		? JSON.parse(reporte.diagnostico)
		: reporte.diagnostico ?? {}
);

	const formatearFecha = (/** @type {string} */ fecha) => {
		if (!fecha) return '';

		const fechaObj = new Date(`${fecha}T00:00:00`);

		return new Intl.DateTimeFormat('es-HN', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(fechaObj);
	};

    function programarSeguimiento() {

    const fechaBase = new Date(`${reporte.fecha}T00:00:00`);

    fechaBase.setMonth(fechaBase.getMonth() + 3);

    const fechaObjetivo = fechaBase
        .toISOString()
        .split('T')[0];

    const titulo = `Revisión de cubierta — ${reporte.cliente_nombre}`;

    const existe = actividadesStore.actividades.some(
        actividad =>
            actividad.origen === 'reporte' &&
            actividad.referencia === reporte.id
    );

    if (existe) {
        alert('Este reporte ya tiene un seguimiento programado.');
        return;
    }

    actividadesStore.crearSeguimiento(
        titulo,
        null,
        fechaObjetivo,
        reporte.id
    );

    alert(`Seguimiento programado para ${fechaObjetivo}.`);
}

	const claseNivel = (nivel = '') => {
		const valor = nivel.toLowerCase();

		if (
			valor.includes('alto') ||
			valor.includes('crítico') ||
			valor.includes('critico') ||
			valor.includes('avanzado')
		) {
			return 'alto';
		}

		if (
			valor.includes('medio') ||
			valor.includes('moderado')
		) {
			return 'medio';
		}

		return 'bajo';
	};
</script>

<svelte:head>
	<title>{reporte.titulo || 'Reporte de Estado y Mantenimiento de Cubierta'}</title>
</svelte:head>

<div class="page">

	<!-- ENCABEZADO -->
	<div class="header">
		<div class="header-left">
			<div class="logo-box">
				ESTANCIA<br />COMERCIAL
			</div>

			<div>
				<div class="brand-name">
					Estancia Comercial
				</div>

				<div class="doc-title">
					{reporte.titulo || 'Reporte de Estado y Mantenimiento de Cubierta'}
				</div>
			</div>
		</div>

		<div class="header-right">
			Documento técnico<br />
			de mantenimiento
		</div>
	</div>


	<!-- DATOS PRINCIPALES -->
	<div class="meta-grid">

		<div class="meta-item">
			<span class="label">Cliente</span>
			<span class="value">
				{reporte.cliente_nombre || '—'}
			</span>
		</div>

		<div class="meta-item">
			<span class="label">Propiedad</span>
			<span class="value">
				{reporte.cotizacion?.cliente_empresa || '—'}
			</span>
		</div>

		<div class="meta-item">
			<span class="label">Fecha</span>
			<span class="value">
				{formatearFecha(reporte.fecha)}
			</span>
		</div>

		<div class="meta-item">
			<span class="label">Trabajo realizado</span>
			<span class="value">
				{reporte.cotizacion?.titulo || '—'}
			</span>
		</div>

	</div>

	{#if !modoPortal}
	<!-- ACCESO AL PORTAL -->
	<div class="portal-access">
		<div>
			<strong>Portal del cliente</strong>
			<span>
				Comparte este proyecto con el cliente mediante su acceso privado.
			</span>
		</div>

		<button
			type="button"
			class="portal-button"
			onclick={abrirAccesoPortal}
		>
			🔐 Dar acceso al portal
		</button>
	</div>
{/if}

	<!-- ESTADO GENERAL -->
	<h2 class="section-title">
		Estado Encontrado
	</h2>

	<div class="estado-box">

		<p>
			<b>Condición encontrada:</b>
			{diagnostico.condicion || '—'}
		</p>

		<p>
			<b>Nivel general:</b>
			{diagnostico.nivel || '—'}
		</p>

		<p>
			<b>Estado de la lámina:</b>
			{diagnostico.estado_lamina || '—'}
		</p>

		<p>
			<b>Objetivo del trabajo realizado:</b>
			{diagnostico.objetivo || '—'}
		</p>

	</div>


	<!-- ZONAS -->
	{#if zonas.length > 0}

		<h2 class="section-title">
			Zonas de Atención
		</h2>

		<div class="zonas">

			{#each zonas as zona}

				<div class="zona-card">

					{#if zona.foto}
						<div class="zona-photo">
							<img
								src={zona.foto}
								alt={zona.nombre || 'Zona de atención'}
							/>
						</div>
					{/if}

					<div class="zona-body">

						<div class="zona-nombre">
							{zona.nombre || 'Zona de atención'}
						</div>

						{#if zona.nivel}
							<span class="nivel {claseNivel(zona.nivel)}">
								{zona.nivel}
							</span>
						{/if}

						{#if zona.observacion}
							<p>
								<b>Observación:</b>
								{zona.observacion}
							</p>
						{/if}

						{#if zona.recomendacion}
							<p>
								<b>Recomendación:</b>
								{zona.recomendacion}
							</p>
						{/if}

					</div>

				</div>

			{/each}

		</div>

	{/if}


	<!-- PLAN DE MANTENIMIENTO -->
	{#if mantenimiento.length > 0}

		<h2 class="section-title">
			Plan de Mantenimiento
		</h2>

		<table class="plan">

			<thead>
				<tr>
					<th>Frecuencia</th>
					<th>Revisión recomendada</th>
					<th>Acción sugerida</th>
				</tr>
			</thead>

			<tbody>

				{#each mantenimiento as item}

					<tr>
						<td>{item.frecuencia || '—'}</td>
						<td>{item.revision || '—'}</td>
						<td>{item.accion || '—'}</td>
					</tr>

				{/each}

			</tbody>

		</table>

	{/if}


	<!-- LIMPIEZA -->
	{#if limpieza.recomendado?.length || limpieza.evitar?.length}

		<h2 class="section-title">
			Limpieza Recomendada
		</h2>

		<div class="limpieza">

			<div class="limpieza-box si">

				<h3>
					Recomendado
				</h3>

				<ul>
					{#each limpieza.recomendado ?? [] as item}
						<li>{item}</li>
					{/each}
				</ul>

			</div>


			<div class="limpieza-box no">

				<h3>
					Evitar
				</h3>

				<ul>
					{#each limpieza.evitar ?? [] as item}
						<li>{item}</li>
					{/each}
				</ul>

			</div>

		</div>

		{#if limpieza.nota}
			<p class="nota">
				{limpieza.nota}
			</p>
		{/if}

	{/if}


	<!-- ALERTAS -->
	{#if alertas.length > 0}

		<h2 class="section-title">
			Señales de Alerta
		</h2>

		<div class="alertas">

			<b>
				Contactar a Estancia Comercial si se observa:
			</b>

			<ul>
				{#each alertas as alerta}
					<li>{alerta}</li>
				{/each}
			</ul>

		</div>

	{/if}


	<!-- CONCLUSIÓN -->
	{#if reporte.recomendacion_final}

		<div class="conclusion">

			<b>Recomendación final:</b>

			{reporte.recomendacion_final}

		</div>

	{/if}


	<!-- FOOTER -->
	<div class="footer">

		<span>
			Estancia Comercial · Reporte técnico
		</span>

		<span>
			{formatearFecha(reporte.fecha)}
		</span>

	</div>

</div>

{#if !modoPortal}
	<div class="acciones-reporte">
		<button
			class="btn-seguimiento"
			onclick={programarSeguimiento}
		>
			📅 Programar seguimiento
		</button>
	</div>
{/if}


{#if !modoPortal && mostrarAccesoPortal}
	<div class="portal-overlay" role="presentation">
		<div
			class="portal-modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="portal-modal-title"
		>
			<div class="portal-modal-header">
				<div>
					<h2 id="portal-modal-title">Portal del cliente</h2>
					<p>
						Comparte este proyecto con el cliente mediante su acceso privado.
					</p>
				</div>

				<button
					type="button"
					class="portal-close"
					onclick={cerrarAccesoPortal}
					disabled={creandoAccesoPortal}
				>
					×
				</button>
			</div>

			<div class="portal-info">
				<div class="portal-field">
					<span>Cliente</span>
					<strong>
						{reporte.cotizacion?.cliente_nombre || '—'}
					</strong>
				</div>

				<div class="portal-field">
					<span>Teléfono</span>
					<strong>
						{reporte.cotizacion?.cliente_whatsapp || '—'}
					</strong>
				</div>

				<div class="portal-link">
					<span>Portal del cliente</span>
					<strong>/portal</strong>
				</div>
			</div>

			{#if errorPortal}
				<div class="portal-error">
					{errorPortal}
				</div>
			{/if}

			{#if resultadoPortal}
				<div class="portal-success">
					<strong>✓ Acceso creado correctamente</strong>

					<div class="portal-success-text">
						El cliente puede entrar desde:
					</div>

					<div class="portal-credenciales">
						<div>
							<span>Portal</span>
							<strong>http://localhost:5174/portal</strong>
						</div>

						<div>
							<span>Usuario</span>
							<strong>
								{reporte.cotizacion?.cliente_whatsapp}
							</strong>
						</div>

						{#if resultadoPortal.passwordTemporal}
							<div>
								<span>Contraseña</span>
								<strong>
									{resultadoPortal.passwordTemporal}
								</strong>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<div class="portal-modal-actions">
				<button
					type="button"
					class="portal-cancel"
					onclick={cerrarAccesoPortal}
					disabled={creandoAccesoPortal}
				>
					Cerrar
				</button>

				{#if !resultadoPortal}
					<button
						type="button"
						class="portal-create"
						onclick={crearAccesoPortal}
						disabled={creandoAccesoPortal}
					>
						{creandoAccesoPortal
							? 'Creando acceso...'
							: '🔐 Dar acceso al portal'}
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

{#if modoPortal}
	<section class="portal-pagos">
		<div class="portal-pagos-header">
			<div>
				<span class="portal-pagos-label">Pagos y recibos</span>
				<h2>Resumen de tu mantenimiento</h2>
			</div>

			<button
				type="button"
				class="btn-imprimir"
				onclick={() => window.print()}
			>
				🖨 Imprimir
			</button>
		</div>

		{#if resumenPagos}
			<div class="pagos-resumen">
				<div>
					<span>Total del trabajo</span>
					<strong>
						{resumenPagos.moneda}
						{resumenPagos.totalProyecto.toLocaleString('es-HN', {
							minimumFractionDigits: 2
						})}
					</strong>
				</div>

				<div>
					<span>Total pagado</span>
					<strong>
						{resumenPagos.moneda}
						{resumenPagos.totalPagado.toLocaleString('es-HN', {
							minimumFractionDigits: 2
						})}
					</strong>
				</div>

				<div>
					<span>Saldo pendiente</span>
					<strong>
						{resumenPagos.moneda}
						{resumenPagos.saldoPendiente.toLocaleString('es-HN', {
							minimumFractionDigits: 2
						})}
					</strong>
				</div>
			</div>
		{/if}

		{#if recibos.length > 0}
			<div class="recibos-lista">
				<h3>Recibos</h3>

				{#each recibos as recibo}
					<div class="recibo-item">
	<div>
		<strong>{recibo.folio}</strong>

		<span>
			{formatearFecha(
				recibo.fecha_pago?.slice(0, 10)
			)}
		</span>
	</div>

	<div class="recibo-derecha">
		<strong>
			{recibo.moneda}
			{Number(recibo.monto).toLocaleString('es-HN', {
				minimumFractionDigits: 2
			})}
		</strong>

		<a
			class="btn-ver-recibo"
			href={`/crm/recibos/${recibo.id}`}
			target="_blank"
			rel="noopener noreferrer"
		>
			👁 Ver recibo
		</a>
	</div>
</div>
				{/each}
			</div>
		{/if}
	</section>
{/if}
<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		background: #fff;
	}

	.page {
		max-width: 850px;
		margin: 0 auto;
		padding: 32px 40px 40px;
		font-family: 'Segoe UI', Arial, sans-serif;
		color: #1f2937;
		background: #fff;

		--navy: #162439;
		--gold: #E7A146;
		--teal: #2DD4B8;
		--gray: #888989;
		--light: #F5F6F8;
		--border: #E2E4E8;
	}


	/* HEADER */

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		border-bottom: 3px solid var(--navy);
		padding-bottom: 16px;
		margin-bottom: 20px;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.logo-box {
		width: 56px;
		height: 56px;
		border-radius: 8px;
		background: var(--navy);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--teal);
		font-weight: bold;
		font-size: 11px;
		text-align: center;
		flex-shrink: 0;
	}

	.brand-name {
		font-size: 13px;
		color: var(--gray);
		letter-spacing: 0.5px;
		text-transform: uppercase;
	}

	.doc-title {
		font-size: 20px;
		color: var(--navy);
		font-weight: 700;
		margin-top: 2px;
	}

	.header-right {
		text-align: right;
		font-size: 12px;
		color: var(--gray);
	}


	/* META */

	.meta-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 10px;
		background: var(--light);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 12px 16px;
		margin-bottom: 24px;
		font-size: 12.5px;
	}

	.meta-item span.label {
		display: block;
		color: var(--gray);
		font-size: 10.5px;
		text-transform: uppercase;
		letter-spacing: 0.4px;
		margin-bottom: 2px;
	}

	.meta-item span.value {
		font-weight: 600;
		color: var(--navy);
	}


	/* SECTION TITLES */

	h2.section-title {
		font-size: 14px;
		color: var(--navy);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border-left: 4px solid var(--teal);
		padding-left: 10px;
		margin: 24px 0 10px;
	}


	/* ESTADO */

	.estado-box {
		background: var(--light);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 14px 16px;
		font-size: 13px;
		line-height: 1.6;
	}

	.estado-box p {
		margin: 4px 0;
	}

	.estado-box b {
		color: var(--navy);
	}


	/* ZONAS */

	.zonas {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}

	.zona-card {
		border: 1px solid var(--border);
		border-radius: 8px;
		overflow: hidden;
		font-size: 11.5px;
	}

	.zona-photo {
		width: 100%;
		height: 220px;
		overflow: hidden;
	}

	.zona-photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.zona-body {
		padding: 10px 12px;
	}

	.zona-nombre {
		font-weight: 700;
		color: var(--navy);
		font-size: 12.5px;
		margin-bottom: 4px;
	}

	.nivel {
		display: inline-block;
		font-size: 10px;
		font-weight: 700;
		padding: 2px 8px;
		border-radius: 10px;
		margin-bottom: 6px;
		text-transform: uppercase;
	}

	.nivel.bajo {
		background: #DFF6E9;
		color: #1D8A4A;
	}

	.nivel.medio {
		background: #FCEFD2;
		color: #B5790C;
	}

	.nivel.alto {
		background: #FBDEDA;
		color: #C23B2B;
	}

	.zona-body p {
		margin: 3px 0;
	}

	.zona-body b {
		color: var(--navy);
	}


	/* TABLA */

	table.plan {
		width: 100%;
		border-collapse: collapse;
		font-size: 12.5px;
		margin-top: 6px;
	}

	table.plan th {
		background: var(--navy);
		color: #fff;
		text-align: left;
		padding: 8px 10px;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.3px;
	}

	table.plan td {
		padding: 8px 10px;
		border-bottom: 1px solid var(--border);
	}

	table.plan tr:nth-child(even) td {
		background: var(--light);
	}


	/* LIMPIEZA */

	.limpieza {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	.limpieza-box {
		border-radius: 8px;
		padding: 12px 14px;
		font-size: 12.5px;
		line-height: 1.6;
	}

	.limpieza-box.si {
		background: #EAFBF3;
		border: 1px solid #BEEBD6;
	}

	.limpieza-box.no {
		background: #FDEDEC;
		border: 1px solid #F4C6C0;
	}

	.limpieza-box h3 {
		margin: 0 0 6px;
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.4px;
	}

	.limpieza-box.si h3 {
		color: #1D8A4A;
	}

	.limpieza-box.no h3 {
		color: #C23B2B;
	}

	.limpieza-box ul {
		margin: 0;
		padding-left: 18px;
	}

	.nota {
		font-size: 11px;
		color: var(--gray);
		font-style: italic;
		margin-top: 8px;
	}


	/* ALERTAS */

	.alertas {
		background: #FFF7EC;
		border: 1px solid #F3DDB0;
		border-radius: 8px;
		padding: 12px 16px;
		font-size: 12.5px;
	}

	.alertas ul {
		margin: 6px 0 0;
		padding-left: 18px;
		columns: 2;
		column-gap: 24px;
	}

	.alertas li {
		margin-bottom: 4px;
	}


	/* CONCLUSION */

	.conclusion {
		background: var(--navy);
		color: #fff;
		border-radius: 8px;
		padding: 14px 18px;
		font-size: 12.5px;
		line-height: 1.6;
		margin-top: 10px;
	}

	.conclusion b {
		color: var(--teal);
	}


	/* FOOTER */

	.footer {
		margin-top: 26px;
		padding-top: 12px;
		border-top: 1px solid var(--border);
		display: flex;
		justify-content: space-between;
		font-size: 10.5px;
		color: var(--gray);
	}


	/* IMPRESIÓN */

	@media print {

		:global(body) {
			margin: 0;
		}

		.page {
			padding: 14px 26px;
			max-width: 100%;
		}

		.zona-photo {
			height: 80px;
		}

		.conclusion {
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}

		table.plan th {
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}


	/* RESPONSIVE */

	@media (max-width: 700px) {

		.page {
			padding: 20px;
		}

		.meta-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.zonas {
			grid-template-columns: 1fr;
		}

		.limpieza {
			grid-template-columns: 1fr;
		}

		.header {
			flex-direction: column;
			gap: 16px;
		}

		.header-right {
			text-align: left;
		}
	}

    .acciones-reporte {
    max-width: 850px;
    margin: 20px auto 40px;
    display: flex;
    justify-content: flex-end;
}

.btn-seguimiento {
    border: none;
    border-radius: 10px;
    padding: 11px 16px;
    background: var(--navy, #162439);
    color: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}

.btn-seguimiento:hover {
    opacity: .9;
}

@media print {
    .acciones-reporte {
        display: none;
    }
}
/* PORTAL — ACCESO DEL CLIENTE */

.portal-overlay {
	position: fixed;
	inset: 0;
	z-index: 1000;
	background: rgba(10, 20, 35, 0.55);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
}

.portal-modal {
	width: min(460px, 100%);
	background: white;
	border-radius: 16px;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
	overflow: hidden;
}

.portal-modal-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding: 22px 24px;
	background: var(--navy, #162439);
	color: white;
}

.portal-modal-header h2 {
	margin: 0;
	font-size: 20px;
}

.portal-modal-header p {
	margin: 5px 0 0;
	font-size: 13px;
	opacity: 0.75;
}

.portal-close {
	border: none;
	background: transparent;
	color: white;
	font-size: 28px;
	line-height: 1;
	cursor: pointer;
	padding: 0 2px;
}

.portal-info {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12px;
	padding: 22px 24px 10px;
}

.portal-field {
	padding: 13px;
	background: #f5f7fa;
	border-radius: 10px;
}

.portal-field span,
.portal-link span,
.portal-credenciales span {
	display: block;
	font-size: 11px;
	color: #687386;
	margin-bottom: 5px;
}

.portal-field strong {
	font-size: 13px;
	color: #162439;
	word-break: break-word;
}

.portal-password {
	padding: 10px 24px 20px;
}

.portal-password label {
	display: block;
	font-size: 13px;
	font-weight: 600;
	color: #162439;
	margin-bottom: 7px;
}

.portal-password input {
	width: 100%;
	box-sizing: border-box;
	border: 1px solid #d5dbe3;
	border-radius: 9px;
	padding: 11px 12px;
	font-size: 14px;
	outline: none;
}

.portal-password input:focus {
	border-color: #162439;
	box-shadow: 0 0 0 3px rgba(22, 36, 57, 0.08);
}

.portal-password small {
	display: block;
	margin-top: 6px;
	color: #7b8492;
	font-size: 11px;
}

.portal-error {
	margin: 0 24px 16px;
	padding: 11px 12px;
	border-radius: 9px;
	background: #fff1f1;
	color: #a32929;
	font-size: 13px;
}

.portal-success {
	margin: 0 24px 16px;
	padding: 14px;
	border-radius: 10px;
	background: #eef8f1;
	border: 1px solid #cce6d3;
	color: #245b32;
}

.portal-success > strong {
	display: block;
	margin-bottom: 14px;
}

.portal-credenciales {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
	margin-bottom: 12px;
}

.portal-credenciales > div {
	background: white;
	padding: 10px;
	border-radius: 8px;
}

.portal-credenciales strong,
.portal-link strong {
	font-size: 12px;
	word-break: break-word;
}

.portal-link {
	background: white;
	padding: 10px;
	border-radius: 8px;
}

.portal-modal-actions {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
	padding: 16px 24px 22px;
	border-top: 1px solid #edf0f3;
}

.portal-cancel,
.portal-create {
	border: none;
	border-radius: 9px;
	padding: 10px 16px;
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
}

.portal-cancel {
	background: #eef1f4;
	color: #344054;
}

.portal-create {
	background: var(--navy, #162439);
	color: white;
}

.portal-cancel:disabled,
.portal-create:disabled {
	opacity: 0.55;
	cursor: not-allowed;
}

@media (max-width: 500px) {
	.portal-info,
	.portal-credenciales {
		grid-template-columns: 1fr;
	}
}
.portal-success-text {
	margin: 0 0 14px;
	font-size: 12px;
	line-height: 1.5;
	color: #245b32;
}

.portal-pagos {
	margin-top: 28px;
	border-top: 2px solid var(--border);
	padding-top: 20px;
}

.portal-pagos-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 15px;
	margin-bottom: 14px;
}

.portal-pagos-label {
	display: block;
	font-size: 10px;
	text-transform: uppercase;
	letter-spacing: .5px;
	color: var(--gray);
}

.portal-pagos h2 {
	margin: 2px 0 0;
	font-size: 16px;
	color: var(--navy);
}

.btn-imprimir {
	border: none;
	border-radius: 9px;
	padding: 10px 15px;
	background: var(--navy);
	color: rgb(0, 0, 0);
	font-weight: 600;
	cursor: pointer;
}

.pagos-resumen {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 10px;
	margin-bottom: 18px;
}

.pagos-resumen > div {
	background: var(--light);
	border: 1px solid var(--border);
	border-radius: 8px;
	padding: 12px;
}

.pagos-resumen span {
	display: block;
	font-size: 10px;
	color: var(--gray);
	margin-bottom: 5px;
}

.pagos-resumen strong {
	font-size: 15px;
	color: var(--navy);
}

.recibos-lista h3 {
	font-size: 12px;
	text-transform: uppercase;
	color: var(--navy);
	margin: 0 0 8px;
}

.recibo-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 11px 12px;
	border: 1px solid var(--border);
	border-radius: 8px;
	margin-bottom: 7px;
}

.recibo-item span {
	display: block;
	font-size: 11px;
	color: var(--gray);
	margin-top: 3px;
}

.recibo-item > strong {
	color: var(--navy);
}

@media print {
	.btn-imprimir {
		display: none;
	}

	.portal-pagos {
		break-inside: avoid;
	}
}
.recibo-derecha {
	display: flex;
	align-items: center;
	gap: 12px;
}

.btn-ver-recibo {
	display: inline-flex;
	align-items: center;
	padding: 7px 11px;
	border-radius: 7px;
	background: var(--navy);
	color: #1e1b1b !important;
	text-decoration: none !important;
	font-size: 11px;
	font-weight: 600;
	white-space: nowrap;
}

.btn-ver-recibo:hover {
	color: #0b0202 !important;
	opacity: .9;
}
@media print {
	.btn-ver-recibo {
		display: none;
	}
}
</style>