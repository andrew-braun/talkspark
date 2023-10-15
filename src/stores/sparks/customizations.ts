import { writable } from "svelte/store"
import type { Writable } from "svelte/store"
import type { Customizations } from "ts/flow"

export const customizations: Writable<Customizations> = writable({
	choices: [],
})

export const updateChoices = ({
	choice: choice,
	value: value,
}: {
	choice: string
	value: string | null
}) =>
	customizations.update((customizations: Customizations) => {
		return {
			...customizations,
			choices: {
				...customizations.choices,
				[choice]: value,
			},
		}
	})
