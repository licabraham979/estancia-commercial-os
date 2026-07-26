/**
 * @typedef {{
 * id:string,
 * nombre:string,
 * descripcion:string,
 * estado:string,
 * clientes:number,
 * objetivo:string,
 * mensaje:string
 * }} Campana
 */

import { writable } from 'svelte/store';


const STORAGE_KEY = 'crm_campanas';


const iniciales = [

	{
		id: 'clientes-inactivos',
		nombre: 'Clientes inactivos',
		descripcion: 'Recuperar clientes que dejaron de responder.',
		estado: 'Activa',
		clientes: 0,
		objetivo: 'Recuperar oportunidades.',
		mensaje: 'Hola, queremos ayudarte con tu proyecto.'
	}

];



/**
 * @returns {Campana[]}
 */
function cargarCampanas(){

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



/** @type {import('svelte/store').Writable<Campana[]>} */
export const campanas = writable(
	cargarCampanas()
);



/**
 * @param {Campana[]} datos
 */
export function guardarCampanas(datos){

	if(typeof localStorage === 'undefined'){
		return;
	}


	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify(datos)
	);

}