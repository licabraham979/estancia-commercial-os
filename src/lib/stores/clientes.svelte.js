let clientes = $state([

{
id:"oscar-guardado",

nombre:"Oscar Guardado",

empresa:"Cliente particular",

telefono:"",

correo:"",

estado:"Inspección pendiente",

proyecto:"Mantenimiento de techo",

valor:"L 15000",

siguienteAccion:"Enviar cotización",

actividades:[

{
fecha:new Date().toISOString(),

titulo:"Inspección registrada",

descripcion:"Se realizó diagnóstico inicial del techo."

}

],

archivos:[],

notas:""

},

{
id:"hotel-palma",

nombre:"Hotel Palma",

empresa:"Hotel Palma",

telefono:"",

correo:"",

estado:"Cotización enviada",

proyecto:"Mantenimiento preventivo",

valor:"L 25000",

siguienteAccion:"Dar seguimiento a cotización",

actividades:[

{
fecha:new Date().toISOString(),

titulo:"Cotización enviada",

descripcion:"Se envió propuesta comercial."

}

],

archivos:[],

notas:""

}

]);

export function obtenerClientes(){

    return clientes;

}



export function obtenerCliente(id){

    return clientes.find(
        cliente => cliente.id === id
    );

}



export function cambiarEstado(id, nuevoEstado){


    const cliente = clientes.find(
        cliente => cliente.id === id
    );


    if(cliente){


        const estadoAnterior = cliente.estado;


        cliente.estado = nuevoEstado;



        cliente.actividades.unshift({

            fecha:new Date().toISOString(),

            titulo:"Estado actualizado",

            descripcion:
            `${estadoAnterior} → ${nuevoEstado}`

        });


    }


}



export function crearCliente(datos){


const nuevoCliente = {

id:
datos.nombre
.toLowerCase()
.replaceAll(" ","-"),


nombre:
datos.nombre,


empresa:
datos.empresa,


telefono:
datos.telefono,


correo:
datos.correo,


estado:
"Nuevo contacto",


proyecto:
"",


valor:
"L 0",


siguienteAccion:
"Contactar cliente",


actividades:[

{

fecha:new Date().toISOString(),

titulo:"Cliente creado",

descripcion:"Nuevo registro comercial"

}

],


archivos:[],


notas:""

};



clientes.push(nuevoCliente);

guardarClientes();



}

function guardarClientes(){

    if(typeof localStorage === "undefined"){
        return;
    }

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


    if(datos){

        const clientesGuardados = JSON.parse(datos);


        clientes.push(
            ...clientesGuardados
        );

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

export function actualizarCliente(id, datos){

    const cliente = clientes.find(
        cliente => cliente.id === id
    );


    if(cliente){

        cliente.proyecto = datos.proyecto;
        cliente.valor = datos.valor;
        cliente.siguienteAccion = datos.siguienteAccion;


        cliente.actividades.unshift({

            fecha:new Date().toISOString(),

            titulo:"Información actualizada",

            descripcion:"Se actualizaron datos comerciales del cliente."

        });


        guardarClientes();

    }
    

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
            )


        };


    })
    .sort((a,b)=>{


        const fechaA =
        a.ultimaActividad?.fecha ?? 0;


        const fechaB =
        b.ultimaActividad?.fecha ?? 0;


        return new Date(fechaB) - new Date(fechaA);


    });

    


}

function calcularTiempoSinContacto(fecha){

    if(!fecha){

        return "Sin contacto";

    }


    const ahora = new Date();

    const ultima = new Date(fecha);


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

