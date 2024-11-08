export function checkCapacity(
	orderWeight: number,
	vehicleCapacity: number
): boolean {
	return orderWeight <= vehicleCapacity
}
