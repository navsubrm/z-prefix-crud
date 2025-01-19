<script>
	import { PUBLIC_API_URL } from '$env/static/public';
	import InventoryItem from '$lib/InventoryItem.svelte';
	import Loader from '$lib/Loader.svelte';
	import SearchBar from './SearchBar.svelte';

	let { user = $bindable(), list = $bindable() } = $props();
	let query = $state();
	/** @type {number | undefined} */
	let timer;
	let inventory = $state(list);
	let loading = $state(false);
	let fullInventory = $derived.by(() => {
		return list.filter((el) => el.userId !== user._id).length > 0 ? true : false;
	});

	$effect(() => {
		if (timer) clearTimeout(timer);
		if (!query || query.length == 0) return (inventory = [...list]);
		if (query)
			timer = setTimeout(() => {
				inventory = [
					...list.filter((el) => {
						if (
							el.name.toLowerCase().includes(query) ||
							el.description.toLowerCase().includes(query)
						)
							return el;
					})
				];
			}, 500);

		return list;
	});

	/** @param {string} id */
	async function fetchInventoryList(id = '') {
		loading = true;
		const response = await fetch(`${PUBLIC_API_URL}/inventory/list/${id}`, { method: 'GET' });
		const data = await response.json();
		list = [...data];
		loading = false;
	}
</script>

<section class="inventory-list">
	{#if user._id}
		<div class="inventory-select-options">
			<button
				class="inventory-option-button"
				class:active={!fullInventory}
				onclick={() => fetchInventoryList(user._id)}>My Inventory</button
			>
			<button
				class="inventory-option-button"
				class:active={fullInventory}
				onclick={() => fetchInventoryList()}>Full Inventory</button
			>
		</div>
	{/if}
	<div class="inventory-title">
		<h1>Inventory List</h1>
		<SearchBar bind:query />
	</div>
	{#if loading}
		<Loader />
	{/if}
	<div class="grid-container" class:long-grid={Object.hasOwn(user, '_id')}>
		<div class="sub-grid">
			<div>Name</div>
			<div>Quantity</div>
			<div>Description</div>
			{#if Object.hasOwn(user, '_id')}
				<div>Edit</div>
				<div>Delete</div>
			{/if}
		</div>
		{#key inventory}
			{#each inventory as item}
				<InventoryItem {item} bind:user bind:list />
			{/each}
		{/key}
	</div>
</section>

<style>
	.inventory-list {
		padding: 1em;
		width: 100%;
	}

	.inventory-title h1 {
		text-align: left;
		text-wrap: nowrap;
		color: var(--black);
		margin-inline: 1em;
	}

	.inventory-title {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-block: 0.5em;
	}

	.grid-container {
		display: grid;
		grid-template-columns: minmax(10ch, 15%) 10ch minmax(20ch, auto);
		grid-template-rows: auto;
		gap: 0.5em;
		margin-top: 1em;
	}

	.long-grid {
		grid-template-columns: minmax(10ch, 15%) 10ch minmax(20ch, auto) 3em 3em;
	}

	.sub-grid {
		display: grid;
		grid-column: 1 / -1;
		grid-template-columns: subgrid;
		grid-template-rows: auto;
		color: var(--black);
	}

	.inventory-select-options {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 0.5em;
	}

	.inventory-option-button {
		padding-block: 0.25em;
		padding-inline: 0.5em;
		background: color-mix(in lab, var(--blue), transparent 80%);
		border: solid 1px var(--blue);
		font-size: 1em;
		color: var(--black);
	}

	.active {
		background: color-mix(in lab, var(--blue), transparent 20%);
		color: var(--white);
	}
</style>
