<script>
	import Sidebar from './Sidebar.svelte';
	import Topbar from './Topbar.svelte';
	import Breadcrumb from './Breadcrumb.svelte';
	import MainContent from './MainContent.svelte';
</script>

<div class="app">
	<Sidebar />

	<div class="content">
		<Topbar />

		<Breadcrumb />

		<MainContent>
			<slot />
		</MainContent>
	</div>
</div>

<style>
	.app {
		display: flex;
		min-height: 100vh;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 20px;
	}
</style>