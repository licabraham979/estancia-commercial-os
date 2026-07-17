/** @typedef {import('$lib/types/clientes').Nota} Nota */

let notas = $state(
    /** @type {Nota[]} */
    ([])
);

function guardarNotas(){

    if(typeof localStorage === "undefined"){
        return;
    }

    localStorage.setItem(
        "notas",
        JSON.stringify(notas)
    );

}



function cargarNotas(){

    if(typeof localStorage === "undefined"){
        return;
    }


    const datos = localStorage.getItem("notas");


    if(datos){

        notas.push(
            ...JSON.parse(datos)
        );

    }

}



export function obtenerNotas(clienteId){

    return notas.filter(
        nota => nota.clienteId === clienteId
    );

}



export function crearNota(datos){


    notas.push({

        id:Date.now(),

        clienteId:datos.clienteId,

        fecha:new Date().toISOString(),

        texto:datos.texto

    });


    guardarNotas();

}


cargarNotas();