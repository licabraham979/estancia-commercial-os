<script>
import { supabase } from '$lib/supabase/client';
import { goto } from '$app/navigation';

import { onMount } from 'svelte';

onMount(async () => {
		const {
			data: { session },
			error
		} = await supabase.auth.getSession();

		console.log('=== SESIÓN COTIZACIÓN ===');
		console.log('session:', session);
		console.log('user:', session?.user);
		console.log('user id:', session?.user?.id);
		console.log('access token:', !!session?.access_token);
		console.log('error:', error);
	});

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
		formaPago: '50% de anticipo para iniciar. 50% contra entrega.',
		vigencia: '15 días'
	});

	/** @type {{
	nombre: string;
	descripcion: string;
	precio: number | string;
	imagenUrl: string;
	recomendada: boolean;
}[]} */
let opciones = $state([
	{
		nombre: '',
		descripcion: '',
		precio: '',
		imagenUrl: '',
		recomendada: false
	}
]);
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

	async function guardarBorrador() {
	try {
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

const subtotal = Number(opcionRecomendada.precio);
const descuento = 0;
const total = subtotal - descuento;

		
		const slugBase =
			`${proyecto.titulo}-${cliente.nombre}`
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '');

		const slug = `${slugBase}-${Date.now()}`;

		// 1. Crear cotización
		const { data: cotizacion, error: errorCotizacion } = await supabase
			.from('cotizaciones')
			.insert({
				cliente_nombre: cliente.nombre.trim(),
				cliente_empresa: cliente.empresa.trim() || null,
				cliente_whatsapp: cliente.whatsapp.trim() || null,
				cliente_email: cliente.email.trim() || null,
				titulo: proyecto.titulo.trim(),
				descripcion: proyecto.descripcion.trim() || null,
				estado: 'borrador',
				moneda: 'L',
				subtotal,
				descuento,
				total,
				forma_pago: condiciones.formaPago.trim() || null,
				vigencia: condiciones.vigencia.trim() || null,
				slug
			})
			.select()
			.single();

		if (errorCotizacion) {
			console.error(errorCotizacion);
			alert(`No se pudo guardar la cotización: ${errorCotizacion.message}`);
			return;
		}

		// 2. Guardar opciones
		const opcionesParaGuardar = opcionesValidas.map((opcion, index) => ({
			cotizacion_id: cotizacion.id,
			nombre: opcion.nombre.trim(),
			descripcion: opcion.descripcion.trim() || null,
			precio: Number(opcion.precio),
			imagen_url: opcion.imagenUrl.trim() || null,
			recomendada: opcion.recomendada,
			orden: index
		}));

		const { error: errorOpciones } = await supabase
			.from('cotizacion_opciones')
			.insert(opcionesParaGuardar);

		if (errorOpciones) {
			console.error(errorOpciones);
			alert(`La cotización se creó, pero fallaron las opciones: ${errorOpciones.message}`);
			return;
		}

		// 3. Guardar fotografías generales
		const fotosParaGuardar = imagenes
			.map((url, index) => ({
				url: url.trim(),
				orden: index,
				tipo: 'proyecto',
				cotizacion_id: cotizacion.id
			}))
			.filter((foto) => foto.url);

		if (fotosParaGuardar.length > 0) {
			const { error: errorFotos } = await supabase
				.from('cotizacion_fotos')
				.insert(fotosParaGuardar);

			if (errorFotos) {
				console.error(errorFotos);
				alert(`La cotización se creó, pero fallaron las imágenes: ${errorFotos.message}`);
				return;
			}
		}

		alert('¡Cotización guardada correctamente!');

		goto('/crm/propuestas');

	} catch (error) {
		console.error(error);
		alert('Ocurrió un error inesperado al guardar la cotización.');
	}
}
</script>

