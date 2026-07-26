<script>
  // Definición correcta de props en Svelte 5 usando $props()
  let { steps = [] } = $props();
</script>

<div class="flex flex-col items-center w-full py-4">
  {#each steps as step, index (step.id)}
    <div class="relative flex items-center w-full mb-10 last:mb-0 group">
      
      <!-- Línea conectora vertical -->
      {#if index < steps.length - 1}
        <div class="absolute left-[19px] top-10 h-[calc(100%-20px)] w-0.5 bg-gray-200 dark:bg-gray-700 -z-10" 
             aria-hidden="true" />
      {/if}

      <!-- Círculo del paso -->
      <div class="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-black shadow-lg z-10 
            transition-all duration-300 hover:scale-110 hover:shadow-lg {step.color}">
  {step.id}
</div>

      <!-- Contenido de Texto -->
      <div class="ml-6 w-full">
        <h3 class="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-wide ">
  {step.title}
</h3>
        <p class="text-gray-600 mt-3 text-base md:text-lg leading-relaxed ">
          {step.description}
        </p>
      </div>
      
    </div>
  {/each}
</div>