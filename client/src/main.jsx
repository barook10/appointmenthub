import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { dbInit } from './services/db'

// Initialize SQLite database before rendering
dbInit().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}).catch(err => {
  console.error('Failed to initialize database:', err)
  document.getElementById('root').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0f0f17;color:#ef4444;font-family:sans-serif;text-align:center">
      <div>
        <h1>Database Initialization Failed</h1>
        <p>${err.message}</p>
        <button onclick="location.reload()" style="margin-top:20px;padding:10px 20px;background:#6366f1;color:#fff;border:none;border-radius:8px;cursor:pointer">Retry</button>
      </div>
    </div>
  `
})
