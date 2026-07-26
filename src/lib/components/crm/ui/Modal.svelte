<script>
	let {
		children,
		titulo = '',
		abierto = false,
		onCerrar
	} = $props();
</script>


{#if abierto}

	<div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

		<div class="bg-white rounded-xl p-6 w-full max-w-lg">

			<div class="flex justify-between items-center mb-4">

				<h2 class="text-xl font-bold">
					{titulo}
				</h2>


				<button
					class="btn btn-sm"
					onclick={onCerrar}
				>
					✕
				</button>

			</div>


			{@render children()}


		</div>

	</div>

{/if}