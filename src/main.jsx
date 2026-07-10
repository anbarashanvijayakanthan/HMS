import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

import { HospitalProvider } from './store/hospitalStore.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <HospitalProvider>
        <App />
      </HospitalProvider>
    </AuthProvider>
  </StrictMode>
)