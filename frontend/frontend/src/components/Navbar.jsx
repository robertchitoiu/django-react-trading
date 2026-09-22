import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

function Navbar() { 
   return (
    <nav className="navbar">
        <div className="navbar-left">
            <Link to='/'>
                <img src={logo} alt="logo"></img>
            </Link>
            <Link className='nav-link' to='/accounts'>Accounts</Link>
            <Link className='nav-link' to='/transactions'>Transactions</Link>
        </div>
        <div className="navbar-right">
            <Link className='nav-link' to='/myAccount'>My Account</Link>
            <Link className='nav-logout'to='/logout'>Logout</Link>
        </div>
    </nav> 
   )
}

export default Navbar