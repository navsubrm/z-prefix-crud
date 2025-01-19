<script>
	import Header from '$lib/Header.svelte';
	import NewInventoryHeader from '$lib/NewInventoryHeader.svelte';
	import Inventory from '$lib/Inventory.svelte';
	import { theme } from '$lib/themeStore';

	export const { data } = $props();

	/** @type {Inventory[] | []} */
	let list = $state(data.list);

	/** @type {User | {}} */
	let user = $state(data.user);

	/** @type {{ value: number, label: string }}*/
	$theme = data.theme;
</script>

<main
	class:base-theme={$theme.value == 0}
	class:mid-dark-blue-theme={$theme.value == 1}
	class:brown-yellow-theme={$theme.value == 2}
	class:yellow-green-theme={$theme.value == 3}
	class:dark-yellow-theme={$theme.value == 4}
>
	<div class="container">
		<Header bind:user />
		<NewInventoryHeader bind:user bind:list />
		<Inventory bind:user bind:list />
	</div>
</main>

<style>
	main {
		padding: 4em;
	}

	.container {
		border: solid 1px var(--blue);
		border-radius: 0.5em;
		overflow: hidden;
	}
</style>
