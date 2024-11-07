import axios from 'axios'

const HERE_API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY
const BASE_URL = 'https://router.hereapi.com/v8/routes'

interface DistanceResult {
	id: string
	distance: number
	duration: number
}

export const calculateDistances = async (
	startCoordinates: [number, number],
	destinations: Array<[number, number]>
): Promise<DistanceResult[]> => {
	if (!HERE_API_KEY) throw new Error('HERE API Key is not defined')

	const distanceResults: DistanceResult[] = []
	for (const [index, coords] of destinations.entries()) {
		const url = `${BASE_URL}?transportMode=car&origin=${startCoordinates[0]},${startCoordinates[1]}&destination=${coords[0]},${coords[1]}&return=summary&apikey=${HERE_API_KEY}`

		try {
			const response = await axios.get(url)
			const summary = response.data.routes[0].sections[0].summary

			distanceResults.push({
				id: index.toString(),
				distance: summary.length,
				duration: summary.duration,
			})
		} catch (error) {
			console.error('Erro ao buscar distâncias na HERE API', error)
			throw error
		}
	}

	return distanceResults
}
