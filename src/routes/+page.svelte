<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import ServiceCard from '$lib/components/ServiceCard.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import Button from '$lib/components/Button.svelte';
  import Casosexito from '$lib/components/Casosexito.svelte';
  import Carousel from '$lib/components/Carousel.svelte';
  import Titulo from '$lib/components/Titulo.svelte';
  import LeftPanel from '$lib/components/LeftPanel.svelte';
  import QuoteForm from '$lib/components/QuoteForm.svelte';
  import AccionFin from '$lib/components/AccionFin.svelte';

  const procesoSteps = [
    { 
      id: 1, 
      title: "VISITA", 
      description: "Conocemos tu proyecto y tomamos medidas.", 
      color: "bg-emerald-500" 
    },
    { 
      id: 2, 
      title: "DIAGNÓSTICO", 
      description: "Analizamos y detectamos las mejores soluciones.", 
      color: "bg-blue-500" 
    },
    { 
      id: 3, 
      title: "PROPUESTA", 
      description: "Te presentamos la mejor opción para tu negocio.", 
      color: "bg-amber-500" 
    },
    { 
      id: 4, 
      title: "INSTALACIÓN", 
      description: "Ejecutamos el proyecto con calidad y profesionalismo.", 
      color: "bg-purple-500" 
    },
    { 
      id: 5, 
      title: "GARANTÍA", 
      description: "Respaldamos nuestro trabajo y seguimos contigo.", 
      color: "bg-green-500" 
    }
  ];

  const misImágenes = [
    "https://res.cloudinary.com/licabraham939/image/upload/v1782770933/aestanciacomercial/cashless-payment_jwbhtj.png",
    "https://res.cloudinary.com/licabraham939/image/upload/v1782771062/aestanciacomercial/crm_owcxve.png",
    "https://res.cloudinary.com/licabraham939/image/upload/v1782771062/aestanciacomercial/pos_systems_hqjx9y.png"
  ];


  // 1. Definimos la interfaz y la CERRAMOS correctamente
  interface ButtonConfig {
    text: string;
    href: string;
    bgColor: string;
    textColor: string;
    borderColor?: string;
    hoverBg?: string;
    hoverText?: string;
  }

  // 2. Definimos el array de botones FUERA de la interfaz
  const buttons: ButtonConfig[] = [
  {
    text: "SOLICITAR ASESORÍA GRATUITA",
    href: "#servicios",
    bgColor: "bg-green-500",
    textColor: "text-white",
    hoverBg: "hover:bg-green-700"
  },
  {
    text: "VER CASOS ÉXITO",
    href: "#contacto",
    // ✅ SOLUCIÓN: Usamos HEX en lugar de RGBA
    bgColor: "bg-[]", 
    // Texto blanco para contraste perfecto
    textColor: "text-white", 
    // Borde del mismo color
    borderColor: "border-2 border-[#E7A145]", 
    // Hover: Un dorado un poco más oscuro manualmente
    hoverBg: "hover:bg-[#C98A35]" 
  },
  {
    text: "Desliza para descubrir más",
    href: "#contactso",
    // ✅ SOLUCIÓN: Usamos HEX en lugar de RGBA
    bgColor: "bg-[]", 
    // Texto blanco para contraste perfecto
    textColor: "text-white", 
    // Borde del mismo color
    borderColor: "border-t-2 border-t-[#60A378] border-b-2 border-b-[#60A378]", 
    // Hover: Un dorado un poco más oscuro manualmente
    hoverBg: "hover:bg-[]" 
  }
];
    const buttons2: ButtonConfig[] = [
  {
    text: "SOLICITAR VÍA WHATSAPP",
    href: "#servicios",
    bgColor: "bg-green-500",
    textColor: "text-white",
    hoverBg: "hover:bg-green-700"
  }
];

    const sectionTitle = "¿ QUÉ PROBLEMAS "; 
  const sectionSubtitle = "QUIERES RESOLVER ?";
  
  interface Service {
    icon: string;
    title: string;
    subtitle: string;
    colorClass: string;
  }

  const services: Service[] = [
    {
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782769333/aestanciacomercial/gable_eoqld0.png",
      title: "TECHOS INDUSTRIALES",
      subtitle: "Conservación y protección",
      colorClass: "border-[#E7A145]"
    },
    {
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782770462/aestanciacomercial/door_nrmyhn.png",
      title: "FACHADAS LED",
      subtitle: "Iluminación que atrae clientes",
      colorClass: "border-[#60A378]"
    },
    {
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782770369/aestanciacomercial/apartment_kduscl.png",
      title: "REMODELACIÓN COMERCIAL",
      subtitle: "Espacios que venden más",
      colorClass: "border-[#E7A145]"
    },
    {
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782770794/aestanciacomercial/billboard_oln1vn.png",
      title: "VINILES Y ACRILICOS",
      subtitle: "Diseño e instalación profesional",
      colorClass: "border-[#60A378]"
    },
    {
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782770933/aestanciacomercial/cashless-payment_jwbhtj.png",
      title: "TARJETAS DIGITALES",
      subtitle: "Comparte tu negocio al instante",
      colorClass: "border-[#E7A145]"
    },
    {
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782771062/aestanciacomercial/crm_owcxve.png",
      title: "PÁGINA WEB + CRM",
      subtitle: "Presencia digital que convierte",
      colorClass: "border-[#60A378]"
    }
  ];

  const serviciosSecundarios = [
    {
      title: "Salón de Estética ELORA", // Tus NUEVOS títulos
      subtitle: "Se desarrolla letras en acrílico 6mm con acabado Rose Gold y se agrega led.",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782796543/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_10.05.52_PM_6_clhp3q.jpg", // Tus NUEVAS imágenes
      colorClass: "border-purple-600"
    },
    {
      title: "Ferretería MACTOOLS",
      subtitle: "Impresión de lona HD, con pintura UV para exterior y una instalación en el 3 piso con un sistema de ventas sobre todas las marcas",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782796448/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.51.37_PM_iiabof.jpg",
      colorClass: "border-purple-600"
    },
    {
      title: "Rotulación con Pintura",
      subtitle: "Visualización de la marca con pintura de calidad y alta resistencia para una nave industrial de cristal",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782808782/aestanciacomercial/proyectosfinales/IMG_20260429_141057_jfixwo.jpg",
      colorClass: "border-purple-600"
    },
    {
      title: "Rotulación Vinil Microperforado",
      subtitle: "Cliente interesado en aperturar para el 10 de Mayo su negocio de Salón y se rotula con vinil microperforado y muebles de calidad",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782809287/aestanciacomercial/proyectosfinales/ChatGPT_Image_30_jun_2026_02_47_39_a.m._ep6xku.png",
      colorClass: "border-purple-600"
    },
    {
      title: "Rotulación Ferretería MG",
      subtitle: "Se crea una imagen de confianza para sus clientes con materiales novedosos (Led,Alucobond, Acrílico y viniles).",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782796534/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.57.40_PM_Editado_npjgbe.jpg",
      colorClass: "border-purple-600"
    },
    {
      title: "Consultorio y Farmacia",
      subtitle: "Se crea la imagen moderna para Doctor y sus servicios con grabado laser de logotipo y luces led para la fachada sobre acrílico",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782796548/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_10.00.15_PM_zyouno.jpg",
      colorClass: "border-purple-600"
    },
    {
      title: "Tienda de Persianas",
      subtitle: "Se crea una imagen digital y procesos de marketing digital",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782796550/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.59.49_PM_ndkxvq.jpg",
      colorClass: "border-purple-600"
    },
    {
      title: "Clientes de Servicio Profesionales (Asesores inmobiliarios, Constructoras,Doctores etc)",
      subtitle: "Se desarrolla sistema de ventas desde tarjetas de Presentación con Relieve, imprenta UV, bordes y tarjetas diitales",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782796080/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.58.01_PM_Editado_vbdl7m.jpg",
      colorClass: "border-purple-600"
    },
    {
      title: "Servicio en la Ceiba",
      subtitle: "Nuestro servicio es garantizado y profesional adquirido con la experiencia en las ventas.",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782796674/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.59.36_PM_1_yy9umn.jpg",
      colorClass: "border-purple-600"
    }
  ];

  const cotizacionForm = [

    {

        label:"¿Qué necesitas?",

        type:"select",

        options:[

            "Techos Industriales",

            "Fachadas",

            "Letras 3D",

            "Viniles"

        ]

    },

    {

        label:"¿Cuántos metros aproximados?",

        type:"select",

        options:[

            "50 m²",

            "100 m²",

            "150 m²",

            "200 m²"

        ]

    },

    {

        label:"¿En qué ciudad estás?",

        type:"select",

        options:[

            "La Ceiba",

            "Tela",

            "San Pedro Sula"

        ]

    }

];
</script>

