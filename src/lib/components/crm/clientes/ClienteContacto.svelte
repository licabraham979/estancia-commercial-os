<script>

let {
    nombre,
    telefono,
    correo
} = $props();


</script>


<div class="contacto">


<h2>
Contacto
</h2>



<div class="datos">


<p>
👤 {nombre}
</p>


<p>
📱 {telefono}
</p>


<p>
✉ {correo}
</p>


</div>



<div class="acciones">


<button>
WhatsApp
</button>


<button>
Llamar
</button>


</div>


</div>



<style>

.contacto {

margin-top:var(--space-6);

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius);

padding:var(--space-4);

}


h2 {

font-size:18px;

margin-bottom:var(--space-4);

}



.datos p {

margin-bottom:8px;

font-size:14px;

}



.acciones {

display:flex;

gap:10px;

margin-top:var(--space-4);

}



button {

padding:8px 14px;

border:none;

border-radius:var(--radius);

cursor:pointer;

background:var(--primary);

color:white;

}


</style>