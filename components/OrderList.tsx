import React, { useState } from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Button,
	Box,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'

import { SortColumn } from '@/utils/sortHelper'
import { Order } from '@/redux/slices/ordersSlice'
import ConfirmDeleteModal from './ConfirmDeleteModal'

interface OrderListProps {
	orders: Order[]
	onEditOrder: (order: Order) => void
	onRemoveOrder: (orderId: string) => void
	onCompleteOrder: (orderId: string) => void
	onAssignVehicle: (order: Order) => void
	handleSort: (column: SortColumn) => void
	sortColumn: SortColumn
	sortDirection: 'asc' | 'desc'
}

const OrderList: React.FC<OrderListProps> = ({
	orders,
	onEditOrder,
	onRemoveOrder,
	onCompleteOrder,
	onAssignVehicle,
	handleSort,
	sortColumn,
	sortDirection,
}) => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [orderToDelete, setOrderToDelete] = useState<string | null>(null)

	const handleOpenDeleteModal = (orderId: string) => {
		setOrderToDelete(orderId)
		setIsDeleteModalOpen(true)
	}

	const handleCloseDeleteModal = () => {
		setOrderToDelete(null)
		setIsDeleteModalOpen(false)
	}

	const handleConfirmDelete = () => {
		if (orderToDelete) {
			onRemoveOrder(orderToDelete)
			toast.success('Order removed successfully!')
		}
		handleCloseDeleteModal()
	}

	const handleCompleteOrderClick = (order: Order) => {
		if (!order.vehiclePlate) {
			toast.error('Assign the order to a vehicle before completing it.')
		} else {
			onCompleteOrder(order.id)
		}
	}

	return (
		<>
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
							<TableCell sx={{ fontWeight: 'bold' }}>Observations</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>
								Assigned Vehicle
							</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{orders.map((order) => (
							<TableRow
								key={order.id}
								sx={{
									backgroundColor: order.vehiclePlate ? 'inherit' : '#fdf1f1',
									opacity: order.completed ? 0.6 : 1,
								}}
							>
								<TableCell>{order.id}</TableCell>
								<TableCell>{order.destination}</TableCell>
								<TableCell>{order.weight}</TableCell>
								<TableCell>{order.observations || '—'}</TableCell>
								<TableCell>
									{order.completed ? (
										<Box display="flex" alignItems="center">
											<CheckIcon color="success" /> Completed
										</Box>
									) : (
										'In Progress'
									)}
								</TableCell>
								<TableCell>
									{order.vehiclePlate ? (
										<Box color="primary.main" fontWeight="bold">
											{order.vehiclePlate}
										</Box>
									) : (
										<Box color="text.secondary">Unassigned</Box>
									)}
								</TableCell>
								<TableCell>
									<IconButton
										onClick={() => onEditOrder(order)}
										color="primary"
										disabled={order.completed}
									>
										<EditIcon />
									</IconButton>
									<IconButton
										onClick={() => handleOpenDeleteModal(order.id)}
										color="error"
									>
										<DeleteIcon />
									</IconButton>
									<Button
										color="primary"
										onClick={() => onAssignVehicle(order)}
										disabled={order.completed}
									>
										Assign Vehicle
									</Button>
									<Button
										sx={{
											color: 'black',
										}}
										color="success"
										onClick={() => handleCompleteOrderClick(order)}
										disabled={order.completed}
									>
										Complete Order
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<ConfirmDeleteModal
				open={isDeleteModalOpen}
				onClose={handleCloseDeleteModal}
				onConfirm={handleConfirmDelete}
			/>
		</>
	)
}

export default OrderList
