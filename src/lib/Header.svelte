<script>
	import UserRegistration from './UserRegistration.svelte';
	import ThemeSelect from './ThemeSelect.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	let { user = $bindable() } = $props();
	let username = $state();
	let password = $state();
	let formErrors = $state({ invalidCredentials: false, dbError: false });

	let loginApiUrl = `${PUBLIC_API_URL}/user/login`;
	let logoutApiUrl = `${PUBLIC_API_URL}/user/logout`;
	let headers = {
		'content-type': 'application/json',
		'Access-Control-Allow-Credentials': 'true',
		'Access-Control-Allow-Origin': `${PUBLIC_API_URL}`
	};

	/** @param {Event} e */
	async function handleLogin(e) {
		e.preventDefault();
		const response = await fetch(loginApiUrl, {
			method: 'POST',
			credentials: 'include',
			headers,
			body: JSON.stringify({ username, password })
		});

		const user = await response.json();

		if (response.ok) window.location.href = `/?user=${user._id}`;
		if (response.status == 409) formErrors = { ...formErrors, invalidCredentials: true };
		if (response.status == 500) formErrors = { ...formErrors, dbError: true };
		password = '';
	}

	/** @param {Event} e */
	async function handleLogout(e) {
		e.preventDefault();

		const response = await fetch(logoutApiUrl, {
			method: 'GET',
			credentials: 'include',
			headers
		});

		if (response.ok) window.location.href = '/';
	}
</script>

