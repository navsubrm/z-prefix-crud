<script>
	let { item } = $props();
	let short = $state(true);
</script>

<div class="flex-base flex-start"><p>{item.name}</p></div>
<div class="flex-base flex-start"><p>{item.quantity}</p></div>
<div class="flex-base flex-start">
	{#if short}
		<p>
			{item.description.substring(0, 100)}{item.description.length > 100 ? '...' : ''}
			{#if item.description.length > 100}
				<span
					><button class="description-button owner" onclick={() => (short = !short)}
						>Show More</button
					></span
				>
			{/if}
		</p>
	{:else}
		<p>
			{item.description}
			<span
				><button class="description-button owner" onclick={() => (short = !short)}>Hide More</button
				></span
			>
		</p>
	{/if}
</div>

<style>
	p {
		padding-left: 5px;
		max-width: 65ch;
		line-height: 1.25;
	}

	.description-button {
		color: color-mix(in lab, var(--blue), transparent 10%);
		text-decoration: underline;
		border: none;
		background-color: transparent;
		opacity: 0.8;
		cursor: pointer;
	}

	div:hover .description-button {
		color: var(--white);
		opacity: 1;
	}
</style>
