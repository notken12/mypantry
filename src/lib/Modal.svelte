<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let title: string;
	export let shown: boolean = false;
	export const open = () => {
		shown = true;
	};
	const dispatch = createEventDispatcher<{ done: void }>();

	const done = () => {
		dispatch('done');
		shown = false;
	};
</script>

{#if shown}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="bg">
		<div class="wrapper">
			<header>
				<button style="visibility: hidden;">Done</button>
				<h1>{title}</h1>
				<button on:click={done}>Done</button>
			</header>
			<slot />
		</div>
	</div>
{/if}

<style>
	.bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #00000066;
		/* backdrop-filter: blur(6px); */
		display: flex;
		padding-top: 16px;
	}

	header {
		display: flex;
		justify-content: space-between;
	}

	h1 {
		font-weight: normal;
		font-size: 17px;
	}

	button {
		border: none;
		margin: -8px -6px;
		align-self: center;
	}
	.wrapper {
		background: var(--base00);
		position: fixed;
		display: flex;
		flex-direction: column;
		width: 100%;
		min-height: 100%;
		padding: 16px;
		border-radius: 8px 8px 0 0;
	}
</style>
