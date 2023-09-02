import { browser } from "$app/environment"

export function toLocalStorage(store: any, storageKey: string) {
	if (browser) {
		store.subscribe((value: any) => {
			let storageValue =
				typeof value === "object" ? JSON.stringify(value) : value

			window.localStorage.setItem(storageKey, storageValue)
		})
	}
}

export function fromLocalStorage(storageKey: string, fallbackValue: any) {
	if (browser) {
		const storedValue = window.localStorage.getItem(storageKey)

		if (storedValue !== "undefined" && storedValue !== null) {
			return typeof fallbackValue === "object"
				? JSON.parse(storedValue)
				: storedValue
		}
	}

	return fallbackValue
}
