<script>
  // Props del componente
  let { 
    texto,           // "RESULTADOS"
    textoHighlight,  // "QUE HABLAN"
    background = 'bg-slate-900/90', // Fondo semitransparente como el Navbar
    textColor = 'text-white',        // Texto blanco por defecto
    highlightColor = 'text-orange-400', // Color naranja (como tu navbar)
    blurAmount = 'backdrop-blur-md', // Blur suave
    padding = 'py-6'                 // Espacio vertical (ajustable)
  } = $props();
</script>

<!-- 
  Claves para que funcione como el Navbar:
  - w-full: Ocupa el 100% del ancho disponible.
  - mx-auto: Centra el bloque si hay contenedores que lo limiten (aunque con w-full es redundante, es seguro).
  - flex + justify-center: Asegura que el texto esté perfectamente centrado.
  - bg-slate-900/90: Fondo oscuro semitransparente para el efecto blur.
-->
<section class="w-full {background} {textColor} {padding} {blurAmount} z-10 relative flex justify-center items-center shadow-lg">
  
  <h2 class="text-center text-3xl md:text-4xl font-bold tracking-wide uppercase">
    <!-- Texto Principal -->
    {texto}
    
    <!-- Texto Destacado -->
    {#if textoHighlight}
      <span class="font-bold mx-2 {highlightColor}">
        {textoHighlight}
      </span>
    {/if}
  </h2>

</section>