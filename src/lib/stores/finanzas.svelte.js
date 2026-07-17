/** @typedef {import('$lib/types/clientes').Pago} Pago */

let movimientos = $state(
    /** @type {Pago[]} */ 
    ([])
);


/**
 * @typedef {Object} MovimientoNuevo
 * @property {string|number} clienteId
 * @property {"ingreso"|"gasto"} tipo
 * @property {string} concepto
 * @property {number} monto
 */

/**
 * @param {MovimientoNuevo} datos
 */
export function agregarMovimiento(datos){

    movimientos.push({
        id: Date.now(),
        clienteId: datos.clienteId,
        tipo: datos.tipo,
        concepto: datos.concepto,
        monto: datos.monto,
        fecha: new Date().toISOString()
    });

    guardarMovimientos();
}




    export function obtenerMovimientosCliente(
    /** @type {number|string} */ clienteId
){

    return movimientos.filter(
        movimiento =>
        movimiento.clienteId === clienteId
    );

}





    export function resumenCliente(
    /** @type {number|string} */ clienteId
){


const movimientosCliente =
obtenerMovimientosCliente(clienteId);



const ingresos =
movimientosCliente
.filter(m=>m.tipo==="ingreso")
.reduce(
(total,m)=> total + m.monto,
0
);



const gastos =
movimientosCliente
.filter(m=>m.tipo==="gasto")
.reduce(
(total,m)=> total + m.monto,
0
);



return {

    ingresos,

    gastos,

    ganancia:
    ingresos - gastos

};


}





function guardarMovimientos(){


    if(typeof localStorage === "undefined"){
        return;
    }


    localStorage.setItem(
        "movimientos_financieros",
        JSON.stringify(movimientos)
    );


}





function cargarMovimientos(){


    if(typeof localStorage === "undefined"){
        return;
    }



    const datos =
    localStorage.getItem(
        "movimientos_financieros"
    );



    if(datos){


        const guardados =
        JSON.parse(datos);



        movimientos.push(
            ...guardados
        );


    }


}





if(typeof window !== "undefined"){

    cargarMovimientos();

}