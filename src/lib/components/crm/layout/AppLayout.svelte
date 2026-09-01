<script>
	import Sidebar from './Sidebar.svelte';
	import Topbar from './Topbar.svelte';
	import Breadcrumb from './Breadcrumb.svelte';
	import MainContent from './MainContent.svelte';
</script>

<div class="app print-layout">
	<Sidebar />

	<div class="content print-content">
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
		@media print {

		.print-layout {
			display: block !important;
			min-height: auto !important;
		}

		.print-layout > :global(*) {
			display: none !important;
		}

		.print-layout > .print-content {
			display: block !important;
			padding: 0 !important;
			margin: 0 !important;
			width: 100% !important;
		}
	}
</style>