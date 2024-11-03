import { configureStore } from '@reduxjs/toolkit'

import ordersReducer from './slices/ordersSlice'
import vehiclesReducer from './slices/vehiclesSlice'

export const store = configureStore({
	reducer: {
		orders: ordersReducer,
		vehicles: vehiclesReducer,
	},
})

// Define o tipo RootState com base na configuração do store
export type RootState = ReturnType<typeof store.getState>
// Define o tipo AppDispatch com base na configuração do store
export type AppDispatch = typeof store.dispatch

export default store
