<script>
	import { PUBLIC_API_URL } from '$env/static/public';
	import InventoryItemDisplay from './InventoryItemDisplay.svelte';

	let { user = $bindable(), item, list = $bindable() } = $props();
	let focusInput = $state();
	let edit = $state(false);
	let descriptionInput = $state();
	let editFormName = $state(item.name);
	let editFormQuantity = $state(item.quantity);
	let editFormDescription = $state(item.description);
	let short = $state(true);
	/** @type {InventoryErrors} */
	let formErrors = $state({
		invalidUser: false,
		nameMissing: false,
		quantityMissing: false,
		descriptionMissing: false,
		dbError: false
	});

	$effect(() => {
		if (edit == true) {
			focusInput.focus();
			setTextAreaSize();
		}
	});

	async function handleUpdate() {
		if (user._id !== item.userId) return (formErrors = { ...formErrors, invalidUser: true });
		let editApiUrl = `${PUBLIC_API_URL}/inventory/edit`;
		const response = await fetch(editApiUrl, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				_id: item._id,
				userId: item.userId,
				name: editFormName,
				quantity: editFormQuantity,
				description: editFormDescription
			})
		});

		if (response.status == 500) return (formErrors = { ...formErrors, dbError: true });
		if (response.status == 200) {
			replaceArrayItem(list, item, {
				_id: item._id,
				userId: item.userId,
				name: editFormName,
				quantity: editFormQuantity,
				description: editFormDescription
			});

			short = true;
			return (edit = false);
		}

		if (response.status == 409) {
			const data = await response.json();
			formErrors = { ...formErrors, ...data };
		}
	}

	/** Replaces the current list item with the updated item.
	 * @param {Inventory[]} array
	 * @param {Inventory} item
	 * @param {Inventory} replacementItem
	 */
	function replaceArrayItem(array, item, replacementItem) {
		/** @param {Inventory} el */
		const index = array.findIndex((el) => el._id == item._id);
		array[index] = replacementItem;
	}

	async function handleDelete() {
		if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) return;
		if (user._id !== item.userId) return (formErrors = { ...formErrors, invalidUser: true });
		let deleteApiUrl = `${PUBLIC_API_URL}/inventory/delete`;

		const response = await fetch(deleteApiUrl, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ _id: item._id, userId: item.userId })
		});

		if (response.status == 200) return (list = [...list.filter((el) => el._id !== item._id)]);
		if (response.status == 500 || response.status == 400)
			return (formErrors = { ...formErrors, dbError: true });

		if (response.status == 409) {
			const data = await response.json();
			return (formErrors = { ...formErrors, ...data });
		}
	}

	function handleCancelEdit() {
		edit = !edit;
		editFormName = item.name;
		editFormQuantity = item.quantity;
		editFormDescription = item.description;
		formErrors = {
			...formErrors,
			nameMissing: false,
			quantityMissing: false,
			descriptionMissing: false,
			invalidUser: false,
			dbError: false
		};
	}

	function setTextAreaSize() {
		descriptionInput.style.height = descriptionInput.scrollHeight + 'px';
	}
</script>

