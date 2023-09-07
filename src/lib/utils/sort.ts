interface SortByDateArgs {
	objects: any[]
	dateField: string
	direction: "ASC" | "DESC"
}

export function sortByDate(args: SortByDateArgs) {
	const { objects, dateField, direction } = args

	// Use the sort() method with a custom comparator function
	const sorted = objects.sort(function (a, b) {
		// Convert the 'created_at' strings to Date objects for comparison
		const dateA = new Date(a[dateField])
		const dateB = new Date(b[dateField])

		// Determine the sorting direction based on the 'direction' argument
		let comparison = 0

		if (dateA < dateB) {
			comparison = -1
		} else if (dateA > dateB) {
			comparison = 1
		}

		// Invert the comparison result if 'direction' is 'desc'
		if (direction === "DESC") {
			comparison = -comparison
		}

		return comparison
	})

	return sorted
}
