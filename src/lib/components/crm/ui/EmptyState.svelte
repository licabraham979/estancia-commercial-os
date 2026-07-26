<script>
	let {
		titulo = 'Sin registros',
		mensaje = ''
	} = $props();
</script>


<div class="text-center p-10 text-gray-500">

	<h3 class="text-lg font-semibold">
		{titulo}
	</h3>


	<p>
		{mensaje}
	</p>

</div>