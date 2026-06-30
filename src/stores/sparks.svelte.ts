import { browser } from '$app/environment';
import type { SparkData } from 'ts/sparks';

function createSparksState(key: string) {
	let items = $state<SparkData[]>(
		browser ? (JSON.parse(localStorage.getItem(key) ?? 'null') ?? []) : []
	);

	$effect.root(() => {
		$effect(() => {
			if (browser) localStorage.setItem(key, JSON.stringify(items));
		});
	});

	return {
		get items() {
			return items;
		},
		add(newItems: SparkData[]) {
			items = [...items, ...newItems];
		},
		remove(id: string) {
			items = items.filter((s) => s.id !== id);
		},
		clear() {
			items = [];
		},
	};
}

export const generatedSparks = createSparksState('all_sparks');
export const savedSparks = createSparksState('saved_sparks');
