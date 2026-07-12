<script>

let {
    estado
} = $props();


const estados = {

    "Nuevo contacto": {
        color:"blue",
        icon:"🟦"
    },

    "Inspección pendiente": {
        color:"yellow",
        icon:"🟨"
    },

    "Cotización enviada": {
        color:"purple",
        icon:"🟪"
    },

    "Seguimiento": {
        color:"orange",
        icon:"🟧"
    },

    "Proyecto aprobado": {
        color:"green",
        icon:"🟩"
    },

    "Finalizado": {
        color:"gray",
        icon:"⬛"
    }

};


let actual = estados[estado] ?? estados["Nuevo contacto"];


</script>



<div class={`status ${actual.color}`}>

<span>

{actual.icon}

</span>


{estado}


</div>



<style>

.status {

display:inline-flex;

align-items:center;

gap:8px;

padding:8px 14px;

border-radius:20px;

font-size:14px;

font-weight:600;

}



.blue {

background:#dbeafe;

color:#1d4ed8;

}


.yellow {

background:#fef9c3;

color:#854d0e;

}


.purple {

background:#f3e8ff;

color:#7e22ce;

}


.orange {

background:#ffedd5;

color:#c2410c;

}


.green {

background:#dcfce7;

color:#15803d;

}


.gray {

background:#e5e7eb;

color:#374151;

}


</style>