import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext' // Import Theme Provider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider> {/* Wrap Theme inside Auth */}
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)