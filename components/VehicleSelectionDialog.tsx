'use client'

import { Vehicle } from '@/redux/slices/vehiclesSlice'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	List,
	ListItem,
	ListItemText,
	Box,
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
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Escolher Veículo</DialogTitle>
			<DialogContent>
				<List>
					{vehicles.map((vehicle) => (
						<ListItem
							key={vehicle.plateNumber}
							onClick={() => onSelectVehicle(vehicle.plateNumber)}
							component="div"
							sx={{
								cursor: 'pointer',
								'&:hover': { backgroundColor: '#f0f0f0' },
							}}
						>
							<ListItemText
								primary={vehicle.plateNumber}
								secondary={`Capacidade: ${vehicle.capacity} kg - Disponível: ${vehicle.availableCapacity} kg`}
							/>
							<Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
								{vehicle.favorite ? '⭐' : ''}
							</Box>
						</ListItem>
					))}
				</List>
			</DialogContent>
		</Dialog>
	)
}

export default VehicleSelectionDialog
