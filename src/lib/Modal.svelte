<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let title: string;
	export let shown: boolean = false;
	export const open = () => {
		shown = true;
		hidden = false;
	};
	const dispatch = createEventDispatcher<{ done: void }>();

	export let hidden = true;

	const done = () => {
		dispatch('done');
		shown = false;
		setTimeout(() => {
			hidden = true;
		}, 200);
	};
</script>

{#if !hidden}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="bg" class:fadeout={!shown && !hidden}>
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
		background: #00000055;
		backdrop-filter: blur(8px);
		display: flex;
		/* padding-top: 16px; */
		padding: 16px;
		animation: fadein 0.2s;
		transition: opacity 0.2s;
	}

	@keyframes fadein {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes pop {
		0% {
			transform: scale(0.92);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes disappear {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		100% {
			transform: scale(0.92);
			opacity: 0.7;
		}
	}

	.fadeout {
		opacity: 0;
	}

	header {
		display: flex;
		padding: 16px;
		justify-content: space-between;
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
		animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		/* border-radius: 8px 8px 0 0; */
	}

	.fadeout .wrapper {
		animation: disappear 0.2s;
	}

	.main {
		padding: 16px;
		padding-top: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
</style>
