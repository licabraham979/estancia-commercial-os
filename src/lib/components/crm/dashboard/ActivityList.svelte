<script>

import { actividadesStore } from '$lib/stores/actividades.svelte.js';


const activities = $derived(
    actividadesStore.actividades
        .filter(activity => {

            if(activity.estado !== 'pendiente'){
                return false;
            }

            if(!activity.fechaObjetivo){
                return false;
            }

            const hoy = new Date();
            hoy.setHours(0,0,0,0);

            const fechaObjetivo = new Date(
                `${activity.fechaObjetivo}T00:00:00`
            );

            return fechaObjetivo <= hoy;

        })
        .sort((a,b) => {

            const fechaA = new Date(
                `${a.fechaObjetivo}T00:00:00`
            );

            const fechaB = new Date(
                `${b.fechaObjetivo}T00:00:00`
            );

            return fechaA.getTime() - fechaB.getTime();

        })
        .slice(0,5)
);


function formatoFecha(/** @type {string|null|undefined} */ fecha = ''){
    if(!fecha) return '';

    const fechaObj = new Date(
        `${fecha}T00:00:00`
    );

    return new Intl.DateTimeFormat(
        'es-HN',
        {
            day:'2-digit',
            month:'long',
            year:'numeric'
        }
    ).format(fechaObj);

}


function ejecutarActividad(/** @type {number|string} */ id){

    actividadesStore.completarActividad(id);

}

</script>


<div class="activity">

    <h2>
        Próximos seguimientos
    </h2>


    {#if activities.length === 0}

        <div class="empty">

            <div class="empty-icon">
                ✓
            </div>

            <strong>
                Todo al día
            </strong>

            <span>
                No hay seguimientos pendientes.
            </span>

        </div>

    {:else}

        <div class="list">

            {#each activities as activity (activity.id)}

                <div class="item">

                    <div class="content">

                        <div class="title">
                            {activity.titulo}
                        </div>


                        <div class="client">

                            {activity.clienteId
                                ? `Cliente: ${activity.clienteId}`
                                : 'Cliente'}

                        </div>


                        <div class="time">

                            📅 Contactar:

                            <strong>
                                {formatoFecha(
                                    activity.fechaObjetivo
                                )}
                            </strong>

                        </div>

                    </div>


                    <button
                        class="complete"
                        onclick={() => ejecutarActividad(activity.id)}
                    >
                        ✓
                    </button>

                </div>

            {/each}

        </div>

    {/if}

</div>


<style>

.activity {

    margin-top:var(--space-6);

}


h2 {

    font-size:18px;

    margin-bottom:var(--space-4);

}


.item {

    display:flex;

    align-items:center;

    gap:14px;

    background:var(--surface);

    border:1px solid var(--border);

    border-radius:var(--radius);

    padding:var(--space-4);

    margin-bottom:var(--space-3);

}


.content {

    flex:1;

}


.title {

    font-weight:600;

    color:var(--text);

}


.client {

    margin-top:var(--space-1);

    color:var(--text-secondary);

    font-size:14px;

}


.time {

    margin-top:var(--space-2);

    font-size:13px;

    color:var(--text-secondary);

}


.time strong {

    color:var(--text);

}


.complete {

    width:38px;

    height:38px;

    border:none;

    border-radius:50%;

    background:var(--primary);

    color:white;

    font-size:18px;

    font-weight:600;

    cursor:pointer;

}


.complete:hover {

    opacity:.9;

}


.empty {

    display:flex;

    flex-direction:column;

    align-items:center;

    justify-content:center;

    gap:5px;

    padding:30px 20px;

    background:var(--surface);

    border:1px solid var(--border);

    border-radius:var(--radius);

    text-align:center;

}


.empty-icon {

    font-size:24px;

    margin-bottom:4px;

}


.empty strong {

    color:var(--text);

}


.empty span {

    color:var(--text-secondary);

    font-size:13px;

}

</style>
