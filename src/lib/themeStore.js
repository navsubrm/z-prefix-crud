import { writable } from 'svelte/store';

export const theme = writable({ value: 0, label: 'Base Theme' });
