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

import { useAppDispatch, useAppSelector } from '@/hooks'

import {
	fetchVehicles,
	toggleFavoriteVehicle,
} from '@/redux/slices/vehiclesSlice'
import {
	fetchOrders,
	calculateOptimalRoute,
	Order,
} from '@/redux/slices/ordersSlice'

import AddOrderForm from '@/components/AddOrderForm'
import VehicleSelectionDialog from '@/components/VehicleSelectionDialog'
import VehicleList from '@/components/VehicleList'
import OrderList from '@/components/OrderList'
import useDashboardHandlers from '@/hooks/useDashboardHandlers'

import {
	SortColumn,
	SortDirection,
	sortOrders,
	sortVehicles,
} from '@/utils/sortHelper'
import { createDebouncedSearch } from '@/utils/debounceHelper'

export default function DashboardPage() {
	const dispatch = useAppDispatch()
	const orders = useAppSelector((state) => state.orders.orders)
	const vehicles = useAppSelector((state) => state.vehicles.vehicles)

	const {
		handleEditOrder,
		handleRemoveOrder,
		handleAssignVehicle,
		handleVehicleSelect,
		handleSaveOrder,
		handleCompleteOrder,
		setSelectedOrder,
		selectedOrder,
		setVehicles,
	} = useDashboardHandlers()

	const [showOrderForm, setShowOrderForm] = useState(false)
	const [selectedTab, setSelectedTab] = useState(0)
	const [showVehicleModal, setShowVehicleModal] = useState(false)
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
			dispatch(fetchOrders()),
			dispatch(calculateOptimalRoute()),
			dispatch(fetchVehicles()),
		]).finally(() => {
			setLoadingOrders(false)
			setLoadingVehicles(false)
		})
	}, [dispatch])

	useEffect(() => {
		setVehicles(vehicles)
	}, [vehicles, setVehicles])

	const handleSort = useCallback((column: SortColumn) => {
		setSortColumn(column)
		setSortDirection((prevDirection) =>
			prevDirection === 'asc' ? 'desc' : 'asc'
		)
	}, [])

	const handleEditOrderWithModal = (order: Order) => {
		handleEditOrder(order)
		setShowOrderForm(true)
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

	const handleOpenVehicleModal = (order: Order) => {
		handleAssignVehicle(order)
		setShowVehicleModal(true)
	}

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
					onSelectVehicle={(vehiclePlate) => {
						handleVehicleSelect(vehiclePlate)
						setShowVehicleModal(false)
					}}
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
			) : filteredOrders.length === 0 ? (
				<Typography variant="body1" color="textSecondary" align="center" my={4}>
					No orders found for the specified destination.
				</Typography>
			) : selectedTab === 0 ? (
				<OrderList
					orders={inProgressOrders}
					onEditOrder={handleEditOrderWithModal}
					onCompleteOrder={handleCompleteOrder}
					onRemoveOrder={handleRemoveOrder}
					onAssignVehicle={handleOpenVehicleModal}
					handleSort={handleSort}
					sortColumn={sortColumn}
					sortDirection={sortDirection}
				/>
			) : (
				<OrderList
					orders={completedOrders}
					onEditOrder={handleEditOrderWithModal}
					onCompleteOrder={handleCompleteOrder}
					onRemoveOrder={handleRemoveOrder}
					onAssignVehicle={handleOpenVehicleModal}
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
					onToggleFavorite={(vehicleId) => {
						dispatch(toggleFavoriteVehicle(vehicleId))
					}}
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
