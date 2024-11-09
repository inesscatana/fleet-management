import React from 'react'
import {
	Dialog,
	DialogTitle,
	DialogActions,
	Button,
	DialogContent,
	Typography,
} from '@mui/material'

interface ConfirmDeleteModalProps {
	open: boolean
	onClose: () => void
	onConfirm: () => void
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
	open,
	onClose,
	onConfirm,
}) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Confirm Deletion</DialogTitle>
			<DialogContent>
				<Typography>Are you sure you want to delete this order?</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Cancel
				</Button>
				<Button onClick={onConfirm} color="error" variant="contained">
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ConfirmDeleteModal
