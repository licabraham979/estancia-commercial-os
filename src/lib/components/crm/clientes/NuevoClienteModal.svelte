<script>

import { crearCliente } from '$lib/stores/clientes.svelte.js';
import { actividadesStore } from '$lib/stores/actividades.svelte.js';


let { open = $bindable(false) } = $props();


let nombre = $state('');
let telefono = $state('');
let empresa = $state('');
let ciudad = $state('');
let origen = $state('Facebook Ads');
let servicio = $state('Mantenimiento de techo');
let interes = $state('tibio');
let comentarios = $state('');


function cerrar(){

    open = false;

}

function guardar(){

    crearCliente({

        nombre,
        empresa,
        telefono,
        correo:""

    });


    cerrar();

}


</script>

{#if open}
    <div class="overlay" on:click={cerrar}>
        <div class="modal" on:click|stopPropagation>
            <div class="header">
                <h2>➕ Nuevo Cliente</h2>
                <button class="cerrar" on:click={cerrar}>✕</button>
            </div>

            <div class="contenido">
                <input bind:value={nombre} placeholder="Nombre del cliente" />
                <input bind:value={telefono} placeholder="Teléfono" />
                <input bind:value={empresa} placeholder="Empresa (opcional)" />
                <input bind:value={ciudad} placeholder="Ciudad" />

                <select bind:value={origen}>
                    <option>Facebook Ads</option>
                    <option>WhatsApp</option>
                    <option>Página web</option>
                    <option>Referido</option>
                    <option>Prospección</option>
                </select>

                <select bind:value={servicio}>
                    <option>Mantenimiento de techo</option>
                    <option>Pintura</option>
                    <option>Fachada</option>
                    <option>Rótulo</option>
                    <option>Vinil</option>
                    <option>Otro</option>
                </select>

                <textarea bind:value={comentarios} rows="4" placeholder="Pega aquí el mensaje que llegó por Facebook..."></textarea>
            </div>

            <div class="footer">
                <button class="btn-cancelar" on:click={cerrar}>Cancelar</button>
                <button class="btn-guardar" on:click={guardar}>Guardar Cliente</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal {
        background: white;
        width: 100%;
        max-width: 560px;
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    }

    .header {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .cerrar {
        border: none;
        background: transparent;
        font-size: 1.2rem;
        cursor: pointer;
    }

    .contenido {
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
    }

    input, select, textarea {
        padding: 0.85rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        font-size: 0.95rem;
    }

    textarea {
        resize: vertical;
    }

    .footer {
        padding: 1rem 1.25rem;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
    }

    .btn-cancelar {
        padding: 0.75rem 1rem;
        border-radius: 10px;
        border: 1px solid #d1d5db;
        background: white;
        cursor: pointer;
    }

    .btn-guardar {
        padding: 0.75rem 1.1rem;
        border-radius: 10px;
        border: none;
        background: #2563eb;
        color: white;
        font-weight: 600;
        cursor: pointer;
    }
</style>