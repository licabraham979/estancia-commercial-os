<script>
	/**
	 * @typedef {{
	 *   id: string,
	 *   cliente_nombre: string,
	 *   cliente_empresa: string|null,
	 *   titulo: string,
	 *   descripcion: string|null,
	 *   estado: string|null,
	 *   moneda: string|null,
	 *   total: number|null,
	 *   forma_pago: string|null,
	 *   created_at: string|null
	 * }} Cotizacion
	 */

	/**
	 * @typedef {{
	 *   id: string,
	 *   folio: string|null,
	 *   fecha_pago: string|null,
	 *   monto: number|string|null,
	 *   moneda: string|null,
	 *   estado: string|null,
	 *   concepto: string|null,
	 *   metodo_pago: string|null,
	 *   referencia: string|null
	 * }} Recibo
	 */

	let { data } = $props();

	let expectativaTrabajo = $state('');

let cargandoPaso3 = $state(false);

	const cotizaciones = $derived(
		data.cotizaciones ?? []
	);

	let cotizacionSeleccionada = $state(/** @type {Cotizacion|null} */ (null));

	let pasoActual = $state(1);

	let recibos = $state(/** @type {Recibo[]} */ ([]));

	let resumen = $state({
		totalProyecto: 0,
		totalPagado: 0,
		saldoPendiente: 0,
		moneda: 'HNL'
	});

	let cargandoRecibos = $state(false);

	let errorRecibos = $state('');



	/** @type {{
 *  cotizacion_id: string|null,
 *  cliente_id: string|null,
 *  cliente_nombre: string,
 *  titulo: string,
 *  fecha: string,
 *  expectativa: string,
 * trabajo_realizado: string, 
 *  diagnostico: {
 *    condicion: string,
 *    nivel: string,
 *    estado_lamina: string,
 *    objetivo: string
 *  },
 *  zonas: {
 *    nombre: string,
 *    nivel: string,
 *    observacion: string,
 *    recomendacion: string
 *  }[],
 *  cambios: {
 *    estado: string,
 *    descripcion: string,
 *    motivo: string,
 *    autorizado: string
 *  },
 *  evidencia: {
 *    fotos_propuesta: FotoPropuesta[],
 *    fotos_seleccionadas: string[],
 *    fotos_nuevas: string[]
 *  },
 * recomendacion_final: string
 * seguimiento: {
 *    tipo: string,
 *    fecha: string,
 *    descripcion: string
 *  }
 *}} */
let reporteBorrador = $state({
	cotizacion_id: null,
	cliente_id: null,
	cliente_nombre: '',
	titulo: '',
	fecha: '',
	
	expectativa: '',
		trabajo_realizado: '',
	diagnostico: {
		condicion: '',
		nivel: '',
		estado_lamina: '',
		objetivo: ''
	},
	zonas: [],
	cambios: {
		estado: 'sin_cambios',
		descripcion: '',
		motivo: '',
		autorizado: ''
	},
	evidencia: {
		fotos_propuesta: [],
		fotos_seleccionadas: [],
		fotos_nuevas: []
	},
	recomendacion_final: '',
	seguimiento: {
	tipo: '3_meses',
	fecha: '',
	descripcion: ''
}
});

	function seleccionarCotizacion(/** @type {Cotizacion} */ cotizacion) {
	cotizacionSeleccionada = cotizacion;

	reporteBorrador = {
		...reporteBorrador,
		cotizacion_id: cotizacion.id,
		cliente_nombre: cotizacion.cliente_nombre ?? '',
		titulo: cotizacion.titulo ?? '',
		fecha: new Date().toISOString().split('T')[0]
	};
}

	async function continuar() {
		if (!cotizacionSeleccionada) {
			alert('Selecciona un trabajo para continuar.');
			return;
		}

		cargandoRecibos = true;
		errorRecibos = '';

		try {
			const respuesta = await fetch(
				`/api/reportes/recibos?cotizacion_id=${encodeURIComponent(cotizacionSeleccionada.id)}`
			);

			const resultado = await respuesta.json();

			if (!respuesta.ok) {
				throw new Error(
					resultado.error || 'No se pudieron cargar los recibos.'
				);
			}

			recibos = resultado.recibos ?? [];

			resumen = resultado.resumen ?? {
				totalProyecto: 0,
				totalPagado: 0,
				saldoPendiente: 0,
				moneda: cotizacionSeleccionada.moneda || 'HNL'
			};

			pasoActual = 2;
		} catch (error) {
			console.error('Error cargando recibos:', error);

			errorRecibos =
				error instanceof Error
					? error.message
					: 'No se pudieron cargar los recibos.';
		} finally {
			cargandoRecibos = false;
		}
	}

	function prepararPaso3() {
	if (!cotizacionSeleccionada) return;

	expectativaTrabajo =
		cotizacionSeleccionada.descripcion?.trim() ||
		cotizacionSeleccionada.titulo ||
		'';

	reporteBorrador = {
		...reporteBorrador,
		cotizacion_id: cotizacionSeleccionada.id,
		cliente_nombre: cotizacionSeleccionada.cliente_nombre,
		titulo: cotizacionSeleccionada.titulo,
		fecha: new Date().toISOString().split('T')[0],
		expectativa: expectativaTrabajo
	};

	pasoActual = 3;
}

