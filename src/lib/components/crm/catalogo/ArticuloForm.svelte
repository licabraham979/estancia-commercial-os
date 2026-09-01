<script>
	import { supabase } from '$lib/supabase/client';

	let { categorias = [], articulo = null, onGuardar, onCancelar } = $props();

	let nombre = $state(articulo?.nombre ?? '');
	let descripcion = $state(articulo?.descripcion ?? '');
	let tipo = $state(articulo?.tipo ?? 'material');
	let categoriaId = $state(articulo?.categoria_id ?? '');

	let variantes = $state(
		articulo?.variantes?.map(/** @param {any} v */ (v) => ({
			id: v.id,
			nombre: v.nombre,
			descripcion: v.descripcion ?? '',
			unidad: v.unidad,
			ancho: v.ancho ?? '',
			alto: v.alto ?? '',
			unidad_medida: v.unidad_medida ?? '',
			atributosTexto: v.atributos
				? JSON.stringify(v.atributos)
				: '{}'
		})) ?? []
	);

	let guardando = $state(false);
	let error = $state('');

	function agregarVariante() {
		variantes.push({
			nombre: '',
			descripcion: '',
			unidad: '',
			ancho: '',
			alto: '',
			unidad_medida: '',
			atributosTexto: '{}'
		});
	}

	/**
	 * @param {number} index
	 */
	function eliminarVariante(index) {
		variantes.splice(index, 1);
	}

	/**
 * @param {any} variante
 */
async function desactivarVariante(variante) {
	const confirmar = confirm(
		`¿Desactivar la variante "${variante.nombre}"?\n\nNo se eliminará del sistema y dejará de aparecer como variante activa.`
	);

	if (!confirmar) return;

	const { error: errorVariante } = await supabase
		.from('catalogo_variantes')
		.update({ activo: false })
		.eq('id', variante.id);

	if (errorVariante) {
		console.error(errorVariante);
		error = 'No fue posible desactivar la variante.';
		return;
	}

	variantes = variantes.filter(
		/** @param {any} v */
		(v) => v.id !== variante.id
	);
}

	/**
 * @param {string} texto
 */
function convertirAtributos(texto) {
	const valor = (texto ?? '').trim();

	if (!valor) {
		return {};
	}

	try {
		const resultado = JSON.parse(valor);

		if (
			typeof resultado !== 'object' ||
			Array.isArray(resultado) ||
			resultado === null
		) {
			return null;
		}

		return resultado;
	} catch {
		return null;
	}
}

	async function guardar() {
		error = '';

		if (!nombre.trim()) {
			error = 'El nombre del artículo es obligatorio.';
			return;
		}

		if (!tipo) {
			error = 'Selecciona el tipo de artículo.';
			return;
		}

		for (const variante of variantes) {
			if (!variante.nombre.trim()) {
				error = 'Todas las variantes deben tener nombre.';
				return;
			}

			if (!variante.unidad.trim()) {
				error = 'Todas las variantes deben tener unidad.';
				return;
			}
		}

		guardando = true;

		try {
			let articuloId = articulo?.id;

			const datosArticulo = {
				nombre: nombre.trim(),
				descripcion: descripcion.trim() || null,
				tipo,
				categoria_id: categoriaId || null,
				activo: true
			};

			if (articuloId) {
				const { error: errorArticulo } = await supabase
					.from('catalogo_articulos')
					.update(datosArticulo)
					.eq('id', articuloId);

				if (errorArticulo) throw errorArticulo;
			} else {
				const { data, error: errorArticulo } = await supabase
					.from('catalogo_articulos')
					.insert(datosArticulo)
					.select('id')
					.single();

				if (errorArticulo) throw errorArticulo;

				articuloId = data.id;
			}

			if (variantes.length > 0) {
				for (const variante of variantes) {
					const atributos = convertirAtributos(
    variante.atributosTexto
);

if (atributos === null) {
    error =
        `La variante "${variante.nombre || 'sin nombre'}" tiene atributos JSON inválidos.`;
    return;
}

const datosVariante = {
    articulo_id: articuloId,
    nombre: variante.nombre.trim(),
    descripcion:
        variante.descripcion.trim() || null,
    unidad: variante.unidad.trim(),
    ancho:
        variante.ancho === ''
            ? null
            : Number(variante.ancho),
    alto:
        variante.alto === ''
            ? null
            : Number(variante.alto),
    unidad_medida:
        variante.unidad_medida.trim() || null,
    atributos,
    activo: true
};

					if (variante.id) {
						const { error: errorVariante } =
							await supabase
								.from('catalogo_variantes')
								.update(datosVariante)
								.eq('id', variante.id);

						if (errorVariante) throw errorVariante;
					} else {
						const { error: errorVariante } =
							await supabase
								.from('catalogo_variantes')
								.insert(datosVariante);

						if (errorVariante) throw errorVariante;
					}
				}
			}

			onGuardar?.();
		} catch (/** @type {any} */ e) {
			console.error(e);
			error =
				e?.message ??
				'No fue posible guardar el artículo.';
		} finally {
			guardando = false;
		}
	}
