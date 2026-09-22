import { useState, useEffect } from 'react'  
import Navbar from '../components/Navbar'  
import { getUser } from '../api/user'  
import { Link } from 'react-router-dom'  
import '../styles/Home.css'

function Home() {  
    const [username, setUsername] = useState('')

    useEffect(() => {  
        getUser()  
            .then(data => setUsername(data.username))  
            .catch(err => console.log(err))  
    }, [])

    return (  
        <>  
            <Navbar />  
            <div className="hero-section">  
                <div className="hero-content">  
                    <p className="hero-greeting">Welcome back, <span>{username}</span> 👋</p>  
                    <h1 className="hero-title">Your Trading Dashboard</h1>  
                    <p className="hero-subtitle">  
                        Manage your accounts, track your transactions and simulate trading in real time.  
                    </p>  
                    <div className="hero-buttons">  
                        <Link to="/accounts" className="hero-btn-primary">View Accounts</Link>  
                        <Link to="/transactions" className="hero-btn-secondary">View Transactions</Link>  
                    </div>  
                </div>

                <div className="hero-cards">  
                    <div className="hero-card">  
                        <p className="card-label">Total Accounts</p>  
                        <h2 className="card-value">—</h2>  
                    </div>  
                    <div className="hero-card">  
                        <p className="card-label">Total Transactions</p>  
                        <h2 className="card-value">—</h2>  
                    </div>  
                    <div className="hero-card">  
                        <p className="card-label">Portfolio Status</p>  
                        <h2 className="card-value">Active</h2>  
                    </div>  
                </div>  
            </div>  
        </>  
    )  
}

export default Home  
