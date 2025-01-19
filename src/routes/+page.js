export const prerender = true;
import { PUBLIC_API_URL } from '$env/static/public';

/**
 * @typedef {Object} user
 * @property {string} _id
 * @property {string} username
 * @property {string} firstName
 * @property {string} lastName
 */

export const load = async ({ fetch }) => {
	const user = await authenticateUser();

	return {
		user,
		list:
			Object.entries(user).length > 0 ? await fetchUserInventory(user) : await fetchInventoryList(),
		theme: await getTheme()
	};

	async function getTheme() {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/user/theme`);
			const theme = await response.json();
			return JSON.parse(theme);
		} catch (err) {
			return { value: 0, label: 'Base Theme' };
		}
	}

	/**
	 * @typedef {Function} fetchInventoryList
	 * @param {user} user
	 * */
	async function fetchUserInventory(user) {
		let userListApiUrl = `${PUBLIC_API_URL}/inventory/list/${user?._id}`;
		try {
			const response = await fetch(userListApiUrl, { method: 'GET' });
			return await response.json();
		} catch (err) {
			console.log('Error from page load: ', err);
			return [];
		}
	}

	async function fetchInventoryList() {
		let fullListApiUrl = `${PUBLIC_API_URL}/inventory/list`;
		try {
			const response = await fetch(fullListApiUrl, { method: 'GET' });
			return await response.json();
		} catch (err) {
			console.log('Error from page load: ', err);
			return [];
		}
	}

	async function authenticateUser() {
		let authApiUrl = `${PUBLIC_API_URL}/user/authenticate`;
		try {
			const response = await fetch(authApiUrl, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'content-type': 'application/json',
					'Access-Control-Allow-Credentials': 'true',
					'Access-Control-Allow-Origin': `${PUBLIC_API_URL}`
				}
			});

			if (!response.ok) return {};

			return await response.json();
		} catch (err) {
			console.log(err);
			return {};
		}
	}
};
