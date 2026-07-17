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


        if(actividadesStore.prioridadAlta.length){

            alertas.push({

                tipo:'critica',

                icono:'🔴',

                titulo:'Actividades críticas',

                texto:
                `Tienes ${actividadesStore.prioridadAlta.length} actividades de prioridad alta.`

            });

        }



        if(actividadesStore.totalPendientes > 10){

            alertas.push({

                tipo:'advertencia',

                icono:'🟡',

                titulo:'Mucho trabajo pendiente',

                texto:
                'Estás acumulando demasiadas actividades.'

            });

        }



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