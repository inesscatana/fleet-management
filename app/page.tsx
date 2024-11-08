'use client'

import { useEffect, useState, useMemo, useCallback, Suspense } from 'react'
import {
	Box,
	Typography,
	Button,
	TextField,
	CircularProgress,
	Tabs,
	Tab,
	Badge,
} from '@mui/material'
import { toast } from 'react-toastify'
import { useAppSelector, useAppDispatch } from '@/hooks'

import {
	fetchVehicles,
	toggleFavoriteVehicle,
	updateVehicle,
} from '@/redux/slices/vehiclesSlice'
import {
	assignOrderToVehicle,
	Order,
	removeOrder,
	calculateOptimalRoute,
	fetchOrders,
	updateOrder,
	addOrder,
} from '@/redux/slices/ordersSlice'

import AddOrderForm from '@/components/AddOrderForm'
import VehicleSelectionDialog from '@/components/VehicleSelectionDialog'
import VehicleList from '@/components/VehicleList'
import OrderList from '@/components/OrderList'

import {
	SortColumn,
	SortDirection,
	sortOrders,
	sortVehicles,
} from '@/utils/sortHelper'
import { createDebouncedSearch } from '@/utils/debounceHelper'

export default function DashboardPage() {
	const orders = useAppSelector((state) => state.orders.orders)
	const vehicles = useAppSelector((state) => state.vehicles.vehicles)
	const dispatch = useAppDispatch()

	const [showOrderForm, setShowOrderForm] = useState(false)
	const [selectedTab, setSelectedTab] = useState(0)
	const [showVehicleModal, setShowVehicleModal] = useState(false)
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [sortColumn, setSortColumn] = useState<SortColumn>('destination')
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
	const [loadingOrders, setLoadingOrders] = useState(true)
	const [loadingVehicles, setLoadingVehicles] = useState(true)

	const debouncedSearch = useMemo(
		() => createDebouncedSearch(setSearchQuery),
		[]
	)

	useEffect(() => {
		setLoadingOrders(true)
		setLoadingVehicles(true)

		Promise.all([
			dispatch(fetchOrders()).then(() => dispatch(calculateOptimalRoute())),
			dispatch(fetchVehicles()),
		]).finally(() => {
			setLoadingOrders(false)
			setLoadingVehicles(false)
		})
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

	const handleSort = useCallback((column: SortColumn) => {
		setSortColumn(column)
		setSortDirection((prevDirection) =>
			prevDirection === 'asc' ? 'desc' : 'asc'
		)
	}, [])

	const handleSaveOrder = (order: Order) => {
		if (selectedOrder) {
			dispatch(updateOrder(order))
			toast.success('Order updated successfully!')
		} else {
			dispatch(addOrder(order))
			toast.success('Order created successfully!')
		}
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

	const filteredOrders = useMemo(() => {
		const filtered = orders.filter((order) =>
			order.destination.toLowerCase().includes(searchQuery.toLowerCase())
		)
		return sortOrders(filtered, sortColumn, sortDirection)
	}, [orders, searchQuery, sortColumn, sortDirection])

	const inProgressOrders = useMemo(
		() => filteredOrders.filter((order) => !order.completed),
		[filteredOrders]
	)
	const completedOrders = useMemo(
		() => filteredOrders.filter((order) => order.completed),
		[filteredOrders]
	)
	const sortedVehicles = useMemo(
		() => sortVehicles(vehicles, sortColumn, sortDirection),
		[vehicles, sortColumn, sortDirection]
	)

	const handleSearchChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			debouncedSearch(event.target.value)
		},
		[debouncedSearch]
	)

	const handleTabChange = useCallback(
		(event: React.SyntheticEvent, newValue: number) => {
			setSelectedTab(newValue)
		},
		[]
	)

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
				onChange={handleSearchChange}
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

			<Suspense fallback={<CircularProgress />}>
				{showOrderForm && (
					<AddOrderForm
						onClose={() => setShowOrderForm(false)}
						open={showOrderForm}
						order={selectedOrder}
						onSave={handleSaveOrder}
					/>
				)}

				<VehicleSelectionDialog
					open={showVehicleModal}
					onClose={() => setShowVehicleModal(false)}
					vehicles={vehicles}
					onSelectVehicle={handleVehicleSelect}
				/>
			</Suspense>

			<Typography variant="h5" gutterBottom color="primary">
				Orders
			</Typography>

			<Tabs
				value={selectedTab}
				onChange={handleTabChange}
				aria-label="Order status tabs"
			>
				<Tab
					label={
						<Badge
							color="primary"
							badgeContent={inProgressOrders.length}
							max={99}
							overlap="rectangular"
							sx={{
								'& .MuiBadge-badge': {
									fontSize: '0.7rem',
									height: '18px',
									minWidth: '18px',
								},
							}}
						>
							In Progress
						</Badge>
					}
				/>
				<Tab label="Completed" />
			</Tabs>

			{loadingOrders ? (
				<Box display="flex" justifyContent="center" my={4}>
					<CircularProgress color="secondary" />
				</Box>
			) : selectedTab === 0 ? (
				<OrderList
					orders={inProgressOrders}
					onEditOrder={handleEditOrder}
					onCompleteOrder={handleCompleteOrder}
					onRemoveOrder={handleRemoveOrder}
					onAssignVehicle={handleAssignVehicle}
					handleSort={handleSort}
					sortColumn={sortColumn}
					sortDirection={sortDirection}
				/>
			) : (
				<OrderList
					orders={completedOrders}
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
