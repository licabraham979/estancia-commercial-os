<script>

import { actividadesStore } from '$lib/stores/actividades.svelte.js';

let { actividad } = $props();

let mostrarSeguimiento = $state(false);

const categoria = $derived(
    actividadesStore.categorias.find(
        item => item.id === actividad.categoriaId
    )
);

const esSeguimiento = $derived(
    actividad.tipo === 'seguimiento' ||
    actividad.origen === 'reporte'
);

function completar(){

    actividadesStore.completarActividad(
        actividad.id
    );

}

function eliminar(){

    if(!confirm('¿Eliminar esta actividad?')) return;

    actividadesStore.eliminarActividad(
        actividad.id
    );

}

function formatearFecha(/** @type {string|null|undefined} */ fecha){

    if(!fecha) return 'Sin fecha';

    const fechaObj = new Date(fecha);

    if(Number.isNaN(fechaObj.getTime())){
        return 'Sin fecha';
    }

    return new Intl.DateTimeFormat('es-HN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(fechaObj);

}

function calcularFecha(/** @type {number} */ meses){

    const base = actividad.fechaObjetivo
        ? new Date(`${actividad.fechaObjetivo}T00:00:00`)
        : new Date();

    base.setMonth(
        base.getMonth() + meses
    );

    return base
        .toISOString()
        .split('T')[0];

}

function cambiarSeguimiento(/** @type {number} */ meses){

    const fecha = calcularFecha(meses);

    actividadesStore.cambiarFechaObjetivo(
        actividad.id,
        fecha
    );

    mostrarSeguimiento = false;

}

function cambiarFecha(/** @type {Event} */ event){

    const fecha = /** @type {HTMLInputElement} */ (event.currentTarget).value;

    if(!fecha) return;

    actividadesStore.cambiarFechaObjetivo(
        actividad.id,
        fecha
    );

    mostrarSeguimiento = false;

}

</script>


<div
    class="card"
    class:completada={actividad.estado === 'completada'}
>

    <button
        class="check"
        onclick={completar}
    >
        {actividad.estado === 'completada'
            ? '✓'
            : '○'}
    </button>


    <div class="content">

        <h3>
            {actividad.titulo}
        </h3>


        <div class="meta">

            {#if categoria}

                <span class="categoria">

                    {categoria.icono}

                    {categoria.nombre}

                </span>

            {/if}


            <span>
                {actividad.prioridad}
            </span>

        </div>


        {#if esSeguimiento}

            <div class="seguimiento">

                <div class="fecha-seguimiento">

                    📅 Próximo seguimiento:

                    <strong>
                        {formatearFecha(actividad.fechaObjetivo)}
                    </strong>

                </div>


                <button
                    class="btn-fecha"
                    onclick={() => mostrarSeguimiento = !mostrarSeguimiento}
                >
                    {mostrarSeguimiento
                        ? 'Cerrar'
                        : 'Cambiar seguimiento'}
                </button>


                {#if mostrarSeguimiento}

                    <div class="opciones-fecha">

                        <button
                            onclick={() => cambiarSeguimiento(3)}
                        >
                            3 meses
                        </button>

                        <button
                            onclick={() => cambiarSeguimiento(6)}
                        >
                            6 meses
                        </button>

                        <button
                            onclick={() => cambiarSeguimiento(12)}
                        >
                            12 meses
                        </button>

                        <label>

                            Fecha personalizada

                            <input
                                type="date"
                                value={actividad.fechaObjetivo ?? ''}
                                onchange={cambiarFecha}
                            />

                        </label>

                    </div>

                {/if}

            </div>

        {/if}

    </div>


    <button
        class="delete"
        onclick={eliminar}
        title="Eliminar actividad"
    >
        🗑️
    </button>

</div>


<style>

.card{

    display:flex;

    align-items:center;

    gap:14px;

    padding:16px;

    background:white;

    border-radius:16px;

    border:1px solid #eee;

    transition:.2s ease;

}

.card:hover{

    transform:translateY(-2px);

}

.check{

    border:none;

    background:none;

    font-size:24px;

    cursor:pointer;

}

.content{

    flex:1;

}

h3{

    margin:0;

    font-size:16px;

}

.meta{

    display:flex;

    gap:8px;

    margin-top:8px;

}

.meta span{

    font-size:12px;

    padding:4px 10px;

    border-radius:20px;

    background:#f1f1f1;

}

.completada h3{

    text-decoration:line-through;

    opacity:.5;

}

.categoria{

    border:1px solid;

    background:white;

}

.seguimiento{

    margin-top:12px;

    padding-top:10px;

    border-top:1px solid #eee;

}

.fecha-seguimiento{

    font-size:13px;

    color:#475569;

}

.fecha-seguimiento strong{

    color:#162439;

}

.btn-fecha{

    margin-top:8px;

    border:none;

    background:none;

    padding:0;

    color:#162439;

    font-size:12px;

    font-weight:600;

    cursor:pointer;

}

.opciones-fecha{

    display:flex;

    align-items:center;

    flex-wrap:wrap;

    gap:6px;

    margin-top:10px;

}

.opciones-fecha button{

    border:1px solid #d8dee8;

    background:white;

    border-radius:8px;

    padding:6px 9px;

    font-size:12px;

    cursor:pointer;

}

.opciones-fecha button:hover{

    background:#f5f7fa;

}

.opciones-fecha label{

    display:flex;

    align-items:center;

    gap:6px;

    font-size:12px;

    color:#64748b;

}

.opciones-fecha input{

    border:1px solid #d8dee8;

    border-radius:8px;

    padding:5px;

    font-size:12px;

}

.delete{

    border:none;

    background:none;

    font-size:16px;

    cursor:pointer;

    opacity:.45;

    padding:6px;

}

.delete:hover{

    opacity:1;

}

</style>
