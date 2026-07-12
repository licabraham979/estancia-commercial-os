<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/theme.css';import '$lib/styles/typography.css';


	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
