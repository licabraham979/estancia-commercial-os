<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import ServiceCard from '$lib/components/ServiceCard.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import Button from '$lib/components/Button.svelte';

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
<!-- <section class="z-50 relative">
  <ServiceCard />
  <ServiceCard />
  <ServiceCard />
</section> -->

