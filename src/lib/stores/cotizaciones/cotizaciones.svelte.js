/**
 * @typedef {Object} ItemCotizacion
 * @property {string} id
 * @property {'servicio'|'material'|'mano_obra'} tipo
 * @property {string} nombre
 * @property {string} unidad
 * @property {number} cantidad
 * @property {number} precio
 * @property {number} subtotal
 */
/**
 * @typedef {Object} Cotizacion
 * @property {string} id
 * @property {string} clienteId
 * @property {string} fecha
 * @property {ItemCotizacion[]} items
 * @property {number} subtotal
 * @property {number} utilidad
 * @property {number} descuento
 * @property {number} isv
 * @property {number} total
 * @property {string} estado
 */


const STORAGE_KEY = 'crm_cotizaciones';


class CotizacionesStore {


	/** @type {Cotizacion[]} */
	cotizaciones = $state([]);


	constructor(){

		this.cargar();

	}


	cargar(){

		if(typeof localStorage === 'undefined') return;


		const guardadas =
			localStorage.getItem(STORAGE_KEY);


		if(guardadas){

			this.cotizaciones = JSON.parse(guardadas);

		}

	}


	guardar(){

		if(typeof localStorage === 'undefined') return;


		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify(this.cotizaciones)
		);

	}



	/**
	 * @param {Omit<Cotizacion,'id'>} cotizacion
	 */

	crear(cotizacion){

		this.cotizaciones.push({

			id: crypto.randomUUID(),

			...cotizacion

		});


		this.guardar();

	}



	/**
	 * @param {string} id
	 */

	obtener(id){

		return this.cotizaciones.find(
			c => c.id === id
		);

	}



	/**
	 * @param {string} id
	 * @param {Partial<Cotizacion>} datos
	 */

	actualizar(id, datos){

		const index =
			this.cotizaciones.findIndex(
				c => c.id === id
			);


		if(index !== -1){

			this.cotizaciones[index] = {

				...this.cotizaciones[index],

				...datos

			};


			this.guardar();

		}

	}



	/**
	 * @param {string} id
	 */

	eliminar(id){

		this.cotizaciones =
			this.cotizaciones.filter(
				c => c.id !== id
			);


		this.guardar();

	}


}


export const cotizacionesStore =
	new CotizacionesStore();