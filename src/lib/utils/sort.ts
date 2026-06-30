interface SortByDateArgs<T> {
	objects: T[];
	dateField: keyof T & string;
	direction: 'ASC' | 'DESC';
}

export function sortByDate<T>(args: SortByDateArgs<T>) {
	const { objects, dateField, direction } = args;

	const sorted = [...objects].sort(function (a, b) {
		const dateA = new Date(a[dateField] as string | number | Date);
		const dateB = new Date(b[dateField] as string | number | Date);

		let comparison = 0;

		if (dateA < dateB) {
			comparison = -1;
		} else if (dateA > dateB) {
			comparison = 1;
		}

		if (direction === 'DESC') {
			comparison = -comparison;
		}

		return comparison;
	});

	return sorted;
}
