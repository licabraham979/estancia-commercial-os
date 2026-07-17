const STORAGE_KEY = 'crm_actividades';


class ActividadesStore {

    actividades = $state([]);

    categorias = [
        { id:1, nombre:'Negocio' },
        { id:2, nombre:'Aprendizaje' },
        { id:3, nombre:'Salud' },
        { id:4, nombre:'Personal' }
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


    crearActividad(titulo, categoriaId = 1){

        this.actividades.unshift({

            id: Date.now(),
            titulo,
            descripcion:'',
            tipo:'habito',
            categoriaId,
            prioridad:'media',
            estado:'pendiente',
            responsable:'usuario',
            origen:'manual',
            referencia:null,
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

    crearHabito(titulo, categoriaId){

    this.actividades.unshift({

        id:Date.now(),

        titulo,

        descripcion:'',

        tipo:'habito',

        categoriaId,

        prioridad:'media',

        estado:'pendiente',

        responsable:'usuario',

        origen:'habito',

        referencia:null,

        fechaCreacion:new Date().toISOString(),

        fechaObjetivo:null,

        fechaCompletada:null

    });


    this.guardar();

}

    completarActividad(id){

    const actividad = this.actividades.find(
        item => item.id === id
    );


    if(!actividad) return;


    actividad.estado = 'completada';

    actividad.fechaCompletada = new Date().toISOString();


    this.guardar();

}


} // <-- cierra la clase


export const actividadesStore = new ActividadesStore();