<header>
	<div>
		<p>
			We Track Stuff{#if user?.firstName}, <span>Welcome, {user?.firstName}</span>{/if}
		</p>
		<ThemeSelect />
	</div>
	<nav>
		<ul>
			{#if user?._id}
				<li>
					<form onsubmit={handleLogout}>
						<button formaction="submit" aria-label="Logout"
							><svg
								width="800px"
								height="800px"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M22 6.62219V17.245C22 18.3579 21.2857 19.4708 20.1633 19.8754L15.0612 21.7977C14.7551 21.8988 14.449 22 14.0408 22C13.5306 22 12.9184 21.7977 12.4082 21.4942C12.2041 21.2918 11.898 21.0895 11.7959 20.8871H7.91837C6.38776 20.8871 5.06122 19.6731 5.06122 18.0544V17.0427C5.06122 16.638 5.36735 16.2333 5.87755 16.2333C6.38776 16.2333 6.69388 16.5368 6.69388 17.0427V18.0544C6.69388 18.7626 7.30612 19.2684 7.91837 19.2684H11.2857V4.69997H7.91837C7.20408 4.69997 6.69388 5.20582 6.69388 5.91401V6.9257C6.69388 7.33038 6.38776 7.73506 5.87755 7.73506C5.36735 7.73506 5.06122 7.33038 5.06122 6.9257V5.91401C5.06122 4.39646 6.28572 3.08125 7.91837 3.08125H11.7959C12 2.87891 12.2041 2.67657 12.4082 2.47423C13.2245 1.96838 14.1429 1.86721 15.0612 2.17072L20.1633 4.09295C21.1837 4.39646 22 5.50933 22 6.62219Z"
									fill="#030D45"
								/>
								<path
									d="M4.85714 14.8169C4.65306 14.8169 4.44898 14.7158 4.34694 14.6146L2.30612 12.5912C2.20408 12.49 2.20408 12.3889 2.10204 12.3889C2.10204 12.2877 2 12.1865 2 12.0854C2 11.9842 2 11.883 2.10204 11.7819C2.10204 11.6807 2.20408 11.5795 2.30612 11.5795L4.34694 9.55612C4.65306 9.25261 5.16327 9.25261 5.46939 9.55612C5.77551 9.85963 5.77551 10.3655 5.46939 10.669L4.7551 11.3772H8.93878C9.34694 11.3772 9.7551 11.6807 9.7551 12.1865C9.7551 12.6924 9.34694 12.7936 8.93878 12.7936H4.65306L5.36735 13.5017C5.67347 13.8052 5.67347 14.3111 5.36735 14.6146C5.26531 14.7158 5.06122 14.8169 4.85714 14.8169Z"
									fill="#030D45"
								/>
							</svg>Exit</button
						>
					</form>
				</li>
			{:else}
				<form onsubmit={handleLogin} class="login-form">
					<div class="flex-container">
						<div class="flex-container flex-column">
							<label for="username">Username:</label>
							<input type="text" name="name" bind:value={username} />
						</div>
						<div class="flex-container flex-column">
							<label for="password">Password: </label>
							<input type="password" name="password" bind:value={password} />
						</div>
						<div>
							<button formaction="submit" aria-label="Login">
								<svg
									width="800px"
									height="800px"
									viewBox="0 0 23 23"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									fill-rule="evenodd"
								>
									<path
										d="M20.1633 4.09295L15.0612 2.17072C14.1429 1.86721 13.2245 1.96838 12.5102 2.47423C12.2041 2.67657 12 2.87891 11.7959 3.08125H7.91837C6.38776 3.08125 5.06122 4.39646 5.06122 5.91401V6.9257C5.06122 7.33038 5.36735 7.73506 5.87755 7.73506C6.38776 7.73506 6.69388 7.33038 6.69388 6.9257V5.91401C6.69388 5.20582 7.30612 4.69997 7.91837 4.69997H11.2857V19.3696H7.91837C7.20408 19.3696 6.69388 18.7626 6.69388 18.1555V17.1439C6.69388 16.7392 6.38776 16.3345 5.87755 16.3345C5.36735 16.3345 5.06122 16.638 5.06122 17.0427V18.0544C5.06122 19.5719 6.28572 20.8871 7.91837 20.8871H11.7959C12 21.0895 12.2041 21.393 12.4082 21.4942C12.9184 21.7977 13.4286 22 14.0408 22C14.3469 22 14.7551 21.8988 15.0612 21.7977L20.1633 19.8754C21.2857 19.4708 22 18.4591 22 17.245V6.62219C22 5.50933 21.1837 4.39646 20.1633 4.09295Z"
										fill="#030D45"
									/>
									<path
										d="M6.38776 13.5017C6.08163 13.8052 6.08163 14.3111 6.38776 14.6146C6.4898 14.7158 6.69388 14.8169 6.89796 14.8169C7.10204 14.8169 7.30612 14.7158 7.40816 14.6146L9.44898 12.5912C9.55102 12.49 9.55102 12.3889 9.65306 12.3889C9.65306 12.2877 9.7551 12.1865 9.7551 12.0854C9.7551 11.9842 9.7551 11.883 9.65306 11.7819C9.65306 11.6807 9.55102 11.5795 9.44898 11.5795L7.40816 9.55612C7.10204 9.25261 6.59184 9.25261 6.28571 9.55612C5.97959 9.85963 5.97959 10.3655 6.28571 10.669L7 11.3772H2.81633C2.40816 11.3772 2 11.6807 2 12.1865C2 12.6924 2.30612 12.9959 2.81633 12.9959H7.10204L6.38776 13.5017Z"
										fill="#030D45"
									/>
								</svg>Login
							</button>
						</div>
					</div>
					{#if formErrors.invalidCredentials}
						<small class="error">Invalid credentials. Try again.</small>
					{/if}
					{#if formErrors.dbError}
						<small class="error">Something went wrong on our side. Try again.</small>
					{/if}
				</form>
				<UserRegistration />
			{/if}
		</ul>
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1em;
		background-color: var(--blue);
		color: var(--white);
	}

	header p {
		font-style: italic;
		font-size: 1.3em;
	}

	header ul {
		display: flex;
		justify-content: space-around;
		align-items: center;
		gap: 1em;
		list-style: none;
		margin-inline: 1em;
	}

	.flex-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
	}

	nav ul :global(button),
	nav ul :global(input) {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-block: 0.25em;
		padding-inline: 0.5em;
		border: none;
		background: transparent;
		font-size: 1em;
		cursor: pointer;
		color: var(--white);
	}

	nav ul :global(input[type='text']),
	nav ul :global(input[type='password']) {
		background-color: color-mix(in lab, var(--white), transparent 70%);
		border-radius: 0.5em;
	}

	nav ul :global(svg) {
		height: 28px;
		width: 28px;
		fill: var(--blue);
	}

	nav ul :global(svg path) {
		fill: var(--white);
	}

	nav ul :global(button:hover) {
		opacity: 0.8;
	}
</style>
