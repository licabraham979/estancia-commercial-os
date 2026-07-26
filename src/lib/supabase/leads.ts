import { supabase } from './client';

export async function crearLead(
	datos: Record<string,string | number>
){

	const { error } = await supabase
		.from('leads')
		.insert(datos);


	if(error){

		console.error(
			"Error guardando lead:",
			error
		);

		return {
			ok:false,
			error
		};

	}


	return {
		ok:true
	};

}