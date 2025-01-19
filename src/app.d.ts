// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	interface Inventory {
		_id: import('mongoose').ObjectId | string;
		name: string;
		quantity: string | number;
		description: string;
		userId: string;
	}

	interface User {
		_id: import('mongoose').ObjectId | string;
		firstName: string;
		lastName: string;
		username: string;
		password: string;
	}

	interface InventoryErrors {
		invalidUser?: boolean;
		userIdMissing?: boolean;
		nameMissing: boolean;
		quantityMissing: boolean;
		descriptionMissing: boolean;
		dbError: boolean;
	}

	interface UserErrors {
		$pwMisMatch: boolean;
		firstNameMissing: boolean;
		lastNameMissing: boolean;
		usernameMissing: boolean;
		passwordMissing: boolean;
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
