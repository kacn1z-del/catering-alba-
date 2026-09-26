import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminPanel from './AdminPanel.jsx'

function Raiz() {
  const esAdmin = window.location.hash.startsWith('#admin')
  return esAdmin ? <AdminPanel /> : <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Raiz />
  </StrictMode>,
)
