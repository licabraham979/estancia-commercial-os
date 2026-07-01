<script>
  // Definición correcta de props en Svelte 5 usando $props()
  let { steps = [] } = $props();
</script>

<div class="flex flex-col items-center w-full py-4">
  {#each steps as step, index (step.id)}
    <div class="relative flex items-center w-full mb-8 last:mb-0 group">
      
      <!-- Línea conectora vertical -->
      {#if index < steps.length - 1}
        <div class="absolute left-[19px] top-10 h-[calc(100%-20px)] w-0.5 bg-gray-200 dark:bg-gray-700 -z-10" 
             aria-hidden="true" />
      {/if}

      <!-- Círculo del paso -->
      <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md z-10 
                  transition-all duration-300 hover:scale-110 hover:shadow-lg {step.color}"
           aria-label="Paso {step.id}: {step.title}">
        {step.id}
      </div>

      <!-- Contenido de Texto -->
      <div class="ml-6 w-full">
        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide text-center ">
          {step.title}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mt-1 text-sm leading-relaxed">
          {step.description}
        </p>
      </div>
      
    </div>
  {/each}
</div>