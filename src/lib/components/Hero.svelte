<!-- src/lib/components/HeroTitle.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  let titleRef = $state<HTMLElement | null>(null);
  let isScrolled = $state(false);

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Si el título ya no es visible (el usuario scrolleó), se desvanece
          if (!entry.isIntersecting) {
            isScrolled = true;
          } else {
            isScrolled = false;
          }
        });
      },
      { threshold: 0.2 } // Se activa cuando el 20% del título sale de la vista
    );

    if (titleRef) observer.observe(titleRef);

    return () => {
      if (titleRef) observer.unobserve(titleRef);
    };
  });
</script>

<!-- El título usa transform y opacity, NO fixed position -->
<section class="relative min-h-screen flex-col items-start justify-center pt-90 overflow-hidden px-4 ">

  <!-- Título: Ajustado al ancho, centrado, sin 'nowrap' forzado si es muy largo -->
  <div><h1 
    bind:this={titleRef}
    class="text-white font-bold drop-shadow-lg transition-all duration-700 ease-in-out text-center leading-tight"
    style="
      font-size: clamp(2.5rem, 5vw, 5rem); /* Se ajusta dinámicamente entre 2.5rem y 5rem */
      opacity: {isScrolled ? 0 : 1};
      transform: {isScrolled ? 'translateY(-20px) scale(0.95)' : 'translateY(0) scale(1)'};
    "
  >
    ESTANCIA <span class="text-amber-400 block md:inline">COMMERCIAL</span>
  </h1></div>
  <div>

      <p class="text-xl md:text-2xl mt-6 mb-8 drop-shadow-md font-light text-center max-w-3xl mx-auto transition-opacity duration-500 text-white" 
     style="opacity: {isScrolled ? 0 : 1}">
    Conservamos, modernizamos y hacemos crecer tu negocio.
  </p>
  </div>
  

</section>
   