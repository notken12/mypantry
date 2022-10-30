<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let title: string;
	export let shown: boolean = false;
	export const open = () => {
		shown = true;
	}
	const dispatch = createEventDispatcher<{ done: void }>();

	const done = () => {
		dispatch('done');
		shown = false;
	};
</script>

{#if shown}
	<div class="bg">
		<div class="wrapper">
			<header>
				<h1>{title}</h1>
				
			<slot />
				<button on:click={done}>Done</button>
			</header>

		</div>
	</div>
{/if}
<style>
	.bg {
		position:fixed;
		top:0;
		left:0;
		width:100vw;
		height:100vh;
		background:#000000aa;
	}
	.wrapper {
		background:black;
		position:fixed;
		top:25vw;
		left:25vh;
		width:25vw;
	}
</style>
