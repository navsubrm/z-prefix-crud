<script>
	export let height = '80px';
	export let width = '80px';
	export let color = '--blue';
</script>

<div class="loader-position">
	<div class="loader" style="--loader-height: {height}; --theme-spinner: var({color})">
		<svg {width} {height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<g data-name="Layer 2">
				<g class="loading-icon" data-name="loader">
					<rect opacity="0" />
					<path class="bar1" d="M12 2a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V3a1 1 0 0 0-1-1z" />
					<path
						class="bar2"
						d="M17 8.14a1 1 0 0 0 .69-.28l1.44-1.39A1 1 0 0 0 17.78 5l-1.44 1.42a1 1 0 0 0 0 1.41 1 1 0 0 0 .66.31z"
					/>
					<path class="bar3" d="M21 11h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2z" />
					<path
						class="bar4"
						d="M17.73 16.14a1 1 0 0 0-1.39 1.44L17.78 19a1 1 0 0 0 .69.28 1 1 0 0 0 .72-.3 1 1 0 0 0 0-1.42z"
					/>
					<path class="bar5" d="M12 18a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1z" />
					<path
						class="bar6"
						d="M6.27 16.14l-1.44 1.39a1 1 0 0 0 0 1.42 1 1 0 0 0 .72.3 1 1 0 0 0 .67-.25l1.44-1.39a1 1 0 0 0-1.39-1.44z"
					/>
					<path class="bar7" d="M6 12a1 1 0 0 0-1-1H3a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1z" />
					<path
						class="bar8"
						d="M6.22 5a1 1 0 0 0-1.39 1.47l1.44 1.39a1 1 0 0 0 .73.28 1 1 0 0 0 .72-.31 1 1 0 0 0 0-1.41z"
					/>
				</g>
			</g>
		</svg>
	</div>
</div>

<style>
	.loader-position {
		position: relative;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.loader svg {
		fill: transparent;
		height: var(--loader-height);
		width: auto;
		transform: scale(5);
		animation: rotate 3.5s infinite steps(8);
	}

	.loading-icon .bar1 {
		fill: var(--theme-spinner);
		opacity: 0;
	}
	.loading-icon .bar2 {
		fill: var(--theme-spinner);
		opacity: 0.05;
	}
	.loading-icon .bar3 {
		fill: var(--theme-spinner);
		opacity: 0.1;
	}
	.loading-icon .bar4 {
		fill: var(--theme-spinner);
		opacity: 0.2;
	}
	.loading-icon .bar5 {
		fill: var(--theme-spinner);
		opacity: 0.4;
	}
	.loading-icon .bar6 {
		fill: var(--theme-spinner);
		opacity: 0.8;
	}
	.loading-icon .bar7 {
		fill: var(--theme-spinner);
		opacity: 0.9;
	}
	.loading-icon .bar8 {
		fill: var(--theme-spinner);
		opacity: 1;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
