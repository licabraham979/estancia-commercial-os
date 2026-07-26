<script>

	let {
		item,
		onEliminar = null
	} = $props();

</script>

<tr>

	<td>
		{item.nombre}
	</td>

	<td class="text-center">
		{item.cantidad}
	</td>

	<td class="text-center">
		{item.unidad}
	</td>

	<td class="text-right">
		L {item.precio.toFixed(2)}
	</td>

	<td class="text-right font-bold">
		L {item.subtotal.toFixed(2)}
	</td>

	<td>

		<button
			class="btn btn-sm btn-error"
			onclick={() => onEliminar?.(item.id)}
		>

			Eliminar

		</button>

	</td>

</tr>