</script>

<div class="space-y-6">

	{#if error}
		<div class="alert alert-error">
			<span>{error}</span>
		</div>
	{/if}

	<div class="grid md:grid-cols-2 gap-4">

		<div>
			<label class="label">
				<span class="label-text font-semibold">
					Nombre
				</span>
			</label>

			<input
				class="input input-bordered w-full"
				placeholder="Ej. Acrílico"
				bind:value={nombre}
			/>
		</div>

		<div>
			<label class="label">
				<span class="label-text font-semibold">
					Tipo
				</span>
			</label>

			<select
				class="select select-bordered w-full"
				bind:value={tipo}
			>
				<option value="material">Material</option>
				<option value="mano_obra">Mano de obra</option>
				<option value="servicio">Servicio</option>
				<option value="herramienta">Herramienta</option>
				<option value="otro">Otro</option>
			</select>
		</div>

	</div>

	<div>
		<label class="label">
			<span class="label-text font-semibold">
				Categoría
			</span>
		</label>

		<select
			class="select select-bordered w-full"
			bind:value={categoriaId}
		>
			<option value="">Sin categoría</option>

			{#each categorias as categoria}
				<option value={categoria.id}>
					{categoria.nombre}
				</option>
			{/each}
		</select>
	</div>

	<div>
		<label class="label">
			<span class="label-text font-semibold">
				Descripción
			</span>
		</label>

		<textarea
			class="textarea textarea-bordered w-full"
			rows="3"
			placeholder="Descripción del artículo"
			bind:value={descripcion}
		></textarea>
	</div>

	<div class="border-t pt-6">

		<div class="flex justify-between items-center mb-4">

			<div>
				<h3 class="text-xl font-bold">
					Variantes
				</h3>

				<p class="text-sm text-gray-500">
					Presentaciones, medidas o versiones del artículo.
				</p>
			</div>

			<button
				class="btn btn-outline"
				type="button"
				onclick={agregarVariante}
			>
				+ Agregar variante
			</button>

		</div>

		{#if variantes.length === 0}

			<div class="rounded-2xl border border-dashed p-6 text-center text-gray-500">
				Este artículo todavía no tiene variantes.
			</div>

		{:else}

			<div class="space-y-5">

				{#each variantes as variante, index}

					<div class="rounded-2xl border p-5 space-y-4">

						<div class="flex justify-between items-center">

							<h4 class="font-bold">
								Variante {index + 1}
							</h4>

							{#if variante.id}

	<button
		class="btn btn-sm btn-error btn-outline"
		type="button"
		onclick={() => desactivarVariante(variante)}
	>
		Desactivar
	</button>

{:else}

	<button
		class="btn btn-sm btn-error"
		type="button"
		onclick={() => eliminarVariante(index)}
	>
		Quitar
	</button>

{/if}

						</div>

						<div class="grid md:grid-cols-2 gap-4">

							<input
								class="input input-bordered"
								placeholder="Nombre de variante"
								bind:value={variante.nombre}
							/>

							<input
								class="input input-bordered"
								placeholder="Unidad (placa, m², pieza...)"
								bind:value={variante.unidad}
							/>

							<input
								class="input input-bordered"
								type="number"
								step="0.01"
								placeholder="Ancho"
								bind:value={variante.ancho}
							/>

							<input
								class="input input-bordered"
								type="number"
								step="0.01"
								placeholder="Alto"
								bind:value={variante.alto}
							/>

							<input
								class="input input-bordered"
								placeholder="Unidad de medida"
								bind:value={variante.unidad_medida}
							/>

							<input
								class="input input-bordered"
								placeholder="Descripción"
								bind:value={variante.descripcion}
							/>

						</div>

						<textarea
							class="textarea textarea-bordered w-full"
							rows="2"
							placeholder="Atributos JSON. Ejemplo: color=blanco, acabado=brillante"
							bind:value={variante.atributosTexto}
						></textarea>

					</div>

				{/each}

			</div>

		{/if}

	</div>

	<div class="flex justify-end gap-3 border-t pt-5">

		<button
			class="btn btn-ghost"
			type="button"
			onclick={() => onCancelar?.()}
			disabled={guardando}
		>
			Cancelar
		</button>

		<button
			class="btn btn-primary"
			type="button"
			onclick={guardar}
			disabled={guardando}
		>
			{guardando
				? 'Guardando...'
				: articulo
					? 'Actualizar artículo'
					: 'Crear artículo'}
		</button>

	</div>

</div>
