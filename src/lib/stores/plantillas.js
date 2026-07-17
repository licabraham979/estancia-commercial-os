/** @typedef {import('$lib/types/clientes').Cliente} Cliente */
import { writable } from 'svelte/store';


export const plantillas = writable([

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

]);