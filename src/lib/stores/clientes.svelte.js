let clientes = $state([]);


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


export function actualizarCliente(id, datos){

    const cliente = clientes.find(
        cliente => cliente.id === id
    );


    if(cliente){

        cliente.proyecto = datos.proyecto;
        cliente.valor = datos.valor;
        cliente.siguienteAccion = datos.siguienteAccion;


        cliente.actividades.unshift({

            fecha:"Ahora",

            titulo:"Información actualizada",

            descripcion:"Se actualizaron datos comerciales del cliente."

        });


        guardarClientes();

    }

}