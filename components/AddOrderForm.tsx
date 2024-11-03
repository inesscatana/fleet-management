'use client'

import { useState, useEffect } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	Button,
	Box,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { addOrder, Order, updateOrder } from '../redux/slices/ordersSlice'
import { AppDispatch } from '../redux/store'

interface AddOrderFormProps {
	onClose: () => void
	open: boolean
	order?: Order | null
}

const AddOrderForm: React.FC<AddOrderFormProps> = ({
	onClose,
	open,
	order,
}) => {
	const dispatch = useDispatch<AppDispatch>()
	const [orderData, setOrderData] = useState<Order>({
		id: '',
		weight: 0,
		destination: '',
		observations: '',
		coordinates: [0, 0],
	})

	// Preencher os dados ao abrir o modal para editar um pedido existente
	useEffect(() => {
		if (order) {
			setOrderData(order)
		} else {
			// Resetar os campos se o pedido não estiver definido
			setOrderData({
				id: '',
				weight: 0,
				destination: '',
				observations: '',
				coordinates: [0, 0],
			})
		}
	}, [order])

	// Atualizar dados de acordo com os inputs do usuário
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setOrderData((prevData) => ({
			...prevData,
			[name]:
				name === 'coordinates'
					? (value.split(',').map(Number) as [number, number])
					: name === 'weight'
					? Number(value)
					: value,
		}))
	}

	// Submeter os dados ao Redux
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (order) {
			// Atualiza o pedido existente
			dispatch(updateOrder(orderData))
		} else {
			// Adiciona um novo pedido
			dispatch(addOrder(orderData))
		}
		onClose() // Fechar modal após envio
	}

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{order ? 'Editar Pedido' : 'Adicionar Pedido'}</DialogTitle>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<TextField
						label="ID do Pedido"
						name="id"
						value={orderData.id}
						onChange={handleChange}
						required
						fullWidth
						margin="normal"
						disabled={!!order} // Desativa o campo ID se for uma edição
					/>
					<TextField
						label="Peso"
						name="weight"
						type="number"
						value={orderData.weight}
						onChange={handleChange}
						required
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Destino"
						name="destination"
						value={orderData.destination}
						onChange={handleChange}
						required
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Coordenadas (lat, lon)"
						name="coordinates"
						value={(orderData.coordinates ?? [0, 0]).join(',')}
						onChange={handleChange}
						required
						fullWidth
						margin="normal"
						helperText="Insira as coordenadas separadas por vírgula (e.g., 38.716, -9.139)"
					/>
					<TextField
						label="Observações"
						name="observations"
						value={orderData.observations || ''}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<Box display="flex" justifyContent="flex-end" mt={2}>
						<Button type="submit" color="primary" variant="contained">
							{order ? 'Salvar Alterações' : 'Adicionar Pedido'}
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

export default AddOrderForm
