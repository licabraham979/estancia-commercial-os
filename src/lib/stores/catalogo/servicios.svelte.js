/**
 * @typedef {Object} Servicio
 * @property {string} id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {string} imagen
 * @property {string} categoria
 * @property {string} unidad
 * @property {number} precio
 * @property {string[]} incluye
 * @property {string} tiempo
 * @property {string} rangoPrecio
 * @property {boolean} activo
 */

const STORAGE_KEY = 'catalogo_servicios';


const serviciosIniciales = [

		{
		id: crypto.randomUUID(),

		nombre: 'Mantenimiento de techo',

		descripcion:'Limpieza, tratamiento anticorrosivo y pintura protectora para prolongar la vida del techo.',

		imagen:'https://res.cloudinary.com/licabraham939/image/upload/v1782796536/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_10.05.52_PM_1_umwcbm.jpg',

		categoria: 'Techos',

		unidad: 'm²',

		precio: 120,

		incluye:[
			'Limpieza profunda',
			'Tratamiento anticorrosivo',
			'Cambio de tornillería',
			'Aplicación de pintura protectora'
		],

		tiempo:'3 a 6 días',

		rangoPrecio:'L100 - L200 por m²',

		activo:true
	},

	{
		id: crypto.randomUUID(),
		nombre: 'Pintura de fachada',
		descripcion:'Preparación de superficie y aplicación de pintura profesional para fachadas.',
		imagen:'https://res.cloudinary.com/licabraham939/image/upload/v1782808782/aestanciacomercial/proyectosfinales/IMG_20260429_141057_jfixwo.jpg',
		categoria: 'Fachadas',
		unidad: 'm²',
		precio: 90,
		incluye:[
				'Preparación de superficie',
				'Reparaciones necesarias',
				'Sellador según diagnóstico',
				'Pintura exterior'
				],

		tiempo:'2 a 5 días',

		rangoPrecio:'Desde L90 por m²',
		activo: true
	},

	{
		id: crypto.randomUUID(),
		nombre: 'Rótulo comercial',
		descripcion:'Fabricación e instalación de rótulos comerciales personalizados.',
		imagen:'https://res.cloudinary.com/licabraham939/image/upload/v1782796534/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.57.40_PM_Editado_npjgbe.jpg',
		categoria: 'Publicidad',
		unidad: 'proyecto',
		precio: 4500,
		incluye:[
				'Diseño personalizado',
				'Fabricación de estructura',
				'Impresión o acabado elegido',
				'Instalación'
				],

		tiempo:'2 a 3 días',

		rangoPrecio:'Desde L4500 por proyecto',
		activo: true
	},

	{
		id: crypto.randomUUID(),
		nombre: 'Vinil microperforado',
		descripcion:'Instalación de vinil microperforado para imagen comercial y privacidad.',
		imagen:'https://res.cloudinary.com/licabraham939/image/upload/v1782809287/aestanciacomercial/proyectosfinales/ChatGPT_Image_30_jun_2026_02_47_39_a.m._ep6xku.png',
		categoria: 'Publicidad',
		unidad: 'm²',
		precio: 350,
		incluye:[
				'Diseño',
				'Impresión',
				'Instalación'
				],

		tiempo:'4 días impresión',

		rangoPrecio:'Desde L350 por m²',
		activo: true
	},
	{
		id: crypto.randomUUID(),
		nombre: 'Letras 3D LED',
		descripcion:`Recomendamos acrílico de 5 mm de espesor con iluminación LED para lograr un acabado moderno, elegante y de gran impacto visual en interiores y exteriores.`,
		imagen:'https://res.cloudinary.com/licabraham939/image/upload/v1785028174/aestanciacomercial/proyectosfinales/ChatGPT_Image_3_jul_2026_03_38_09_p.m._Editado_vm86yw.png',
		categoria: 'Publicidad',
		unidad: 'Proyecto',
		precio: 2500,
		incluye:[
				'Diseño',
				'Corte Laser',
				'Iluminación LED',
				'Instalación'
				],

		tiempo:'7 días instalado',

		rangoPrecio:'Desde L2500 por proyecto o Logo',
		activo: true
	},
	{
		id: crypto.randomUUID(),
		nombre: 'Diseño digital para negocios',
		descripcion:`Impulsamos la imagen de tu negocio con diseños profesionales para todos tus canales de venta. Creamos tarjetas de presentación, menús, volantes, papelería comercial, anuncios digitales y soluciones web para ayudarte a captar más clientes. Desde una pieza gráfica hasta un sistema de ventas digital adaptado a tu negocio.`,
		imagen:'https://res.cloudinary.com/licabraham939/image/upload/v1784869205/aestanciacomercial/proyectosfinales/ChatGPT_Image_26_jun_2026_03_17_53_p.m._ztokhx.png',
		categoria: 'Publicidad',
		unidad: 'Proyecto',
		precio: 999,
		incluye:[
				'Tarjetas de presentación',
				' Menús y catálogos',
				' Volantes publicitarios',
				' Papelería comercial',
				' Diseños para redes sociales',
				' Landing pages y sistemas web'
				],

		tiempo:'2 días ',

		rangoPrecio:'Desde L999 hasta L5999 según proyecto',
		activo: true
	},
	{
		id: crypto.randomUUID(),
		nombre: 'Tarjeta de Presentación',
		descripcion:`Diseñamos tarjetas de presentación profesionales listas para impresión, cuidando medidas, calidad y detalles para evitar errores al momento de producirlas.
					Además, puedes evolucionar hacia tarjetas digitales para compartir tu información de forma rápida y moderna con tus clientes.`,
		imagen:'https://res.cloudinary.com/licabraham939/image/upload/v1782796029/aestanciacomercial/proyectosfinales/WhatsApp_Image_2026-06-29_at_9.58.01_PM_1_lejhyi.jpg',
		categoria: 'Publicidad',
		unidad: 'Proyecto',
		precio: 400,
		incluye:[
				' Diseño profesional',
				' Archivo listo para imprenta',
				' Ajuste de medidas y calidad',
				' Diseño para tarjeta digital',
				' Adaptación de información comercial'
				],

		tiempo:'2 días ',

		rangoPrecio:'Desde 350 hasta L999 según diseño',
		activo: true
	}
	

];


class ServiciosStore {

	/** @type {Servicio[]} */
	servicios = $state([]);


	constructor(){

		this.cargar();

	}


	cargar(){

		if(typeof localStorage === 'undefined') return;


		const guardados =
			localStorage.getItem(STORAGE_KEY);


		if(guardados){

			this.servicios = JSON.parse(guardados);

		}else{

			this.servicios = serviciosIniciales;
			this.guardar();

		}

	}


	guardar(){

		if(typeof localStorage === 'undefined') return;


		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify(this.servicios)
		);

	}

		/**
	 * @param {Omit<Servicio,'id'>} servicio
	 */
	crear(servicio){

		this.servicios.push({

			id: crypto.randomUUID(),

			...servicio

		});


		this.guardar();

	}



	/**
	 * @param {string} id
	 * @param {Partial<Servicio>} datos
	 */
	actualizar(id, datos){

		const index = this.servicios.findIndex(
			s => s.id === id
		);


		if(index !== -1){

			this.servicios[index] = {

				...this.servicios[index],

				...datos

			};


			this.guardar();

		}

	}



	/**
	 * @param {string} id
	 */
	eliminar(id){

		this.servicios = this.servicios.filter(
			s => s.id !== id
		);


		this.guardar();

	}

}




export const serviciosStore = new ServiciosStore();