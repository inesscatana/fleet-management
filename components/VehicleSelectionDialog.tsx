import React, { useState } from 'react'
import { Vehicle } from '@/redux/slices/vehiclesSlice'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	List,
	ListItemButton,
	ListItemText,
	Box,
	TextField,
	Typography,
} from '@mui/material'

interface VehicleSelectionDialogProps {
	open: boolean
	onClose: () => void
	vehicles: Vehicle[]
	onSelectVehicle: (vehiclePlate: string) => void
}

const VehicleSelectionDialog: React.FC<VehicleSelectionDialogProps> = ({
	open,
	onClose,
	vehicles,
	onSelectVehicle,
}) => {
	// State para o campo de busca
	const [searchQuery, setSearchQuery] = useState('')

	// Filtra e ordena veículos com base na busca e se são favoritos
	const filteredVehicles = vehicles
		.filter((vehicle) =>
			vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
		)
		.sort((a, b) => {
			if (a.favorite === b.favorite) return 0
			return a.favorite ? -1 : 1
		})

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Select Vehicle</DialogTitle>
			<DialogContent>
				<TextField
					label="Search Vehicle"
					variant="outlined"
					fullWidth
					margin="normal"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				{filteredVehicles.length === 0 ? (
					<Typography color="textSecondary" align="center" sx={{ mt: 2 }}>
						No vehicles available.
					</Typography>
				) : (
					<List>
						{filteredVehicles.map((vehicle) => (
							<ListItemButton
								key={vehicle.plateNumber}
								onClick={() => onSelectVehicle(vehicle.plateNumber)}
								sx={{
									cursor: 'pointer',
									backgroundColor: vehicle.favorite ? '#fff4e5' : 'inherit',
									'&:hover': { backgroundColor: '#f0f0f0' },
								}}
							>
								<ListItemText
									primary={vehicle.plateNumber}
									secondary={`Capacity: ${vehicle.capacity} kg - Available: ${vehicle.availableCapacity} kg`}
									primaryTypographyProps={{
										fontWeight: vehicle.favorite ? 'bold' : 'normal',
										color: vehicle.favorite ? 'primary' : 'textPrimary',
									}}
								/>
								<Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
									{vehicle.favorite ? '⭐' : ''}
								</Box>
							</ListItemButton>
						))}
					</List>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default VehicleSelectionDialog
