<script lang="ts">
  import { onMount } from 'svelte';
  import EmblaCarousel from 'embla-carousel'; // Importar la librería base
  import type { EmblaCarouselType } from 'embla-carousel';

  let {
    before = '',
    after = '',
    beforeLabel = 'ANTES',
    afterLabel = 'DESPUÉS',
    height = '55vh',
    width = '85vw'
  } = $props();

  let emblaRef: HTMLElement | null = null;
  let emblaApi: EmblaCarouselType | null = null;
  let index = $state(0);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  onMount(() => {
    if (!emblaRef) return;

    // Inicializar con la librería base
    emblaApi = EmblaCarousel(emblaRef, {
      loop: false,
      align: 'start'
    });

    emblaApi.on('select', () => {
      index = emblaApi!.selectedScrollSnap();
    });
    
    index = emblaApi.selectedScrollSnap();
  });
</script>

<div 
  class="relative w-full flex justify-center items-center" 
  style="width: {width}; height: {height};"
>
  <div class="embla__viewport overflow-hidden w-full h-full" bind:this={emblaRef}>
    <div class="embla__container flex h-full">
      <!-- Slide 1 -->
      <div class="embla__slide flex-[0_0_100%] min-w-0 relative h-full">
        <img src={before} alt={beforeLabel} class="w-full h-full " />
        <div class="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm font-bold">
          {beforeLabel}
        </div>
      </div>

      <!-- Slide 2 -->
      <div class="embla__slide flex-[0_0_100%] min-w-0 relative h-full">
        <img src={after} alt={afterLabel} class="w-full h-full object-cover" />
        <div class="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm font-bold">
          {afterLabel}
        </div>
      </div>
    </div>
  </div>

  <!-- Botones -->
  <button onclick={scrollPrev} class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-black p-2 rounded-full backdrop-blur transition-all z-10">
    &#10094;
  </button>
  <button onclick={scrollNext} class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-black p-2 rounded-full backdrop-blur transition-all z-10">
    &#10095;
  </button>
</div>

<style>
  .embla__viewport { height: 100%; }
  .embla__container { display: flex; height: 100%; }
  .embla__slide { flex: 0 0 100%; min-width: 0; position: relative; }
</style>