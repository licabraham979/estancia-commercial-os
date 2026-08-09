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
  title: "Salón de Estética ELORA",

  subtitle:
    "Alfredo nos contactó mientras remodelaba un local que había rentado para instalar su salón de estética. Nos compartió su logotipo y buscaba conocer diferentes opciones para darle una nueva presencia a la fachada.",

  icon:
    "https://res.cloudinary.com/licabraham939/image/upload/v1782796543/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_10.05.52_PM_6_clhp3q.jpg",

  galeria: [
  "https://res.cloudinary.com/licabraham939/image/upload/v1782796543/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_10.05.52_PM_6_clhp3q.jpg",
  "https://res.cloudinary.com/licabraham939/image/upload/v1786256770/aestanciacomercial/proyectosfinales/elora/ChatGPT_Image_9_ago_2026_12_14_53_a.m._Editado_3_xbk7ub.png",
  "https://res.cloudinary.com/licabraham939/image/upload/v1786256770/aestanciacomercial/proyectosfinales/elora/ChatGPT_Image_9_ago_2026_12_14_53_a.m._Editado_2_ey2nqz.png",
  "https://res.cloudinary.com/licabraham939/image/upload/v1786256769/aestanciacomercial/proyectosfinales/elora/ChatGPT_Image_9_ago_2026_12_14_53_a.m._Editado_4_vxumns.png",
  "https://res.cloudinary.com/licabraham939/image/upload/v1786256770/aestanciacomercial/proyectosfinales/elora/ChatGPT_Image_9_ago_2026_12_14_53_a.m._Editado_3_xbk7ub.png"
],

  colorClass: "border-purple-600",

  historia:
    "Alfredo nos contactó mientras remodelaba un local que había rentado para instalar su salón de estética. Nos compartió su logotipo y buscaba conocer diferentes opciones para darle una nueva presencia a la fachada. Al visitar el negocio conocimos el espacio y el reto que representaba diferenciar el salón de la barbería que se encontraba a un lado.",

  problema:
   "El local todavía estaba en proceso de remodelación y el salón compartiría espacio junto a otro negocio. El reto era crear una fachada que identificara claramente al salón, destacara frente al negocio vecino y mantuviera presencia durante el día y la noche.",

  solucion:
    "Presentamos tres alternativas de rotulación. La propuesta elegida utilizó las letras del logotipo en acrílico Rose Gold, instaladas con separadores para generar un efecto tridimensional y posteriormente complementadas con iluminación LED.",

  materiales: [
    "Acrílico",
    "Separadores para efecto 3D",
    "Lámparas LED",
    "Acabado Rose Gold"
  ],

  resultado:
     "El resultado fue una fachada que diferencia al salón y mantiene visible su identidad después del anochecer. En lugar de utilizar tiras LED, instalamos lámparas estratégicamente para generar halos de luz alrededor del logotipo, convirtiendo la fachada en un elemento de presencia comercial tanto de día como de noche.",

  textoCopiar:
  "Me interesa una solución similar para mi negocio. ¿Podrían orientarme?"
},
   
