<script>
	/**
	 * @typedef {{
	 *   id: string,
	 *   meta_user_id: string,
	 *   nombre: string,
	 *   estado: string,
	 *   asignado_a: string | null,
	 *   cliente_id: string | null,
	 *   ultimo_mensaje: string | null,
	 *   ultima_fecha: string | null,
	 *   created_at: string,
	 *   updated_at: string
	 * }} Conversacion
	 */

	/**
	 * @typedef {{
	 *   id: string,
	 *   conversation_id: string,
	 *   meta_message_id: string | null,
	 *   direccion: string,
	 *   contenido: string,
	 *   tipo: string,
	 *   created_at: string
	 * }} Mensaje
	 */

	/** @type {Conversacion[]} */
	let conversaciones = $state([]);

	/** @type {Conversacion | null} */
	let conversacionSeleccionada = $state(null);

	/** @type {Mensaje[]} */
	let mensajes = $state([]);

	let cargando = $state(true);
	let cargandoMensajes = $state(false);
	let error = $state('');

	let mensajeNuevo = $state('');
let enviandoMensaje = $state(false);

async function enviarMensaje() {
	if (
		!conversacionSeleccionada ||
		!mensajeNuevo.trim() ||
		enviandoMensaje
	) {
		return;
	}

	try {
		enviandoMensaje = true;
		error = '';

		const respuesta = await fetch(
			`/api/messenger/conversations/${conversacionSeleccionada.id}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					mensaje: mensajeNuevo
				})
			}
		);

		const datos = await respuesta.json();

		if (!respuesta.ok || !datos.ok) {
			throw new Error(
				datos.error || 'No se pudo enviar el mensaje'
			);
		}

		mensajes = [...mensajes, datos.mensaje];

		conversacionSeleccionada = {
			...conversacionSeleccionada,
			ultimo_mensaje: mensajeNuevo.trim(),
			ultima_fecha: new Date().toISOString()
		};

		conversaciones = conversaciones.map(
			(conversacion) =>
				conversacion.id ===
				conversacionSeleccionada?.id
					? {
							...conversacion,
							ultimo_mensaje: mensajeNuevo.trim(),
							ultima_fecha: new Date().toISOString()
						}
					: conversacion
		);

		mensajeNuevo = '';
	} catch (e) {
		console.error(e);

		error =
			e instanceof Error
				? e.message
				: 'No se pudo enviar el mensaje';
	} finally {
		enviandoMensaje = false;
	}
}

	async function cargarConversaciones() {
		try {
			cargando = true;
			error = '';

			const respuesta = await fetch(
				'/api/messenger/conversations'
			);

			const datos = await respuesta.json();

			if (!datos.ok) {
				throw new Error(
					datos.error ||
						'No se pudieron cargar las conversaciones'
				);
			}

			conversaciones = datos.conversaciones ?? [];

			if (
				conversaciones.length > 0 &&
				!conversacionSeleccionada
			) {
				await seleccionarConversacion(
					conversaciones[0]
				);
			}
		} catch (e) {
			console.error(e);

			error =
				'No se pudieron cargar las conversaciones.';
		} finally {
			cargando = false;
		}
	}

	/**
	 * @param {Conversacion} conversacion
	 */
	async function seleccionarConversacion(conversacion) {
		try {
			cargandoMensajes = true;
			conversacionSeleccionada = conversacion;
			mensajes = [];

			const respuesta = await fetch(
				`/api/messenger/conversations/${conversacion.id}`
			);

			const datos = await respuesta.json();

			if (!datos.ok) {
				throw new Error(
					datos.error ||
						'No se pudo cargar la conversación'
				);
			}

			conversacionSeleccionada =
				datos.conversacion;

			mensajes = datos.mensajes ?? [];
		} catch (e) {
			console.error(e);

			error =
				'No se pudo cargar la conversación.';
		} finally {
			cargandoMensajes = false;
		}
	}

	/**
	 * @param {string} nombre
	 */
	function obtenerIniciales(nombre) {
		if (!nombre) return '?';

		return nombre
			.split(' ')
			.slice(0, 2)
			.map(
				/** @param {string} parte */
				(parte) => parte[0]
			)
			.join('')
			.toUpperCase();
	}

	/**
	 * @param {string | null} fecha
	 */
	function formatearHora(fecha) {
		if (!fecha) return '';

		return new Date(fecha).toLocaleTimeString(
			'es-HN',
			{
				hour: '2-digit',
				minute: '2-digit'
			}
		);
	}

	/**
	 * @param {string} estado
	 */
	function claseEstado(estado) {
		if (estado === 'potencial') return 'potencial';
		if (estado === 'archivado') return 'archivado';

		return 'nuevo';
	}

		/**
		 * @param {string} estado
		 */
		function cambiarEstadoDemo(estado) {
			if (!conversacionSeleccionada) return;

		conversacionSeleccionada = {
			...conversacionSeleccionada,
			estado
		};

		conversaciones = conversaciones.map(
			(conversacion) =>
				conversacion.id ===
				conversacionSeleccionada?.id
					? {
							...conversacion,
							estado
						}
					: conversacion
		);
	}

	cargarConversaciones();


</script>

<svelte:head>
	<title>Inbox | CRM</title>
</svelte:head>

<div class="inbox">

	<div class="header">
		<div>
			<h1>Inbox</h1>

			<p>
				Conversaciones de Messenger
			</p>
		</div>

		<button onclick={cargarConversaciones}>
			Actualizar
		</button>
	</div>

	{#if error}
		<div class="error">
			{error}
		</div>
	{/if}

	<div class="workspace">

		<!-- LISTA -->

		<aside class="conversaciones">

			<div class="lista-header">
				<strong>
					Conversaciones
				</strong>

				<span>
					{conversaciones.length}
				</span>
			</div>

			{#if cargando}

				<div class="estado-vacio">
					Cargando...
				</div>

			{:else if conversaciones.length === 0}

				<div class="estado-vacio">
					No hay conversaciones.
				</div>

			{:else}

				{#each conversaciones as conversacion}

					<button
						class:selected={
							conversacionSeleccionada?.id ===
							conversacion.id
						}
						class="conversacion"
						onclick={() =>
							seleccionarConversacion(
								conversacion
							)
						}
					>

						<div class="avatar">
							{obtenerIniciales(
								conversacion.nombre
							)}
						</div>

						<div class="preview">

							<div class="preview-top">

								<strong>
									{conversacion.nombre}
								</strong>

								<small>
									{formatearHora(
										conversacion.ultima_fecha
									)}
								</small>

							</div>

							<div class="preview-bottom">

								<span>
									{conversacion.ultimo_mensaje ||
										'Sin mensajes'}
								</span>

								<i
									class={claseEstado(
										conversacion.estado
									)}
								></i>

							</div>

						</div>

					</button>

				{/each}

			{/if}

		</aside>


		<!-- CHAT -->

		<section class="chat">

			{#if !conversacionSeleccionada}

				<div class="sin-seleccion">

					<div class="icono">
						💬
					</div>

					<h2>
						Selecciona una conversación
					</h2>

					<p>
						Aquí aparecerán las conversaciones
						de tus clientes.
					</p>

				</div>

			{:else}

				<header class="chat-header">

	<div class="cliente-info">

		<div class="avatar grande">
			{obtenerIniciales(
				conversacionSeleccionada.nombre
			)}
		</div>

		<div>

			<h2>
				{conversacionSeleccionada.nombre}
			</h2>

			<span class="estado">
				{conversacionSeleccionada.estado}
			</span>

		</div>

	</div>


	<div class="acciones">

		{#if conversacionSeleccionada.estado === 'nuevo'}

			<button
				class="btn potencial"
				onclick={() =>
					cambiarEstadoDemo('potencial')
				}
			>
				⭐ Marcar como potencial
			</button>

			<button
				class="btn archivado"
				onclick={() =>
					cambiarEstadoDemo('archivado')
				}
			>
				🗃️ Archivar
			</button>

		{:else if conversacionSeleccionada.estado === 'potencial'}

			<button
				class="btn crm"
				disabled
			>
				👤 Pasar al CRM
			</button>

			<button
				class="btn archivado"
				onclick={() =>
					cambiarEstadoDemo('archivado')
				}
			>
				🗃️ Archivar
			</button>

		{:else if conversacionSeleccionada.estado === 'archivado'}

			<button
				class="btn recuperar"
				onclick={() =>
					cambiarEstadoDemo('nuevo')
				}
			>
				↩️ Recuperar
			</button>

		{/if}

	</div>

</header>


				<div class="mensajes">

					{#if cargandoMensajes}

						<div class="estado-vacio">
							Cargando mensajes...
						</div>

					{:else if mensajes.length === 0}

						<div class="estado-vacio">
							No hay mensajes.
						</div>

					{:else}

						{#each mensajes as mensaje}

							<div
								class:saliente={
									mensaje.direccion ===
									'outbound'
								}
								class="mensaje"
							>

								<div class="burbuja">

									<p>
										{mensaje.contenido}
									</p>

									<small>
										{formatearHora(
											mensaje.created_at
										)}
									</small>

								</div>

							</div>

						{/each}

					{/if}

				</div>


				<div class="composer">

	<input
		placeholder="Escribir mensaje..."
		bind:value={mensajeNuevo}
		disabled={enviandoMensaje}
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				enviarMensaje();
			}
		}}
	/>

	<button
		onclick={enviarMensaje}
		disabled={
			enviandoMensaje ||
			!mensajeNuevo.trim()
		}
	>
		{enviandoMensaje ? 'Enviando...' : 'Enviar'}
	</button>

</div>

			{/if}

		</section>

	</div>

</div>


<style>

	.chat-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		flex-wrap: wrap;
	}

	.acciones {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.btn {
		border: 0;
		border-radius: 8px;
		padding: 9px 12px;
		font-size: 13px;
		cursor: pointer;
	}

	.btn.potencial {
		background: #dbeafe;
		color: #1d4ed8;
	}

	.btn.archivado {
		background: #f3f4f6;
		color: #4b5563;
	}

	.btn.crm {
		background: #dcfce7;
		color: #166534;
		cursor: not-allowed;
	}

	.btn.recuperar {
		background: #e0f2fe;
		color: #0369a1;
	}

	.inbox {
		display: flex;
		flex-direction: column;
		gap: 20px;
		height: calc(100vh - 80px);
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	h1 {
		margin: 0;
		font-size: 28px;
	}

	.header p {
		margin: 4px 0 0;
		color: #6b7280;
	}

	.header button {
		border: 0;
		border-radius: 8px;
		padding: 10px 16px;
		background: #2563eb;
		color: white;
		cursor: pointer;
	}

	.error {
		padding: 12px 16px;
		border-radius: 8px;
		background: #fee2e2;
		color: #991b1b;
	}

	.workspace {
		display: flex;
		flex: 1;
		min-height: 0;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		background: white;
		overflow: hidden;
	}

	.conversaciones {
		width: 360px;
		border-right: 1px solid #e5e7eb;
		overflow-y: auto;
	}

	.lista-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 18px;
		border-bottom: 1px solid #e5e7eb;
	}

	.lista-header span {
		padding: 3px 8px;
		border-radius: 999px;
		background: #f3f4f6;
		font-size: 12px;
	}

	.conversacion {
		width: 100%;
		display: flex;
		gap: 12px;
		padding: 15px;
		border: 0;
		border-bottom: 1px solid #f3f4f6;
		background: white;
		text-align: left;
		cursor: pointer;
	}

	.conversacion:hover,
	.conversacion.selected {
		background: #f8fafc;
	}

	.avatar {
		width: 42px;
		height: 42px;
		flex-shrink: 0;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: #e5e7eb;
		color: #374151;
		font-weight: 700;
		font-size: 13px;
	}

	.avatar.grande {
		width: 46px;
		height: 46px;
	}

	.preview {
		min-width: 0;
		flex: 1;
	}

	.preview-top,
	.preview-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
	}

	.preview-top strong {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.preview-top small {
		color: #9ca3af;
	}

	.preview-bottom {
		margin-top: 5px;
	}

	.preview-bottom span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #6b7280;
		font-size: 13px;
	}

	.preview-bottom i {
		width: 8px;
		height: 8px;
		flex-shrink: 0;
		border-radius: 50%;
	}

	.nuevo {
		background: #22c55e;
	}

	.potencial {
		background: #3b82f6;
	}

	.archivado {
		background: #9ca3af;
	}

	.chat {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.chat-header {
		padding: 15px 20px;
		border-bottom: 1px solid #e5e7eb;
	}

	.cliente-info {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.cliente-info h2 {
		margin: 0;
		font-size: 18px;
	}

	.estado {
		font-size: 12px;
		color: #6b7280;
	}

	.mensajes {
		flex: 1;
		overflow-y: auto;
		padding: 25px;
		background: #f8fafc;
	}

	.mensaje {
		display: flex;
		justify-content: flex-start;
		margin-bottom: 12px;
	}

	.mensaje.saliente {
		justify-content: flex-end;
	}

	.burbuja {
		max-width: 70%;
		padding: 10px 14px;
		border-radius: 12px;
		background: white;
		box-shadow: 0 1px 2px rgb(0 0 0 / 6%);
	}

	.saliente .burbuja {
		background: #2563eb;
		color: white;
	}

	.burbuja p {
		margin: 0;
		line-height: 1.45;
	}

	.burbuja small {
		display: block;
		margin-top: 5px;
		font-size: 10px;
		opacity: 0.6;
		text-align: right;
	}

	.composer {
		display: flex;
		gap: 10px;
		padding: 15px;
		border-top: 1px solid #e5e7eb;
	}

	.composer input {
		flex: 1;
		padding: 12px;
		border: 1px solid #d1d5db;
		border-radius: 8px;
	}

	.composer button {
		padding: 0 20px;
		border: 0;
		border-radius: 8px;
		background: #2563eb;
		color: white;
	}

	.estado-vacio,
	.sin-seleccion {
		display: grid;
		place-items: center;
		padding: 40px;
		color: #6b7280;
		text-align: center;
	}

	.sin-seleccion {
		height: 100%;
		align-content: center;
	}

	.icono {
		font-size: 40px;
		margin-bottom: 10px;
	}

	.sin-seleccion h2 {
		margin: 0 0 5px;
		color: #374151;
	}

	.sin-seleccion p {
		margin: 0;
	}

</style>
