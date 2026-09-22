import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants'
import { Navigate } from 'react-router-dom'
import Accounts from './pages/Accounts'
import Transactions from './pages/Transactions'
import MyAccount from './pages/MyAccount'

function Logout() {
  localStorage.removeItem(ACCESS_TOKEN)
  localStorage.removeItem(REFRESH_TOKEN)
  return <Navigate to='/login' />
}

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/accounts' element={<Accounts />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path='/myaccount' element={<MyAccount />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
