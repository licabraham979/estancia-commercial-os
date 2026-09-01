
<script>
	import { goto } from '$app/navigation';
	import { obtenerProveedores } from '$lib/stores/proveedores.svelte.js';

	/** @type {import('$lib/stores/proveedores.svelte.js').Proveedor[]} */
	let proveedores = $state([]);

	let busqueda = $state('');
	let cargando = $state(true);

	let proveedoresFiltrados = $derived(
		proveedores.filter((proveedor) => {
			const texto = busqueda.toLowerCase().trim();

			if (!texto) return true;

			return [
				proveedor.nombre,
				proveedor.telefono,
				proveedor.whatsapp,
				proveedor.email,
				proveedor.categoria,
				proveedor.productos,
				proveedor.direccion
			]
				.filter(Boolean)
				.some(valor =>
					String(valor).toLowerCase().includes(texto)
				);
		})
	);

	async function cargarProveedores() {
		cargando = true;
		proveedores = await obtenerProveedores();
		cargando = false;
	}

	function nuevoProveedor() {
		goto('/crm/proveedores/nuevo');
	}

	/**
	 * @param {string} id
	 */
	function abrirProveedor(id) {
		goto(`/crm/proveedores/${id}`);
	}

	$effect(() => {
		cargarProveedores();
	});
</script>



<div class="pagina">

	<header class="header">

		<div>
			<h1>Proveedores</h1>

			<p>
				Contactos, productos, condiciones y promociones.
			</p>
		</div>

		<button class="nuevo" onclick={nuevoProveedor}>
			+ Nuevo proveedor
		</button>

	</header>


	<div class="barra">

		<input
			type="search"
			placeholder="Buscar proveedor, empresa, categoría..."
			bind:value={busqueda}
		/>

		<span>
			{proveedoresFiltrados.length} proveedor{proveedoresFiltrados.length === 1 ? '' : 'es'}
		</span>

	</div>


	{#if proveedoresFiltrados.length === 0}

		<div class="vacio">

			<div class="icono">🏢</div>

			<h2>No hay proveedores todavía</h2>

			<p>
				Agrega tu primer proveedor para tener a mano
				contacto, productos, condiciones y promociones.
			</p>

			<button class="nuevo" onclick={nuevoProveedor}>
				+ Agregar proveedor
			</button>

		</div>

	{:else}

		<div class="grid">

			{#each proveedoresFiltrados as proveedor}

				<article class="card">

					<div class="card-header">

						<div>

							<h2>{proveedor.nombre}</h2>

							

						</div>

						{#if proveedor.categoria}
							<span class="categoria">
								{proveedor.categoria}
							</span>
						{/if}

					</div>


					{#if proveedor.productos}

						<div class="dato">

							<span>Productos / Servicios</span>

							<strong>
								{proveedor.productos}
							</strong>

						</div>

					{/if}


					<div class="datos">

						{#if proveedor.telefono}

							<div>
								<span>Teléfono</span>
								<strong>{proveedor.telefono}</strong>
							</div>

						{/if}


						{#if proveedor.whatsapp}

							<div>
								<span>WhatsApp</span>
								<strong>{proveedor.whatsapp}</strong>
							</div>

						{/if}


						{#if proveedor.tiempo_entrega}
	<div>
		<span>Entrega</span>
		<strong>{proveedor.tiempo_entrega}</strong>
	</div>
{/if}

					</div>


				

					<button
						class="ver"
						onclick={() => abrirProveedor(proveedor.id)}
					>
						Ver ficha →
					</button>

				</article>

			{/each}

		</div>

	{/if}

</div>


<style>

.pagina {
	padding: var(--space-6);
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: var(--space-4);
}

.header h1 {
	font-size: 32px;
}

.header p {
	margin-top: var(--space-2);
	color: var(--text-secondary);
}

.nuevo {
	padding: 12px 18px;
	border: none;
	border-radius: 10px;
	background: var(--primary);
	color: white;
	cursor: pointer;
	font-weight: 600;
}

.barra {
	margin-top: var(--space-6);
	display: flex;
	align-items: center;
	gap: 15px;
}

.barra input {
	flex: 1;
	max-width: 520px;
	padding: 12px 14px;
	border: 1px solid var(--border);
	border-radius: 10px;
	font-size: 15px;
}

.barra span {
	font-size: 14px;
	color: var(--text-secondary);
}

.grid {
	margin-top: var(--space-6);
	display: grid;
	grid-template-columns: repeat(
		auto-fit,
		minmax(300px, 1fr)
	);
	gap: var(--space-4);
}

.card {
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius);
	padding: var(--space-5);
	box-shadow: var(--shadow-sm);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 15px;
}

.card-header h2 {
	font-size: 19px;
}

.card-header p {
	margin-top: 4px;
	color: var(--text-secondary);
	font-size: 14px;
}

.categoria {
	padding: 5px 9px;
	border-radius: 20px;
	background: #eff6ff;
	color: var(--primary);
	font-size: 12px;
	font-weight: 600;
	white-space: nowrap;
}

.dato {
	margin-top: var(--space-5);
}

.dato span,
.datos span {
	display: block;
	font-size: 12px;
	color: var(--text-secondary);
}

.dato strong {
	display: block;
	margin-top: 4px;
	font-size: 14px;
}

.datos {
	margin-top: var(--space-5);
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 15px;
}

.datos strong {
	display: block;
	margin-top: 4px;
	font-size: 14px;
}

.promocion {
	margin-top: var(--space-5);
	padding: 12px;
	border-radius: 10px;
	background: #fff7ed;
}

.promocion span {
	font-size: 12px;
}

.promocion strong {
	display: block;
	margin-top: 4px;
}

.promocion p {
	margin-top: 4px;
	font-size: 13px;
}

.ver {
	margin-top: var(--space-5);
	width: 100%;
	padding: 11px;
	border: 1px solid var(--border);
	border-radius: 9px;
	background: transparent;
	cursor: pointer;
	font-weight: 600;
}

.vacio {
	margin: 60px auto;
	max-width: 500px;
	text-align: center;
	padding: 40px;
	border: 1px dashed var(--border);
	border-radius: var(--radius);
}

.icono {
	font-size: 42px;
}

.vacio h2 {
	margin-top: 15px;
}

.vacio p {
	margin: 10px 0 20px;
	color: var(--text-secondary);
}

</style>
