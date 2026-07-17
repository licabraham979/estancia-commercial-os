/** @typedef {import('$lib/types/clientes').Actividad} Actividad */

let actividades = $state(
    /** @type {Actividad[]} */ 
    ([])
);

const STORAGE_KEY = 'crm_actividades';


class ActividadesStore {

    /** @type {Actividad[]} */
actividades = $state([]);
    categorias = [

    {
        id:1,
        nombre:'Clientes',
        icono:'👥',
        color:'#2563eb'
    },

    {
        id:2,
        nombre:'Prospección',
        icono:'🎯',
        color:'#7c3aed'
    },

    {
        id:3,
        nombre:'Finanzas',
        icono:'💰',
        color:'#16a34a'
    },

    {
        id:4,
        nombre:'Estudio',
        icono:'📚',
        color:'#ea580c'
    },

    {
        id:5,
        nombre:'Crecimiento personal',
        icono:'💪',
        color:'#dc2626'
    },

    {
        id:6,
        nombre:'Administración',
        icono:'🏢',
        color:'#475569'
    },

    {
        id:7,
        nombre:'Compras',
        icono:'🛒',
        color:'#0f766e'
    },

    {
        id:8,
        nombre:'Operación',
        icono:'🧰',
        color:'#9333ea'
    }
    
];


    constructor(){

        if(typeof localStorage !== 'undefined'){

            const guardadas = localStorage.getItem(STORAGE_KEY);

            if(guardadas){

                this.actividades = JSON.parse(guardadas);

            }

        }

    }

    
    get pendientes(){

    return this.actividades.filter(
        item => item.estado === 'pendiente'
    );

}


get completadas(){

    return this.actividades.filter(
        item => item.estado === 'completada'
    );

}


get prioridadAlta(){

    return this.actividades.filter(
        item =>
        item.estado === 'pendiente' &&
        item.prioridad === 'alta'
    );

}

get total(){

    return this.actividades.length;

}


get totalPendientes(){

    return this.actividades.filter(
        item => item.estado === 'pendiente'
    ).length;

}


get totalCompletadas(){

    return this.actividades.filter(
        item => item.estado === 'completada'
    ).length;

}


get progreso(){

    if(this.total === 0) return 0;


    return Math.round(
        (this.totalCompletadas / this.total) * 100
    );

}


    crearActividad(
    /** @type {string} */ titulo,
    /** @type {number} */ categoriaId = 1,
    /** @type {string} */ prioridad = 'media'
){

        this.actividades.unshift({

    id: Date.now(),

    clienteId:null,

    campanaId:null,

    titulo,

    descripcion:'',

    tipo:'habito',

    categoriaId,

    prioridad,

    estado:'pendiente',

    responsable:'usuario',

    origen:'manual',

    referencia:null,

    fecha:new Date().toISOString(),

    fechaCreacion:new Date().toISOString(),

    fechaObjetivo:null,

    fechaCompletada:null

});

        this.guardar();

    }


    

    guardar(){

        if(typeof localStorage !== 'undefined'){

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(this.actividades)
            );

        }

    }

   crearHabito(
    /** @type {string} */ titulo,
    /** @type {number} */ categoriaId
){
    // pendiente
}
/**
 * @param {number|string} id
 */
completarActividad(id){

    const actividad = this.actividades.find(
        item => item.id === id
    );


    if(!actividad) return;


    actividad.estado = 'completada';

    actividad.fechaCompletada = new Date().toISOString();


    this.guardar();

}

get actividadesPorCategoria(){

    return this.categorias.map(categoria => ({

        ...categoria,

        actividades:

        this.actividades.filter(
            actividad =>
            actividad.categoriaId === categoria.id
        )

    }));

}

crearActividadCliente(
    /** @type {string} */ titulo,
    /** @type {number|string} */ clienteId,
    /** @type {number} */ categoriaId = 1
){

    this.actividades.unshift({

        id: Date.now(),

        clienteId,

        campanaId:null,

        titulo,

        descripcion:'',

        tipo:'seguimiento',

        categoriaId,

        prioridad:'media',

        estado:'pendiente',

        responsable:'usuario',

        origen:'cliente',

        referencia: clienteId,

        fecha: new Date().toISOString(),

        fechaCreacion:new Date().toISOString(),

        fechaObjetivo:null,

        fechaCompletada:null

    });


    this.guardar();

}

registrarActividadCliente(){
}

} // <-- cierra la clase


export const actividadesStore = new ActividadesStore();

