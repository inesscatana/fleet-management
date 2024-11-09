import React, { useState, useEffect } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	Button,
	Box,
} from '@mui/material'
import { Order } from '@/redux/slices/ordersSlice'

interface AddOrderFormProps {
	open: boolean
	onClose: () => void
	order: Order | null
	onSave: (updatedOrder: Order) => void
}

const AddOrderForm: React.FC<AddOrderFormProps> = ({
	open,
	onClose,
	order,
	onSave,
}) => {
	const [orderData, setOrderData] = useState<Order>({
		id: '',
		weight: 0,
		destination: '',
		observations: '',
		coordinates: [0, 0],
	})

	// Fill in the data when opening the modal for editing or clear for a new order
	useEffect(() => {
		if (order) {
			setOrderData(order)
		} else {
			setOrderData({
				id: '',
				weight: 0,
				destination: '',
				observations: '',
				coordinates: [0, 0],
			})
		}
	}, [order])

	// Update data based on user input, including parsing of coordinates
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setOrderData((prevData) => ({
			...prevData,
			[name]:
				name === 'coordinates'
					? (value.split(',').map(Number) as [number, number]) // Split and convert coordinates
					: name === 'weight'
					? Number(value) // Convert weight to number
					: value,
		}))
	}

	// Submit data based on the current state (adding or updating)
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSave(orderData)
		onClose()
	}

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{order ? 'Edit Order' : 'Add Order'}</DialogTitle>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<TextField
						label="Order ID"
						name="id"
						value={orderData.id}
						onChange={handleChange}
						required
						fullWidth
						margin="normal"
						disabled={!!order}
					/>
					<TextField
						label="Weight"
						name="weight"
						type="number"
						value={orderData.weight}
						onChange={handleChange}
						required
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Destination"
						name="destination"
						value={orderData.destination}
						onChange={handleChange}
						required
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Coordinates (lat, lon)"
						name="coordinates"
						value={(orderData.coordinates ?? [0, 0]).join(',')}
						onChange={handleChange}
						required
						fullWidth
						margin="normal"
						helperText="Enter coordinates separated by comma (e.g., 38.716, -9.139)"
					/>
					<TextField
						label="Observations"
						name="observations"
						value={orderData.observations || ''}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<Box display="flex" justifyContent="flex-end" mt={2}>
						<Button type="submit" color="primary" variant="contained">
							{order ? 'Save Changes' : 'Add Order'}
						</Button>
						<Button onClick={onClose} sx={{ ml: 2 }}>
							Cancel
						</Button>
					</Box>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default AddOrderForm
