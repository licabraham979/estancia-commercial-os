
<script>
	import { goto } from '$app/navigation';
	import { crearProveedor } from '$lib/stores/proveedores.svelte.js';

	let nombre = $state('');
	let telefono = $state('');
	let whatsapp = $state('');
	let email = $state('');
	let direccion = $state('');
	let sitio_web = $state('');
	let categoria = $state('');
	let productos = $state('');
	let condiciones_pago = $state('');
	let tiempo_entrega = $state('');
	let notas = $state('');

	let guardando = $state(false);

	function guardar() {
		if (!nombre.trim()) {
			alert('Escribe el nombre del proveedor.');
			return;
		}

		guardando = true;

		crearProveedor({
			nombre,
			telefono,
			whatsapp,
			email,
			direccion,
			sitio_web,
			categoria,
			productos,
			condiciones_pago,
			tiempo_entrega,
			notas
		});

		goto('/crm/proveedores');
	}

	function cancelar() {
		goto('/crm/proveedores');
	}
</script>


<div class="pagina">

	<header class="header">

		<div>
			<button class="volver" onclick={cancelar}>
				← Proveedores
			</button>

			<h1>Nuevo proveedor</h1>

			<p>
				Guarda la información que necesitas para comprar rápido.
			</p>
		</div>

	</header>


	<form onsubmit={(event) => {
		event.preventDefault();
		guardar();
	}}>

		<section class="bloque">

			<h2>Contacto</h2>

			<div class="grid">

				<label>
					<span>Nombre</span>
					<input bind:value={nombre} placeholder="Nombre de contacto">
				</label>

				<label>
					<span>Empresa</span>
					<input bind:value={sitio_web} placeholder="Sitio web">
				</label>

				<label>
					<span>Contacto</span>
					<input bind:value={direccion} placeholder="Dirección">
				</label>

				<label>
					<span>Teléfono</span>
					<input bind:value={telefono} placeholder="Teléfono">
				</label>

				<label>
					<span>WhatsApp</span>
					<input bind:value={whatsapp} placeholder="Número de WhatsApp">
				</label>

				<label>
					<span>Correo</span>
					<input type="email" bind:value={email} placeholder="correo@empresa.com">
				</label>

			</div>

		</section>


		<section class="bloque">

			<h2>Comercial</h2>

			<div class="grid">

				<label>
					<span>Categoría</span>
					<input bind:value={categoria} placeholder="Pinturas, herramientas, materiales...">
				</label>

				<label>
					<span>Productos / Servicios</span>
					<input bind:value={productos} placeholder="Qué compras aquí">
				</label>

				<label>
					<span>Condiciones de pago</span>
					<input bind:value={condiciones_pago} placeholder="Contado, crédito, transferencia...">
				</label>

				<label>
					<span>Tiempo de entrega</span>
					<input bind:value={tiempo_entrega} placeholder="Inmediato, 24 h, 3 días...">
				</label>

				<label class="ancho">
	<span>Dirección</span>
	<input
		bind:value={direccion}
		placeholder="Sucursal, ciudad o dirección"
	>
</label>

			</div>

		</section>


		

		<section class="bloque">

			<h2>Notas</h2>

			<textarea
				bind:value={notas}
				rows="5"
				placeholder="Información útil para futuras compras..."
			></textarea>

		</section>


		<div class="acciones">

			<button
				type="button"
				class="cancelar"
				onclick={cancelar}
			>
				Cancelar
			</button>

			<button
				type="submit"
				class="guardar"
				disabled={guardando}
			>
				Guardar proveedor
			</button>

		</div>

	</form>

</div>


<style>

.pagina {
	max-width: 1000px;
	margin: 0 auto;
	padding: var(--space-6);
}

.header {
	margin-bottom: var(--space-6);
}

.volver {
	border: none;
	background: transparent;
	padding: 0;
	color: var(--primary);
	cursor: pointer;
	margin-bottom: var(--space-4);
	font-size: 14px;
}

.header h1 {
	font-size: 30px;
}

.header p {
	margin-top: var(--space-2);
	color: var(--text-secondary);
}

form {
	display: flex;
	flex-direction: column;
	gap: var(--space-5);
}

.bloque {
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: var(--radius);
	padding: var(--space-5);
}

.bloque h2 {
	font-size: 18px;
	margin-bottom: var(--space-5);
}

.grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 18px;
}

label {
	display: flex;
	flex-direction: column;
	gap: 7px;
}

label span {
	font-size: 13px;
	color: var(--text-secondary);
}

input,
select,
textarea {
	width: 100%;
	box-sizing: border-box;
	padding: 12px;
	border: 1px solid var(--border);
	border-radius: 9px;
	background: var(--surface);
	font-size: 15px;
	font-family: inherit;
}

textarea {
	resize: vertical;
}

.ancho {
	grid-column: 1 / -1;
}

.acciones {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
}

.cancelar,
.guardar {
	padding: 12px 20px;
	border-radius: 9px;
	cursor: pointer;
	font-weight: 600;
}

.cancelar {
	background: transparent;
	border: 1px solid var(--border);
}

.guardar {
	border: none;
	background: var(--primary);
	color: white;
}

.guardar:disabled {
	opacity: .6;
	cursor: wait;
}

@media (max-width: 700px) {

	.grid {
		grid-template-columns: 1fr;
	}

	.ancho {
		grid-column: auto;
	}

	.pagina {
		padding: var(--space-4);
	}

	.acciones {
		flex-direction: column-reverse;
	}

	.cancelar,
	.guardar {
		width: 100%;
	}

}

</style>
