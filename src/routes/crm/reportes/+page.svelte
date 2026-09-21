<script>

	let { data } = $props();

	const reportes = $derived(
		data.reportes ?? []
	);

	function formatearFecha(/** @type {string|null|undefined} */ fecha){

		if(!fecha) return '';

		const fechaObj = new Date(
			`${fecha}T00:00:00`
		);

		return new Intl.DateTimeFormat(
			'es-HN',
			{
				day:'2-digit',
				month:'long',
				year:'numeric'
			}
		).format(fechaObj);

	}

	function verReporte(/** @type {string} */ id){

		window.location.href = `/crm/reportes/${id}`;

	}

	function crearReporte(){

		window.location.href = '/crm/reportes/nuevo';

	}

</script>


<svelte:head>

	<title>
		Reportes | Estancia Comercial
	</title>

</svelte:head>


<div class="page">

	<header class="header">

		<div>

			<h1>
				📋 Reportes
			</h1>

			<p>
				Reportes técnicos de trabajos realizados,
				diagnóstico y mantenimiento.
			</p>

		</div>


		<button
			class="btn-crear"
			onclick={crearReporte}
		>
			＋ Crear reporte
		</button>

	</header>


	{#if reportes.length === 0}

		<div class="vacio">

			<div class="icono">
				📋
			</div>

			<h2>
				Aún no hay reportes
			</h2>

			<p>
				Crea el primer reporte técnico para comenzar.
			</p>

			<button
				class="btn-crear"
				onclick={crearReporte}
			>
				＋ Crear reporte
			</button>

		</div>

	{:else}

		<div class="grid">

			{#each reportes as reporte (reporte.id)}

				<article class="card">

					<div class="card-header">

						<span class="tipo">
							{reporte.plantilla === 'estado_mantenimiento_cubierta'
								? 'Cubierta'
								: 'Reporte técnico'}
						</span>

						<span class="fecha">
							{formatearFecha(reporte.fecha)}
						</span>

					</div>


					<h2>
						{reporte.titulo}
					</h2>


					<div class="cliente">

						<strong>
							{reporte.cliente_nombre}
						</strong>

						{#if reporte.cotizacion?.cliente_empresa}

							<span>
								{reporte.cotizacion.cliente_empresa}
							</span>

						{/if}

					</div>


					{#if reporte.cotizacion?.titulo}

						<div class="trabajo">

							<span>
								Trabajo
							</span>

							<strong>
								{reporte.cotizacion.titulo}
							</strong>

						</div>

					{/if}


					<div class="card-footer">

						<button
							class="btn-ver"
							onclick={() => verReporte(reporte.id)}
						>
							Ver reporte →
						</button>

					</div>

				</article>

			{/each}

		</div>

	{/if}

</div>


<style>

.page{

	max-width:1100px;

	margin:0 auto;

	padding:32px 24px 60px;

}


.header{

	display:flex;

	align-items:center;

	justify-content:space-between;

	gap:20px;

	margin-bottom:28px;

}


.header h1{

	margin:0;

	font-size:28px;

	color:var(--text);

}


.header p{

	margin:7px 0 0;

	color:var(--text-secondary);

	font-size:14px;

}


.btn-crear{

	border:none;

	border-radius:10px;

	padding:11px 16px;

	background:var(--primary);

	color:white;

	font-size:14px;

	font-weight:600;

	cursor:pointer;

	white-space:nowrap;

}


.btn-crear:hover{

	opacity:.9;

}


.grid{

	display:grid;

	grid-template-columns:
		repeat(auto-fill, minmax(310px, 1fr));

	gap:18px;

}


.card{

	background:var(--surface);

	border:1px solid var(--border);

	border-radius:var(--radius);

	padding:20px;

	transition:.2s ease;

}


.card:hover{

	transform:translateY(-2px);

	box-shadow:var(--shadow);

}


.card-header{

	display:flex;

	align-items:center;

	justify-content:space-between;

	gap:10px;

	margin-bottom:14px;

}


.tipo{

	font-size:11px;

	font-weight:700;

	text-transform:uppercase;

	letter-spacing:.05em;

	color:var(--text-secondary);

}


.fecha{

	font-size:12px;

	color:var(--text-secondary);

}


.card h2{

	margin:0;

	font-size:17px;

	line-height:1.35;

	color:var(--text);

}


.cliente{

	display:flex;

	flex-direction:column;

	gap:3px;

	margin-top:14px;

}


.cliente strong{

	font-size:14px;

	color:var(--text);

}


.cliente span{

	font-size:13px;

	color:var(--text-secondary);

}


.trabajo{

	display:flex;

	flex-direction:column;

	gap:3px;

	margin-top:16px;

	padding-top:14px;

	border-top:1px solid var(--border);

}


.trabajo span{

	font-size:11px;

	text-transform:uppercase;

	color:var(--text-secondary);

}


.trabajo strong{

	font-size:13px;

	color:var(--text);

}


.card-footer{

	display:flex;

	justify-content:flex-end;

	margin-top:20px;

}


.btn-ver{

	border:1px solid var(--border);

	background:transparent;

	border-radius:9px;

	padding:8px 12px;

	color:var(--text);

	font-size:13px;

	font-weight:600;

	cursor:pointer;

}


.btn-ver:hover{

	background:var(--surface-hover, #f5f5f5);

}


.vacio{

	min-height:55vh;

	display:flex;

	flex-direction:column;

	align-items:center;

	justify-content:center;

	text-align:center;

}


.icono{

	font-size:42px;

	margin-bottom:10px;

}


.vacio h2{

	margin:0;

	color:var(--text);

}


.vacio p{

	margin:8px 0 20px;

	color:var(--text-secondary);

}


@media(max-width:700px){

	.header{

		align-items:flex-start;

		flex-direction:column;

	}


	.btn-crear{

		width:100%;

	}


	.grid{

		grid-template-columns:1fr;

	}

}

</style>
