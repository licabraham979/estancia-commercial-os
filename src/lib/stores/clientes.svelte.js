/** @typedef {import('$lib/types/clientes').Cliente} Cliente */
/** @typedef {import('$lib/types/clientes').Gasto} Gasto */
/** @typedef {import('$lib/types/clientes').Pago} Pago */

let clientes = $state(/** @type {Cliente[]} */ ([]));

export function obtenerClientes(){

    return clientes;

}



/**
 * @param {number|string} id
 */
export function obtenerCliente(id){

    return clientes.find(
        cliente => String(cliente.id) === String(id)
    );

}



/**
 * @param {number|string} id
 * @param {string} nuevoEstado
 */
    export function cambiarEstado(id, nuevoEstado) {

    const cliente = clientes.find(
        c => String(c.id) === String(id)
    );

    if (cliente) {

        const estadoAnterior = cliente.estado;

        cliente.estado = nuevoEstado;

        cliente.actividades ??= [];

        cliente.actividades.unshift({
            id: Date.now(),
            fecha: new Date().toISOString(),
            titulo: "Estado actualizado",
            descripcion: `${estadoAnterior} → ${nuevoEstado}`,
            estado: "completada",
            prioridad: "media",
            fechaCreacion: new Date().toISOString()
        });

        guardarClientes();
    }
}

/**
 * @param {{
nombre:string,
empresa:string,
telefono?:string,
correo?:string
}} datos
 */
export function crearCliente(datos){


const nuevoCliente = {

    id: Date.now(),

    nombre: datos.nombre,

    empresa: datos.empresa,

    estado:"Nuevo contacto",

    telefono:datos.telefono ?? "",

    correo:datos.correo ?? "",

    actividades:[],

    pagos:[],

    gastos:[],

    ultimaActividad:null,

    proyecto:"",
    valor:0,

    nivelSeguimiento:{
        etiqueta:"Cliente nuevo",
        color:"gray",
        icono:"👤"
    }

};


clientes.push(nuevoCliente);

guardarClientes();

}

function guardarClientes() {

    if (typeof localStorage === "undefined") return;

    localStorage.setItem(
        "clientes",
        JSON.stringify(clientes)
    );
}


function cargarClientes(){

    if(typeof localStorage === "undefined"){
        return;
    }


    const datos = localStorage.getItem("clientes");


    if (datos) {
    clientes = JSON.parse(datos);
}

}


if (typeof window !== "undefined") {
    cargarClientes();
}

export function obtenerClientesSinAccion(){

    return clientes.filter(
        cliente => !cliente.siguienteAccion
    );

}

/**
 * @param {number|string} id
 * @param {Partial<Cliente>} datos
 */
export function actualizarCliente(id, datos){

    const cliente = clientes.find(
        c => c.id === id
    );

    if(!cliente) return;

    Object.assign(cliente, datos);

    guardarClientes();

}

export function obtenerSeguimientos(){

    return clientes
    .map(cliente => {


        const ultima =
        cliente.actividades?.[0] ?? null;



        return {

            id: cliente.id,

            nombre: cliente.nombre,

            empresa: cliente.empresa,


            estado: cliente.estado,


            siguienteAccion:
            cliente.siguienteAccion,


            valor:
            cliente.valor,


            proyecto:
            cliente.proyecto,


            ultimaActividad: ultima,


            tiempoSinContacto:
            calcularTiempoSinContacto(
                ultima?.fecha
            ),


            nivelSeguimiento:
            calcularNivelSeguimiento(
                ultima?.fecha
            ),

            accionRecomendada:
            calcularAccionSeguimiento(
                ultima?.fecha,
                cliente.estado
            )


        };


    })
    .sort((a,b)=>{


        const fechaA =
        a.ultimaActividad?.fecha ?? 0;


        const fechaB =
        b.ultimaActividad?.fecha ?? 0;


        return new Date(fechaB).getTime() - new Date(fechaA).getTime();


    });

    


}
/**
 * @param {number|string} id
 * @param {Gasto} gasto
 */