<svelte:head>
	<title>Nueva propuesta | Estancia Comercial</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 p-6 lg:p-8">

	<div class="mx-auto max-w-6xl space-y-8">

		<!-- ENCABEZADO -->

		<div>
			<a
				href="/crm/propuestas"
				class="text-sm font-bold text-slate-500 transition hover:text-slate-900"
			>
				← Volver a propuestas
			</a>

			<div class="mt-5">
				<h1 class="text-3xl font-black text-slate-900">
					Nueva propuesta
				</h1>

				<p class="mt-2 text-slate-500">
					Prepara una propuesta comercial para presentar a tu cliente.
				</p>
			</div>
		</div>


		<!-- CLIENTE -->

		<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

			<div class="mb-6">
				<h2 class="text-xl font-black text-slate-900">
					1. Cliente
				</h2>

				<p class="mt-1 text-sm text-slate-500">
					Información de la persona o negocio al que presentarás la propuesta.
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
						placeholder="Ej. Jorge Castañeda"
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
						placeholder="Ej. AUREA Cocina y Sabor"
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
						placeholder="+504 0000-0000"
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
						placeholder="cliente@empresa.com"
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

				<p class="mt-1 text-sm text-slate-500">
					Describe brevemente lo que estás proponiendo.
				</p>
			</div>

			<div class="space-y-5">

				<label class="block">
					<span class="mb-2 block text-sm font-bold text-slate-700">
						Título de la propuesta
					</span>

					<input
						bind:value={proyecto.titulo}
						type="text"
						placeholder="Ej. Renovación de fachada comercial"
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
						placeholder="Explica brevemente el alcance del proyecto..."
						class="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-900 focus:bg-white"
					></textarea>
				</label>

			</div>

		</section>


		<!-- IMÁGENES -->

		<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

			<div class="mb-6">
				<h2 class="text-xl font-black text-slate-900">
					3. Imágenes del proyecto
				</h2>

				<p class="mt-1 text-sm text-slate-500">
					Pega directamente las URLs de las imágenes que quieras mostrar en la propuesta.
				</p>
			</div>

			<div class="space-y-4">

				{#each imagenes as imagen, index}

					<div class="flex gap-3">

						<input
							bind:value={imagenes[index]}
							type="url"
							placeholder="https://..."
							class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-900 focus:bg-white"
						/>

						{#if imagenes.length > 1}

							<button
								type="button"
								onclick={() => eliminarImagen(index)}
								class="rounded-xl border border-red-200 px-4 font-bold text-red-500 transition hover:bg-red-50"
							>
								Eliminar
							</button>

						{/if}

					</div>

				{/each}


				<button
					type="button"
					onclick={agregarImagen}
					class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
				>
					+ Agregar imagen
				</button>

			</div>

		</section>


		<!-- OPCIONES -->

		<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

			<div class="mb-6 flex items-start justify-between gap-4">

				<div>
					<h2 class="text-xl font-black text-slate-900">
						4. Opciones de propuesta
					</h2>

					<p class="mt-1 text-sm text-slate-500">
						Presenta diferentes alternativas para que el cliente pueda comparar.
					</p>
				</div>

				<button
					type="button"
					onclick={agregarOpcion}
					class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
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
									class="text-sm font-bold text-red-500 hover:text-red-700"
								>
									Eliminar opción
								</button>

							{/if}

						</div>


						<div class="grid gap-5 md:grid-cols-2">

							<label class="block">
								<span class="mb-2 block text-sm font-bold text-slate-700">
									Nombre de la opción
								</span>

								<input
									bind:value={opcion.nombre}
									type="text"
									placeholder="Ej. Letras acrílicas sobre muro"
									class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
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
									placeholder="0.00"
									class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
								/>
							</label>


							<label class="block md:col-span-2">
								<span class="mb-2 block text-sm font-bold text-slate-700">
									Descripción
								</span>

								<textarea
									bind:value={opcion.descripcion}
									rows="3"
									placeholder="Describe materiales, medidas, instalación, etc."
									class="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
								></textarea>
							</label>


							<label class="block md:col-span-2">
								<span class="mb-2 block text-sm font-bold text-slate-700">
									URL de imagen
								</span>

								<input
									bind:value={opcion.imagenUrl}
									type="url"
									placeholder="https://..."
									class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
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
								Marcar como opción recomendada
							</label>

						</div>

					</div>

				{/each}

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
						class="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-900 focus:bg-white"
					></textarea>
				</label>


				<label class="block">
					<span class="mb-2 block text-sm font-bold text-slate-700">
						Vigencia
					</span>

					<input
						bind:value={condiciones.vigencia}
						type="text"
						placeholder="Ej. 15 días"
						class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-900 focus:bg-white"
					/>
				</label>

			</div>

		</section>


		<!-- ACCIONES -->

		<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

			<a
				href="/crm/propuestas"
				class="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-bold text-slate-700 transition hover:bg-slate-50"
			>
				Cancelar
			</a>

			<button
				type="button"
				onclick={guardarBorrador}
				class="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-slate-700"
			>
				Guardar borrador
			</button>

		</div>

	</div>

</div>
