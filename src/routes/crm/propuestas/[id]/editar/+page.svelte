<script>
	import { supabase } from '$lib/supabase/client';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let cargando = $state(true);
	let guardando = $state(false);
	let error = $state('');

	let cliente = $state({
		nombre: '',
		empresa: '',
		whatsapp: '',
		email: ''
	});

	let proyecto = $state({
		titulo: '',
		descripcion: ''
	});

	let imagenes = $state(['']);

	let condiciones = $state({
		formaPago: '',
		vigencia: ''
	});

/** @type {{
	nombre: string;
	descripcion: string;
	precio: number | string;
	imagenUrl: string;
	recomendada: boolean;
}[]} */
let opciones = $state([]);

	let propuestaId = $state('');

	onMount(async () => {
	const id = page.params.id;

	if (!id) {
		console.error('No se encontró el ID de la propuesta.');
		return;
	}

	propuestaId = id;

		await cargarPropuesta();
	});

	async function cargarPropuesta() {
		cargando = true;
		error = '';

		try {
			/*
			 * 1. Cargar propuesta
			 */
			const { data: propuesta, error: errorPropuesta } =
				await supabase
					.from('cotizaciones')
					.select('*')
					.eq('id', propuestaId)
					.single();

			if (errorPropuesta) {
				throw new Error(
					`No se pudo cargar la propuesta: ${errorPropuesta.message}`
				);
			}

			/*
			 * 2. Cargar opciones
			 */
			const { data: opcionesData, error: errorOpciones } =
				await supabase
					.from('cotizacion_opciones')
					.select('*')
					.eq('cotizacion_id', propuesta.id)
					.order('orden', { ascending: true });

			if (errorOpciones) {
				throw new Error(
					`No se pudieron cargar las opciones: ${errorOpciones.message}`
				);
			}

			/*
			 * 3. Cargar fotografías
			 */
			const { data: fotosData, error: errorFotos } =
				await supabase
					.from('cotizacion_fotos')
					.select('*')
					.eq('cotizacion_id', propuesta.id)
					.order('orden', { ascending: true });

			if (errorFotos) {
				throw new Error(
					`No se pudieron cargar las imágenes: ${errorFotos.message}`
				);
			}

			/*
			 * 4. Rellenar formulario
			 */

			cliente.nombre = propuesta.cliente_nombre ?? '';
			cliente.empresa = propuesta.cliente_empresa ?? '';
			cliente.whatsapp = propuesta.cliente_whatsapp ?? '';
			cliente.email = propuesta.cliente_email ?? '';

			proyecto.titulo = propuesta.titulo ?? '';
			proyecto.descripcion = propuesta.descripcion ?? '';

			condiciones.formaPago = propuesta.forma_pago ?? '';
			condiciones.vigencia = propuesta.vigencia ?? '';

			/*
			 * Si existen fotografías, las cargamos.
			 * Si no, dejamos un campo vacío.
			 */
			imagenes =
				fotosData?.length > 0
					? fotosData.map((foto) => foto.url)
					: [''];

			/*
			 * Cargar opciones
			 */
			opciones =
				opcionesData?.length > 0
					? opcionesData.map((opcion) => ({
							nombre: opcion.nombre ?? '',
							descripcion: opcion.descripcion ?? '',
							precio: opcion.precio ?? '',
							imagenUrl: opcion.imagen_url ?? '',
							recomendada: opcion.recomendada ?? false
						}))
					: [
							{
								nombre: '',
								descripcion: '',
								precio: '',
								imagenUrl: '',
								recomendada: false
							}
						];

		} catch (err) {
			console.error(err);

			error =
				err instanceof Error
					? err.message
					: 'No se pudo cargar la propuesta.';

		} finally {
			cargando = false;
		}
	}

	function agregarImagen() {
		imagenes.push('');
	}

	function eliminarImagen(/** @type {number} */ index) {
		if (imagenes.length > 1) {
			imagenes.splice(index, 1);
		}
	}

	function agregarOpcion() {
		opciones.push({
			nombre: '',
			descripcion: '',
			precio: '',
			imagenUrl: '',
			recomendada: false
		});
	}

	function eliminarOpcion(/** @type {number} */ index) {
		if (opciones.length > 1) {
			opciones.splice(index, 1);
		}
	}

	function marcarRecomendada(/** @type {number} */ index) {
		opciones.forEach((opcion, i) => {
			opcion.recomendada = i === index;
		});
	}

	async function guardarCambios() {
	if (!propuestaId) {
		alert('No se encontró la propuesta.');
		return;
	}

	guardando = true;
	error = '';

	try {
		// ==========================================
		// 1. VALIDACIONES
		// ==========================================

		if (!cliente.nombre.trim()) {
			alert('Ingresa el nombre del cliente.');
			return;
		}

		if (!proyecto.titulo.trim()) {
			alert('Ingresa el título de la propuesta.');
			return;
		}

		const opcionesValidas = opciones.filter(
			(opcion) =>
				opcion.nombre.trim() &&
				opcion.precio !== '' &&
				Number(opcion.precio) >= 0
		);

		if (opcionesValidas.length === 0) {
			alert('Agrega al menos una opción con nombre y precio.');
			return;
		}

		const opcionRecomendada = opcionesValidas.find(
			(opcion) => opcion.recomendada
		);

		if (!opcionRecomendada) {
			alert('Marca una opción como recomendada antes de guardar.');
			return;
		}

		// ==========================================
		// 2. CALCULAR TOTALES
		// ==========================================

		const subtotal = Number(opcionRecomendada.precio);
		const descuento = 0;
		const total = subtotal - descuento;

		// ==========================================
		// 3. ACTUALIZAR PROPUESTA
		// ==========================================

		const { error: errorCotizacion } = await supabase
			.from('cotizaciones')
			.update({
				cliente_nombre: cliente.nombre.trim(),
				cliente_empresa: cliente.empresa.trim() || null,
				cliente_whatsapp: cliente.whatsapp.trim() || null,
				cliente_email: cliente.email.trim() || null,

				titulo: proyecto.titulo.trim(),
				descripcion: proyecto.descripcion.trim() || null,

				subtotal,
				descuento,
				total,

				forma_pago: condiciones.formaPago.trim() || null,
				vigencia: condiciones.vigencia.trim() || null
			})
			.eq('id', propuestaId);

		if (errorCotizacion) {
			throw new Error(
				`No se pudo actualizar la propuesta: ${errorCotizacion.message}`
			);
		}

// ==========================================
// 4. ELIMINAR OPCIONES ANTERIORES
// ==========================================

const { error: errorEliminarOpciones } = await supabase
	.from('cotizacion_opciones')
	.delete()
	.eq('cotizacion_id', propuestaId);

if (errorEliminarOpciones) {
	throw new Error(
		`No se pudieron eliminar las opciones anteriores: ${errorEliminarOpciones.message}`
	);
}
		// ==========================================
		// 5. INSERTAR OPCIONES ACTUALIZADAS
		// ==========================================

		const opcionesParaGuardar = opcionesValidas.map((opcion, index) => ({
			cotizacion_id: propuestaId,
			nombre: opcion.nombre.trim(),
			descripcion: opcion.descripcion.trim() || null,
			precio: Number(opcion.precio),
			imagen_url: opcion.imagenUrl.trim() || null,
			recomendada: opcion.recomendada,
			orden: index
		}));

		const { error: errorInsertarOpciones } = await supabase
			.from('cotizacion_opciones')
			.insert(opcionesParaGuardar);

		if (errorInsertarOpciones) {
			throw new Error(
				`No se pudieron guardar las opciones: ${errorInsertarOpciones.message}`
			);
		}

		// ==========================================
		// 6. ELIMINAR FOTOS ANTERIORES
		// ==========================================

		const { error: errorEliminarFotos } = await supabase
			.from('cotizacion_fotos')
			.delete()
			.eq('cotizacion_id', propuestaId);

		if (errorEliminarFotos) {
			throw new Error(
				`No se pudieron actualizar las imágenes: ${errorEliminarFotos.message}`
			);
		}

		// ==========================================
		// 7. INSERTAR FOTOS ACTUALIZADAS
		// ==========================================

		const fotosParaGuardar = imagenes
			.map((url, index) => ({
				url: url.trim(),
				orden: index,
				tipo: 'proyecto',
				cotizacion_id: propuestaId
			}))
			.filter((foto) => foto.url);

		if (fotosParaGuardar.length > 0) {
			const { error: errorInsertarFotos } = await supabase
				.from('cotizacion_fotos')
				.insert(fotosParaGuardar);

			if (errorInsertarFotos) {
				throw new Error(
					`No se pudieron guardar las imágenes: ${errorInsertarFotos.message}`
				);
			}
		}

		// ==========================================
		// 8. TODO CORRECTO
		// ==========================================

		alert(`Guardado correctamente. ID: ${propuestaId}`);

await goto(`/crm/propuestas/${propuestaId}`);

	} catch (err) {
		console.error('Error guardando propuesta:', err);

		error =
			err instanceof Error
				? err.message
				: 'No se pudo guardar la propuesta.';

		alert(error);

	} finally {
		guardando = false;
	}
}
</script>

