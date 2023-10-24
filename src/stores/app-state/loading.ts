import { writable } from "svelte/store"
import type { Writable } from "svelte/store"

export interface ActionState {
	loading: boolean
}

export interface LoadingStore {
	randomSparks: ActionState
	customSparks: ActionState
}

export const loadingState: Writable<LoadingStore> = writable({
	randomSparks: { loading: false },
	customSparks: { loading: false },
})

type SetLoadingState = {
	action: keyof LoadingStore
	loading: boolean
}

export function getLoadingState(action: keyof LoadingStore) {
	return loadingState.subscribe((state) => state[action].loading)
}

export function getAnyLoadingState(state: LoadingStore) {
	return Object.values(state).some((action) => action.loading)
}

export function setLoadingState({ action, loading }: SetLoadingState) {
	loadingState.update((state) => {
		state[action].loading = loading
		return state
	})
}
