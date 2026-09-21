<!-- Usuario50432646081

Contraseña temporalEC-FdsWbTdudC -->
<script>
	import { supabase } from '$lib/supabase/client';
	import { goto } from '$app/navigation';

let telefono = $state('');
let password = $state('');
let error = $state('');
let cargando = $state(false);
	function normalizarTelefono(/** @type {string} */ valor) {
		const limpio = valor.replace(/\D/g, '');

		if (limpio.startsWith('504') && limpio.length === 11) {
			return `+${limpio}`;
		}

		if (limpio.length === 8) {
			return `+504${limpio}`;
		}

		return '';
	}

	async function iniciarSesion() {
		error = '';

		const telefonoAuth = normalizarTelefono(telefono);

		if (!telefonoAuth) {
			error = 'Escribe un número de teléfono válido.';
			return;
		}

		if (!password.trim()) {
			error = 'Escribe tu contraseña.';
			return;
		}

		cargando = true;

		try {
			const emailInterno =
	`portal-${telefonoAuth.replace(/\D/g, '')}@portal.estancia.local`;

const { data, error: authError } =
	await supabase.auth.signInWithPassword({
		email: emailInterno,
		password
	});

			if (authError) {
	console.error('ERROR SUPABASE AUTH:', authError);
	error = authError.message;
	return;
}

		const debeCambiarPassword =
	data.user?.user_metadata?.debe_cambiar_password === true;

if (debeCambiarPassword) {
	await goto('/portal/primer-acceso');
} else {
	await goto('/portal');
}
		} catch (err) {
			console.error('Error iniciando sesión:', err);

			error =
				err instanceof Error
					? err.message
					: 'No se pudo iniciar sesión.';
		} finally {
			cargando = false;
		}
	}
</script>

<svelte:head>
	<title>Acceso al portal | Estancia Comercial</title>
</svelte:head>

<div class="portal-login">
	<div class="portal-card">
		<div class="portal-header">
			<div class="portal-logo">EC</div>

			<div>
				<h1>Estancia Comercial</h1>
				<p>Portal del cliente</p>
			</div>
		</div>

		<div class="portal-body">
			<h2>Bienvenido</h2>

			<p class="intro">
				Ingresa con el teléfono y la contraseña que te proporcionamos.
			</p>

			<form onsubmit={(e) => {
				e.preventDefault();
				iniciarSesion();
			}}>
				<div class="campo">
					<label for="telefono">Teléfono</label>

					<input
						id="telefono"
						type="tel"
						bind:value={telefono}
						placeholder="32646081"
						autocomplete="tel"
					/>

					<small>
						Escribe tu número de 8 dígitos.
					</small>
				</div>

				<div class="campo">
					<label for="password">Contraseña</label>

					<input
						id="password"
						type="password"
						bind:value={password}
						placeholder="Tu contraseña"
						autocomplete="current-password"
					/>
				</div>

				{#if error}
					<div class="error">
						{error}
					</div>
				{/if}

				<button
					type="submit"
					disabled={cargando}
				>
					{cargando ? 'Ingresando...' : 'Ingresar al portal'}
				</button>
			</form>
		</div>

		<div class="portal-footer">
			Acceso privado para clientes de Estancia Comercial
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		background: #f3f5f8;
		font-family:
			Inter,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			"Segoe UI",
			sans-serif;
	}

	.portal-login {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		box-sizing: border-box;
	}

	.portal-card {
		width: min(430px, 100%);
		background: white;
		border-radius: 18px;
		overflow: hidden;
		box-shadow: 0 18px 50px rgba(0, 0, 0, 0.12);
	}

	.portal-header {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 26px 28px;
		background: #162439;
		color: white;
	}

	.portal-logo {
		width: 46px;
		height: 46px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: white;
		color: #162439;
		font-weight: 800;
		font-size: 15px;
	}

	.portal-header h1 {
		margin: 0;
		font-size: 19px;
	}

	.portal-header p {
		margin: 4px 0 0;
		font-size: 13px;
		opacity: 0.72;
	}

	.portal-body {
		padding: 30px 28px;
	}

	.portal-body h2 {
		margin: 0;
		color: #162439;
		font-size: 23px;
	}

	.intro {
		margin: 8px 0 24px;
		color: #687386;
		font-size: 13px;
		line-height: 1.5;
	}

	form {
		display: grid;
		gap: 18px;
	}

	.campo label {
		display: block;
		margin-bottom: 7px;
		font-size: 13px;
		font-weight: 600;
		color: #162439;
	}

	.campo input {
		width: 100%;
		box-sizing: border-box;
		padding: 12px 13px;
		border: 1px solid #d5dbe3;
		border-radius: 9px;
		font-size: 14px;
		outline: none;
	}

	.campo input:focus {
		border-color: #162439;
		box-shadow: 0 0 0 3px rgba(22, 36, 57, 0.08);
	}

	.campo small {
		display: block;
		margin-top: 6px;
		color: #7b8492;
		font-size: 11px;
	}

	.error {
		padding: 11px 12px;
		border-radius: 9px;
		background: #fff1f1;
		color: #a32929;
		font-size: 13px;
	}

	form button {
		width: 100%;
		border: none;
		border-radius: 9px;
		padding: 12px 16px;
		background: #162439;
		color: white;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
	}

	form button:hover {
		opacity: 0.94;
	}

	form button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.portal-footer {
		padding: 16px 28px 20px;
		border-top: 1px solid #edf0f3;
		text-align: center;
		color: #8a93a0;
		font-size: 11px;
	}
</style>

