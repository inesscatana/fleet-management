import axiosInstance from '@/app/api/axiosInstance'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Vehicle {
	plateNumber: string
	capacity: number
	availableCapacity: number
	favorite?: boolean
}

interface VehiclesState {
	vehicles: Vehicle[]
}

const initialState: VehiclesState = {
	vehicles: [],
}

// Thunk para buscar veículos da API
export const fetchVehicles = createAsyncThunk(
	'vehicles/fetchVehicles',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get('/vehicles')
			return response.data
		} catch (error) {
			return rejectWithValue('Erro ao carregar veículos')
		}
	}
)

const vehiclesSlice = createSlice({
	name: 'vehicles',
	initialState,
	reducers: {
		addVehicle: (state, action: PayloadAction<Vehicle>) => {
			state.vehicles.push(action.payload)
		},
		updateVehicleCapacity: (
			state,
			action: PayloadAction<{ plateNumber: string; newCapacity: number }>
		) => {
			const vehicle = state.vehicles.find(
				(v) => v.plateNumber === action.payload.plateNumber
			)
			if (vehicle) {
				vehicle.availableCapacity = action.payload.newCapacity
			}
		},
		toggleFavoriteVehicle: (state, action: PayloadAction<string>) => {
			const vehicle = state.vehicles.find(
				(v) => v.plateNumber === action.payload
			)
			if (vehicle) {
				vehicle.favorite = !vehicle.favorite
			}
		},
		updateVehicle: (state, action: PayloadAction<Vehicle>) => {
			const index = state.vehicles.findIndex(
				(vehicle) => vehicle.plateNumber === action.payload.plateNumber
			)
			if (index !== -1) {
				state.vehicles[index] = action.payload
			}
		},
		removeVehicle: (state, action: PayloadAction<string>) => {
			state.vehicles = state.vehicles.filter(
				(vehicle) => vehicle.plateNumber !== action.payload
			)
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchVehicles.fulfilled, (state, action) => {
			state.vehicles = action.payload
		})
	},
})

export const {
	addVehicle,
	updateVehicleCapacity,
	toggleFavoriteVehicle,
	updateVehicle,
	removeVehicle,
} = vehiclesSlice.actions
export default vehiclesSlice.reducer
