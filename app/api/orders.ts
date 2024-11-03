import axios from 'axios'

const API_URL = 'http://localhost:4000/orders'

export const fetchOrders = async () => {
	const response = await axios.get(API_URL)
	return response.data
}

export const addOrder = async (order: any) => {
	const response = await axios.post(API_URL, order)
	return response.data
}

export const updateOrder = async (order: any) => {
	const response = await axios.put(`${API_URL}/${order.id}`, order)
	return response.data
}

export const removeOrder = async (orderId: string) => {
	const response = await axios.delete(`${API_URL}/${orderId}`)
	return response.data
}
