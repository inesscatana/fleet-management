import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Box,
	Typography,
	SortDirection,
} from '@mui/material'
import { Vehicle } from '@/redux/slices/vehiclesSlice'
import { Order } from '@/redux/slices/ordersSlice'
import { SortColumn } from '@/utils/sortHelper'

interface VehicleListProps {
	vehicles: Vehicle[]
	orders: Order[]
	onToggleFavorite: (vehicleId: string) => void
	handleSort: (column: 'capacity' | 'availableCapacity' | 'favorite') => void
	sortColumn: SortColumn
	sortDirection: SortDirection
}

const VehicleList: React.FC<VehicleListProps> = ({
	vehicles,
	orders,
	onToggleFavorite,
	handleSort,
	sortColumn,
	sortDirection,
}) => {
	return (
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
					{vehicles.map((vehicle) => (
						<TableRow key={vehicle.plateNumber}>
							<TableCell>{vehicle.plateNumber}</TableCell>
							<TableCell>{vehicle.capacity}</TableCell>
							<TableCell>{vehicle.availableCapacity}</TableCell>
							<TableCell>
								{orders
									.filter((order) => order.vehiclePlate === vehicle.plateNumber)
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
									onClick={() => onToggleFavorite(vehicle.plateNumber)}
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
	)
}

export default VehicleList