{
  title: "Ferretería MACTOOLS",

  subtitle:
    "Renovamos una lona deteriorada con impresión de alta calidad para exterior, mejorando la presencia y durabilidad de la fachada.",

  icon:
    "https://res.cloudinary.com/licabraham939/image/upload/v1782796448/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.51.37_PM_iiabof.jpg",

  galeria: [
    "https://res.cloudinary.com/licabraham939/image/upload/v1782796448/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.51.37_PM_iiabof.jpg",
    "https://res.cloudinary.com/licabraham939/image/upload/v1786258075/aestanciacomercial/proyectosfinales/mactools/ChatGPT_Image_9_ago_2026_12_46_30_a.m._Editado_nlib1h.png",
    "https://res.cloudinary.com/licabraham939/image/upload/v1786258074/aestanciacomercial/proyectosfinales/mactools/ChatGPT_Image_9_ago_2026_12_46_30_a.m._Editado_2_wpedww.png"
  ],

  colorClass: "border-purple-600",

  historia:
    "Conocimos al cliente durante una visita comercial que realizábamos negocio por negocio. Al observar que la lona de la fachada estaba deteriorada, le entregamos nuestra tarjeta y nos pidió que tomáramos las medidas en ese momento. Después de realizar la medición le entregamos la cotización y nos comentó que ya tenía contemplado realizar el cambio y que incluso contaba con el diseño preparado.",

  problema:
    "Aunque el cliente ya tenía previsto el gasto, su carga de trabajo le impedía llevar el diseño a impresión. Además, el archivo presentaba problemas técnicos: estaba pixelado y no se encontraba preparado en curvas para una impresión de calidad.",

  solucion:
    "Nos ofrecimos a encargarnos del proceso para facilitarle el trabajo. Revisamos el archivo, resolvimos el problema de calidad y realizamos la impresión utilizando un sistema adecuado para exterior, con tintas UV para lograr una imagen más resistente y con mejor presencia. Al momento de realizar la instalación, el cliente quedó satisfecho con el resultado y nos solicitó una segunda lona.",

  materiales: [
    "Lona para exterior",
    "Impresión de alta calidad",
    "Tintas UV",
    "Materiales de instalación"
  ],

  resultado:
    "El proyecto se concretó después de aproximadamente un mes y medio, ya que la carga de trabajo del cliente retrasó la compra. Durante ese tiempo mantuvimos el seguimiento y permanecimos disponibles para ayudarle a avanzar. Finalmente, además de renovar la primera lona, el cliente nos solicitó una segunda. El resultado fue una solución que no solo mejoró la imagen de la fachada, sino que le permitió al cliente resolver un trabajo pendiente sin tener que encargarse personalmente del proceso de impresión e instalación.",

  textoCopiar:
    "Me interesa una solución similar para mi negocio. ¿Podrían orientarme?"
},

{
  title: "Templa Cristal y Acero",

  subtitle:
    "Transformamos un muro comercial en una identificación de gran formato mediante rotulación con pintura y un logotipo de alto impacto.",

  icon:
    "https://res.cloudinary.com/licabraham939/image/upload/v1782808782/aestanciacomercial/proyectosfinales/IMG_20260429_141057_jfixwo.jpg",

  galeria: [
    "https://res.cloudinary.com/licabraham939/image/upload/v1782808782/aestanciacomercial/proyectosfinales/IMG_20260429_141057_jfixwo.jpg",
    "https://res.cloudinary.com/licabraham939/image/upload/v1786258879/aestanciacomercial/proyectosfinales/templacristal%20y%20acero/ChatGPT_Image_9_ago_2026_12_59_35_a.m._Editado_hkxrei.png",
    "https://res.cloudinary.com/licabraham939/image/upload/v1786258878/aestanciacomercial/proyectosfinales/templacristal%20y%20acero/ChatGPT_Image_9_ago_2026_12_59_35_a.m._Editado_2_tpwyin.png",
    "https://res.cloudinary.com/licabraham939/image/upload/v1786258876/aestanciacomercial/proyectosfinales/templacristal%20y%20acero/ChatGPT_Image_9_ago_2026_12_59_35_a.m._Editado_3_nkzoyb.png"
  ],

  colorClass: "border-purple-600",

  historia:
    "Conocimos a la Licenciada Ángeles durante una jornada de prospección en campo. Visitamos su oficina, ubicada en una plaza comercial, que funcionaba como matriz de varias sucursales. Nos explicó que llevaba tiempo buscando un proveedor de rotulación y no había encontrado una opción que se ajustara a lo que necesitaba. Nos compartió las medidas y fotografías de la fachada que quería intervenir.",

  problema:
    "El proyecto requería rotular una nueva sucursal ubicada en una nave que funcionaba tanto como área de trabajo como punto de venta. Antes de ejecutar el trabajo necesitábamos comprobar las condiciones del muro, sus dimensiones y la viabilidad de realizar la rotulación directamente sobre la superficie.",

  solucion:
    "Facilitamos la visita a la nueva sucursal para revisar personalmente el muro y determinar la mejor forma de ejecutar el proyecto. Después de obtener la autorización correspondiente, realizamos la rotulación con pintura en dos manos, incorporando un logotipo de gran formato con efecto visual tridimensional, letras grandes y legibles y los tres números de WhatsApp de la empresa.",

  materiales: [
    "Pintura para rotulación",
    "Dos manos de aplicación",
    "Diseño de logotipo en gran formato",
    "Rotulación de números de WhatsApp"
  ],

  resultado:
    "El trabajo fue terminado en dos días. La Licenciada Ángeles pudo visitar la sucursal durante una mañana para conocer el avance y encontró el proyecto terminado, con una identificación clara, visible y de gran presencia. El resultado superó sus expectativas y convirtió el muro de la nueva sucursal en un elemento de identificación comercial para la empresa.",

  textoCopiar:
    "Me interesa una solución similar para mi negocio. ¿Podrían orientarme?"
},


