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
			<div class="main">
				<slot />
			</div>
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
		backdrop-filter: blur(8px);
		display: flex;
		/* padding-top: 16px; */
		padding: 16px;
	}

	header {
		display: flex;
		padding: 16px;
		justify-content: space-between;
	}

	h1 {
		/* font-weight: normal; */
		font-size: 17px;
		background: var(--base0B);
		color: var(--base00);
		padding: 2px 6px;
		padding: 8px 10px;
		line-height: 17px;
	}

	button {
		border: none;
		/* margin: -8px -6px; */
		align-self: center;
	}
	.wrapper {
		background: var(--base00);
		display: flex;
		flex-direction: column;
		flex: 1;
		/* border-radius: 8px 8px 0 0; */
	}

	.main {
		padding: 16px;
		padding-top: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
</style>
