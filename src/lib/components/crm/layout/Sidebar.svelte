<script>
	import { page } from '$app/state';

	const menu = [
		{
			nombre: 'Dashboard',
			ruta: '/crm'
		},
		{
			nombre: 'Clientes',
			ruta: '/crm/clientes'
		},
		{
			nombre: 'Pipeline',
			ruta: '/crm/pipeline'
		},
		{
			nombre: 'Nuevo Cliente',
			ruta: '/crm/clientes/nuevo'
		}
	];
</script>


<aside class="sidebar">

	<h2>
		CRM
	</h2>


	<nav>

		{#each menu as item}

			<a 
				href={item.ruta}
				class:activo={page.url.pathname === item.ruta}
			>
				{item.nombre}
			</a>

		{/each}

	</nav>

</aside>


<style>

.sidebar {

	width: 240px;
	padding: 20px;

	background: #111827;
	color: white;

	min-height: 100vh;

}


h2 {

	margin-bottom: 30px;

}


nav {

	display:flex;
	flex-direction:column;
	gap:10px;

}


a {

	color:white;
	text-decoration:none;

	padding:12px;
	border-radius:8px;

}


a:hover,
.activo {

	background:#2563eb;

}

</style>