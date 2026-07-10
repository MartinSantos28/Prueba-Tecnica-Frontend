import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NotificationsProvider } from './context/NotificationsContext'
import AppLayout from './layouts/AppLayout'
import './App.css'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Users = lazy(() => import('./pages/Users'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))

function PageLoader() {
  return (
    <div className="page">
      <div className="loading-state">Cargando...</div>
    </div>
  )
}

function App() {
  return (
    <NotificationsProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Routes>
          <Route element={<AppLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/users"
            element={
              <Suspense fallback={<PageLoader />}>
                <Users />
              </Suspense>
            }
          />
          <Route
            path="/products"
            element={
              <Suspense fallback={<PageLoader />}>
                <Products />
              </Suspense>
            }
          />
          <Route
            path="/products/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProductDetail />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
    </NotificationsProvider>
  )
}

export default App
