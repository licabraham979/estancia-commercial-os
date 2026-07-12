<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    let isOpen = false;

    // Función para alternar el menú móvil
    function toggleMenu() {
        isOpen = !isOpen;
    }

    // Función para cerrar el menú al hacer clic en un enlace (móvil)
    function closeMenu() {
        isOpen = false;
    }
</script>

<nav class="bg-slate-900 text-white shadow-lg sticky top-0 z-50 bg-transparent backdrop-blur-md">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <!-- SECCIÓN IZQUIERDA: LOGO Y NOMBRE -->
        <a href="/" class="flex items-center gap-3 no-underline group">
             <img class="w-20" src="https://res.cloudinary.com/licabraham939/image/upload/v1782713868/aestanciacomercial/Copia_de_logo_estancia_virtual-02_Editado_k0zdbo.png">
            <!--  <div
                class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-md group-:bg-orange-600 transition-colors"
            ></div>-->

            <div class="flex flex-col">
                <span
                    class="text-lg font-bold tracking-wide leading-tight "
                >
                    ESTANCIA
                </span>
                <span
                     
                    class="text-sm font-medium text-slate-300 leading-tight"
                    style="color: rgb(231, 161, 69, 1);"
                >
                    COMMERCIAL
                </span>
            </div>
        </a>

        <!-- SECCIÓN DERECHA: MENÚ ESCRITORIO (Oculto en móvil) -->
        <div class="hidden md:flex items-center gap-8">
            <a
                href="#inicio"
                class="text-sm font-medium hover:text-orange-400 transition-colors"
                >Inicio</a
            >
            <a
                href="#servicios"
                class="text-sm font-medium hover:text-orange-400 transition-colors"
                >Servicios</a
            >
            <a
                href="https://www.facebook.com/profile.php?id=61591619660174"
                class="text-sm font-medium hover:text-orange-400 transition-colors"
                >Nosotros</a
            >
            <a
                href="https://wa.me/50433838386"
                class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
                Contáctanos
            </a>
        </div>

        <!-- BOTÓN MÓVIL (Visible solo en móvil) -->
        <button
            class="md:hidden text-white focus:outline-none p-2"
            on:click={toggleMenu}
            aria-label="Abrir menú"
        >
            <!-- Icono Hamburguesa cuando está cerrado -->
            {#if !isOpen}
                <svg
                    class="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                </svg>
            {:else}
                <!-- Icono X cuando está abierto -->
                <svg
                    class="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    ></path>
                </svg>
            {/if}
        </button>
    </div>

    <!-- MENÚ DESPLEGABLE MÓVIL (Animación simple) -->
    {#if isOpen}
        <div class="md:hidden bg-slate-800 border-t border-slate-700">
            <div class="flex flex-col p-4 gap-4">
                <a
                    href="#inicio"
                    on:click={closeMenu}
                    class="text-slate-200 hover:text-orange-400 font-medium py-2 px-4 rounded hover:bg-slate-700 transition-colors"
                    >Inicio</a
                >
                <a
                    href="#servicios"
                    on:click={closeMenu}
                    class="text-slate-200 hover:text-orange-400 font-medium py-2 px-4 rounded hover:bg-slate-700 transition-colors"
                    >Servicios</a
                >
                <a
                    href="#nosotros"
                    on:click={closeMenu}
                    class="text-slate-200 hover:text-orange-400 font-medium py-2 px-4 rounded hover:bg-slate-700 transition-colors"
                    >Nosotros</a
                >
                <a
                    href="#contacto"
                    on:click={closeMenu}
                    class="text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg shadow-md transition-colors"
                >
                    Contáctanos
                </a>
            </div>
        </div>
    {/if}
</nav>
