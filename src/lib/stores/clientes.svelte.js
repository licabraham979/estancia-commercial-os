let clientes = $state([

    {
        id:"oscar-guardado",
        nombre:"Oscar Guardado",
        empresa:"Hotel Palma",
        telefono:"+504 9999-9999",
        correo:"oscar@hotelpalma.com",
        estado:"Cotización enviada",
        proyecto:"Mantenimiento de techo",
        valor:"L 35,000",
        siguienteAccion:"Llamar viernes 10:00 AM",
            
            actividades:[
                {
                    fecha:"Hoy",
                    titulo:"Cotización enviada",
                    descripcion:"Se envió propuesta comercial."
                }
            ]
    },


    {
        id:"carlos-perez",
        nombre:"Carlos Pérez",
        empresa:"Restaurante Azul",
        telefono:"+504 9999-9999",
        correo:"carlos@hotelpalma.com",
        estado:"Inspección pendiente",
        proyecto:"Revisión de fachada",
        valor:"L 20,000",
        siguienteAccion:"Agendar visita",

            actividades:[
                {
                    fecha:"Hoy",
                    titulo:"Cotización enviada",
                    descripcion:"Se envió propuesta comercial."
                }
            ]
    },


    {
        id:"maria-lopez",
        nombre:"María López",
        empresa:"Constructora Norte",
        telefono:"+504 9769-9999",
        correo:"maria@hotelpalma.com",
        estado:"Seguimiento",
        proyecto:"Rótulo comercial",
        valor:"L 60,000",
        siguienteAccion:"Enviar propuesta",

            actividades:[
                {
                    fecha:"Hoy",
                    titulo:"Cotización enviada",
                    descripcion:"Se envió propuesta comercial."
                }
            ]
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

            fecha:"Ahora",

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

fecha:"Ahora",

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

    localStorage.setItem(
        "clientes",
        JSON.stringify(clientes)
    );

}


function cargarClientes(){

    if(typeof localStorage === "undefined"){
        return;
    }


    const datos =
    localStorage.getItem("clientes");


    if(datos){

        const clientesGuardados = JSON.parse(datos);


        clientes.push(
            ...clientesGuardados
        );

    }

}


cargarClientes();