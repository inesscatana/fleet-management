'use client'

import { Provider } from 'react-redux'
import { CssBaseline } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { store } from '../redux/store'
import { Manrope } from 'next/font/google'

const manrope = Manrope({ subsets: ['latin'] })

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<Provider store={store}>
			<html lang="en">
				<body className={`${manrope.className} antialiased`}>
					<CssBaseline />
					{children}
					<ToastContainer
						position="top-right"
						autoClose={3000}
						hideProgressBar
					/>
				</body>
			</html>
		</Provider>
	)
}
