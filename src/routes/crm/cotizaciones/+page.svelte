<script>
	import { cotizacionesStore } from '$lib/stores/cotizaciones/cotizaciones.svelte.js';
</script>


<div class="p-6">

	<div class="flex justify-between items-center mb-6">

		<div>
			<h1 class="text-2xl font-bold">
				Cotizaciones
			</h1>

			<p class="text-sm text-gray-500">
				Gestión de propuestas comerciales
			</p>
		</div>


		<a
			href="/crm/cotizaciones/nueva"
			class="btn btn-primary"
		>
			+ Nueva Cotización
		</a>

	</div>



	<div class="overflow-x-auto">

		<table class="table">

			<thead>
				<tr>
					<th>Cliente</th>
					<th>Fecha</th>
					<th>Total</th>
					<th>Estado</th>
				</tr>
			</thead>


			<tbody>

				{#if cotizacionesStore.cotizaciones.length === 0}

					<tr>
						<td colspan="4" class="text-center">
							No hay cotizaciones todavía
						</td>
					</tr>


				{:else}


					{#each cotizacionesStore.cotizaciones as cotizacion}

						<tr>

							<td>
								{cotizacion.clienteId}
							</td>


							<td>
								{cotizacion.fecha}
							</td>


							<td>
								L {cotizacion.total}
							</td>


							<td>
								{cotizacion.estado}
							</td>

						</tr>


					{/each}


				{/if}

			</tbody>

		</table>

	</div>


</div>