<svelte:head>
	<title>Editar propuesta | Estancia Comercial</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 p-6 lg:p-8">

	<div class="mx-auto max-w-6xl space-y-8">

		<div>
			<a
				href={`/crm/propuestas/${propuestaId}`}
				class="text-sm font-bold text-slate-500 transition hover:text-slate-900"
			>
				← Volver a propuesta
			</a>

			<div class="mt-5">
				<h1 class="text-3xl font-black text-slate-900">
					Editar propuesta
				</h1>

				<p class="mt-2 text-slate-500">
					Modifica la información comercial de la propuesta.
				</p>
			</div>
		</div>

		{#if cargando}

			<section class="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
				<p class="font-bold text-slate-700">
					Cargando propuesta...
				</p>
			</section>

		{:else if error}

			<section class="rounded-2xl border border-red-200 bg-red-50 p-6">

				<h2 class="font-black text-red-800">
					No se pudo cargar la propuesta
				</h2>

				<p class="mt-2 text-sm text-red-600">
					{error}
				</p>

			</section>

		{:else}

			<!-- CLIENTE -->

			<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

				<div class="mb-6">
					<h2 class="text-xl font-black text-slate-900">
						1. Cliente
					</h2>

					<p class="mt-1 text-sm text-slate-500">
						Información del cliente.
					</p>
				</div>

				<div class="grid gap-5 md:grid-cols-2">

					<label class="block">
						<span class="mb-2 block text-sm font-bold text-slate-700">
							Nombre
						</span>

						<input
							bind:value={cliente.nombre}
							type="text"
							class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-900 focus:bg-white"
						/>
					</label>

					<label class="block">
						<span class="mb-2 block text-sm font-bold text-slate-700">
							Empresa / negocio
						</span>

						<input
							bind:value={cliente.empresa}
							type="text"
							class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-900 focus:bg-white"
						/>
					</label>

					<label class="block">
						<span class="mb-2 block text-sm font-bold text-slate-700">
							WhatsApp
						</span>

						<input
							bind:value={cliente.whatsapp}
							type="tel"
							class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-900 focus:bg-white"
						/>
					</label>

					<label class="block">
						<span class="mb-2 block text-sm font-bold text-slate-700">
							Correo electrónico
						</span>

						<input
							bind:value={cliente.email}
							type="email"
							class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-900 focus:bg-white"
						/>
					</label>

				</div>

			</section>

			<!-- PROYECTO -->

			<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

				<div class="mb-6">
					<h2 class="text-xl font-black text-slate-900">
						2. Proyecto
					</h2>
				</div>

				<div class="space-y-5">

					<label class="block">
						<span class="mb-2 block text-sm font-bold text-slate-700">
							Título
						</span>

						<input
							bind:value={proyecto.titulo}
							type="text"
							class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-900 focus:bg-white"
						/>
					</label>

					<label class="block">
						<span class="mb-2 block text-sm font-bold text-slate-700">
							Descripción
						</span>

						<textarea
							bind:value={proyecto.descripcion}
							rows="4"
							class="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-900 focus:bg-white"
						></textarea>
					</label>

				</div>

			</section>

			<!-- OPCIONES -->

			<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

				<div class="mb-6 flex items-start justify-between gap-4">

					<div>
						<h2 class="text-xl font-black text-slate-900">
							3. Opciones de propuesta
						</h2>

						<p class="mt-1 text-sm text-slate-500">
							Modifica precios, descripciones y alternativas.
						</p>
					</div>

					<button
						type="button"
						onclick={agregarOpcion}
						class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
					>
						+ Agregar opción
					</button>

				</div>

				<div class="space-y-6">

					{#each opciones as opcion, index}

						<div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">

							<div class="mb-5 flex items-center justify-between">

								<h3 class="font-black text-slate-900">
									Opción {index + 1}
								</h3>

								{#if opciones.length > 1}

									<button
										type="button"
										onclick={() => eliminarOpcion(index)}
										class="text-sm font-bold text-red-500"
									>
										Eliminar opción
									</button>

								{/if}

							</div>

							<div class="grid gap-5 md:grid-cols-2">

								<label class="block">
									<span class="mb-2 block text-sm font-bold text-slate-700">
										Nombre
									</span>

									<input
										bind:value={opcion.nombre}
										type="text"
										class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
									/>
								</label>

								<label class="block">
									<span class="mb-2 block text-sm font-bold text-slate-700">
										Precio
									</span>

									<input
										bind:value={opcion.precio}
										type="number"
										min="0"
										step="0.01"
										class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
									/>
								</label>

								<label class="block md:col-span-2">
									<span class="mb-2 block text-sm font-bold text-slate-700">
										Descripción
									</span>

									<textarea
										bind:value={opcion.descripcion}
										rows="3"
										class="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3"
									></textarea>
								</label>

								<label class="block md:col-span-2">
									<span class="mb-2 block text-sm font-bold text-slate-700">
										URL de imagen
									</span>

									<input
										bind:value={opcion.imagenUrl}
										type="url"
										class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
									/>
								</label>

							</div>

							<div class="mt-5 flex items-center gap-3">

								<input
									id={`recomendada-${index}`}
									type="checkbox"
									checked={opcion.recomendada}
									onchange={() => marcarRecomendada(index)}
									class="h-5 w-5 rounded border-slate-300"
								/>

								<label
									for={`recomendada-${index}`}
									class="text-sm font-bold text-slate-700"
								>
									Marcar como recomendada
								</label>

							</div>

						</div>

					{/each}

				</div>

			</section>

			<!-- IMÁGENES -->

			<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

				<div class="mb-6">
					<h2 class="text-xl font-black text-slate-900">
						4. Imágenes del proyecto
					</h2>
				</div>

				<div class="space-y-4">

					{#each imagenes as imagen, index}

						<div class="flex gap-3">

							<input
								bind:value={imagenes[index]}
								type="url"
								placeholder="https://..."
								class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
							/>

							{#if imagenes.length > 1}

								<button
									type="button"
									onclick={() => eliminarImagen(index)}
									class="rounded-xl border border-red-200 px-4 font-bold text-red-500"
								>
									Eliminar
								</button>

							{/if}

						</div>

					{/each}

					<button
						type="button"
						onclick={agregarImagen}
						class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700"
					>
						+ Agregar imagen
					</button>

				</div>

			</section>

			<!-- CONDICIONES -->

			<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

				<div class="mb-6">
					<h2 class="text-xl font-black text-slate-900">
						5. Condiciones
					</h2>
				</div>

				<div class="grid gap-5 md:grid-cols-2">

					<label class="block">
						<span class="mb-2 block text-sm font-bold text-slate-700">
							Forma de pago
						</span>

						<textarea
							bind:value={condiciones.formaPago}
							rows="3"
							class="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
						></textarea>
					</label>

					<label class="block">
						<span class="mb-2 block text-sm font-bold text-slate-700">
							Vigencia
						</span>

						<input
							bind:value={condiciones.vigencia}
							type="text"
							class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
						/>
					</label>

				</div>

			</section>

			<!-- ACCIONES -->

			<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

				<a
					href={`/crm/propuestas/${propuestaId}`}
					class="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-bold text-slate-700"
				>
					Cancelar
				</a>

				<button
					type="button"
					onclick={guardarCambios}
					disabled={guardando}
					class="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white disabled:opacity-50"
				>
					{guardando ? 'Guardando...' : 'Guardar cambios'}
				</button>

			</div>

		{/if}

	</div>

</div>
