<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase/client';
	import AppLayout from '$lib/components/crm/layout/AppLayout.svelte';

	let cargando = $state(true);
    
	onMount(() => {
		let activo = true;

		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_OUT' || !session) {
				goto('/login');
			}
		});

		async function verificarSesion() {
			const {
				data: { session }
			} = await supabase.auth.getSession();

			if (!session) {
				await goto('/login');
				return;
			}

			if (activo) {
				cargando = false;
			}
		}

		verificarSesion();

		return () => {
			activo = false;
			subscription.unsubscribe();
		};
	});
</script>

{#if !cargando}
	<AppLayout>
		<slot />
	</AppLayout>
{/if}