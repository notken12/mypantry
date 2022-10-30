<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let title: string;
	export let show: boolean = true;

	const dispatch = createEventDispatcher<{ done: void }>();

	const done = () => {
		dispatch('done');
		show = false;
	};
</script>

{#if show}
	<div class="bg">
		<div class="wrapper">
			<header>
				<h1>{title}</h1>
				<button on:click={done}>Done</button>
			</header>

			<slot />
		</div>
	</div>
{/if}