{#key edit}
	<span class="form-errors" class:hide-errors={!edit}>
		{#if formErrors.invalidUser}
			<small class="error">You can only edit items you own.</small>
		{/if}
		{#if formErrors.nameMissing || formErrors.quantityMissing || formErrors.descriptionMissing}
			<small class="error">All fields are required to update the item.</small>
		{/if}
		{#if formErrors.dbError}
			<small class="error">Something went wrong on our end. Please try again.</small>
		{/if}
	</span>
{/key}

{#if edit}
	<!-- Outline item in edit mode to make it easy to see the item. -->
	<div class="sub-grid-action-header">
		<div class="flex-base flex-start">Editing: {item.name}</div>
		<div class="flex-base flex-start"></div>
		<div class="flex-base flex-start"></div>
		<div class="flex-base flex-start">Submit</div>
		<div class="flex-base flex-start">Cancel</div>
	</div>
{/if}

<div class="sub-grid" class:sub-grid-no-edit={!edit} class:active-edit={edit}>
	{#if !edit}
		<InventoryItemDisplay {item} />
	{:else}
		<!-- Start item edit: -->

		<div class="flex-base flex-start">
			<input type="text" name="name" class="name-input" bind:value={editFormName} />
		</div>
		<div class="flex-base flex-start">
			<input
				type="text"
				name="quantity"
				class="quantity-input"
				bind:value={editFormQuantity}
				bind:this={focusInput}
			/>
		</div>
		<div class="flex-base flex-start">
			<textarea
				name="description"
				bind:value={editFormDescription}
				bind:this={descriptionInput}
				oninput={setTextAreaSize}
			></textarea>
		</div>
	{/if}

	<!-- Check if user is logged in and display edit options. -->

	{#if Object.hasOwn(user, '_id')}
		<!-- Check if item belongs to use and only allow edit where user and item match. -->
		{#if !edit}
			<div class="button flex-base flex-center">
				<button
					class="edit-button"
					class:owner={item?.userId == user?._id}
					onclick={() => (edit = !edit)}
					title="Edit Item"
					aria-label="Edit Item"
				>
					<svg
						class="edit-svg"
						width="800px"
						height="800px"
						viewBox="0 0 16 16"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
					>
						<g fill="#000000">
							<path
								fill-rule="evenodd"
								d="M11.436 1.005A1.75 1.75 0 0113.902.79l.702.589a1.75 1.75 0 01.216 2.465l-5.704 6.798a4.75 4.75 0 01-1.497 1.187l-2.572 1.299a.75.75 0 01-1.056-.886l.833-2.759a4.75 4.75 0 01.908-1.68l5.704-6.798zm1.502.934a.25.25 0 00-.353.03l-.53.633 1.082.914.534-.636a.25.25 0 00-.031-.352l-.703-.59zm-.765 2.726l-1.082-.914-4.21 5.016a3.25 3.25 0 00-.621 1.15L5.933 11l1.01-.51a3.249 3.249 0 001.024-.812l4.206-5.013z"
								clip-rule="evenodd"
							/>

							<path
								d="M3.25 3.5a.75.75 0 00-.75.75v9.5c0 .414.336.75.75.75h9.5a.75.75 0 00.75-.75V9A.75.75 0 0115 9v4.75A2.25 2.25 0 0112.75 16h-9.5A2.25 2.25 0 011 13.75v-9.5A2.25 2.25 0 013.25 2H6a.75.75 0 010 1.5H3.25z"
							/>
						</g>
					</svg>
				</button>
			</div>
			<div class="button flex-base flex-center" style="width: 2em;">
				<button
					class="delete-button"
					class:owner={item.userId == user._id}
					title="Delete Item"
					aria-label="Delete Item"
					onclick={handleDelete}
					><svg
						class="delete-svg"
						version="1.1"
						id="Layer_1"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						x="0px"
						y="0px"
						viewBox="0 0 284.011 284.011"
						style="enable-background:new 0 0 284.011 284.011;"
						xml:space="preserve"
					>
						<g>
							<g>
								<path
									d="M235.732,66.214l-28.006-13.301l1.452-3.057c6.354-13.379,0.639-29.434-12.74-35.789L172.316,2.611
				   c-6.48-3.079-13.771-3.447-20.532-1.042c-6.76,2.406-12.178,7.301-15.256,13.782l-1.452,3.057L107.07,5.106
				   c-14.653-6.958-32.239-0.698-39.2,13.955L60.7,34.155c-1.138,2.396-1.277,5.146-0.388,7.644c0.89,2.499,2.735,4.542,5.131,5.68
				   l74.218,35.25h-98.18c-2.797,0-5.465,1.171-7.358,3.229c-1.894,2.059-2.839,4.815-2.607,7.602l13.143,157.706
				   c1.53,18.362,17.162,32.745,35.588,32.745h73.54c18.425,0,34.057-14.383,35.587-32.745l11.618-139.408l28.205,13.396
				   c1.385,0.658,2.845,0.969,4.283,0.969c3.74,0,7.328-2.108,9.04-5.712l7.169-15.093C256.646,90.761,250.386,73.175,235.732,66.214z
					M154.594,23.931c0.786-1.655,2.17-2.905,3.896-3.521c1.729-0.614,3.59-0.521,5.245,0.267l24.121,11.455
				   c3.418,1.624,4.878,5.726,3.255,9.144l-1.452,3.057l-36.518-17.344L154.594,23.931z M169.441,249.604
				   c-0.673,8.077-7.55,14.405-15.655,14.405h-73.54c-8.106,0-14.983-6.328-15.656-14.405L52.35,102.728h129.332L169.441,249.604z
					M231.62,96.835l-2.878,6.06L83.057,33.701l2.879-6.061c2.229-4.695,7.863-6.698,12.554-4.469l128.661,61.108
				   C231.845,86.509,233.85,92.142,231.62,96.835z"
								/>
							</g>
						</g>
					</svg></button
				>
			</div>
		{:else}
			<!-- When editing, display submit and cancel buttons. -->
			<div class="button flex-base flex-center">
				<button
					class="submit-button"
					class:owner={item?.userId == user?._id}
					onclick={handleUpdate}
					title="Save Edit"
					aria-label="Save Edit"
				>
					<svg
						id="save-item-edit"
						width="800px"
						height="800px"
						viewBox="0 0 1024 1024"
						class="icon"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						><path
							d="M905.92 237.76a32 32 0 0 0-52.48 36.48A416 416 0 1 1 96 512a418.56 418.56 0 0 1 297.28-398.72 32 32 0 1 0-18.24-61.44A480 480 0 1 0 992 512a477.12 477.12 0 0 0-86.08-274.24z"
							fill="#231815"
						/><path
							d="M630.72 113.28A413.76 413.76 0 0 1 768 185.28a32 32 0 0 0 39.68-50.24 476.8 476.8 0 0 0-160-83.2 32 32 0 0 0-18.24 61.44zM489.28 86.72a36.8 36.8 0 0 0 10.56 6.72 30.08 30.08 0 0 0 24.32 0 37.12 37.12 0 0 0 10.56-6.72A32 32 0 0 0 544 64a33.6 33.6 0 0 0-9.28-22.72A32 32 0 0 0 505.6 32a20.8 20.8 0 0 0-5.76 1.92 23.68 23.68 0 0 0-5.76 2.88l-4.8 3.84a32 32 0 0 0-6.72 10.56A32 32 0 0 0 480 64a32 32 0 0 0 2.56 12.16 37.12 37.12 0 0 0 6.72 10.56zM230.08 467.84a36.48 36.48 0 0 0 0 51.84L413.12 704a36.48 36.48 0 0 0 51.84 0l328.96-330.56A36.48 36.48 0 0 0 742.08 320l-303.36 303.36-156.8-155.52a36.8 36.8 0 0 0-51.84 0z"
							fill="#231815"
						/></svg
					>
				</button>
			</div>
			<div class="button flex-base flex-center" style="width: 2em;">
				<button
					class="cancel-svg"
					class:owner={item.userId == user._id}
					onclick={handleCancelEdit}
					title="Cancel Edit"
					aria-label="Cancel Edit"
					><svg
						id="cancel-edit-svg"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						x="0px"
						y="0px"
						viewBox="0 0 252 252"
						style="enable-background:new 0 0 252 252;"
						xml:space="preserve"
					>
						<g>
							<path
								d="M126,0C56.523,0,0,56.523,0,126s56.523,126,126,126s126-56.523,126-126S195.477,0,126,0z M126,234
					   c-59.551,0-108-48.449-108-108S66.449,18,126,18s108,48.449,108,108S185.551,234,126,234z"
							/>
							<path
								d="M164.612,87.388c-3.515-3.515-9.213-3.515-12.728,0L126,113.272l-25.885-25.885c-3.515-3.515-9.213-3.515-12.728,0
					   c-3.515,3.515-3.515,9.213,0,12.728L113.272,126l-25.885,25.885c-3.515,3.515-3.515,9.213,0,12.728
					   c1.757,1.757,4.061,2.636,6.364,2.636s4.606-0.879,6.364-2.636L126,138.728l25.885,25.885c1.757,1.757,4.061,2.636,6.364,2.636
					   s4.606-0.879,6.364-2.636c3.515-3.515,3.515-9.213,0-12.728L138.728,126l25.885-25.885
					   C168.127,96.601,168.127,90.902,164.612,87.388z"
							/>
						</g>
					</svg></button
				>
			</div>
		{/if}
	{/if}
</div>

{#if edit}
	<!-- Outline item in edit mode to make it easy to see the item. -->

	<div class="sub-grid-action-header">
		<div class="flex-base flex-start">Editing: {item.name}</div>
		<div class="flex-base flex-start"></div>
		<div class="flex-base flex-start"></div>
		<div class="flex-base flex-start"></div>
		<div class="flex-base flex-start"></div>
	</div>
{/if}

<style>
	.sub-grid,
	.sub-grid-action-header {
		display: grid;
		grid-column: 1 / -1;
		grid-template-columns: subgrid;
		grid-template-rows: auto;
	}

	.sub-grid {
		margin-block: 0.25em;
		background-color: color-mix(in lab, var(--blue), transparent 70%);
		border-radius: 0.25em;
		padding-block: 0.25em;
		padding-inline: 0.25em;
		min-height: 40px;
		color: var(--black);
	}

	.sub-grid-action-header {
		background: linear-gradient(
			to left,
			color-mix(in lab, var(--red), transparent 70%),
			var(--red)
		);
		color: var(--black);
	}

	.sub-grid-no-edit {
		padding-block: 0.5em;
		padding-inline: 1em;
	}

	.flex-base {
		display: flex;
		align-items: center;
	}

	.flex-start {
		justify-content: flex-start;
	}

	.flex-center {
		justify-content: center;
	}

	.button {
		display: flex;
		align-items: center;
	}

	button {
		pointer-events: none;
		border: none;
		background-color: transparent;
		opacity: 0.3;
		cursor: pointer;
	}

	.owner {
		pointer-events: all;
		opacity: 1;
	}

	svg {
		height: 2em;
		width: 2em;
	}

	.edit-svg g {
		fill: var(--blue);
	}

	.delete-svg,
	.cancel-svg {
		fill: var(--red);
	}

	#save-item-edit path {
		fill: var(--green);
	}

	input,
	textarea {
		width: 100%;
		height: 100%;
		font-size: 0.99em;
		background: transparent;
		outline: none;
		border: none; /* solid 1px var(--white); */
		color: var(--white);
		margin: 0;
		padding-left: 5px;
		padding-right: 0;
		padding-block: 0;
		border-radius: 0.25em;
	}

	/* Active changes. */

	input:focus,
	input:focus-within,
	input:hover,
	textarea:hover,
	textarea:focus,
	textarea:focus-within,
	.active-edit input,
	.active-edit textarea {
		background-color: color-mix(in lab, var(--white), transparent 75%);
	}

	.sub-grid:hover .edit-svg g,
	.active-edit .edit-svg g {
		fill: var(--white);
	}

	.sub-grid:hover,
	.active-edit {
		background-color: color-mix(in lab, var(--blue), transparent 0%);
		color: var(--white);
	}

	.name-input {
		padding-left: 10px;
		max-width: 19ch;
	}

	.quantity-input {
		max-width: 5ch;
	}

	textarea {
		padding-top: 0.4em;
		min-height: auto;
		resize: none;
	}

	.hide-errors {
		display: none;
	}
</style>
