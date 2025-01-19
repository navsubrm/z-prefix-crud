<script>
	import { PUBLIC_API_URL } from '$env/static/public';
	import Select from 'svelte-select';
	import { theme } from './themeStore';

	async function handleTheme(e) {
		$theme = e.detail;
		if (e.type == 'clear') $theme = { value: 0, label: 'Base Theme' };

		const res = await fetch(`${PUBLIC_API_URL}/user/theme`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'content-type': 'application/json',
				'Access-Control-Allow-Credentials': 'true',
				'Access-Control-Allow-Origin': `${PUBLIC_API_URL}`
			},
			body: JSON.stringify({ ...$theme })
		});
	}
</script>

<div class="select-container">
	<label for="theme-select">Select Theme: </label>
	<Select
		name="theme-select"
		on:change={handleTheme}
		on:clear={handleTheme}
		items={[
			{ value: 0, label: 'Base Theme' },
			{ value: 1, label: 'Mid Blue' },
			{ value: 2, label: 'Brown Yellow' },
			{ value: 3, label: 'Yellow Green' },
			{ value: 4, label: 'Dark Yellow' }
		]}
		value={$theme}
	/>
</div>

<style>
	.select-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1em;
		width: 100%;
		max-width: 400px;
		min-width: 30ch;
		--height: 2em;
		--background: color-mix(in lab, transparent, var(--white) 20%);
		--margin: 5px;
		--border: solid 1px var(--white);
		--border-hover: solid 2px var(--white);
		--border-focused: solid 2px var(--white);
		--chevron-color: var(--white);
		--font-size: var(--_basic-form-styles-font-size, 1em);
		--padding: 0 5px;
		--item-color: var(--blue);
		--selected-item-color: var(--white);
		--item-is-active-bg: var(--blue);
		--item-hover-color: var(--white);
		--item-hover-bg: var(--blue);
		--clear-icon-color: var(--white);
		--placeholder-color: var(--white);
		--placeholder-opacity: 0.9;
		--multi-item-bg: var(--blue);
		--multi-item-border-radius: 0.25em;
	}

	.select-container label {
		text-wrap: nowrap;
	}
</style>
