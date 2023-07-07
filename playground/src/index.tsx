import './index.css'
import React, { StrictMode } from 'react'
import App from './components/App'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<App />
	</StrictMode>
)
