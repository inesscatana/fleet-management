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
	sortOrdersByDistance,
	updateOrder,
} from '@/redux/slices/ordersSlice'

type SortColumn =
	| 'id'
	| 'destination'
	| 'weight'
	| 'capacity'
	| 'availableCapacity'
	| 'favorite'
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
			await dispatch(sortOrdersByDistance())
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
				<TableContainer component={Paper} sx={{ mb: 4 }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell
									onClick={() => handleSort('id')}
									style={{ cursor: 'pointer', fontWeight: 'bold' }}
								>
									ID{' '}
									{sortColumn === 'id'
										? sortDirection === 'asc'
											? '↑'
											: '↓'
										: ''}
								</TableCell>
								<TableCell
									onClick={() => handleSort('destination')}
									style={{ cursor: 'pointer', fontWeight: 'bold' }}
								>
									Destination{' '}
									{sortColumn === 'destination'
										? sortDirection === 'asc'
											? '↑'
											: '↓'
										: ''}
								</TableCell>
								<TableCell
									onClick={() => handleSort('weight')}
									style={{ cursor: 'pointer', fontWeight: 'bold' }}
								>
									Weight (kg){' '}
									{sortColumn === 'weight'
										? sortDirection === 'asc'
											? '↑'
											: '↓'
										: ''}
								</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Notes</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredOrders.map((order) => (
								<TableRow key={order.id}>
									<TableCell>{order.id}</TableCell>
									<TableCell>{order.destination}</TableCell>
									<TableCell>{order.weight}</TableCell>
									<TableCell>{order.observations || 'N/A'}</TableCell>
									<TableCell>
										<IconButton
											onClick={() => handleEditOrder(order)}
											color="primary"
										>
											<EditIcon />
										</IconButton>
										<IconButton
											onClick={() => handleRemoveOrder(order.id)}
											color="error"
										>
											<DeleteIcon />
										</IconButton>
										<Button
											color="primary"
											onClick={() => handleAssignVehicle(order)}
										>
											Assign Vehicle
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			<Typography variant="h5" gutterBottom color="primary">
				Vehicles
			</Typography>
			{loadingVehicles ? (
				<Box display="flex" justifyContent="center" my={4}>
					<CircularProgress color="secondary" />
				</Box>
			) : (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 'bold' }}>Plate</TableCell>
								<TableCell
									onClick={() => handleSort('capacity')}
									style={{ cursor: 'pointer', fontWeight: 'bold' }}
								>
									Max Capacity (kg){' '}
									{sortColumn === 'capacity'
										? sortDirection === 'asc'
											? '↑'
											: '↓'
										: ''}
								</TableCell>
								<TableCell
									onClick={() => handleSort('availableCapacity')}
									style={{ cursor: 'pointer', fontWeight: 'bold' }}
								>
									Available Capacity (kg){' '}
									{sortColumn === 'availableCapacity'
										? sortDirection === 'asc'
											? '↑'
											: '↓'
										: ''}
								</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>
									Today&apos;s Orders
								</TableCell>
								<TableCell
									onClick={() => handleSort('favorite')}
									style={{ cursor: 'pointer', fontWeight: 'bold' }}
								>
									Actions{' '}
									{sortColumn === 'favorite'
										? sortDirection === 'asc'
											? '↑'
											: '↓'
										: ''}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{sortedVehicles.map((vehicle) => (
								<TableRow key={vehicle.plateNumber}>
									<TableCell>{vehicle.plateNumber}</TableCell>
									<TableCell>{vehicle.capacity}</TableCell>
									<TableCell>{vehicle.availableCapacity}</TableCell>
									<TableCell>
										{orders
											.filter(
												(order) => order.vehiclePlate === vehicle.plateNumber
											)
											.map((order) => (
												<Box key={order.id}>
													<Typography>
														{order.destination} - {order.weight} kg
													</Typography>
												</Box>
											))}
									</TableCell>
									<TableCell>
										<Button
											onClick={() => handleToggleFavorite(vehicle.plateNumber)}
											sx={{
												color: vehicle.favorite ? 'gray' : 'green',
											}}
										>
											{vehicle.favorite ? 'Unfavorite' : 'Favorite'}
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
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