{
  title: "Siempre Bella",

  subtitle:
    "Acompañamos la inauguración de un salón de estética con rotulación en vinil microperforado y apoyo para completar el proyecto.",

  icon:
    "https://res.cloudinary.com/licabraham939/image/upload/v1782809287/aestanciacomercial/proyectosfinales/ChatGPT_Image_30_jun_2026_02_47_39_a.m._ep6xku.png",

  galeria: [
    "https://res.cloudinary.com/licabraham939/image/upload/v1782809287/aestanciacomercial/proyectosfinales/ChatGPT_Image_30_jun_2026_02_47_39_a.m._ep6xku.png",
    "https://res.cloudinary.com/licabraham939/image/upload/v1786260371/aestanciacomercial/proyectosfinales/siemprebella/ChatGPT_Image_9_ago_2026_01_24_34_a.m._Editado_sdjyqq.png",
    "https://res.cloudinary.com/licabraham939/image/upload/v1786260369/aestanciacomercial/proyectosfinales/siemprebella/ChatGPT_Image_9_ago_2026_01_24_34_a.m._Editado_2_pxrpts.png",
    "https://res.cloudinary.com/licabraham939/image/upload/v1786260369/aestanciacomercial/proyectosfinales/siemprebella/ChatGPT_Image_9_ago_2026_01_24_34_a.m._Editado_3_nhtsod.png"
  ],

  colorClass: "border-purple-600",

  historia:
    "El cliente nos contactó a través de Facebook buscando una solución para la inauguración del salón de estética que estaba preparando para su esposa como regalo del Día de las Madres. Aunque el negocio se encontraba en un sector de difícil acceso, coordinamos el proyecto y trabajamos a partir de las ideas que tenía para darle una nueva imagen al espacio.",

  problema:
    "El cliente necesitaba tener listo el salón para una fecha especial y buscaba un vinil microperforado que ayudara a transformar la imagen del local. Sin embargo, durante el proceso también tuvo problemas con el proveedor al que había encargado los muebles de estética, poniendo en riesgo parte del proyecto y del regalo que había preparado.",

  solucion:
    "Presentamos diferentes propuestas de diseño para el vinil microperforado y, al conocer la situación con el mobiliario, buscamos una forma de ayudarlo a completar su proyecto. Gracias a nuestra experiencia previa trabajando con un fabricante de muebles para barberías y estética, pudimos proporcionarle un contacto confiable para que pudiera gestionar directamente la fabricación del mobiliario y hacer realidad el proyecto que tenía planeado.",

  materiales: [
    "Vinil microperforado",
    "Diseño e impresión",
    "Mobiliario de estética mediante proveedor recomendado"
  ],

  resultado:
    "El proyecto permitió que el cliente avanzara con la imagen del nuevo salón y encontrara una alternativa para resolver el problema con el mobiliario. Más que entregar únicamente una pieza de rotulación, pudimos acompañarlo en un momento importante para su negocio y ayudarle a acercarse al resultado que había imaginado para la inauguración y el regalo de su esposa.",

  textoCopiar:
    "Me interesa una solución similar para mi negocio. ¿Podrían orientarme?"
},