function prepararPaso4() {
	reporteBorrador = {
		...reporteBorrador,
		expectativa: expectativaTrabajo
	};

	pasoActual = 4;
}

let zonasEncontradas = $state([
	{
		nombre: '',
		nivel: 'medio',
		observacion: '',
		recomendacion: ''
	}
]);
let trabajoRealizado = $state('');
let cambiosTrabajo = $state({
	estado: 'sin_cambios',
	descripcion: '',
	motivo: '',
	autorizado: ''
});

/** @typedef {{ id: string, url: string, orden: number, tipo: string }} FotoPropuesta */

/** @type {FotoPropuesta[]} */
let fotosPropuesta = $state([]);

/** @type {string[]} */
let fotosSeleccionadas = $state([]);

/** @type {string[]} */
let fotosNuevas = $state([]);
let nuevaFotoUrl = $state('');

let cargandoFotos = $state(false);
let errorFotos = $state('');
let recomendacionFinal = $state('');
let seguimiento = $state({
	tipo: '3_meses',
	fecha: '',
	descripcion: ''
});

function prepararPaso7() {
	reporteBorrador = {
		...reporteBorrador,
		trabajo_realizado: trabajoRealizado,
		cambios: cambiosTrabajo
	};

	pasoActual = 7;
}

async function prepararPaso8() {
	if (!cotizacionSeleccionada) return;

	cargandoFotos = true;
	errorFotos = '';

	try {
		const respuesta = await fetch(
			`/api/reportes/fotos?cotizacion_id=${cotizacionSeleccionada.id}`
		);

		const resultado = await respuesta.json();

		if (!respuesta.ok) {
			throw new Error(resultado.error || 'No se pudieron cargar las fotos');
		}

		fotosPropuesta = resultado.fotos ?? [];

		fotosSeleccionadas = fotosPropuesta.map((foto) => foto.id);

		reporteBorrador = {
			...reporteBorrador,
			cambios: cambiosTrabajo,
			evidencia: {
				fotos_propuesta: fotosPropuesta,
				fotos_seleccionadas: fotosSeleccionadas,
				fotos_nuevas: fotosNuevas
			}
		};

		pasoActual = 8;
	} catch (error) {
		console.error('Error cargando fotos para el reporte:', error);

		errorFotos =
			error instanceof Error
				? error.message
				: 'No se pudieron cargar las fotos';
	} finally {
		cargandoFotos = false;
	}
}

async function generarReporte() {
	reporteBorrador = {
		...reporteBorrador,
		recomendacion_final: recomendacionFinal,
		seguimiento: seguimiento
	};

	const reporteParaGuardar = {
		cotizacion_id: reporteBorrador.cotizacion_id,
		cliente_id: reporteBorrador.cliente_id,
		cliente_nombre: reporteBorrador.cliente_nombre,
		titulo: reporteBorrador.titulo,
		fecha: reporteBorrador.fecha,

		diagnostico: reporteBorrador.diagnostico,
		zonas: reporteBorrador.zonas,

		mantenimiento: {
			expectativa: reporteBorrador.expectativa,
			trabajo_realizado: reporteBorrador.trabajo_realizado,
			cambios: reporteBorrador.cambios
		},

		evidencia: reporteBorrador.evidencia,

		recomendacion_final: reporteBorrador.recomendacion_final,

		seguimiento: reporteBorrador.seguimiento
	};

	try {
		const respuesta = await fetch('/api/reportes/crear', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(reporteParaGuardar)
		});

		const resultado = await respuesta.json();

		if (!respuesta.ok) {
			throw new Error(
				resultado.error || 'No se pudo crear el reporte'
			);
		}

		console.log(
			'REPORTE CREADO:',
			$state.snapshot(resultado.reporte)
		);

		alert('Reporte creado correctamente.');
	} catch (error) {
		console.error('Error creando reporte:', error);

		alert(
			error instanceof Error
				? error.message
				: 'No se pudo crear el reporte'
		);
	}
}
function prepararPaso9() {
	reporteBorrador = {
		...reporteBorrador,
		evidencia: {
			fotos_propuesta: fotosPropuesta,
			fotos_seleccionadas: fotosSeleccionadas,
			fotos_nuevas: fotosNuevas
		}
	};

	pasoActual = 9;
}
function prepararPaso10() {
	reporteBorrador = {
		...reporteBorrador,
		recomendacion_final: recomendacionFinal,
		seguimiento: seguimiento
	};

	pasoActual = 10;
}

function agregarZona() {
	zonasEncontradas = [
		...zonasEncontradas,
		{
			nombre: '',
			nivel: 'medio',
			observacion: '',
			recomendacion: ''
		}
	];
}

function eliminarZona(/** @type {number} */ indice) {
	if (zonasEncontradas.length === 1) return;

	zonasEncontradas = zonasEncontradas.filter(
		(_, i) => i !== indice
	);
}

function prepararPaso5() {
	if (!cotizacionSeleccionada) return;

	reporteBorrador = {
		...reporteBorrador,
		zonas: zonasEncontradas
	};

	pasoActual = 5;
}

