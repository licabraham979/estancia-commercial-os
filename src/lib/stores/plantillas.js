/**
 * @typedef {{
 * id:number,
 * campana:string,
 * nombre:string,
 * tipo:string,
 * texto:string
 * }} Plantilla
 */

import { writable } from 'svelte/store';


const STORAGE_KEY = 'crm_plantillas';


const iniciales = [

	{
		id: 1,
		campana: 'clientes-inactivos',
		nombre: 'Día 1 - Reactivación',
		tipo: 'WhatsApp',
		texto:
		'Hola, ¿cómo estás? Estuvimos revisando tu proyecto y queremos saber si todavía podemos ayudarte.'
	},


	{
		id: 2,
		campana: 'clientes-inactivos',
		nombre: 'Día 3 - Seguimiento',
		tipo: 'WhatsApp',
		texto:
		'Hola, quería dar seguimiento a la información que te enviamos.'
	},


	{
		id: 3,
		campana: 'clientes-inactivos',
		nombre: 'Día 6 - Cierre',
		tipo: 'WhatsApp',
		texto:
		'Hola, estamos organizando agenda de proyectos y quería saber si avanzamos con el tuyo.'
	}

];


/** @returns {Plantilla[]} */
function cargarPlantillas(){

	if(typeof localStorage === 'undefined'){
		return iniciales;
	}


	const guardadas = localStorage.getItem(STORAGE_KEY);


	if(guardadas){

		return JSON.parse(guardadas);

	}


	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify(iniciales)
	);


	return iniciales;

}


/** @type {import('svelte/store').Writable<Plantilla[]>} */
export const plantillas = writable(
	cargarPlantillas()
);



/**
 * @param {Plantilla[]} datos
 */
export function guardarPlantillas(datos){

	if(typeof localStorage === 'undefined'){
		return;
	}


	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify(datos)
	);

}