{
  title: "Ferretería MG",

  subtitle:
    "Modernizamos la fachada con Alucobond y elementos de venta pensados para transmitir confianza y permanencia.",

  icon:
    "https://res.cloudinary.com/licabraham939/image/upload/v1782796534/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.57.40_PM_Editado_npjgbe.jpg",

  galeria: [
    "https://res.cloudinary.com/licabraham939/image/upload/v1782796534/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.57.40_PM_Editado_npjgbe.jpg",
    ""
  ],

  colorClass: "border-purple-600",

  historia:
    "El cliente llegó buscando específicamente una fachada moderna elaborada con Alucobond. Durante la conversación conocimos mejor su negocio y descubrimos que la ferretería ya contaba con cinco años de trayectoria.",

  problema:
    "El objetivo no era únicamente cambiar la apariencia de la fachada. El cliente buscaba proyectar una imagen más moderna y profesional que ayudara a transmitir confianza a sus clientes y reforzara la percepción de que el negocio estaba establecido y continuaría atendiendo sus necesidades.",

  solucion:
    "Además del uso de Alucobond, recomendamos incorporar diferentes elementos de venta para que la fachada no funcionara únicamente como decoración, sino como una herramienta de comunicación comercial. La propuesta buscó aprovechar la trayectoria de cinco años del negocio para transmitir permanencia, confianza y disponibilidad para sus clientes.",

  materiales: [
    "Alucobond",
    "Elementos de rotulación",
    "Elementos de comunicación comercial"
  ],

  resultado:
    "La nueva fachada permitió darle a Ferretería MG una presencia más moderna y profesional, mientras que los elementos de venta ayudaron a comunicar una idea importante para el negocio: cinco años de permanencia y el compromiso de seguir ahí para ofrecer a sus clientes los materiales que necesitan.",

  textoCopiar:
    "Me interesa una solución similar para mi negocio. ¿Podrían orientarme?"
},


{
  title: "Consultorio y Farmacia",

  subtitle:
    "Modernizamos la imagen del consultorio conservando su identidad y combinando acrílico grabado con láser y vinil decorativo.",

  icon:
    "https://res.cloudinary.com/licabraham939/image/upload/v1786261337/aestanciacomercial/proyectosfinales/Captura_desde_2026-08-09_01-37-46_bkginq.png",

  galeria: [
    "https://res.cloudinary.com/licabraham939/image/upload/v1786261337/aestanciacomercial/proyectosfinales/Captura_desde_2026-08-09_01-37-46_bkginq.png",
    "https://res.cloudinary.com/licabraham939/image/upload/v1786261325/aestanciacomercial/proyectosfinales/ChatGPT_Image_9_ago_2026_01_40_20_a.m._Editado_luemoh.png",
    "https://res.cloudinary.com/licabraham939/image/upload/v1786261323/aestanciacomercial/proyectosfinales/ChatGPT_Image_9_ago_2026_01_40_20_a.m._Editado_2_aany1v.png",
    "https://res.cloudinary.com/licabraham939/image/upload/v1786261322/aestanciacomercial/proyectosfinales/ChatGPT_Image_9_ago_2026_01_40_20_a.m._Editado_3_tds7hh.png"
  ],

  colorClass: "border-purple-600",

  historia:
    "El cliente buscaba renovar la imagen de su consultorio sin perder la identidad que ya había construido. Su intención era conservar el diseño de su logotipo, pero llevarlo a una presentación más moderna y profesional.",

  problema:
    "El reto era actualizar la imagen del espacio sin modificar un elemento importante para el negocio: su identidad visual. Además del consultorio, el proyecto debía integrar la farmacia para conseguir una imagen más uniforme.",

  solucion:
    "Propusimos utilizar el logotipo en acrílico con grabado láser para darle una presentación más limpia y moderna, conservando el diseño original. Como complemento, incorporamos una sección de vinil para el área del consultorio y la farmacia, creando una composición visual que integrara ambos espacios.",

  materiales: [
    "Acrílico",
    "Grabado láser",
    "Vinil decorativo"
  ],

  resultado:
    "El consultorio logró renovar su imagen manteniendo la identidad que sus clientes ya reconocían. La combinación de acrílico grabado y vinil permitió darle al espacio una apariencia más moderna, profesional y coherente entre el consultorio y la farmacia.",

  textoCopiar:
    "Me interesa una solución similar para mi negocio. ¿Podrían orientarme?"
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
<Casosexito casos={serviciosSecundarios} />
<!-- 
  CONTENEDOR PERSONALIZADO:
  Aquí definimos el diseño "Ícono izquierda - Texto derecha".
  Esto NO afecta a los otros ServiceCard que uses en otras páginas.
-->
<!-- <div class="relative z-40 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 py-12 bg-white/80 backdrop-blur-md rounded-xl shadow-md ">
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
</div> -->
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
