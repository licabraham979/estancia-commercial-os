<script>
	import { supabase } from '$lib/supabase/client';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let error = '';
	let cargando = false;

	async function iniciarSesion() {
		error = '';
		cargando = true;

		const { error: authError } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (authError) {
			error = 'Correo o contraseña incorrectos.';
			cargando = false;
			return;
		}

		await goto('/crm');
	}
</script>

<svelte:head>
	<title>Ingresar | Estancia Comercial</title>
</svelte:head>

<div class="login-container">
	<div class="login-card">
		<div class="logo">
			Estancia Comercial
		</div>

		<h1>Ingresar</h1>
		<p>Accede al CRM de Estancia Comercial</p>

		<form on:submit|preventDefault={iniciarSesion}>
			<label for="email">Correo electrónico</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				placeholder="correo@ejemplo.com"
				autocomplete="email"
				required
			/>

			<label for="password">Contraseña</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				placeholder="••••••••"
				autocomplete="current-password"
				required
			/>

			{#if error}
				<div class="error">{error}</div>
			{/if}

			<button type="submit" disabled={cargando}>
				{cargando ? 'Ingresando...' : 'Ingresar'}
			</button>
		</form>
	</div>
</div>

<style>
	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		background: #f5f7fa;
	}

	.login-card {
		width: 100%;
		max-width: 420px;
		padding: 40px;
		background: white;
		border-radius: 16px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
	}

	.logo {
		font-size: 20px;
		font-weight: 700;
		margin-bottom: 30px;
	}

	h1 {
		margin: 0 0 8px;
		font-size: 30px;
	}

	p {
		margin: 0 0 30px;
		color: #6b7280;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	label {
		font-size: 14px;
		font-weight: 600;
		margin-top: 8px;
	}

	input {
		width: 100%;
		box-sizing: border-box;
		padding: 13px 14px;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		font-size: 15px;
	}

	input:focus {
		outline: none;
		border-color: #2563eb;
	}

	button {
		margin-top: 18px;
		padding: 13px;
		border: none;
		border-radius: 8px;
		background: #111827;
		color: white;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.error {
		margin-top: 8px;
		padding: 10px;
		border-radius: 8px;
		background: #fee2e2;
		color: #991b1b;
		font-size: 14px;
	}
</style>
