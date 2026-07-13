import { writable } from 'svelte/store';


export const campanas = writable([
	{
		id: 'clientes-inactivos',
		nombre: 'Clientes inactivos',
		descripcion: 'Recuperar clientes que dejaron de responder.',
		estado: 'Activa',
		clientes: 0,
		objetivo: 'Recuperar oportunidades.',
		mensaje: 'Hola, queremos ayudarte con tu proyecto.'
	}
]);