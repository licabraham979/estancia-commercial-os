
<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	import {
		obtenerProveedor,
		eliminarProveedor
	} from '$lib/stores/proveedores.svelte.js';

	import { supabase } from '$lib/supabase/client';

	/** @type {any[]} */
	let materialesProveedor = $state([]);

	/** @type {any[]} */
	let catalogoMateriales = $state([]);

	let mostrarAgregarMaterial = $state(false);
	let articuloSeleccionado = $state('');
	let precioProveedor = $state('');
	let notaMaterial = $state('');
	let cargandoMateriales = $state(false);
	let cargandoProveedor = $state(true);

	const id = $derived(page.params.id ?? '');

	/** @type {import('$lib/stores/proveedores.svelte.js').Proveedor|null} */
	let proveedor = $state(null);

	async function cargarProveedor() {
		cargandoProveedor = true;

		if (!id) {
			proveedor = null;
			cargandoProveedor = false;
			return;
		}

		proveedor = await obtenerProveedor(id);
		cargandoProveedor = false;
	}

	function volver() {
		goto('/crm/proveedores');
	}

	function editar() {
		alert('Edición de proveedor: siguiente paso');
	}

	async function eliminar() {
		if (!proveedor) return;

		const confirmar = confirm(
			`¿Eliminar a ${proveedor.nombre}?`
		);

		if (!confirmar) return;

		const eliminado = await eliminarProveedor(proveedor.id);

		if (!eliminado) {
			alert('No fue posible eliminar el proveedor.');
			return;
		}

		goto('/crm/proveedores');
	}

	async function cargarMaterialesProveedor() {
		if (!proveedor) return;

		cargandoMateriales = true;

		const { data, error } = await supabase
			.from('proveedor_materiales')
			.select(`
				id,
				proveedor_id,
				articulo_id,
				precio,
				notas,
				activo,
				updated_at,
				catalogo_articulos (
					id,
					nombre,
					descripcion,
					tipo
				)
			`)
			.eq('proveedor_id', String(proveedor.id))
			.eq('activo', true)
			.order('updated_at', { ascending: false });

		if (error) {
			console.error('Error cargando materiales:', error);
			materialesProveedor = [];
		} else {
			materialesProveedor = data ?? [];
		}

		cargandoMateriales = false;
	}

	async function cargarCatalogoMateriales() {
		const { data, error } = await supabase
			.from('catalogo_articulos')
			.select('id, nombre, descripcion, tipo')
			.eq('activo', true)
			.order('nombre');

		if (error) {
			console.error('Error cargando catálogo:', error);
			catalogoMateriales = [];
			return;
		}

		catalogoMateriales = data ?? [];
	}

	async function prepararAgregarMaterial() {
		await cargarCatalogoMateriales();

		articuloSeleccionado = '';
		precioProveedor = '';
		notaMaterial = '';

		mostrarAgregarMaterial = true;
	}

	async function guardarMaterialProveedor() {
		if (!proveedor) return;

		if (!articuloSeleccionado) {
			alert('Selecciona un material.');
			return;
		}

		const precio = Number(precioProveedor);

		if (!Number.isFinite(precio) || precio < 0) {
			alert('Introduce un precio válido.');
			return;
		}

		const { error } = await supabase
			.from('proveedor_materiales')
			.upsert(
				{
					proveedor_id: String(proveedor.id),
					articulo_id: articuloSeleccionado,
					precio,
					notas: notaMaterial.trim() || null,
					activo: true,
					updated_at: new Date().toISOString()
				},
				{
					onConflict: 'proveedor_id,articulo_id'
				}
			);

		if (error) {
			console.error('Error guardando material:', error);
			alert('No fue posible guardar el material.');
			return;
		}

		mostrarAgregarMaterial = false;

		await cargarMaterialesProveedor();
	}

	/**
	 * @param {string} idMaterial
	 */
	async function quitarMaterial(idMaterial) {
		const confirmar = confirm(
			'¿Quitar este material de este proveedor?'
		);

		if (!confirmar) return;

		const { error } = await supabase
			.from('proveedor_materiales')
			.update({
				activo: false,
				updated_at: new Date().toISOString()
			})
			.eq('id', idMaterial);

		if (error) {
			console.error(error);
			alert('No fue posible quitar el material.');
			return;
		}

		await cargarMaterialesProveedor();
	}

	function compartirFicha() {
		alert('Compartir ficha: siguiente paso');
	}

	function abrirAsignarMateriales() {
		prepararAgregarMaterial();
	}

	$effect(() => {
		cargarProveedor();
	});

	$effect(() => {
		if (proveedor) {
			cargarMaterialesProveedor();
		}
	});
