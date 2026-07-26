<script lang="ts">
import { track } from '@vercel/analytics';

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
  import LeadCapture from '$lib/components/LeadCapture.svelte';
  import AccionFin from '$lib/components/AccionFin.svelte';
  import { serviciosStore } from '$lib/stores/catalogo/servicios.svelte.js';
  import { crearCliente } from '$lib/stores/clientes.svelte.js';
  import ImageModal from '$lib/components/crm/ui/ImageModal.svelte';
  import { crearLead } from '$lib/supabase/leads';
  
  let servicioSeleccionado = $state('');
let areaSeleccionada = $state(0);

const precios: Record<string, number> = {

	"Mantenimiento de techo":120,

	"Pintura de fachada":90,

	"Rótulo comercial":4500,

	"Vinil microperforado":350

};

let estimacion = $derived(

	servicioSeleccionado && areaSeleccionada

		? {

			desde: Math.round(
				precios[servicioSeleccionado] * areaSeleccionada * 0.85
			),

			hasta: Math.round(
				precios[servicioSeleccionado] * areaSeleccionada * 1.15
			)

		}

		: null

);

  const procesoSteps = [
  { 
    id: 1, 
    title: "VISITA", 
    description: "Conocemos tu proyecto y tomamos medidas.", 
    color: "bg-emerald-500",
    titleColor: "text-emerald-600"
  },
  { 
    id: 2, 
    title: "DIAGNÓSTICO", 
    description: "Analizamos y detectamos las mejores soluciones.", 
    color: "bg-blue-500",
    titleColor: "text-blue-600"
  },
  { 
    id: 3, 
    title: "PROPUESTA", 
    description: "Te presentamos la mejor opción para tu negocio.", 
    color: "bg-amber-500",
    titleColor: "text-amber-600"
  },
  { 
    id: 4, 
    title: "INSTALACIÓN", 
    description: "Ejecutamos el proyecto con calidad y profesionalismo.", 
    color: "bg-purple-500",
    titleColor: "text-purple-600"
  },
  { 
    id: 5, 
    title: "GARANTÍA", 
    description: "Respaldamos nuestro trabajo y seguimos contigo.", 
    color: "bg-green-500",
    titleColor: "text-green-600"
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
    href: "https://wa.me/50433838386",
    bgColor: "bg-green-500",
    textColor: "text-white",
    hoverBg: "hover:bg-green-700"
  }
];

    const sectionTitle = "¿ QUÉ PROBLEMAS "; 
  const sectionSubtitle = "QUIERES RESOLVER ?";
  
 
  
  const serviciosSecundarios = [
    {
      title: "Salón de Estética ELORA", // Tus NUEVOS títulos
      subtitle: "Renovamos la imagen del negocio mediante letras en acrílico de 6 mm con acabado Rose Gold e iluminación LED, logrando una fachada moderna y de mayor presencia comercial.",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782796543/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_10.05.52_PM_6_clhp3q.jpg", // Tus NUEVAS imágenes
      colorClass: "border-purple-600"
    },
    {
      title: "Ferretería MACTOOLS",
      subtitle: "Fabricamos una lona en impresión HD con tintas UV para exterior e instalamos el rótulo en un tercer nivel, logrando máxima visibilidad y resistencia a la intemperie.",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782796448/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.51.37_PM_iiabof.jpg",
      colorClass: "border-purple-600"
    },
    {
      title: "Rotulación con Pintura",
      subtitle: "Renovamos la imagen corporativa mediante pintura de alta resistencia, resaltando la identidad de la marca en una moderna fachada de vidrio.",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782808782/aestanciacomercial/proyectosfinales/IMG_20260429_141057_jfixwo.jpg",
      colorClass: "border-purple-600"
    },
    {
      title: "Rotulación Vinil Microperforado",
      subtitle: "Acompañamos la apertura del salón con rotulación en vinil microperforado y mobiliario comercial, entregando un espacio listo para recibir clientes desde el primer día.",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782809287/aestanciacomercial/proyectosfinales/ChatGPT_Image_30_jun_2026_02_47_39_a.m._ep6xku.png",
      colorClass: "border-purple-600"
    },
    {
      title: "Rotulación Ferretería MG",
      subtitle: "Transformamos la imagen del negocio mediante una combinación de letras LED, Alucobond, acrílico y viniles, logrando una presencia comercial más atractiva y profesional.",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782796534/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.57.40_PM_Editado_npjgbe.jpg",
      colorClass: "border-purple-600"
    },
    {
      title: "Consultorio y Farmacia",
      subtitle: "Diseñamos una fachada moderna para el consultorio con logotipo grabado en acrílico, iluminación LED y acabados de alta calidad que fortalecen la confianza y la imagen profesional.",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782796548/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_10.00.15_PM_zyouno.jpg",
      colorClass: "border-purple-600"
    },
    {
      title: "Tienda de Persianas",
      subtitle: "Diseñamos la imagen digital del negocio e implementamos procesos de marketing para aumentar la visibilidad, captar prospectos y fortalecer la presencia de la marca.",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782796550/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.59.49_PM_ndkxvq.jpg",
      colorClass: "border-purple-600"
    },
    {
      title: "Soluciones para Profesionales y Empresas",
      subtitle: "Diseñamos herramientas comerciales para asesores inmobiliarios, constructoras, médicos y otros profesionales mediante tarjetas premium, impresión UV, acabados especiales y tarjetas digitales.",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782796080/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.58.01_PM_Editado_vbdl7m.jpg",
      colorClass: "border-purple-600"
    },
    {
      title: "Servicio en la Ceiba",
      subtitle: "Acompañamos a cada cliente desde el diagnóstico hasta la entrega final, combinando experiencia, innovación y soluciones que generan valor para su negocio.",
      icon: "https://res.cloudinary.com/licabraham939/image/upload/v1782796674/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.59.36_PM_1_yy9umn.jpg",
      colorClass: "border-purple-600"
    }
  ];

    const cotizacionForm = $derived([

	{
		label:"¿Qué necesitas?",
		type:"select",
		options: serviciosStore.servicios
			.filter(s => s.activo)
			.map(servicio => servicio.nombre)
	},


	...(servicioSeleccionado &&
	serviciosStore.servicios.find(
		s => s.nombre === servicioSeleccionado
	)?.unidad === "m²"

	? [

		{
	label:"¿Cuántos metros aproximados?",

	type:"number",

	placeholder:"Ejemplo: 10"
},

	]

	: []),


	{
		label:"¿En qué ciudad estás?",
		type:"select",
		options:[
			"La Ceiba",
			"Tela",
			"San Pedro Sula"
		]
	}

]);

