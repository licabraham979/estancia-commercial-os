<script>

const archivos = [

    {
        nombre:"Fotos techo antes",
        tipo:"Imagen",
        icono:"📷"
    },

    {
        nombre:"Cotización.pdf",
        tipo:"Documento",
        icono:"📄"
    },

    {
        nombre:"Factura.pdf",
        tipo:"Documento",
        icono:"📄"
    }

];

</script>


<div class="archivos">


<h2>
Archivos
</h2>



<div class="grid">


{#each archivos as archivo}


<div class="file">


<div class="icon">
{archivo.icono}
</div>


<div>

<h3>
{archivo.nombre}
</h3>

<p>
{archivo.tipo}
</p>

</div>


</div>


{/each}


</div>


</div>



<style>

.archivos {

margin-top:var(--space-6);

}



h2 {

font-size:18px;

margin-bottom:var(--space-4);

}



.grid {

display:grid;

grid-template-columns:repeat(auto-fit,minmax(220px,1fr));

gap:var(--space-4);

}



.file {

display:flex;

align-items:center;

gap:var(--space-3);

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius);

padding:var(--space-4);

}



.icon {

font-size:28px;

}



.file h3 {

font-size:15px;

}



.file p {

font-size:13px;

margin-top:4px;

color:var(--text-secondary);

}



</style>