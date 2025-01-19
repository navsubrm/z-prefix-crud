<script>
	let { query = $bindable() } = $props();
</script>

<span>
	<input
		type="text"
		name="search-value"
		placeholder="Search Item by Name"
		autoComplete="on"
		bind:value={query}
	/>
	<div class="buttons">
		{#if query == '' || !query}
			<button aria-label="Search Input">
				Search
				<svg
					version="1.1"
					id="Capa_1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					x="0px"
					y="0px"
					fill="inherit"
					height="30px"
					width="30px"
					viewBox="0 0 286.522 286.522"
					style="enable-background:new 0 0 286.522 286.522;"
					xml:space="preserve"
				>
					<g>
						<path
							d="M257.926,166.892c38.128-38.128,38.128-100.168,0-138.296s-100.168-38.128-138.296,0
		c-31.035,31.035-36.806,77.912-17.318,114.841L2.929,242.821c-3.905,3.905-3.905,10.237,0,14.142l26.63,26.63
		c3.905,3.905,10.237,3.905,14.142,0l99.383-99.383C180.014,203.698,226.891,197.927,257.926,166.892z M36.63,262.38l-12.488-12.488
		l89.529-89.529c1.872,2.243,3.854,4.424,5.959,6.529s4.287,4.087,6.529,5.959L36.63,262.38z M133.772,152.75
		c-30.33-30.33-30.33-79.681,0-110.012s79.681-30.33,110.012,0s30.33,79.681,0,110.012S164.103,183.08,133.772,152.75z"
						/>
						<path
							d="M235.447,51.075c-25.733-25.733-67.605-25.733-93.338,0s-25.733,67.605,0,93.338s67.605,25.733,93.338,0
		S261.181,76.809,235.447,51.075z M156.251,130.271c-17.935-17.935-17.935-47.119,0-65.054s47.119-17.935,65.054,0
		s17.935,47.119,0,65.054S174.187,148.206,156.251,130.271z"
						/>
						<path
							d="M213.527,72.995c-13.646-13.646-35.851-13.646-49.497,0c-3.905,3.905-3.905,10.237,0,14.142
		c3.905,3.905,10.237,3.905,14.142,0c5.848-5.848,15.365-5.848,21.213,0c3.905,3.905,10.237,3.905,14.142,0
		C217.432,83.232,217.432,76.901,213.527,72.995z"
						/>
					</g>
				</svg>
			</button>
		{:else}
			<button onclick={() => (query = '')}
				>Clear
				<svg
					height="30px"
					width="30px"
					version="1.1"
					id="Capa_1"
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
				</svg>
			</button>
		{/if}
	</div>
</span>

<style>
	span {
		--_font-size: 1em;
		--_button-color: var(--blue);
		position: relative;
		display: flex;
		justify-content: center;
		align-items: var(--_input-alignment, center);
		margin-inline: auto;
		height: 40px;
		width: 100%;
		border: solid 1px var(--_button-color, var(--blue));
		border-radius: 0.25em;
		background: transparent;
		color: var(--blue);
	}

	span:focus-within,
	input:focus-within {
		outline: none;
		border: solid 2px var(--blue);
		background-color: color-mix(in lab, var(--blue), transparent 85%);
	}

	input {
		background: transparent;
		color: var(--white);
		padding: 10px;
		border: solid 1px var(--_button-color, var(--blue));
		border-radius: 0.25em;
		cursor: pointer;
		font-size: var(--_font-size);
	}

	input[type='text'] {
		width: 100%;
		height: 100%;
		padding-inline: 15px 38px;
		border-radius: 0.25em;
		border: none;
	}

	input[type='text']:focus,
	input[type='text']:focus-within {
		color: var(--black);
	}

	input[type='text']::placeholder {
		color: var(--black);
	}

	input[type='text']:focus::placeholder,
	input[type='text']:focus-within::placeholder,
	input[type='text']:focus ~ *,
	input[type='text']:focus-within ~ * {
		color: var(--black);
		fill: var(--_button-color, var(--blue));
	}

	.buttons {
		position: absolute;
		right: 7px;
		top: 3px;
		color: var(--black);
		fill: var(--_button-color, var(--blue));
	}

	.buttons > * {
		background: none;
		border: none;
		color: var(--black);
		cursor: pointer;
		font-size: 1em;
	}

	.buttons > *:hover,
	input:hover {
		color: var(--blue);
	}

	input[type='text']:focus ~ .buttons > *,
	input[type='text']:focus-within ~ .buttons > * {
		color: var(--black);
	}

	input[type='text']:focus ~ .buttons > *:hover,
	input[type='text']:focus-within ~ .buttons > *:hover {
		color: color-mix(in lab, var(--_button-color, var(--blue)), var(--white) 20%);
	}
</style>