</script>

{#if !proveedor}

	<div class="vacio">
		<div class="icono">🔎</div>

		<h1>Proveedor no encontrado</h1>

		<p>
			Este proveedor no existe o fue eliminado.
		</p>

		<button class="boton" onclick={volver}>
			← Volver a proveedores
		</button>
	</div>

{:else}

	<div class="pagina">

		<header class="header">

			<button class="volver" onclick={volver}>
				← Proveedores
			</button>

			<div class="acciones">
	<button class="compartir" onclick={compartirFicha}>
		📤 Compartir ficha
	</button>

	<button class="materiales" onclick={abrirAsignarMateriales}>
		📦 Asignar materiales
	</button>

	<button class="secundario" onclick={editar}>
		Editar
	</button>

	<button class="peligro" onclick={eliminar}>
		Eliminar
	</button>
</div>

		</header>


		
<section class="encabezado">

	<div>
		<h1>{proveedor.nombre}</h1>

		{#if proveedor.categoria}
			<span class="categoria">
				{proveedor.categoria}
			</span>
		{/if}
	</div>

</section>


<div class="grid">

	<section class="card">

		<h2>Contacto</h2>

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

			{#if proveedor.email}
				<div>
					<span>Correo</span>
					<strong>{proveedor.email}</strong>
				</div>
			{/if}

			{#if proveedor.direccion}
				<div>
					<span>Dirección</span>
					<strong>{proveedor.direccion}</strong>
				</div>
			{/if}

		</div>

	</section>


	<section class="card">

		<h2>Comercial</h2>

		<div class="datos">

			{#if proveedor.productos}
				<div class="ancho">
					<span>Productos / Servicios</span>
					<strong>{proveedor.productos}</strong>
				</div>
			{/if}

			{#if proveedor.condiciones_pago}
				<div>
					<span>Condiciones de pago</span>
					<strong>{proveedor.condiciones_pago}</strong>
				</div>
			{/if}

			{#if proveedor.tiempo_entrega}
				<div>
					<span>Tiempo de entrega</span>
					<strong>{proveedor.tiempo_entrega}</strong>
				</div>
			{/if}

		</div>

	</section>


			<section class="card materiales-card">

	<div class="materiales-header">

		<div>
			<h2>Materiales y precios</h2>

			<p>
				Precios específicos que maneja este proveedor.
			</p>
		</div>

		<button
			class="boton-material"
			onclick={prepararAgregarMaterial}
		>
			+ Agregar material
		</button>

	</div>

	{#if cargandoMateriales}

		<p class="estado-materiales">
			Cargando materiales...
		</p>

	{:else if materialesProveedor.length === 0}

		<div class="sin-materiales">

			<div>📦</div>

			<strong>
				Aún no hay materiales asignados
			</strong>

			<p>
				Agrega materiales del catálogo y registra
				el precio que maneja este proveedor.
			</p>

		</div>

	{:else}

		<div class="lista-materiales">

			{#each materialesProveedor as relacion}

				<div class="material-item">

					<div class="material-info">

						<strong>
							{relacion.catalogo_articulos?.nombre ?? 'Material'}
						</strong>

						{#if relacion.catalogo_articulos?.descripcion}
							<span>
								{relacion.catalogo_articulos.descripcion}
							</span>
						{/if}

						{#if relacion.notas}
							<small>
								{relacion.notas}
							</small>
						{/if}

					</div>

					<div class="material-precio">

						<strong>
							L {Number(relacion.precio).toFixed(2)}
						</strong>

						<button
							class="quitar-material"
							onclick={() => quitarMaterial(relacion.id)}
						>
							Quitar
						</button>

					</div>

				</div>

			{/each}

		</div>

	{/if}

</section>


{#if mostrarAgregarMaterial}

	<div class="modal-fondo">

		<div class="modal-material">

			<div class="modal-header">

				<div>
					<h2>Agregar material</h2>

					<p>
						Selecciona un artículo del catálogo maestro.
					</p>
				</div>

				<button
					class="cerrar-modal"
					onclick={() => mostrarAgregarMaterial = false}
				>
					✕
				</button>

			</div>

			<div class="form-material">

				<label>
					<span>Material</span>

					<select bind:value={articuloSeleccionado}>
						<option value="">
							Seleccionar material...
						</option>

						{#each catalogoMateriales as articulo}
							<option value={articulo.id}>
								{articulo.nombre}
								{articulo.tipo ? ` · ${articulo.tipo}` : ''}
							</option>
						{/each}
					</select>
				</label>

				<label>
					<span>Precio de este proveedor</span>

					<input
						type="number"
						min="0"
						step="0.01"
						placeholder="0.00"
						bind:value={precioProveedor}
					/>
				</label>

				<label>
					<span>Nota</span>

					<input
						type="text"
						placeholder="Ej. precio especial, promoción..."
						bind:value={notaMaterial}
					/>
				</label>

				<div class="modal-acciones">

					<button
						class="secundario"
						onclick={() => mostrarAgregarMaterial = false}
					>
						Cancelar
					</button>

					<button
						class="boton"
						onclick={guardarMaterialProveedor}
					>
						Guardar precio
					</button>

				</div>

			</div>

		</div>

	</div>

{/if}

{#if proveedor.notas}
	<section class="card">
		<h2>Notas</h2>

		<p class="notas">
			{proveedor.notas}
		</p>
	</section>
{/if}

	</div>

</div>

{/if}
<style>

.pagina {
	padding: var(--space-6);
	max-width: 1100px;
	margin: 0 auto;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: var(--space-4);
}

.volver {
	border: none;
	background: transparent;
	cursor: pointer;
	font-weight: 600;
	color: var(--text-secondary);
}

.acciones {
	display: flex;
	gap: 10px;
}

.secundario,
.peligro,
.boton {
	padding: 10px 16px;
	border-radius: 9px;
	cursor: pointer;
	font-weight: 600;
}

.secundario {
	border: 1px solid var(--border);
	background: var(--surface);
}

.peligro {
	border: none;
	background: #fee2e2;
	color: #b91c1c;
}

.encabezado {
	margin-top: var(--space-6);
	padding-bottom: var(--space-5);
	border-bottom: 1px solid var(--border);
}

.encabezado h1 {
	font-size: 32px;
}

.contacto {
	margin-top: 5px;
	color: var(--text-secondary);
}

.categoria {
	display: inline-block;
	margin-top: 12px;
	padding: 5px 10px;
	border-radius: 20px;
	background: #eff6ff;
	color: var(--primary);
	font-size: 12px;
	font-weight: 600;
}

.grid {
	margin-top: var(--space-5);
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: var(--space-4);
}

.card {
	padding: var(--space-5);
	border: 1px solid var(--border);
	border-radius: var(--radius);
	background: var(--surface);
	box-shadow: var(--shadow-sm);
}

.card h2 {
	margin-bottom: var(--space-4);
	font-size: 18px;
}

.datos {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 18px;
}

.datos span,
.promocion span {
	display: block;
	font-size: 12px;
	color: var(--text-secondary);
}

.datos strong,
.promocion strong {
	display: block;
	margin-top: 4px;
	font-size: 14px;
}

.ancho {
	grid-column: 1 / -1;
}

.promocion {
	background: #fff7ed;
}

.promocion > div + div {
	margin-top: 15px;
}

.notas {
	color: var(--text-secondary);
	line-height: 1.6;
	white-space: pre-wrap;
}

.vacio {
	max-width: 500px;
	margin: 100px auto;
	text-align: center;
	padding: 40px;
}

.icono {
	font-size: 42px;
	margin-bottom: 15px;
}

.vacio p {
	margin: 10px 0 25px;
	color: var(--text-secondary);
}

.boton {
	border: none;
	background: var(--primary);
	color: white;
}

@media (max-width: 700px) {
	.grid {
		grid-template-columns: 1fr;
	}

	.datos {
		grid-template-columns: 1fr;
	}

	.header {
		align-items: flex-start;
	}

	.acciones {
		flex-direction: column;
	}
}
.materiales-card {
	grid-column: 1 / -1;
}

.materiales-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 20px;
}

.materiales-header p {
	margin-top: 4px;
	color: var(--text-secondary);
	font-size: 14px;
}

.boton-material {
	border: none;
	border-radius: 9px;
	padding: 10px 15px;
	background: var(--primary);
	color: white;
	cursor: pointer;
	font-weight: 600;
}

.estado-materiales,
.sin-materiales {
	margin-top: 25px;
	color: var(--text-secondary);
}

.sin-materiales {
	padding: 30px;
	border: 1px dashed var(--border);
	border-radius: 12px;
	text-align: center;
}

.sin-materiales > div {
	font-size: 35px;
	margin-bottom: 10px;
}

.sin-materiales p {
	margin-top: 6px;
	font-size: 14px;
}

.lista-materiales {
	margin-top: 25px;
	display: grid;
	gap: 10px;
}

.material-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 20px;
	padding: 15px;
	border: 1px solid var(--border);
	border-radius: 12px;
}

.material-info {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.material-info span,
.material-info small {
	color: var(--text-secondary);
	font-size: 13px;
}

.material-precio {
	display: flex;
	align-items: center;
	gap: 15px;
}

.material-precio > strong {
	font-size: 18px;
}

.quitar-material {
	border: none;
	background: transparent;
	color: #b91c1c;
	cursor: pointer;
	font-size: 12px;
}

.modal-fondo {
	position: fixed;
	inset: 0;
	z-index: 100;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
	background: rgba(0, 0, 0, 0.45);
}

.modal-material {
	width: min(520px, 100%);
	background: var(--surface);
	border-radius: 16px;
	padding: 25px;
	box-shadow: var(--shadow-sm);
}

.modal-header {
	display: flex;
	justify-content: space-between;
	gap: 20px;
}

.modal-header p {
	margin-top: 5px;
	color: var(--text-secondary);
	font-size: 14px;
}

.cerrar-modal {
	border: none;
	background: transparent;
	cursor: pointer;
	font-size: 18px;
}

.form-material {
	margin-top: 25px;
	display: grid;
	gap: 18px;
}

.form-material label {
	display: grid;
	gap: 7px;
}

.form-material label span {
	font-size: 13px;
	font-weight: 600;
}

.form-material select,
.form-material input {
	width: 100%;
	padding: 11px 12px;
	border: 1px solid var(--border);
	border-radius: 9px;
	background: var(--surface);
}

.modal-acciones {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
	margin-top: 5px;
}

@media (max-width: 700px) {
	.materiales-header,
	.material-item {
		flex-direction: column;
		align-items: stretch;
	}

	.material-precio {
		justify-content: space-between;
	}
}
</style>
