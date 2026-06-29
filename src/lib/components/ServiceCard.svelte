<script>
  // 1. Extraemos las props correctamente. 
  // 'icon' ahora existe y tiene un valor por defecto si no se pasa.
  let { 
    icon = "", 
    title = "", 
    subtitle = "", 
    colorClass = "border-[#E7A145]" 
  } = $props();

  // 2. Ahora Svelte reconoce 'icon' y puede calcular 'isImage'
  let isImage = $derived(icon.startsWith('http'));

  let cardClasses = $derived(
    `relative group block p-8 bg-white rounded-xl shadow-sm 
    border-t-2 border-b-0 ${colorClass} 
    transition-all duration-300 hover:shadow-lg hover:-translate-y-1
    overflow-hidden`
  );
</script>

<article class={cardClasses}>
  <!-- Contenedor del Icono/Imagen -->
  <div class="w-full flex justify-center items-center mb-6 h-20">
    {#if isImage}
      <!-- Renderizar como Imagen -->
      <img 
        src={icon} 
        alt={title} 
        class="h-16 w-auto object-contain transform group-hover:scale-110 transition-transform duration-300"
        loading="lazy" 
      />
    {:else}
      <!-- Renderizar como Texto/SVG -->
      <div class="text-5xl transform group-hover:scale-110 transition-transform duration-300 text-gray-800">
        {icon}
      </div>
    {/if}
  </div>

  <!-- Título -->
  <h3 class="text-center text-xl font-bold text-gray-900 mb-3 group-hover:text-[#E7A145] transition-colors">
    {title}
  </h3>

  <!-- Subtítulo -->
  <p class="text-center text-gray-600 leading-relaxed">
    {subtitle}
  </p>

  <!-- Efecto decorativo -->
  <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E7A145] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
</article>