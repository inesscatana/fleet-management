'use client'

import React, { useState, useEffect } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	Button,
	FormControlLabel,
	Checkbox,
	Box,
} from '@mui/material'
import {
	Vehicle,
	addVehicle,
	updateVehicle,
} from '../redux/slices/vehiclesSlice'
import { useAppDispatch } from '../hooks' // Use o hook personalizado

interface AddVehicleFormProps {
	open: boolean
	onClose: () => void
	vehicle?: Vehicle | null
}

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({
	open,
	onClose,
	vehicle,
}) => {
	const dispatch = useAppDispatch()
	const [vehicleData, setVehicleData] = useState<Vehicle>({
		plateNumber: '',
		capacity: 0,
		availableCapacity: 0,
		favorite: false,
	})

	useEffect(() => {
		if (vehicle) {
			setVehicleData(vehicle)
		} else {
			setVehicleData({
				plateNumber: '',
				capacity: 0,
				availableCapacity: 0,
				favorite: false,
			})
		}
	}, [vehicle])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setVehicleData((prevData) => ({
			...prevData,
			[name]:
				name === 'capacity' || name === 'availableCapacity'
					? parseInt(value, 10)
					: value,
		}))
	}

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setVehicleData((prevData) => ({
			...prevData,
			favorite: e.target.checked,
		}))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (vehicle) {
			dispatch(updateVehicle(vehicleData))
		} else {
			dispatch(addVehicle(vehicleData))
		}
		onClose()
	}

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>
				{vehicle ? 'Editar Veículo' : 'Adicionar Veículo'}
			</DialogTitle>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<TextField
						label="Placa do Veículo"
						name="plateNumber"
						value={vehicleData.plateNumber}
						onChange={handleChange}
						fullWidth
						required
						disabled={!!vehicle}
						sx={{ mb: 2 }}
					/>
					<TextField
						label="Capacidade Máxima (kg)"
						name="capacity"
						type="number"
						value={vehicleData.capacity}
						onChange={handleChange}
						fullWidth
						required
						sx={{ mb: 2 }}
					/>
					<TextField
						label="Capacidade Disponível (kg)"
						name="availableCapacity"
						type="number"
						value={vehicleData.availableCapacity}
						onChange={handleChange}
						fullWidth
						required
						sx={{ mb: 2 }}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={vehicleData.favorite}
								onChange={handleCheckboxChange}
							/>
						}
						label="Favorito"
					/>
					<Box mt={2}>
						<Button type="submit" variant="contained" color="primary">
							{vehicle ? 'Salvar Alterações' : 'Adicionar Veículo'}
						</Button>
						<Button onClick={onClose} sx={{ ml: 2 }}>
							Cancelar
						</Button>
					</Box>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default AddVehicleForm
