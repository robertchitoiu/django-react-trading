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
import EditAccount from './pages/EditAccount'
import CreateAccount from './pages/CreateAccount'

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
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }/>
        <Route path='/logout' element={
        <ProtectedRoute>
          <Logout />
        </ProtectedRoute>
        }/>
        <Route path='/accounts' element={
          <ProtectedRoute>
            <Accounts />
          </ProtectedRoute>
        }/>
        <Route path='/editAccount/:id' element={  
          <ProtectedRoute>  
              <EditAccount />  
          </ProtectedRoute>  
        }/>  
        <Route path='/createAccount' element={
          <ProtectedRoute>
            <CreateAccount />
          </ProtectedRoute>
        }/>
        <Route path='/transactions/:id/:name' element={
          <ProtectedRoute>
              <Transactions />
          </ProtectedRoute>
        }/>
        <Route path='/myaccount' element={
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
