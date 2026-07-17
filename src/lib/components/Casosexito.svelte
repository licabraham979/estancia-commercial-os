<script>
  import { onMount, onDestroy } from 'svelte';
  import EmblaCarousel from 'embla-carousel';

  // 1. Definir Props
  let { images = [], intervalMs = 4000 } = $props();

  // 2. Definir Estado
  let emblaNode = $state();
  let emblaApi = $state();
  let selectedIndex = $state(0);
  /** @type {ReturnType<typeof setInterval> | null} */
let timer = null;

  // 3. Definir Imágenes por defecto (Constante segura)
  const defaultImages = [
    "https://res.cloudinary.com/licabraham939/image/upload/v1782770933/aestanciacomercial/cashless-payment_jwbhtj.png",
    "https://res.cloudinary.com/licabraham939/image/upload/v1782771062/aestanciacomercial/crm_owcxve.png"
  ];

  // 4. DEFINICIÓN CORRECTA DE slides PARA SSR
  // Usamos una asignación directa inicial para asegurar que existe antes de $derived
  // y luego usamos $derived para la reactividad si 'images' cambia.
  // En SSR, 'images' puede ser un array vacío inicialmente, pero nunca undefined si la prop tiene default.
  
  // Opción más segura para SSR: Usar una variable reactiva simple con lógica de fallback
  // que se evalúa en el momento de la renderización.
  let slides = $derived(images && images.length > 0 ? images : defaultImages);

  // --- Lógica del Carousel ---

  const initEmbla = () => {
    if (!emblaNode) return;

    emblaApi = EmblaCarousel(emblaNode, {
      loop: true,
      align: 'start',
      skipSnaps: false,
      slidesToScroll: 1
    });

    const onSelect = () => {
      selectedIndex = emblaApi.selectedScrollSnap();
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    
    startAutoPlay();
  };

  const startAutoPlay = () => {
    if (timer) return; // Evitar múltiples intervalos
    timer = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, intervalMs);
  };

  const stopAutoPlay = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const scrollPrev = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      stopAutoPlay();
    }
  };

  const scrollNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
      stopAutoPlay();
    }
  };

 /**
 * @param {number} index
 */
const scrollTo = (index) => {
    if (emblaApi) {
        emblaApi.scrollTo(index);
    }
};

  onMount(() => {
    initEmbla();
  });

  onDestroy(() => {
    stopAutoPlay();
    if (emblaApi) {
      emblaApi.destroy();
      emblaApi = null;
    }
  });
</script>


<div 
  class="relative w-full flex justify-center overflow-hidden bg-white py-1"
  onmouseenter={stopAutoPlay}
  onmouseleave={startAutoPlay}
>
  
  <div class="relative w-[70] h-[100%] rounded-lg overflow-hidden shadow-2xl">
    
    <div class="embla__viewport h-full" bind:this={emblaNode}>
      <div class="embla__container h-50% flex">
        <!-- Usamos 'slides' definido arriba -->
        {#each slides as slide, i}
          <div class="embla__slide flex-[0_0_100%] min-w-0 h-full relative">
            <img 
              src={slide} 
              alt="Slide {i + 1}"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
              <h3 class="text-xl font-bold">Solución {i + 1}</h3>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Botón Anterior (Sintaxis nueva onclick) -->
    <button 
      onclick={scrollPrev}
      class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-all z-20"
      aria-label="Anterior"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
    </button>

    <!-- Botón Siguiente (Sintaxis nueva onclick) -->
    <button 
      onclick={scrollNext}
      class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-all z-20"
      aria-label="Siguiente"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>

    <!-- Indicadores (Puntos) -->
    <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-20">
      {#each slides as _, i}
        <button
          onclick={() => scrollTo(i)}
          class="h-2 rounded-full transition-all duration-300 {i === selectedIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}"
          aria-label="Ir al slide {i + 1}"
        ></button>
      {/each}
    </div>
  </div>
</div>


<style>
  .embla__viewport {
    overflow: hidden;
    height: 100%;
  }
  .embla__container {
    display: flex;
    height: 50%;
  }
  .embla__slide {
    flex: 0 0 100%;
    min-width: 0;
    height: 100%;
    position: relative;
  }
</style>