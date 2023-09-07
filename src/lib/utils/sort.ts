interface SortByDateArgs {
	objects: any[]
	dateField: string
}

export function sortByDate(args: SortByDateArgs) {
	const { objects, dateField } = args

	// Use the sort() method with a custom comparator function
	const sorted = objects.sort(function (a, b) {
		// Convert the 'created_at' strings to Date objects for comparison
		const dateA = new Date(a[dateField])
		const dateB = new Date(b[dateField])

		// Compare the Date objects
		if (dateA < dateB) {
			return -1 // a should come before b
		} else if (dateA > dateB) {
			return 1 // b should come before a
		} else {
			return 0 // a and b are equal
		}
	})

	return sorted
}
