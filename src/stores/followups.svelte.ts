import { browser } from '$app/environment';
import type { Followup } from 'ts/followup';

type FollowupsByParent = Record<string, Followup[]>;

function createParentFollowupsState(key: string) {
	let byParent = $state<FollowupsByParent>(
		browser ? (JSON.parse(localStorage.getItem(key) ?? 'null') ?? {}) : {}
	);

	$effect.root(() => {
		$effect(() => {
			if (browser) localStorage.setItem(key, JSON.stringify(byParent));
		});
	});

	return {
		getForParent(parentId: string) {
			return byParent[parentId] ?? [];
		},
		setForParent(parentId: string, followups: Followup[]) {
			byParent = { ...byParent, [parentId]: followups };
		},
		clearForParent(parentId: string) {
			const rest = { ...byParent };
			delete rest[parentId];
			byParent = rest;
		},
	};
}

function createKeptFollowupsState(key: string) {
	let items = $state<Followup[]>(
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
		isKept(id: string) {
			return items.some((followup) => followup.id === id);
		},
		keep(followup: Followup) {
			if (items.some((item) => item.id === followup.id)) return;
			items = [...items, followup];
		},
		remove(id: string) {
			items = items.filter((followup) => followup.id !== id);
		},
	};
}

export const parentFollowups = createParentFollowupsState('parent_followups');
export const keptFollowups = createKeptFollowupsState('kept_followups');
