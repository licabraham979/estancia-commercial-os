<script lang="ts">
  import CasoExitoModal from '$lib/components/CasoExitoModal.svelte';

  interface Caso {
    title: string;
    subtitle: string;
    icon: string;
    colorClass?: string;
    galeria?: string[];
  }

  let {
    casos
  }: {
    casos: Caso[];
  } = $props();

  let mostrarTodos = $state(false);
  let casoSeleccionado = $state<Caso | null>(null);

  const casosVisibles = $derived(
    mostrarTodos ? casos : casos.slice(0, 6)
  );

  function abrirCaso(caso: Caso) {
    casoSeleccionado = caso;
  }

  function cerrarCaso() {
    casoSeleccionado = null;
  }
</script>

<section
  id="casos-exito"
  class="py-20 px-4"
>
  <div class="max-w-7xl mx-auto">

    <!-- Encabezado -->
    <div class="text-center mb-12">
      <h2 class="text-4xl md:text-5xl font-bold tracking-tight">
        CASOS DE ÉXITO
      </h2>

      <p class="mt-4 max-w-2xl mx-auto text-gray-500">
        Proyectos reales, soluciones reales y resultados que hablan por sí mismos.
      </p>
    </div>

    <!-- Grid -->
    <div
      class="
        grid
        grid-cols-2
        gap-3
        md:gap-5
      "
    >

      {#each casosVisibles as caso}
        <button
          type="button"
          onclick={() => abrirCaso(caso)}
          class="
            group
            relative
            aspect-[4/3]
            overflow-hidden
            rounded-2xl
            cursor-pointer
            bg-gray-100
            text-left
          "
          aria-label={`Ver caso: ${caso.title}`}
        >

          <img
            src={caso.icon}
            alt={caso.title}
            class="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              transition-transform
              duration-500
              ease-out
              group-hover:scale-105
            "
            loading="lazy"
          />

          <!-- Indicador sutil -->
          <div
            class="
              absolute
              inset-0
              bg-black/0
              group-hover:bg-black/10
              transition-colors
              duration-300
            "
          ></div>

          <!-- Indicador de interacción -->
          <div
            class="
              absolute
              right-3
              top-3
              w-9
              h-9
              rounded-full
              bg-black/40
              backdrop-blur-sm
              text-white
              flex
              items-center
              justify-center
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-300
            "
            aria-hidden="true"
          >
            ↗
          </div>

        </button>
      {/each}

    </div>

    <!-- Ver más -->
    {#if casos.length > 6}
      <div class="relative z-30 flex justify-center mt-10 ">

        <button
          type="button"
          onclick={() => (mostrarTodos = !mostrarTodos)}
          class="px-7 py-3 rounded-full border border-gray-300 text-white font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300"
        >
          {mostrarTodos ? 'Ver menos' : 'Ver más'}
        </button>

      </div>
    {/if}

  </div>
</section>

<!-- Modal -->
<CasoExitoModal
  caso={casoSeleccionado}
  abierto={casoSeleccionado !== null}
  onCerrar={cerrarCaso}
/>