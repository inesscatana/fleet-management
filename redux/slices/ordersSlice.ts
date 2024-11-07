import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

import { calculateDistances } from '@/utils/hereApi'
import axiosInstance from '@/app/api/axiosInstance'
import { RootState } from '../store'

export interface Order {
	id: string
	weight: number
	destination: string
	vehiclePlate?: string
	observations?: string
	completed?: boolean
	coordinates: [number, number]
}

interface OrdersState {
	orders: Order[]
}

const initialState: OrdersState = {
	orders: [],
}

// Thunk para buscar pedidos da API
export const fetchOrders = createAsyncThunk(
	'orders/fetchOrders',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get('/orders')
			return response.data
		} catch (error) {
			return rejectWithValue('Erro ao carregar pedidos')
		}
	}
)

// Thunk para calcular a rota ideal
export const calculateOptimalRoute = createAsyncThunk(
	'orders/calculateOptimalRoute',
	async (_, { getState }) => {
		const state = getState() as RootState
		const orders = state.orders.orders.filter((order) => !order.completed)
		const startCoordinates: [number, number] = [38.71814, -9.14552] // Fintech House em Lisboa

		// Obtém as distâncias entre o ponto de início e cada pedido
		const distances = await calculateDistances(
			startCoordinates,
			orders.map((order) => order.coordinates)
		)

		// Ordena os pedidos com base nas distâncias para o ponto inicial
		const sortedOrders = [...orders].sort((a, b) => {
			const distanceA = distances.find((d) => d.id === a.id)?.distance || 0
			const distanceB = distances.find((d) => d.id === b.id)?.distance || 0
			return distanceA - distanceB
		})

		return sortedOrders
	}
)

const ordersSlice = createSlice({
	name: 'orders',
	initialState,
	reducers: {
		addOrder: (state, action: PayloadAction<Order>) => {
			state.orders.push(action.payload)
		},
		assignOrderToVehicle: (
			state,
			action: PayloadAction<{ orderId: string; vehiclePlate: string }>
		) => {
			const order = state.orders.find(
				(order) => order.id === action.payload.orderId
			)
			if (order) {
				order.vehiclePlate = action.payload.vehiclePlate
			}
		},
		updateOrderObservations: (
			state,
			action: PayloadAction<{ orderId: string; observations: string }>
		) => {
			const order = state.orders.find(
				(order) => order.id === action.payload.orderId
			)
			if (order) {
				order.observations = action.payload.observations
			}
		},
		completeOrder: (state, action: PayloadAction<string>) => {
			const order = state.orders.find((order) => order.id === action.payload)
			if (order) {
				order.completed = true
			}
		},
		updateOrder: (state, action: PayloadAction<Order>) => {
			const index = state.orders.findIndex(
				(order) => order.id === action.payload.id
			)
			if (index !== -1) {
				state.orders[index] = action.payload
			}
		},
		removeOrder: (state, action: PayloadAction<string>) => {
			state.orders = state.orders.filter((order) => order.id !== action.payload)
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchOrders.fulfilled, (state, action) => {
			state.orders = action.payload
		})
		builder.addCase(calculateOptimalRoute.fulfilled, (state, action) => {
			state.orders = action.payload
		})
	},
})

export const {
	addOrder,
	assignOrderToVehicle,
	updateOrderObservations,
	completeOrder,
	updateOrder,
	removeOrder,
} = ordersSlice.actions
export default ordersSlice.reducer
