import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '../index.css'
import App from './App.tsx'
import Order from './Order.tsx'
import SelectOrder from './SelectOrder.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/order" element={<Order />} />
        <Route path="/select-order" element={<SelectOrder />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
