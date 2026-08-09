<script lang="ts">
  interface Caso {
    title: string;
    subtitle: string;
    icon: string;
    galeria?: string[];

    historia?: string;
    problema?: string;
    solucion?: string;
    materiales?: string[];
    resultado?: string;

    textoCopiar?: string;
  }

  let {
    caso,
    abierto = false,
    onCerrar
  }: {
    caso: Caso | null;
    abierto: boolean;
    onCerrar: () => void;
  } = $props();

  let imagenActual = $state(0);
  let copiado = $state(false);

  const imagenes = $derived(
    caso
      ? caso.galeria?.length
        ? caso.galeria
        : [caso.icon]
      : []
  );

  function anterior() {
    if (!imagenes.length) return;

    imagenActual =
      imagenActual === 0
        ? imagenes.length - 1
        : imagenActual - 1;
  }

  function siguiente() {
    if (!imagenes.length) return;

    imagenActual =
      imagenActual === imagenes.length - 1
        ? 0
        : imagenActual + 1;
  }

  async function copiarSolucion() {
    if (!caso) return;

    const texto =
      caso.textoCopiar ??
      "Me interesa una solución similar para mi negocio. ¿Podrían orientarme?";

    try {
      await navigator.clipboard.writeText(texto);

      copiado = true;

      setTimeout(() => {
        copiado = false;
      }, 2000);
    } catch (error) {
      console.error("No se pudo copiar:", error);
    }
  }

  function cerrar() {
    imagenActual = 0;
    copiado = false;
    onCerrar();
  }
</script>

