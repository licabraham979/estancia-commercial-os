import { obtenerClientes } from '$lib/stores/clientes.svelte';


export function obtenerEstadisticas(){


    const clientes = obtenerClientes();



    return {


        total:
        clientes.length,


        cotizaciones:
        clientes.filter(
            c => c.estado === "Cotización enviada"
        ).length,


        seguimiento:
        clientes.filter(
            c => c.estado === "Seguimiento"
        ).length,


        aprobados:
        clientes.filter(
            c => c.estado === "Proyecto aprobado"
        ).length,


        valorTotal:
        clientes.reduce(
            (total, cliente)=>{

                return total + 
                Number(
                    cliente.valor
                    .replace(/[^0-9]/g,'')
                );

            },
            0
        )


    };


}