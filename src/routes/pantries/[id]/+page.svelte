<script lang="ts">
	import type { Pantry } from '$lib/Pantry';

	import type { PageData } from './$types';

	export let data: PageData;
	export let pantry: Pantry = data.pantry;
</script>

<main>
	<h1>{pantry.name}</h1>
</main>
