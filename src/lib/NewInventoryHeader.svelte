<script>
	import { PUBLIC_API_URL } from '$env/static/public';
	let { list = $bindable(), user = $bindable() } = $props();

	/** @type { HTMLFormElement | undefined } */
	let addInventoryForm = $state();
	let keyForm = $state(false);
	let formErrors = $state({
		duplicate: false,
		userIdMissing: false,
		nameMissing: false,
		descriptionMissing: false,
		quantityMissing: false
	});

	async function handleSubmit() {
		let addAPIUrl = `${PUBLIC_API_URL}/inventory/add`;
		const formData = Object.fromEntries(new FormData(addInventoryForm));
		if (!formData.userId) return;

		const response = await fetch(addAPIUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData)
		});

		if (!response.ok) {
			const errors = await response.json();
			formErrors = { ...formErrors, ...errors };
			return console.log(errors);
		}

		const data = await response.json();

		list = [...list, data];
		keyForm = !keyForm;
	}
</script>

<section class="inventory-add">
	{#if Object.hasOwn(user, '_id')}
		<div class="flex-container flex-column flex-center">
			<h2>Add Inventory Items</h2>
			{#key keyForm}
				{#if formErrors.duplicate}
					<small class="error" style="text-align: center;"
						>You already have have an item with that name, you should update the existing item.</small
					>
				{/if}
				{#if formErrors.userIdMissing}
					<small class="error"
						>Somehow you are attempting to add an item without being logged in. Log in to update
						inventory.</small
					>
				{/if}
				<form bind:this={addInventoryForm} onsubmit={handleSubmit}>
					<input type="hidden" name="userId" value={user?._id || null} />
					<div class="flex-container flex-space-around">
						<div class="flex-container flex-column">
							<label for="name"
								>Name: {#if formErrors.nameMissing}
									<small class="error">A name is required for the item.</small>
								{/if}
							</label>
							<input type="text" name="name" autofocus />
						</div>
						<div class="flex-container flex-column">
							<label for="quantity"
								>Quantity:
								{#if formErrors.quantityMissing}
									<small class="error">A quantity is required for the item.</small>
								{/if}
							</label>

							<input type="number" name="quantity" />
						</div>
						<div class="flex-container flex-column">
							<label for="description"
								>Description:
								{#if formErrors.descriptionMissing}
									<small class="error">A description is required for the item.</small>
								{/if}
							</label>
							<textarea name="description" cols="20" rows="1"></textarea>
						</div>
					</div>

					<input type="submit" value="Add New Item to Inventory" />
				</form>
			{/key}
		</div>
	{/if}
</section>

<style>
	.inventory-add {
		padding-block: 1em;
		padding-inline: 2em;
		background-color: var(--blue);
		color: var(--white);
	}

	.flex-container {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		flex-grow: 1;
		gap: 0.5em;
	}

	.flex-column {
		flex-direction: column;
	}

	.flex-center {
		align-self: center;
	}

	.flex-space-around {
		justify-content: space-between;
	}

	h2 {
		width: 100%;
		text-align: center;
		margin-block: 0.25em;
	}

	input,
	textarea {
		--_input-height: 1.75em;
		height: var(--_input-height);
		border: solid 1px var(--white);
		font-size: 1.2em;
		margin-block: 5px;
		border-radius: 0.25em;
		width: 100%;
		padding-inline: 0.5em;
		background: none;
		cursor: pointer;
		color: var(--white);
	}

	textarea {
		padding-top: 3px;
	}

	input:focus,
	input:focus-within,
	textarea:focus,
	textarea:focus-within {
		border: solid 2px var(--white);
		background-color: color-mix(in lab, var(--white), transparent 85%);
	}

	input[type='submit'] {
		background-color: transparent;
		font-size: 1.2em;
		border: solid 1px var(--white);
		color: var(--white);
		height: calc(var(--_input-height) * 1.25);
	}

	input[type='submit']:hover {
		background-color: color-mix(in lab, var(--white), transparent 85%);
	}
</style>
