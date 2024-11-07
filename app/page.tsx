'use client'

import { useEffect, useState } from 'react'
import {
	Box,
	Typography,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	TextField,
	CircularProgress,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'
import { useAppSelector, useAppDispatch } from '@/hooks'
import {
	fetchVehicles,
	toggleFavoriteVehicle,
	updateVehicle,
} from '@/redux/slices/vehiclesSlice'
import AddOrderForm from '@/components/AddOrderForm'
import VehicleSelectionDialog from '@/components/VehicleSelectionDialog'
import {
	assignOrderToVehicle,
	Order,
	removeOrder,
	calculateOptimalRoute,
	updateOrder,
} from '@/redux/slices/ordersSlice'
import VehicleList from '@/components/VehicleList'
import OrderList from '@/components/OrderList'

export type SortColumn =
	| 'id'
	| 'destination'
	| 'weight'
	| 'capacity'
	| 'availableCapacity'
	| 'favorite'
	| 'status'
type SortDirection = 'asc' | 'desc'

export default function DashboardPage() {
	const orders = useAppSelector((state) => state.orders.orders)
	const vehicles = useAppSelector((state) => state.vehicles.vehicles)
	const dispatch = useAppDispatch()

	const [showOrderForm, setShowOrderForm] = useState(false)
	const [showVehicleModal, setShowVehicleModal] = useState(false)
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [sortColumn, setSortColumn] = useState<SortColumn>('destination')
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
	const [loadingOrders, setLoadingOrders] = useState(true)
	const [loadingVehicles, setLoadingVehicles] = useState(true)

	useEffect(() => {
		const loadOrders = async () => {
			setLoadingOrders(true)
			await dispatch(calculateOptimalRoute())
			setLoadingOrders(false)
		}

		const loadVehicles = async () => {
			setLoadingVehicles(true)
			await dispatch(fetchVehicles())
			setLoadingVehicles(false)
		}

		loadOrders()
		loadVehicles()
	}, [dispatch])

	const handleEditOrder = (order: Order) => {
		setSelectedOrder(order)
		setShowOrderForm(true)
	}

	const handleRemoveOrder = (orderId: string) => {
		dispatch(removeOrder(orderId))
		toast.success('Order removed successfully!')
	}

	const handleAssignVehicle = (order: Order) => {
		setSelectedOrder(order)
		setShowVehicleModal(true)
	}

	const handleVehicleSelect = (vehicleId: string) => {
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
				toast.info('New order assigned! Check your next destination.')
				setShowVehicleModal(false)
				setSelectedOrder(null)
			} else {
				toast.error(
					`Insufficient capacity to assign order to vehicle ${vehicleId}.`
				)
			}
		}
	}

	const handleToggleFavorite = (vehicleId: string) => {
		dispatch(toggleFavoriteVehicle(vehicleId))
		toast.info(`Vehicle ${vehicleId} updated successfully!`)
	}

	const handleSort = (column: SortColumn) => {
		if (sortColumn === column) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
		} else {
			setSortColumn(column)
			setSortDirection('asc')
		}
	}

	const handleSaveOrder = (updatedOrder: Order) => {
		dispatch(updateOrder(updatedOrder))
		toast.success('Order updated successfully!')
		setShowOrderForm(false)
		setSelectedOrder(null)
	}

	const handleCompleteOrder = (orderId: string) => {
		const order = orders.find((o) => o.id === orderId)
		if (order) {
			dispatch(updateOrder({ ...order, completed: true }))
			toast.success('Order marked as complete!')
		}
	}

	const filteredOrders = orders
		.filter((order) =>
			order.destination.toLowerCase().includes(searchQuery.toLowerCase())
		)
		.sort((a, b) => {
			let comparison = 0

			if (sortColumn === 'id') {
				comparison = a.id.localeCompare(b.id)
			} else if (sortColumn === 'destination') {
				comparison = a.destination.localeCompare(b.destination)
			} else if (sortColumn === 'weight') {
				comparison = a.weight - b.weight
			} else if (sortColumn === 'status') {
				comparison = Number(a.completed) - Number(b.completed)
			}

			return sortDirection === 'asc' ? comparison : -comparison
		})

	const sortedVehicles = [...vehicles].sort((a, b) => {
		let comparison = 0
		if (sortColumn === 'capacity') {
			comparison = a.capacity - b.capacity
		} else if (sortColumn === 'availableCapacity') {
			comparison = a.availableCapacity - b.availableCapacity
		} else if (sortColumn === 'favorite') {
			comparison = a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1
		}
		return sortDirection === 'asc' ? comparison : -comparison
	})

	return (
		<Box p={3}>
			<Typography variant="h4" gutterBottom color="primary">
				Fleet Management Dashboard
			</Typography>

			<TextField
				label="Search Order (by Destination)"
				variant="outlined"
				fullWidth
				placeholder="Enter order destination..."
				sx={{ mb: 2 }}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				color="secondary"
			/>

			<Button
				variant="contained"
				color="secondary"
				sx={{ mb: 2 }}
				onClick={() => {
					setSelectedOrder(null)
					setShowOrderForm(true)
				}}
			>
				Create New Order
			</Button>

			{showOrderForm && (
				<AddOrderForm
					onClose={() => setShowOrderForm(false)}
					open={showOrderForm}
					order={selectedOrder}
					onSave={handleSaveOrder}
				/>
			)}

			<Typography variant="h5" gutterBottom color="primary">
				Orders
			</Typography>
			{loadingOrders ? (
				<Box display="flex" justifyContent="center" my={4}>
					<CircularProgress color="secondary" />
				</Box>
			) : (
				<OrderList
					orders={filteredOrders}
					onEditOrder={handleEditOrder}
					onCompleteOrder={handleCompleteOrder}
					onRemoveOrder={handleRemoveOrder}
					onAssignVehicle={handleAssignVehicle}
					handleSort={handleSort}
					sortColumn={sortColumn}
					sortDirection={sortDirection}
				/>
			)}

			<Typography variant="h5" gutterBottom color="primary">
				Vehicles
			</Typography>
			{loadingVehicles ? (
				<Box display="flex" justifyContent="center" my={4}>
					<CircularProgress color="secondary" />
				</Box>
			) : (
				<VehicleList
					vehicles={sortedVehicles}
					orders={orders}
					onToggleFavorite={handleToggleFavorite}
					handleSort={handleSort}
					sortColumn={sortColumn}
					sortDirection={sortDirection}
				/>
			)}

			<VehicleSelectionDialog
				open={showVehicleModal}
				onClose={() => setShowVehicleModal(false)}
				vehicles={vehicles}
				onSelectVehicle={handleVehicleSelect}
			/>
		</Box>
	)
}
