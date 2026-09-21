<script>
	import { supabase } from '$lib/supabase/client';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let nuevaPassword = $state('');
	let confirmarPassword = $state('');
	let error = $state('');
	let cargando = $state(true);
	let guardando = $state(false);

	onMount(async () => {
		const {
			data: { session }
		} = await supabase.auth.getSession();

		if (!session) {
			await goto('/portal/login');
			return;
		}

		const debeCambiar =
			session.user?.user_metadata?.debe_cambiar_password === true;

		if (!debeCambiar) {
			await goto('/portal');
			return;
		}

		cargando = false;
	});

	async function establecerPassword() {
		error = '';

		if (nuevaPassword.length < 8) {
			error = 'La contraseña debe tener al menos 8 caracteres.';
			return;
		}

		if (nuevaPassword !== confirmarPassword) {
			error = 'Las contraseñas no coinciden.';
			return;
		}

		guardando = true;

		try {
			const { error: updateError } =
				await supabase.auth.updateUser({
					password: nuevaPassword,
					data: {
						debe_cambiar_password: false
					}
				});

			if (updateError) {
				throw updateError;
			}

			await goto('/portal');
		} catch (err) {
			console.error(
				'Error estableciendo contraseña:',
				err
			);

			error =
				err instanceof Error
					? err.message
					: 'No se pudo establecer la contraseña.';
		} finally {
			guardando = false;
		}
	}
</script>

<svelte:head>
	<title>Primer acceso | Estancia Comercial</title>
</svelte:head>

{#if cargando}
	<div class="loading">
		<span>Preparando tu acceso...</span>
	</div>
{:else}
	<main class="contenedor">
		<section class="card">
			<div class="marca">ESTANCIA COMERCIAL</div>

			<h1>Bienvenido a tu portal</h1>

			<p class="intro">
				Este es tu primer acceso. Crea una contraseña personal
				para proteger tu información.
			</p>

			<form onsubmit={(event) => {
				event.preventDefault();
				establecerPassword();
			}}>
				<label for="password">
					Nueva contraseña
				</label>

				<input
					id="password"
					type="password"
					bind:value={nuevaPassword}
					placeholder="Mínimo 8 caracteres"
					autocomplete="new-password"
				/>

				<label for="confirmar">
					Confirmar contraseña
				</label>

				<input
					id="confirmar"
					type="password"
					bind:value={confirmarPassword}
					placeholder="Repite tu contraseña"
					autocomplete="new-password"
				/>

				{#if error}
					<div class="error">
						{error}
					</div>
				{/if}

				<button
					type="submit"
					disabled={guardando}
				>
					{guardando
						? 'Guardando...'
						: 'Establecer mi contraseña'}
				</button>
			</form>
		</section>
	</main>
{/if}

<style>
	.loading {
		min-height: 100vh;
		display: grid;
		place-items: center;
		color: #666;
		font-family: system-ui, sans-serif;
	}

	.contenedor {
		min-height: 100vh;
		display: grid;
		place-items: center;
		padding: 24px;
		background: #f5f6f8;
		font-family: system-ui, sans-serif;
	}

	.card {
		width: min(440px, 100%);
		padding: 36px;
		background: white;
		border-radius: 18px;
		box-shadow: 0 8px 35px rgb(0 0 0 / 8%);
	}

	.marca {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: #777;
		margin-bottom: 18px;
	}

	h1 {
		margin: 0 0 12px;
		font-size: 28px;
	}

	.intro {
		margin: 0 0 28px;
		line-height: 1.5;
		color: #666;
	}

	form {
		display: grid;
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
		border: 1px solid #d8dce2;
		border-radius: 9px;
		font-size: 15px;
	}

	input:focus {
		outline: none;
		border-color: #777;
	}

	button {
		margin-top: 14px;
		padding: 14px;
		border: 0;
		border-radius: 9px;
		background: #111;
		color: white;
		font-weight: 700;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.error {
		margin-top: 8px;
		padding: 12px;
		border-radius: 8px;
		background: #fff0f0;
		color: #a33;
		font-size: 14px;
	}
</style>