function registrarCliente(datos: Record<string,string>){

	const cliente = crearCliente({

		nombre: datos.nombre ?? "Cliente web",

		empresa: datos["¿Qué necesitas?"] ?? "",

		telefono: datos.telefono ?? ""

	});


	console.log("Nuevo cliente creado:", cliente);

}
async function guardarLead(datos: Record<string,string>){

	const lead = {

		nombre: datos.nombre ?? "",

		telefono: datos.telefono ?? "",

		email: datos.email ?? "",

		empresa: datos.empresa ?? "",

		ciudad: datos["¿En qué ciudad estás?"] ?? "",

		servicio: servicioSeleccionado,

		metros: datos["¿Cuántos metros aproximados?"] ?? "",

		estimacion_desde: estimacion?.desde ?? 0,

		estimacion_hasta: estimacion?.hasta ?? 0,

		mensaje: datos.mensaje ?? "",

		estado: "Nuevo"

	};


	const resultado = await crearLead(lead);

  if(resultado.ok){

		track('lead_enviado', {

			servicio: servicioSeleccionado,

			ciudad: lead.ciudad

		});

	}

	console.log(resultado);

}

function actualizarCotizador(datos: Record<string,string>){

	console.log(
 "DATOS DEL FORMULARIO:",
 $state.snapshot(datos)
);


	servicioSeleccionado =
		datos["¿Qué necesitas?"] ?? "";


	const servicio = serviciosStore.servicios.find(
		s => s.nombre === servicioSeleccionado
	);


	if(!servicio){
		console.log("Servicio no encontrado");
		return;
	}


	let desde = 0;
	let hasta = 0;


// Servicios por metro cuadrado
if(servicio.unidad === "m²"){

	const area =
		datos["¿Cuántos metros aproximados?"] ?? 0;


	areaSeleccionada = Number(area);


	if(areaSeleccionada <= 0){

		console.log("No hay metros ingresados");
		return;

	}


	desde = areaSeleccionada * servicio.precio;

	hasta = desde * 1.3;


}
else {
		// Servicios por proyecto

		desde = servicio.precio;

		hasta = servicio.precio * 1.3;

	}


	estimacion = {

		desde: Math.round(desde),

		hasta: Math.round(hasta)

	};


	console.log(
		"ESTIMACION:",
		estimacion
	);

}
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
      {#each serviciosStore.servicios.filter(s => s.activo) as service}
        <ServiceCard
          icon={service.imagen}
          title={service.nombre}
          subtitle={service.descripcion}
          colorClass="border-[#E7A145]"
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
 <section class="flex flex-col gap-10 justify-center items-center bg-gray-50 py-16 px-4">

  <div class="">
    <Carousel 
      before="https://res.cloudinary.com/licabraham939/image/upload/v1782796539/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_10.05.52_PM_3_rafpxh.jpg" 
      after="https://res.cloudinary.com/licabraham939/image/upload/v1782796537/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_10.05.52_PM_2_owasqi.jpg"
    />
  </div>


  <div class="">
    <Carousel 
      before="https://res.cloudinary.com/licabraham939/image/upload/v1782796536/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_10.05.52_PM_1_umwcbm.jpg" 
      after="https://res.cloudinary.com/licabraham939/image/upload/v1782796535/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_10.05.52_PM_wifs7r.jpg"
    />
  </div>

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
<div class="relative z-40 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 py-12 bg-white/80 backdrop-blur-md rounded-xl shadow-md ">
  {#each serviciosSecundarios as service}

  <div class="flex flex-col items-center gap-6">

    <div class="w-86 h-86 rounded-2xl overflow-hidden">

      {#if service.icon.startsWith('http')}

       <ImageModal
  imagen={service.icon}
  titulo={service.title}
  descripcion={service.subtitle}
/>

      {:else}

        <div class="text-3xl text-white">
          {service.icon}
        </div>

      {/if}

    </div>

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

<section class="flex flex-col items-center justify-center bg-gray-50 relative py-20 rounded-3xl shadow-inner">

  <div class="w-full max-w-5xl px-8 bg-white rounded-3xl shadow-lg py-10">

    <h2 class="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-900">
      Proceso de Trabajo
    </h2>

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

<div class="relative bg-white z-10">
<QuoteForm

	fields={cotizacionForm}

	button="Solicitar Cotización"

	onChange={actualizarCotizador}

/>
{#if estimacion}

<div class="mt-8 p-6 rounded-3xl bg-emerald-50 border">

 
<h3 class="text-xl font-bold">
	Estimación inicial
</h3>

<p class="mt-3">
	Desde:
	<strong>
		L {estimacion.desde.toLocaleString('es-MX')}
	</strong>
</p>

<p>
	Hasta:
	<strong>
		L {estimacion.hasta.toLocaleString('es-MX')}
	</strong>
</p>

</div>

{/if}
{#if estimacion}

<LeadCapture
	onEnviar={guardarLead}
/>

{/if}
</div>


<AccionFin />

 <!-- El contenido de tu página -->
  <div class="pb-20"> 
    <!-- El pb-20 es importante para que el contenido no quede tapado por la barra fija -->
    <slot />
  </div>
  
  <BottomNav />