export function registrarGasto(id, gasto){

    const cliente =
    clientes.find(
        cliente => cliente.id === id
    );


    if(cliente){

       cliente.gastos.push({

        id: Date.now(),

        tipo:"gasto",

        fecha:new Date().toISOString(),

        concepto:gasto.concepto,

        monto:Number(gasto.monto)

        });


        guardarClientes();

    }

}

/**
 
 * @property {string} fecha
 * @property {string} concepto
 * @property {number} valor
 * @property {number} valorProyecto
 */

/**
 * @param {number|string} id
 * @param {Pago} pago
 */
export function registrarPago(id, pago){

    const cliente = clientes.find(
        cliente => cliente.id === id
    );

    if(cliente){

        cliente.pagos.push({

            id: Date.now(),

            tipo:"ingreso",

            fecha:new Date().toISOString(),

            concepto:pago.concepto,

            monto:Number(pago.monto)

        });

        guardarClientes();

    }

}
    
/**
 * @param {number|string} id
 */
export function obtenerRentabilidad(id){

    const cliente =
    clientes.find(
        cliente => cliente.id === id
    );


    if(!cliente){

        return null;

    }



    const ingresos =
    cliente.pagos.reduce(
    /**
     * @param {number} total
     * @param {import('$lib/types/clientes').Pago} pago
     */
    (total,pago)=>
        total + pago.monto,
    0
    );


    const gastos =
cliente.gastos.reduce(
    /**
     * @param {number} total
     * @param {import('$lib/types/clientes').Gasto} gasto
     */
    (total,gasto)=>
    total + gasto.monto,
    0
);


    return {

    ingresos,

    gastos,

    ganancia:

    ingresos - gastos,

    pendiente:

    cliente.valor - ingresos

};


}
/**
 * @param {string|Date|null|undefined} fecha
 */
function calcularTiempoSinContacto(fecha){

    if(!fecha){

        return "Sin contacto";

    }


    const ahora = Date.now();
    const ultima = new Date(fecha).getTime();


    const diferencia =
    ahora - ultima;


    const horas =
    Math.floor(
        diferencia / (1000 * 60 * 60)
    );


    if(horas < 1){

        return "Hace menos de 1 hora";

    }


    if(horas < 24){

        return `Hace ${horas} horas`;

    }


    const dias =
    Math.floor(horas / 24);


    return `Hace ${dias} días`;

}
/**
 * @param {string|Date|null|undefined} fecha
 */
function calcularNivelSeguimiento(fecha){

    if(!fecha){

        return {

            etiqueta:"Sin contacto",

            color:"gris",

            icono:"⚫"

        };

    }


    const ahora = new Date();

    const ultima = new Date(fecha);


    const horas =
    (ahora - ultima) /
    (1000 * 60 * 60);



    if(horas < 24){

        return {

            etiqueta:"Activo",

            color:"verde",

            icono:"🟢"

        };

    }


    if(horas < 72){

        return {

            etiqueta:"Atención",

            color:"amarillo",

            icono:"🟡"

        };

    }


    return {

        etiqueta:"Riesgo",

        color:"rojo",

        icono:"🔴"

    };


}
/**
 * @param {string|Date|null|undefined} fecha
 */
function calcularAccionSeguimiento(fecha, estado){


    const horas =
    fecha
    ?
    Date.now() - new Date(fecha).getTime()
    /
    (1000 * 60 * 60)
    :
    999;



    if(!fecha){

        return "Registrar primer contacto";

    }



    if(horas < 1){

        return "Continuar negociación";

    }



    if(horas < 24){

        return "Enviar seguimiento";

    }



    if(horas < 72){

        return "Realizar llamada";

    }



    if(
        estado === "Cotización enviada"
    ){

        return "Confirmar decisión del cliente";

    }



   return "Reactivar cliente";

}