{#if abierto && caso}

  <div
    class="
      fixed
      inset-0
      z-[100]
      bg-black/90
      backdrop-blur-sm
      overflow-y-auto
      p-4
      md:p-8
    "
    role="dialog"
    aria-modal="true"
    aria-label={caso.title}
    onclick={cerrar}
  >

    <div
      class="
        relative
        w-full
        max-w-6xl
        mx-auto
        min-h-full
        flex
        items-center
        justify-center
        py-8
      "
      onclick={(e) => e.stopPropagation()}
    >

      <!-- CONTENEDOR DEL PROYECTO -->

      <div
        class="
          relative
          w-full
          bg-white
          rounded-2xl
          overflow-hidden
          shadow-2xl
        "
      >

        <!-- CERRAR -->

        <button
          onclick={cerrar}
          class="
            absolute
            right-4
            top-4
            z-30
            w-10
            h-10
            rounded-full
            bg-black/60
            hover:bg-black/80
            text-white
            text-2xl
            font-bold
            flex
            items-center
            justify-center
            transition
          "
          aria-label="Cerrar"
        >
          ×
        </button>


        <!-- FOTOGRAFÍA -->

        <div
          class="
            relative
            bg-black
            flex
            items-center
            justify-center
            min-h-[300px]
            md:min-h-[500px]
          "
        >

          <img
            src={imagenes[imagenActual]}
            alt={caso.title}
            class="
              max-h-[70vh]
              max-w-full
              w-full
              object-contain
            "
          />


          {#if imagenes.length > 1}

            <!-- ANTERIOR -->

            <button
              onclick={anterior}
              class="
                absolute
                left-3
                md:left-6
                top-1/2
                -translate-y-1/2
                w-11
                h-11
                rounded-full
                bg-black/50
                hover:bg-black/80
                text-white
                text-3xl
                flex
                items-center
                justify-center
                transition
              "
              aria-label="Imagen anterior"
            >
              ‹
            </button>


            <!-- SIGUIENTE -->

            <button
              onclick={siguiente}
              class="
                absolute
                right-3
                md:right-6
                top-1/2
                -translate-y-1/2
                w-11
                h-11
                rounded-full
                bg-black/50
                hover:bg-black/80
                text-white
                text-3xl
                flex
                items-center
                justify-center
                transition
              "
              aria-label="Imagen siguiente"
            >
              ›
            </button>

          {/if}


          <!-- CONTADOR -->

          {#if imagenes.length > 1}

            <div
              class="
                absolute
                bottom-4
                left-1/2
                -translate-x-1/2
                bg-black/60
                text-white
                text-sm
                px-4
                py-1.5
                rounded-full
                backdrop-blur-sm
              "
            >
              {imagenActual + 1} / {imagenes.length}
            </div>

          {/if}

        </div>


        <!-- INFORMACIÓN -->

        <div class="p-6 md:p-10">

          <!-- TÍTULO -->

          <h2
            class="
              text-2xl
              md:text-4xl
              font-bold
              text-gray-900
            "
          >
            {caso.title}
          </h2>


          <!-- DESCRIPCIÓN -->

          {#if caso.subtitle}

            <p
              class="
                mt-3
                text-gray-600
                text-base
                md:text-lg
                max-w-4xl
              "
            >
              {caso.subtitle}
            </p>

          {/if}


          <!-- CONTENIDO -->

          <div
            class="
              mt-8
              grid
              grid-cols-1
              md:grid-cols-2
              gap-8
            "
          >

            <!-- HISTORIA -->

            {#if caso.historia}

              <div>

                <h3
                  class="
                    text-sm
                    font-bold
                    tracking-widest
                    text-gray-900
                  "
                >
                  HISTORIA DEL PROYECTO
                </h3>

                <p
                  class="
                    mt-2
                    text-gray-600
                    leading-relaxed
                  "
                >
                  {caso.historia}
                </p>

              </div>

            {/if}


            <!-- PROBLEMA -->

            {#if caso.problema}

              <div>

                <h3
                  class="
                    text-sm
                    font-bold
                    tracking-widest
                    text-gray-900
                  "
                >
                  PROBLEMA
                </h3>

                <p
                  class="
                    mt-2
                    text-gray-600
                    leading-relaxed
                  "
                >
                  {caso.problema}
                </p>

              </div>

            {/if}


            <!-- SOLUCIÓN -->

            {#if caso.solucion}

              <div>

                <h3
                  class="
                    text-sm
                    font-bold
                    tracking-widest
                    text-gray-900
                  "
                >
                  SOLUCIÓN
                </h3>

                <p
                  class="
                    mt-2
                    text-gray-600
                    leading-relaxed
                  "
                >
                  {caso.solucion}
                </p>

              </div>

            {/if}


            <!-- MATERIALES -->

            {#if caso.materiales?.length}

              <div>

                <h3
                  class="
                    text-sm
                    font-bold
                    tracking-widest
                    text-gray-900
                  "
                >
                  MATERIALES
                </h3>

                <ul class="mt-2 space-y-2">

                  {#each caso.materiales as material}

                    <li
                      class="
                        flex
                        items-center
                        gap-2
                        text-gray-600
                      "
                    >
                      <span
                        class="
                          w-1.5
                          h-1.5
                          rounded-full
                          bg-gray-900
                        "
                      ></span>

                      {material}

                    </li>

                  {/each}

                </ul>

              </div>

            {/if}

          </div>


          <!-- RESULTADO -->

          {#if caso.resultado}

            <div
              class="
                mt-8
                pt-8
                border-t
                border-gray-200
              "
            >

              <h3
                class="
                  text-sm
                  font-bold
                  tracking-widest
                  text-gray-900
                "
              >
                RESULTADO
              </h3>

              <p
                class="
                  mt-2
                  text-gray-700
                  leading-relaxed
                  text-base
                  md:text-lg
                "
              >
                {caso.resultado}
              </p>

            </div>

          {/if}


          <!-- CTA -->

          <div
            class="
              mt-10
              pt-8
              border-t
              border-gray-200
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-5
            "
          >

            <div>

              <h3
                class="
                  text-lg
                  md:text-xl
                  font-bold
                  text-gray-900
                "
              >
                ¿Tienes un proyecto similar?
              </h3>

              <p class="mt-1 text-gray-500 text-sm">
                Podemos ayudarte a encontrar una solución para tu espacio.
              </p>

            </div>


            <div
              class="
                flex
                flex-col
                sm:flex-row
                gap-3
              "
            >

              <!-- COPIAR -->

              <button
                type="button"
                onclick={copiarSolucion}
                class="
                  px-5
                  py-3
                  rounded-xl
                  border
                  border-gray-300
                  text-gray-800
                  font-semibold
                  hover:bg-gray-100
                  transition
                "
              >
                {copiado ? "Copiado ✓" : "Copiar esta solución"}
              </button>


              <!-- COTIZACIÓN -->

              <a
                href="https://wa.me/50433838386"
                target="_blank"
                rel="noopener noreferrer"
                class="
                  px-5
                  py-3
                  rounded-xl
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  font-semibold
                  text-center
                  transition
                "
              >
                Solicitar cotización
              </a>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

{/if}