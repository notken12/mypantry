<script lang="ts">
	import Icon from '@iconify/svelte';

	export let href = '';
</script>

<a {href}>
	<span class="material-symbols-outlined">arrow_back</span>
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

	span:hover {
		color: var(--base0D);
	}
</style>
