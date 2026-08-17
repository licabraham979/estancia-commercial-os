<script>
	const fechaActualizacion = '17 de agosto de 2026';
</script>



<div class="pagina">
	<main class="contenedor">
		<header>
			<div class="marca">ESTANCIA COMERCIAL</div>
			<h1>Política de Privacidad</h1>
			<p class="actualizacion">
				Última actualización: {fechaActualizacion}
			</p>
		</header>

```
	<section>
		<h2>1. Responsable</h2>
		<p>
			Estancia Comercial es responsable del tratamiento de los
			datos personales que se gestionan mediante sus canales de
			comunicación y herramientas internas de atención a clientes.
		</p>
	</section>

	<section>
		<h2>2. Información que podemos recibir</h2>
		<p>
			Cuando una persona se comunica con Estancia Comercial mediante
			Messenger u otros canales habilitados, podemos recibir y
			almacenar información necesaria para atender la conversación,
			como identificadores de la plataforma, nombre disponible,
			mensajes enviados y datos relacionados con la conversación.
		</p>
	</section>

	<section>
		<h2>3. Uso de la información</h2>
		<p>
			La información se utiliza exclusivamente para gestionar y
			responder solicitudes de clientes y personas interesadas,
			dar seguimiento a conversaciones, proporcionar información
			sobre nuestros servicios y mejorar nuestra atención comercial.
		</p>
	</section>

	<section>
		<h2>4. Gestión de mensajes</h2>
		<p>
			Estancia Comercial utiliza herramientas de gestión interna
			para organizar conversaciones recibidas mediante Messenger.
			Los mensajes pueden ser almacenados en nuestro sistema CRM
			para permitir su consulta y seguimiento por parte del personal
			autorizado.
		</p>
	</section>

	<section>
		<h2>5. Compartición de información</h2>
		<p>
			No vendemos ni comercializamos información personal. La
			información podrá ser procesada por proveedores tecnológicos
			necesarios para operar nuestros sistemas y servicios, siempre
			en la medida necesaria para cumplir con las finalidades
			descritas en esta política.
		</p>
	</section>

	<section>
		<h2>6. Seguridad</h2>
		<p>
			Aplicamos medidas técnicas y administrativas razonables para
			proteger la información contra acceso, modificación,
			divulgación o eliminación no autorizada.
		</p>
	</section>

	<section>
		<h2>7. Conservación de la información</h2>
		<p>
			Conservamos la información durante el tiempo necesario para
			las finalidades para las que fue recopilada, para proporcionar
			seguimiento comercial y para cumplir con las obligaciones
			legales aplicables.
		</p>
	</section>

	<section>
		<h2>8. Derechos y solicitudes</h2>
		<p>
			Las personas pueden solicitar información sobre el tratamiento
			de sus datos, así como solicitar su corrección o eliminación
			cuando corresponda.
		</p>

		<p>
			Para realizar una solicitud relacionada con privacidad,
			puedes comunicarte con nosotros mediante los canales oficiales
			de Estancia Comercial.
		</p>
	</section>

	<section>
		<h2>9. Cambios a esta política</h2>
		<p>
			Esta política puede actualizarse cuando sea necesario para
			reflejar cambios en nuestros servicios, procesos o requisitos
			legales. La fecha de actualización se indicará al inicio de
			esta página.
		</p>
	</section>

	<section>
		<h2>10. Contacto</h2>
		<p>
			Para consultas relacionadas con esta política de privacidad,
			puedes contactar a Estancia Comercial a través de sus canales
			oficiales de comunicación.
		</p>
	</section>
</main>
```

</div>

<style>
	:global(body) {
		margin: 0;
		background: #f7f8fa;
		color: #1f2937;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			"Segoe UI",
			sans-serif;
	}

	.pagina {
		min-height: 100vh;
		padding: 48px 20px;
		box-sizing: border-box;
	}

	.contenedor {
		width: min(860px, 100%);
		margin: 0 auto;
		padding: 48px;
		background: white;
		border-radius: 16px;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
		box-sizing: border-box;
	}

	header {
		margin-bottom: 42px;
		padding-bottom: 28px;
		border-bottom: 1px solid #e5e7eb;
	}

	.marca {
		margin-bottom: 14px;
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: #166534;
	}

	h1 {
		margin: 0 0 10px;
		font-size: clamp(30px, 5vw, 42px);
		line-height: 1.15;
		color: #111827;
	}

	.actualizacion {
		margin: 0;
		color: #6b7280;
		font-size: 14px;
	}

	section {
		margin-bottom: 32px;
	}

	h2 {
		margin: 0 0 12px;
		font-size: 20px;
		color: #111827;
	}

	p {
		margin: 0;
		font-size: 16px;
		line-height: 1.75;
		color: #4b5563;
	}

	@media (max-width: 640px) {
		.pagina {
			padding: 20px 12px;
		}

		.contenedor {
			padding: 28px 22px;
			border-radius: 12px;
		}

		header {
			margin-bottom: 32px;
		}
	}
</style>
