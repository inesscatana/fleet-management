import { Order } from '@/redux/slices/ordersSlice'
import { Vehicle } from '@/redux/slices/vehiclesSlice'

export type SortColumn =
	| 'id'
	| 'destination'
	| 'weight'
	| 'capacity'
	| 'availableCapacity'
	| 'favorite'

export type SortDirection = 'asc' | 'desc'

// Sort Orders
export const sortOrders = (
	orders: Order[],
	sortColumn: SortColumn,
	sortDirection: SortDirection
): Order[] => {
	return orders.slice().sort((a, b) => {
		const valueA = a[sortColumn as keyof Order]
		const valueB = b[sortColumn as keyof Order]

		if (valueA === undefined || valueB === undefined) return 0
		if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1
		if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1
		return 0
	})
}

// Sort Vehicles
export const sortVehicles = (
	vehicles: Vehicle[],
	sortColumn: SortColumn,
	sortDirection: SortDirection
): Vehicle[] => {
	return vehicles.slice().sort((a, b) => {
		if (sortColumn === 'capacity')
			return (a.capacity - b.capacity) * (sortDirection === 'asc' ? 1 : -1)
		if (sortColumn === 'availableCapacity')
			return (
				(a.availableCapacity - b.availableCapacity) *
				(sortDirection === 'asc' ? 1 : -1)
			)
		if (sortColumn === 'favorite')
			return (
				(a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1) *
				(sortDirection === 'asc' ? 1 : -1)
			)
		return 0
	})
}
