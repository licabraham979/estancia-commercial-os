let notas = $state([

    {
        id:1,
        clienteId:"oscar-guardado",
        fecha:"Hoy",
        texto:"Cliente interesado en mantenimiento completo del techo."
    },

    {
        id:2,
        clienteId:"oscar-guardado",
        fecha:"Ayer",
        texto:"Solicitó revisar opciones de precio."
    }

]);



export function obtenerNotas(clienteId){

    return notas.filter(

        nota => nota.clienteId === clienteId

    );

}



export function crearNota(datos){


    notas.push({

        id:Date.now(),

        clienteId:datos.clienteId,

        fecha:"Ahora",

        texto:datos.texto

    });


}