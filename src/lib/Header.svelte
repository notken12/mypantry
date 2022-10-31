<script lang="ts">
	import BackLink from './BackLink.svelte';

	export let href = '';
</script>

<header>
	<BackLink {href} />
	<h1><slot /></h1>
</header>
