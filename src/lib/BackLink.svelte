<script lang="ts">
	import Icon from '@iconify/svelte';

	export let href = '';
</script>

<a {href}>
	<Icon icon="material-symbols:arrow-back" width="17" height="17" color="var(--base00)!important" />
	<slot />
</a>

<style>
	a {
		color: var(--base05);
		text-decoration: none;
		display: inline-flex;
		gap: 16px;
		align-items: center;
	}
</style>
