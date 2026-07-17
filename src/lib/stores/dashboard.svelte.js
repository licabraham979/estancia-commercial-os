/** @typedef {import('$lib/types/clientes').Cliente} Cliente */
import { actividadesStore } from './actividades.svelte.js';
import { obtenerClientes, obtenerSeguimientos } from './clientes.svelte.js';


class DashboardStore {


    get clientesResumen(){

        const clientes = obtenerClientes();

        return {

            total: clientes.length,

            nuevos: clientes.filter(
                cliente => cliente.estado === 'Nuevo contacto'
            ).length,

            conProyecto: clientes.filter(
                cliente => cliente.proyecto
            ).length,

            sinAccion: clientes.filter(
                cliente => !cliente.siguienteAccion
            ).length

        };

    }



    get resumen(){

        return {

            pendientes:
                actividadesStore.totalPendientes,

            completadas:
                actividadesStore.totalCompletadas,

            progreso:
                actividadesStore.progreso,

            prioridadAlta:
                actividadesStore.prioridadAlta.length

        };

    }



    get seguimientos(){

        return obtenerSeguimientos();

    }



   get alertas(){

    const alertas = [];


    const seguimientos = obtenerSeguimientos();



    // CLIENTES FRÍOS

    const clientesFríos =
    seguimientos.filter(cliente =>
        cliente.nivelSeguimiento?.etiqueta === "Cliente frío"
    );


    if(clientesFríos.length){

        alertas.push({

            tipo:"critica",

            icono:"🔴",

            titulo:"Clientes fríos",

            texto:
            `${clientesFríos.length} clientes llevan más de 3 días sin contacto.`

        });

    }



    // SEGUIMIENTOS HOY

    const seguimientoHoy =
    seguimientos.filter(cliente =>
        cliente.nivelSeguimiento?.etiqueta === "Seguimiento hoy"
    );


    if(seguimientoHoy.length){

        alertas.push({

            tipo:"advertencia",

            icono:"🟠",

            titulo:"Seguimientos pendientes",

            texto:
            `${seguimientoHoy.length} clientes requieren seguimiento hoy.`

        });

    }



    // COTIZACIONES

    const cotizaciones =
    seguimientos.filter(cliente =>
        cliente.estado === "Cotización enviada"
    );


    if(cotizaciones.length){

        alertas.push({

            tipo:"dinero",

            icono:"💰",

            titulo:"Cotizaciones abiertas",

            texto:
            `${cotizaciones.length} propuestas esperan decisión.`

        });

    }



    // INSPECCIONES

    const inspecciones =
    seguimientos.filter(cliente =>
        cliente.estado === "Inspección pendiente"
    );


    if(inspecciones.length){

        alertas.push({

            tipo:"visita",

            icono:"📍",

            titulo:"Inspecciones pendientes",

            texto:
            `${inspecciones.length} clientes esperan visita técnica.`

        });

    }



    // ACTIVIDADES CRÍTICAS

    if(actividadesStore.prioridadAlta.length){

        alertas.push({

            tipo:'critica',

            icono:'🔴',

            titulo:'Actividades críticas',

            texto:
            `Tienes ${actividadesStore.prioridadAlta.length} actividades de prioridad alta.`

        });

    }



    // MUCHAS ACTIVIDADES

    if(actividadesStore.totalPendientes > 10){

        alertas.push({

            tipo:'advertencia',

            icono:'🟡',

            titulo:'Mucho trabajo pendiente',

            texto:
            'Estás acumulando demasiadas actividades.'

        });

    }



    // COMPLETADAS

    if(actividadesStore.totalCompletadas > 0){

        alertas.push({

            tipo:'info',

            icono:'🟢',

            titulo:'Buen trabajo',

            texto:
            `Hoy completaste ${actividadesStore.totalCompletadas} actividades.`

        });

    }



    return alertas;

}



    get decision(){

        if(actividadesStore.prioridadAlta.length){

            return {

                icono:'🎯',

                titulo:'Prioridad del día',

                texto:
                'Completa primero las actividades de prioridad alta.'

            };

        }



        if(actividadesStore.totalPendientes){

            return {

                icono:'📌',

                titulo:'Continúa ejecutando',

                texto:
                'Aún tienes actividades pendientes.'

            };

        }



        return {

            icono:'🎉',

            titulo:'Excelente trabajo',

            texto:
            'No tienes pendientes.'

        };

    }


}



export const dashboardStore = new DashboardStore();