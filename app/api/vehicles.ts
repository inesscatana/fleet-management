import axios from 'axios'

const API_URL = 'http://localhost:4000/vehicles'

export const fetchVehicles = async () => {
	const response = await axios.get(API_URL)
	return response.data
}

export const addVehicle = async (vehicle: any) => {
	const response = await axios.post(API_URL, vehicle)
	return response.data
}

export const updateVehicle = async (vehicle: any) => {
	const response = await axios.put(`${API_URL}/${vehicle.plateNumber}`, vehicle)
	return response.data
}

export const removeVehicle = async (plateNumber: string) => {
	const response = await axios.delete(`${API_URL}/${plateNumber}`)
	return response.data
}
