import { useAppDispatch } from '@/hooks'
import { toast } from 'react-toastify'
import {
	assignOrderToVehicle,
	Order,
	removeOrder,
	updateOrder,
	addOrder,
} from '@/redux/slices/ordersSlice'
import { updateVehicle, Vehicle } from '@/redux/slices/vehiclesSlice'
import { useState } from 'react'

export default function useDashboardHandlers() {
	const dispatch = useAppDispatch()
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

	const handleEditOrder = (order: Order) => {
		setSelectedOrder(order)
	}

	const handleRemoveOrder = (orderId: string) => {
		dispatch(removeOrder(orderId))
		toast.success('Order removed successfully!')
	}

	const handleAssignVehicle = (order: Order) => {
		setSelectedOrder(order)
	}

	const handleVehicleSelect = (vehicleId: string, vehicles: Vehicle[]) => {
		const vehicle = vehicles.find((v) => v.plateNumber === vehicleId)

		if (vehicle && selectedOrder) {
			if (selectedOrder.weight <= vehicle.availableCapacity) {
				dispatch(
					assignOrderToVehicle({
						orderId: selectedOrder.id,
						vehiclePlate: vehicleId,
					})
				)

				const updatedVehicleCapacity = {
					...vehicle,
					availableCapacity: vehicle.availableCapacity - selectedOrder.weight,
				}
				dispatch(updateVehicle(updatedVehicleCapacity))

				toast.success(`Order successfully assigned to vehicle ${vehicleId}!`)
			} else {
				toast.error(
					`Insufficient capacity to assign order to vehicle ${vehicleId}.`
				)
			}
		}
		setSelectedOrder(null)
	}

	const handleSaveOrder = (order: Order) => {
		if (selectedOrder) {
			dispatch(updateOrder(order))
			toast.success('Order updated successfully!')
		} else {
			dispatch(addOrder(order))
			toast.success('Order created successfully!')
		}
		setSelectedOrder(null)
	}

	const handleCompleteOrder = () => {
		if (selectedOrder) {
			dispatch(updateOrder({ ...selectedOrder, completed: true }))
			toast.success('Order marked as complete!')
		} else {
			toast.error("Can't complete an order without selecting one.")
		}
	}

	return {
		handleEditOrder,
		handleRemoveOrder,
		handleAssignVehicle,
		handleVehicleSelect,
		handleSaveOrder,
		handleCompleteOrder,
		setSelectedOrder,
		selectedOrder,
	}
}