<Navbar />

<section>
  <img 
    src="https://res.cloudinary.com/licabraham939/image/upload/v1782714657/aestanciacomercial/ChatGPT_Image_29_jun_2026_12_27_45_a.m._Editado_i0foj1.png" 
    alt="Fondo"
    class="fixed inset-0 w-full h-full object-cover z-0"
  />
</section>

<Hero />

<!-- Botones -->
<div class="flex flex-col gap-4 items-center justify-center w-full max-w-sm mx-auto mt-8 z-10 relative">
  {#each buttons as btn}
    <Button {btn} />
  {/each}
</div>


<!-- Sección de Servicios -->
 
<section id="servicios" class="relative py-20 bg-white overflow-hidden">
  <!-- Fondo decorativo sutil -->
  <div class="absolute inset-0 z-0 opacity-5">
    <div class="absolute top-0 left-0 w-96 h-96 bg-[#E7A145] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-[#60A378] rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
  </div>

  <div class="container mx-auto px-4 relative z-10">
    
    <!-- Título Central H2 -->
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
        {sectionTitle}
      </h2>
      <p class="text-4xl md:text-5xl font-bold text-green-600 mb-4 tracking-tight">
  
      {sectionSubtitle}
      </p>
      <!-- Línea decorativa debajo del título -->
      <div class="w-24 h-1 bg-[#E7A145] mx-auto mt-6 rounded-full"></div>
    </div>

    <!-- Grid de 2 Columnas -->
    <!-- CORRECCIÓN: Usamos 'service' como variable del bucle y pasamos sus propiedades -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {#each services as service}
        <ServiceCard 
          icon={service.icon}
          title={service.title}
          subtitle={service.subtitle}
          colorClass={service.colorClass}
        />
      {/each}
    </div>
  </div>
</section>

<!-- NUEVO CÓDIGO (Pegar esto) -->


<Titulo 
  texto="RESULTADOS"
  textoHighlight="QUE HABLAN"
  background="bg-gray-50" 
  textColor="text-black"
  highlightColor="text-[#60A378]" 
  blurAmount="backdrop-blur-md"
  padding="py-12"
/>
 <section class="flex justify-center items-center min-h-screen bg-gray-50">
    
  <Carousel 
    before="https://res.cloudinary.com/licabraham939/image/upload/v1782796539/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_10.05.52_PM_3_rafpxh.jpg" 
    after="https://res.cloudinary.com/licabraham939/image/upload/v1782796537/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_10.05.52_PM_2_owasqi.jpg"
  />
  <Carousel 
    before="https://res.cloudinary.com/licabraham939/image/upload/v1782796536/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_10.05.52_PM_1_umwcbm.jpg" 
    after="https://res.cloudinary.com/licabraham939/image/upload/v1782796535/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_10.05.52_PM_wifs7r.jpg"
  />
  
 
</section>
 <Titulo 
  texto="CASOS DE "
  textoHighlight="ÉXITO"
  background="bg-gray-50" 
  textColor="text-black"
  highlightColor="text-[#60A378]" 
  blurAmount="backdrop-blur-md"
  padding="py-12"
/>
 <Titulo 
  texto=""
  textoHighlight="Algunos proyectos que han transformado negocios"
  background="bg-gray-50" 
  textColor="text-black"
  highlightColor="text-[#60A378]" 
  blurAmount="backdrop-blur-md"
  padding="py-12"
/>
<section>

<!-- 
  CONTENEDOR PERSONALIZADO:
  Aquí definimos el diseño "Ícono izquierda - Texto derecha".
  Esto NO afecta a los otros ServiceCard que uses en otras páginas.
-->
<div class="relative z-40 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 py-12 bg-white/40 backdrop-blur-md rounded-xl shadow-md ">
  {#each serviciosSecundarios as service}
    
    <!-- 
      Aquí creamos el diseño "nuevo" usando un div padre.
      Le pasamos las clases de diseño a este div, no al componente.
    -->
    
      <!-- 1. Lógica del Icono (Copia exacta de tu ServiceCard.svelte) -->
      <div class="flex flex-col flex items-center gap-6">
        <div class={`w-66 h-66  ${service.colorClass.replace('border-', 'bg-')} rounded-2xl flex items-center justify-center text-white text-3xl shadow-sm overflow-hidden`}>
          {#if service.icon.startsWith('http')}
            <!-- RENDERIZADO COMO IMAGEN -->
            <img 
              src={service.icon} 
              alt={service.title} 
              class="h-60 w-auto object-contain transform hover:scale-210 transition-transform duration-300"
              loading="lazy" 
            />
          {:else}
            <!-- RENDERIZADO COMO TEXTO/EMOJI -->
            <div class="text-3xl transform hover:scale-110 transition-transform duration-300 text-white">
              {service.icon}
            </div>
          {/if}
        </div>
      </div>


      <!-- 2. TEXTO A LA DERECHA -->
      <div class="flex flex-col justify-center">
        <h3 class="text-xl font-bold text-gray-800 mb-1">
          {service.title}
        </h3>
        <p class="text-gray-600 text-sm leading-relaxed">
          {service.subtitle}
        </p>
      </div>

    

  {/each}
</div>
</section>

 <Titulo 
  texto="NUESTROS"
  textoHighlight=" PROCESOS"
  background="bg-gray-50" 
  textColor="text-black"
  highlightColor="text-[#60A378]" 
  blurAmount="backdrop-blur-md"
  padding="py-12"
/>

 <Titulo 
  texto="Así trabajamos para garantizar resultados de calidad"
  textoHighlight=" "
  background="bg-gray-50" 
  textColor="text-black"
  highlightColor="text-[#60A378]" 
  blurAmount="backdrop-blur-md"
  padding="py-12"
/>

    <!-- COLUMNA IZQUIERDA: Timeline -->
    <section class="flex flex-col items-center justify-center bg-white relative">
      <div class="">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-blue">
        Proceso de Trabajo
      </h2>
      <!-- Aquí pasamos los datos del timeline -->
      <LeftPanel steps={procesoSteps} />
    </div>

    </section>
    

  
 <Titulo 
  texto="CALCULA"
  textoHighlight="TU PROYECTO"
  background="bg-gray-50" 
  textColor="text-black"
  highlightColor="text-[#60A378]" 
  blurAmount="backdrop-blur-md"
  padding="py-12"
/>

 <Titulo 
  texto="Obtén una cotización rápida y personalizada"
  textoHighlight=""
  background="bg-gray-50" 
  textColor="text-black"
  highlightColor="text-[#60A378]" 
  blurAmount="backdrop-blur-md"
  padding="py-12"
/>
<QuoteForm

fields={cotizacionForm}

/>

<div class="flex flex-col gap-4 items-center justify-center w-full max-w-sm mx-auto mt-8 z-10 relative">
  {#each buttons2 as btn}
    <Button {btn} />
  {/each}
</div>

<AccionFin />

 <!-- El contenido de tu página -->
  <div class="pb-20"> 
    <!-- El pb-20 es importante para que el contenido no quede tapado por la barra fija -->
    <slot />
  </div>
  
  <BottomNav />