function prepararPaso6() {
	reporteBorrador = {
		...reporteBorrador,
		zonas: zonasEncontradas
	};

	pasoActual = 6;
}
	function volverPasoAnterior() {
		pasoActual = 1;
	}
	function agregarFotoNueva() {
	const url = nuevaFotoUrl.trim();

	if (!url) return;

	fotosNuevas = [...fotosNuevas, url];
	nuevaFotoUrl = '';

	reporteBorrador = {
		...reporteBorrador,
		evidencia: {
			fotos_propuesta: fotosPropuesta,
			fotos_seleccionadas: fotosSeleccionadas,
			fotos_nuevas: fotosNuevas
		}
	};
}

function eliminarFotoNueva(/** @type {number} */ indice) {
	fotosNuevas = fotosNuevas.filter((_, i) => i !== indice);

	reporteBorrador = {
		...reporteBorrador,
		evidencia: {
			fotos_propuesta: fotosPropuesta,
			fotos_seleccionadas: fotosSeleccionadas,
			fotos_nuevas: fotosNuevas
		}
	};
}
</script>
<svelte:head>
	<title>Crear reporte | Estancia Comercial</title>
</svelte:head>

<div class="page">

	<header class="header">
		<div>
			<a href="/crm/reportes" class="volver">
				← Reportes
			</a>

			<h1>Crear reporte</h1>

			<p>
				Primero selecciona el trabajo que quieres documentar.
			</p>
		</div>
	</header>

	<section class="paso">
		<div class="paso-header">
			<span class="numero">1</span>

			<div>
				<h2>¿Qué trabajo vamos a documentar?</h2>

				<p>
					Selecciona la cotización relacionada con el trabajo realizado.
				</p>
			</div>
		</div>

		{#if cotizaciones.length === 0}

			<div class="vacio">
				<div class="icono">📋</div>

				<h3>No hay cotizaciones disponibles</h3>

				<p>
					Primero necesitas tener una cotización registrada.
				</p>

				<a href="/crm/cotizaciones/nueva" class="btn-secundario">
					＋ Crear cotización
				</a>
			</div>

		{:else}

			<div class="lista">

				{#each cotizaciones as cotizacion (cotizacion.id)}

					<button
						type="button"
						class:selected={cotizacionSeleccionada?.id === cotizacion.id}
						class="cotizacion"
						onclick={() => seleccionarCotizacion(cotizacion)}
					>

						<div class="cotizacion-principal">

							<div class="cliente">
								{cotizacion.cliente_nombre}
							</div>

							{#if cotizacion.cliente_empresa}
								<div class="empresa">
									{cotizacion.cliente_empresa}
								</div>
							{/if}

							<div class="trabajo">
								{cotizacion.titulo}
							</div>

						</div>

						<div class="cotizacion-derecha">

							{#if cotizacion.total != null}
								<div class="total">
									{cotizacion.moneda || 'HNL'}
									{Number(cotizacion.total).toLocaleString('es-HN')}
								</div>
							{/if}

							<div class="estado">
								{cotizacion.estado || 'borrador'}
							</div>

						</div>

					</button>

				{/each}

			</div>

		{/if}
	</section>

	{#if cotizacionSeleccionada}

		<section class="seleccion">

			<div>
				<span>Trabajo seleccionado</span>

				<strong>
					{cotizacionSeleccionada.titulo}
				</strong>

				<p>
					{cotizacionSeleccionada.cliente_nombre}
					{#if cotizacionSeleccionada.cliente_empresa}
						· {cotizacionSeleccionada.cliente_empresa}
					{/if}
				</p>
			</div>

			<button
	class="btn-continuar"
	onclick={continuar}
	disabled={cargandoRecibos}
>
	{cargandoRecibos ? 'Cargando…' : 'Continuar →'}
</button>

		</section>

	{/if}

</div>

{#if pasoActual === 2}
	<section class="paso paso-recibos">

		<div class="paso-header">
			<span class="numero">2</span>

			<div>
				<h2>Revisemos los recibos</h2>

				<p>
					Estos pagos están relacionados con el trabajo seleccionado.
				</p>
			</div>
		</div>

		{#if errorRecibos}

			<div class="error-recibos">
				{errorRecibos}
			</div>

		{:else}

			<div class="resumen-recibos">

				<div class="resumen-item">
					<span>Total del trabajo</span>
					<strong>
						{resumen.moneda}
						{Number(resumen.totalProyecto).toLocaleString('es-HN')}
					</strong>
				</div>

				<div class="resumen-item">
					<span>Total pagado</span>
					<strong>
						{resumen.moneda}
						{Number(resumen.totalPagado).toLocaleString('es-HN')}
					</strong>
				</div>

				<div class="resumen-item">
					<span>Saldo pendiente</span>
					<strong>
						{resumen.moneda}
						{Number(resumen.saldoPendiente).toLocaleString('es-HN')}
					</strong>
				</div>

			</div>

			<div class="recibos-header">
				<div>
					<strong>Recibos registrados</strong>
					<span>{recibos.length} recibo{recibos.length === 1 ? '' : 's'}</span>
				</div>

				<a
					href={`/crm/recibos/nuevo?cotizacion_id=${cotizacionSeleccionada?.id ?? ''}`}
					class="btn-secundario"
				>
					＋ Agregar recibo
				</a>
			</div>

			{#if recibos.length === 0}

				<div class="sin-recibos">
					<div>🧾</div>
					<strong>Aún no hay recibos emitidos</strong>
					<p>
						Puedes registrar el pago relacionado con este trabajo.
					</p>
				</div>

			{:else}

				<div class="lista-recibos">

					{#each recibos as recibo (recibo.id)}

						<div class="recibo">

							<div>
								<strong>
									{recibo.folio || 'Recibo sin folio'}
								</strong>

								<span>
									{recibo.fecha_pago || 'Sin fecha'}
								</span>

								{#if recibo.concepto}
									<p>{recibo.concepto}</p>
								{/if}
							</div>

							<strong class="recibo-monto">
								{recibo.moneda || resumen.moneda}
								{Number(recibo.monto ?? 0).toLocaleString('es-HN')}
							</strong>

						</div>

					{/each}

				</div>

			{/if}

		{/if}
				
		<div class="navegacion-pasos">
			<button
				type="button"
				class="btn-volver-paso"
				onclick={volverPasoAnterior}
			>
				← Volver
			</button>

			<button
				type="button"
				class="btn-continuar"
				onclick={prepararPaso4}
			>
				Continuar →
			</button>
		</div>

	</section>
{/if}

{#if pasoActual === 4}
	<section class="paso paso-diagnostico">

		<div class="paso-header">
			<span class="numero">4</span>

			<div>
				<h2>¿Qué encontramos?</h2>

				<p>
					Documenta las condiciones encontradas al revisar el trabajo.
				</p>
			</div>
		</div>

		<div class="campo-diagnostico">

			<label for="condicion">
				Condición encontrada
			</label>

			<textarea
				id="condicion"
				bind:value={reporteBorrador.diagnostico.condicion}
				rows="4"
				placeholder="Ej. Corrosión superficial, manchas de óxido, acumulación de humedad..."
			></textarea>

		</div>

		<div class="campo-diagnostico">

			<label for="nivel">
				Nivel general
			</label>

			<input
				id="nivel"
				type="text"
				bind:value={reporteBorrador.diagnostico.nivel}
				placeholder="Ej. Zonas específicas con mayor corrosión"
			/>

		</div>

		<div class="campo-diagnostico">

			<label for="estado-lamina">
				Estado de la lámina
			</label>

			<textarea
				id="estado-lamina"
				bind:value={reporteBorrador.diagnostico.estado_lamina}
				rows="3"
				placeholder="Describe el estado estructural o superficial encontrado..."
			></textarea>

		</div>

		<div class="campo-diagnostico">

			<label for="objetivo">
				Objetivo del trabajo realizado
			</label>

			<textarea
				id="objetivo"
				bind:value={reporteBorrador.diagnostico.objetivo}
				rows="3"
				placeholder="¿Qué se buscaba lograr con el trabajo?"
			></textarea>

		</div>

		<div class="navegacion-pasos">

			<button
				type="button"
				class="btn-volver-paso"
				onclick={() => pasoActual = 3}
			>
				← Lo esperado
			</button>

		<button
	type="button"
	class="btn-continuar"
	onclick={prepararPaso5}
>
	Continuar →
</button>
		</div>

	</section>
{/if}
{#if pasoActual === 5}
	<section class="paso paso-zonas">

		<div class="paso-header">
			<span class="numero">5</span>

			<div>
				<h2>¿Qué zonas encontramos?</h2>

				<p>
					Registra las zonas que requieren atención o seguimiento.
				</p>
			</div>
		</div>

		<div class="zonas-editor">

			{#each zonasEncontradas as zona, indice}
				<div class="zona-editor">

					<div class="zona-editor-header">
						<strong>Zona {indice + 1}</strong>

						{#if zonasEncontradas.length > 1}
							<button
								type="button"
								class="btn-eliminar-zona"
								onclick={() => eliminarZona(indice)}
							>
								Eliminar
							</button>
						{/if}
					</div>

					<div class="campo-diagnostico">
						<label for={`zona-nombre-${indice}`}>
							Nombre de la zona
						</label>

						<input
							id={`zona-nombre-${indice}`}
							type="text"
							bind:value={zona.nombre}
							placeholder="Ej. Parte frontal del techo"
						/>
					</div>

					<div class="campo-diagnostico">
						<label for={`zona-nivel-${indice}`}>
							Nivel de atención
						</label>

						<select
							id={`zona-nivel-${indice}`}
							bind:value={zona.nivel}
						>
							<option value="bajo">Bajo</option>
							<option value="medio">Medio</option>
							<option value="alto">Alto</option>
						</select>
					</div>

					<div class="campo-diagnostico">
						<label for={`zona-observacion-${indice}`}>
							¿Qué observamos?
						</label>

						<textarea
							id={`zona-observacion-${indice}`}
							bind:value={zona.observacion}
							rows="3"
							placeholder="Describe lo encontrado en esta zona..."
						></textarea>
					</div>

					<div class="campo-diagnostico">
						<label for={`zona-recomendacion-${indice}`}>
							Recomendación
						</label>

						<textarea
							id={`zona-recomendacion-${indice}`}
							bind:value={zona.recomendacion}
							rows="3"
							placeholder="¿Qué recomendamos para esta zona?"
						></textarea>
					</div>

				</div>
			{/each}

		</div>

		<button
			type="button"
			class="btn-agregar-zona"
			onclick={agregarZona}
		>
			＋ Agregar otra zona
		</button>

		<div class="navegacion-pasos">

			<button
				type="button"
				class="btn-volver-paso"
				onclick={() => pasoActual = 4}
			>
				← ¿Qué encontramos?
			</button>

			<button
	type="button"
	class="btn-continuar"
	onclick={prepararPaso6}
>
	Continuar →
</button>
		</div>

	</section>
{/if}
{#if pasoActual === 6}
	<section class="paso">

		<div class="paso-header">
			<span class="numero">6</span>

			<div>
				<h2>¿Qué hicimos?</h2>

				<p>
					Documenta los trabajos realizados durante la intervención.
				</p>
			</div>
		</div>

		<div class="campo-diagnostico">
			<label for="trabajo-realizado">
				Trabajo realizado
			</label>

			<textarea
	id="trabajo-realizado"
	rows="5"
	placeholder="Describe qué trabajos se realizaron..."
	bind:value={trabajoRealizado}
></textarea>
		</div>

		<div class="navegacion-pasos">

			<button
				type="button"
				class="btn-volver-paso"
				onclick={() => pasoActual = 5}
			>
				← Zonas
			</button>

			<button
	type="button"
	class="btn-continuar"
	onclick={prepararPaso7}
>
	Continuar →
</button>

		</div>

	</section>
{/if}
{#if pasoActual === 7}
	<section class="paso paso-cambios">

		<div class="paso-header">
			<span class="numero">7</span>

			<div>
				<h2>¿Hubo cambios?</h2>

				<p>
					Indica si el trabajo se realizó conforme a lo previsto.
				</p>
			</div>
		</div>

		<div class="campo-diagnostico">
			<label for="estado-cambios">
				¿El trabajo se realizó como estaba previsto?
			</label>

			<select
				id="estado-cambios"
				bind:value={cambiosTrabajo.estado}
			>
				<option value="sin_cambios">
					Sí, sin cambios
				</option>

				<option value="parcial">
					Parcialmente
				</option>

				<option value="con_cambios">
					No, hubo cambios
				</option>
			</select>
		</div>

		{#if cambiosTrabajo.estado !== 'sin_cambios'}

			<div class="campo-diagnostico">
				<label for="descripcion-cambios">
					¿Qué cambió?
				</label>

				<textarea
					id="descripcion-cambios"
					bind:value={cambiosTrabajo.descripcion}
					rows="3"
					placeholder="Describe qué cambió respecto a lo previsto..."
				></textarea>
			</div>

			<div class="campo-diagnostico">
				<label for="motivo-cambios">
					¿Por qué cambió?
				</label>

				<textarea
					id="motivo-cambios"
					bind:value={cambiosTrabajo.motivo}
					rows="3"
					placeholder="Indica el motivo del cambio..."
				></textarea>
			</div>

			<div class="campo-diagnostico">
				<label for="autorizado-cambios">
					¿El cambio fue autorizado?
				</label>

				<select
					id="autorizado-cambios"
					bind:value={cambiosTrabajo.autorizado}
				>
					<option value="">
						Seleccionar
					</option>

					<option value="si">
						Sí
					</option>

					<option value="no">
						No
					</option>

					<option value="no_aplica">
						No aplica
					</option>
				</select>
			</div>

		{/if}

		<div class="navegacion-pasos">

			<button
				type="button"
				class="btn-volver-paso"
				onclick={() => pasoActual = 6}
			>
				← ¿Qué hicimos?
			</button>

			<button
				type="button"
				class="btn-continuar"
				onclick={prepararPaso8}
			>
				Continuar →
			</button>

		</div>

	</section>
{/if}
{#if pasoActual === 8}
	<section class="paso">

		<div class="paso-header">
			<span class="numero">8</span>

			<div>
				<h2>Evidencia</h2>

				<p>
					Selecciona las fotografías que documentarán el trabajo realizado.
				</p>
			</div>
		</div>

		<div class="evidencia-seccion">

			<div class="evidencia-titulo">
				<h3>Nuevas imágenes</h3>

				<p>
					Pega aquí las URLs de las fotografías nuevas alojadas en Cloudinary.
				</p>
			</div>

			<div class="evidencia-nueva-form">

				<input
					type="url"
					bind:value={nuevaFotoUrl}
					placeholder="https://res.cloudinary.com/..."
					class="evidencia-url-input"
				/>

				<button
					type="button"
					class="btn-agregar-evidencia"
					onclick={agregarFotoNueva}
				>
					+ Agregar
				</button>

			</div>

			{#if fotosNuevas.length > 0}

				<div class="evidencia-nuevas-lista">

					{#each fotosNuevas as url, indice}

						<div class="evidencia-nueva">

							<img
								src={url}
								alt="Nueva evidencia"
							/>

							<div class="evidencia-nueva-info">

								<span>{url}</span>

								<button
									type="button"
									onclick={() => eliminarFotoNueva(indice)}
								>
									Eliminar
								</button>

							</div>

						</div>

					{/each}

				</div>

			{/if}

		</div>

		<div class="navegacion-pasos">

			<button
				type="button"
				class="btn-volver-paso"
				onclick={() => pasoActual = 7}
			>
				← Cambios
			</button>

			<button
	type="button"
	class="btn-continuar"
	onclick={prepararPaso9}
>
	Continuar →
</button>

		</div>

	</section>
{/if}

{#if pasoActual === 9}
	<section class="paso paso-recomendaciones">

		<div class="paso-header">
			<span class="numero">9</span>

			<div>
				<h2>¿Qué recomendamos?</h2>

				<p>
					Registra las recomendaciones que deben quedar indicadas al cliente.
				</p>
			</div>
		</div>

		<div class="campo-diagnostico">

			<label for="recomendacion-final">
				Recomendación final
			</label>

			<textarea
				id="recomendacion-final"
				bind:value={recomendacionFinal}
				rows="6"
				placeholder="Ej. Se recomienda realizar mantenimiento preventivo, mantener limpia la superficie y revisar periódicamente las zonas tratadas..."
			></textarea>

		</div>

		<div class="navegacion-pasos">

			<button
				type="button"
				class="btn-volver-paso"
				onclick={() => pasoActual = 8}
			>
				← Evidencia
			</button>

			<button
				type="button"
				class="btn-continuar"
				onclick={prepararPaso10}
			>
				Continuar →
			</button>

		</div>

	</section>
{/if}
{#if pasoActual === 10}
	<section class="paso paso-seguimiento">

		<div class="paso-header">
			<span class="numero">10</span>

			<div>
				<h2>¿Cuándo debemos volver?</h2>

				<p>
					Programa el seguimiento para que el cliente no tenga que recordarlo.
				</p>
			</div>
		</div>

		<div class="campo-diagnostico">

			<label for="tipo-seguimiento">
				¿Cuándo quieres hacer el seguimiento?
			</label>

			<select
				id="tipo-seguimiento"
				bind:value={seguimiento.tipo}
			>
				<option value="3_meses">En 3 meses</option>
				<option value="6_meses">En 6 meses</option>
				<option value="12_meses">En 12 meses</option>
				<option value="personalizado">Fecha personalizada</option>
			</select>

		</div>

		{#if seguimiento.tipo === 'personalizado'}

			<div class="campo-diagnostico">

				<label for="fecha-seguimiento">
					Fecha de seguimiento
				</label>

				<input
					id="fecha-seguimiento"
					type="date"
					bind:value={seguimiento.fecha}
				/>

			</div>

		{/if}

		<div class="campo-diagnostico">

			<label for="descripcion-seguimiento">
				¿Qué debemos revisar?
			</label>

			<textarea
				id="descripcion-seguimiento"
				rows="4"
				bind:value={seguimiento.descripcion}
				placeholder="Ej. Revisar nuevamente el estado del techo, corrosión, acabado y posibles puntos de humedad."
			></textarea>

		</div>

		<div class="navegacion-pasos">

			<button
				type="button"
				class="btn-volver-paso"
				onclick={() => pasoActual = 9}
			>
				← Recomendaciones
			</button>

			<button
				type="button"
				class="btn-continuar"
onclick={generarReporte}	>
				Generar reporte →
			</button>

		</div>

	</section>
{/if}
<style>
.evidencia-nueva-form {
	display: flex;
	gap: 10px;
	margin-top: 16px;
}

.evidencia-url-input {
	min-width: 0;
	flex: 1;
	padding: 12px 14px;
	border: 1px solid #e2e8f0;
	border-radius: 12px;
	background: #f8fafc;
	outline: none;
}

.evidencia-url-input:focus {
	border-color: #94a3b8;
	background: white;
}

.btn-agregar-evidencia {
	padding: 12px 18px;
	border: 1px solid #cbd5e1;
	border-radius: 12px;
	background: white;
	font-weight: 800;
	color: #334155;
	cursor: pointer;
}

.btn-agregar-evidencia:hover {
	background: #f8fafc;
}

.evidencia-nuevas-lista {
	display: grid;
	gap: 12px;
	margin-top: 18px;
}

.evidencia-nueva {
	display: flex;
	gap: 14px;
	align-items: center;
	padding: 12px;
	border: 1px solid #e2e8f0;
	border-radius: 14px;
	background: white;
}

.evidencia-nueva img {
	width: 90px;
	height: 70px;
	object-fit: cover;
	border-radius: 10px;
	flex-shrink: 0;
}

.evidencia-nueva-info {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 14px;
	min-width: 0;
	width: 100%;
}

.evidencia-nueva-info span {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 13px;
	color: #64748b;
}

.evidencia-nueva-info button {
	flex-shrink: 0;
	padding: 8px 12px;
	border: 1px solid #fecaca;
	border-radius: 10px;
	background: white;
	font-weight: 700;
	color: #dc2626;
	cursor: pointer;
}

.evidencia-nueva-info button:hover {
	background: #fef2f2;
}

@media (max-width: 700px) {
	.evidencia-nueva-form {
		flex-direction: column;
	}

	.evidencia-nueva-info {
		flex-direction: column;
		align-items: flex-start;
	}

	.evidencia-nueva-info span {
		width: 100%;
	}
}
.zonas-editor{
	display:flex;
	flex-direction:column;
	gap:16px;
}

.zona-editor{
	padding:18px;
	border:1px solid var(--border);
	border-radius:10px;
	background:var(--surface);
}

.zona-editor-header{
	display:flex;
	align-items:center;
	justify-content:space-between;
	gap:12px;
	margin-bottom:18px;
}

.zona-editor-header strong{
	font-size:14px;
	color:var(--text);
}

.btn-eliminar-zona{
	border:0;
	background:transparent;
	color:var(--text-secondary);
	font-size:11px;
	cursor:pointer;
}

.btn-eliminar-zona:hover{
	color:var(--text);
}

.btn-agregar-zona{
	margin-top:14px;
	padding:10px 14px;
	border:1px dashed var(--border);
	border-radius:9px;
	background:transparent;
	color:var(--text);
	font-size:13px;
	cursor:pointer;
}

.btn-agregar-zona:hover{
	background:var(--surface-hover, #f5f5f5);
}

.campo-diagnostico select{
	width:100%;
	box-sizing:border-box;
	padding:13px 14px;
	border:1px solid var(--border);
	border-radius:10px;
	background:var(--surface);
	color:var(--text);
	font:inherit;
	font-size:13px;
	outline:none;
}

.campo-diagnostico select:focus{
	border-color:var(--primary);
}
	.page{
		max-width:1000px;
		margin:0 auto;
		padding:32px 24px 60px;
	}

	.header{
		margin-bottom:28px;
	}

	.volver{
		display:inline-block;
		margin-bottom:14px;
		color:var(--text-secondary);
		font-size:13px;
		text-decoration:none;
	}

	.volver:hover{
		color:var(--text);
	}

	h1{
		margin:0;
		color:var(--text);
		font-size:28px;
	}

	.header p{
		margin:7px 0 0;
		color:var(--text-secondary);
		font-size:14px;
	}

	.paso{
		background:var(--surface);
		border:1px solid var(--border);
		border-radius:var(--radius);
		padding:24px;
	}

	.paso-header{
		display:flex;
		align-items:flex-start;
		gap:14px;
		margin-bottom:24px;
	}

	.numero{
		display:flex;
		align-items:center;
		justify-content:center;
		width:32px;
		height:32px;
		flex:none;
		border-radius:50%;
		background:var(--primary);
		color:white;
		font-weight:700;
	}

	.paso-header h2{
		margin:2px 0 5px;
		font-size:18px;
		color:var(--text);
	}

	.paso-header p{
		margin:0;
		color:var(--text-secondary);
		font-size:13px;
	}

	.lista{
		display:flex;
		flex-direction:column;
		gap:10px;
	}

	.cotizacion{
		width:100%;
		display:flex;
		align-items:center;
		justify-content:space-between;
		gap:20px;
		padding:16px;
		border:1px solid var(--border);
		border-radius:10px;
		background:transparent;
		text-align:left;
		cursor:pointer;
		transition:.15s ease;
	}

	.cotizacion:hover{
		background:var(--surface-hover, #f5f5f5);
	}

	.cotizacion.selected{
		border-color:var(--primary);
		background:color-mix(
			in srgb,
			var(--primary) 7%,
			var(--surface)
		);
	}

	.cotizacion-principal{
		min-width:0;
	}
	.evidencia-seccion {
	margin-top: 24px;
}

.evidencia-titulo h3 {
	margin: 0;
	font-size: 18px;
	font-weight: 800;
	color: #0f172a;
}

.evidencia-titulo p {
	margin: 6px 0 0;
	font-size: 14px;
	color: #64748b;
}

.evidencia-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 16px;
	margin-top: 20px;
}

.evidencia-foto {
	overflow: hidden;
	border: 1px solid #e2e8f0;
	border-radius: 16px;
	background: white;
	cursor: pointer;
	transition: border-color 0.2s, box-shadow 0.2s;
}

.evidencia-foto:hover {
	border-color: #94a3b8;
	box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.evidencia-foto img {
	display: block;
	width: 100%;
	height: 180px;
	object-fit: cover;
}

.evidencia-foto-control {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 12px 14px;
	font-size: 14px;
	font-weight: 700;
	color: #334155;
}

.evidencia-foto-control input {
	width: 17px;
	height: 17px;
}

.evidencia-mensaje {
	margin-top: 20px;
	padding: 18px;
	border-radius: 14px;
	background: #f8fafc;
	color: #64748b;
}

.evidencia-error {
	margin-top: 20px;
	padding: 18px;
	border-radius: 14px;
	background: #fef2f2;
	color: #b91c1c;
}

@media (max-width: 700px) {
	.evidencia-grid {
		grid-template-columns: 1fr;
	}
}
	.cliente{
		font-size:14px;
		font-weight:700;
		color:var(--text);
	}

	.empresa{
		margin-top:2px;
		font-size:12px;
		color:var(--text-secondary);
	}

	.trabajo{
		margin-top:9px;
		font-size:14px;
		color:var(--text);
	}

	.cotizacion-derecha{
		flex:none;
		text-align:right;
	}

	.total{
		font-size:14px;
		font-weight:700;
		color:var(--text);
	}

	.estado{
		margin-top:5px;
		font-size:11px;
		color:var(--text-secondary);
		text-transform:uppercase;
	}

	.seleccion{
		display:flex;
		align-items:center;
		justify-content:space-between;
		gap:20px;
		margin-top:18px;
		padding:18px 20px;
		background:var(--surface);
		border:1px solid var(--border);
		border-radius:var(--radius);
	}

	.seleccion span{
		display:block;
		margin-bottom:4px;
		font-size:11px;
		color:var(--text-secondary);
		text-transform:uppercase;
	}

	.seleccion strong{
		display:block;
		font-size:15px;
		color:var(--text);
	}

	.seleccion p{
		margin:4px 0 0;
		font-size:13px;
		color:var(--text-secondary);
	}

	.btn-continuar,
	.btn-secundario{
		border:none;
		border-radius:9px;
		padding:10px 15px;
		background:var(--primary);
		color:white;
		font-size:13px;
		font-weight:600;
		cursor:pointer;
		text-decoration:none;
		white-space:nowrap;
	}

	.btn-continuar:hover,
	.btn-secundario:hover{
		opacity:.9;
	}

	.vacio{
		padding:50px 20px;
		text-align:center;
	}

	.icono{
		font-size:38px;
		margin-bottom:10px;
	}

	.vacio h3{
		margin:0;
		color:var(--text);
	}

	.vacio p{
		margin:7px 0 18px;
		color:var(--text-secondary);
		font-size:13px;
	}

	.paso-recibos{
	margin-top:18px;
}

.resumen-recibos{
	display:grid;
	grid-template-columns:repeat(3, 1fr);
	gap:12px;
	margin-bottom:24px;
}

.resumen-item{
	padding:16px;
	border:1px solid var(--border);
	border-radius:10px;
	background:var(--surface);
}

.resumen-item span{
	display:block;
	margin-bottom:6px;
	font-size:11px;
	color:var(--text-secondary);
	text-transform:uppercase;
}

.resumen-item strong{
	font-size:17px;
	color:var(--text);
}

.recibos-header{
	display:flex;
	align-items:center;
	justify-content:space-between;
	gap:16px;
	margin-bottom:12px;
}

.recibos-header strong{
	display:block;
	font-size:14px;
	color:var(--text);
}

.recibos-header span{
	display:block;
	margin-top:3px;
	font-size:12px;
	color:var(--text-secondary);
}

.lista-recibos{
	display:flex;
	flex-direction:column;
	gap:8px;
}

.recibo{
	display:flex;
	align-items:center;
	justify-content:space-between;
	gap:20px;
	padding:14px 16px;
	border:1px solid var(--border);
	border-radius:10px;
}

.recibo > div{
	min-width:0;
}

.recibo strong{
	display:block;
	font-size:13px;
	color:var(--text);
}

.recibo span{
	display:block;
	margin-top:3px;
	font-size:11px;
	color:var(--text-secondary);
}

.recibo p{
	margin:5px 0 0;
	font-size:12px;
	color:var(--text-secondary);
}

.recibo-monto{
	white-space:nowrap;
}

.sin-recibos{
	padding:36px 20px;
	text-align:center;
	border:1px dashed var(--border);
	border-radius:10px;
}

.sin-recibos > div{
	font-size:30px;
	margin-bottom:8px;
}

.sin-recibos strong{
	color:var(--text);
	font-size:14px;
}

.sin-recibos p{
	margin:6px 0 0;
	color:var(--text-secondary);
	font-size:12px;
}

.error-recibos{
	padding:14px;
	border:1px solid var(--border);
	border-radius:10px;
	color:var(--text);
	font-size:13px;
}

.navegacion-pasos{
	display:flex;
	align-items:center;
	justify-content:space-between;
	margin-top:20px;
}

.btn-volver-paso{
	border:1px solid var(--border);
	border-radius:9px;
	padding:10px 15px;
	background:transparent;
	color:var(--text);
	font-size:13px;
	cursor:pointer;
}

.btn-volver-paso:hover{
	background:var(--surface-hover, #f5f5f5);
}

.btn-continuar:disabled{
	opacity:.6;
	cursor:wait;
}

.campo-diagnostico{
	margin-bottom:18px;
}

.campo-diagnostico label{
	display:block;
	margin-bottom:7px;
	font-size:13px;
	font-weight:600;
	color:var(--text);
}

.campo-diagnostico textarea,
.campo-diagnostico input{
	width:100%;
	box-sizing:border-box;
	padding:13px 14px;
	border:1px solid var(--border);
	border-radius:10px;
	background:var(--surface);
	color:var(--text);
	font:inherit;
	font-size:13px;
	line-height:1.5;
	outline:none;
}

.campo-diagnostico textarea{
	resize:vertical;
}

.campo-diagnostico textarea:focus,
.campo-diagnostico input:focus{
	border-color:var(--primary);
}

	@media(max-width:700px){
		.cotizacion{
			align-items:flex-start;
			flex-direction:column;
		}

		.cotizacion-derecha{
			text-align:left;
		}

		.seleccion{
			align-items:flex-start;
			flex-direction:column;
		}

		.btn-continuar{
			width:100%;
		}
		.resumen-recibos{
	grid-template-columns:1fr;
}

.recibos-header{
	align-items:flex-start;
	flex-direction:column;
}

.recibos-header .btn-secundario{
	width:100%;
	text-align:center;
}

.recibo{
	align-items:flex-start;
	flex-direction:column;
}

.navegacion-pasos{
	gap:10px;
}

.navegacion-pasos button{
	width:100%;
}
	}
</style>
