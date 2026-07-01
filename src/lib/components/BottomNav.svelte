<script>
  // Definimos los enlaces y sus rutas
  const links = [
    { title: 'INICIO', href: '/', icon: 'home' },
    { title: 'SERVICIOS', href: '/servicios', icon: 'grid' },
    { title: 'CASOS', href: '/casos', icon: 'folder' },
    { title: 'NOSOTROS', href: '/nosotros', icon: 'user' }
  ];

  const whatsappUrl = 'https://wa.me/521234567890'; // Reemplaza con tu número
</script>

<nav class="fixed bottom-0 left-0 w-full bg-gray-900 text-gray-400 border-t border-gray-800 shadow-lg z-50">
  <div class="flex justify-around items-center h-16 max-w-4xl mx-auto px-2">
    
    <!-- Enlaces normales (Inicio, Servicios, etc.) -->
    {#each links as link}
      <a 
        href={link.href} 
        class="flex flex-col items-center justify-center w-full h-full hover:text-white transition-colors duration-300 group"
      >
        <!-- Ícono SVG dinámico -->
        {#if link.icon === 'home'}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        {:else if link.icon === 'grid'}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        {:else if link.icon === 'folder'}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        {:else if link.icon === 'user'}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        {/if}
        
        <span class="text-[10px] font-bold tracking-wide uppercase">{link.title}</span>
      </a>
    {/each}

    <!-- Botón WhatsApp Destacado -->
    <a 
      href={whatsappUrl} 
      target="_blank"
      rel="noopener noreferrer"
      class="relative -top-6 group"
      aria-label="Contáctanos por WhatsApp"
    >
      <!-- Círculo de fondo con degradado verde -->
      <div class="w-14 h-14 rounded-full bg-gradient-to-tr from-green-500 to-green-400 flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:shadow-green-400/70 transition-all duration-300 group-hover:scale-110">
        <!-- Ícono de WhatsApp -->
        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </div>
      <!-- Etiqueta opcional debajo del botón (si quieres que diga WHATSAPP) -->
      <span class="block text-center text-[9px] text-green-400 font-bold mt-1 uppercase tracking-wider">
        WHATSAPP
      </span>
    </a>

  </div>
</nav>