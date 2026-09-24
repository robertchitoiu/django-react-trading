import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getUser } from '../api/user'
import { Link } from 'react-router-dom'
import '../styles/Home.css'
import { getNews } from '../api/externalApi'
import NewsCard from '../components/NewsCard'

function Home() {
    const [username, setUsername] = useState('')
    const [news, setNews] = useState([])

    useEffect(() => {
        getUser()
            .then(data => {
                const capitalizedUsername = data.username.charAt(0).toUpperCase() + data.username.slice(1)
                setUsername(capitalizedUsername)
            })
            .catch(err => console.log(err))

        getNews()
            .then(data => { console.log(data); setNews(data) })
            .catch(err => console.log(err))
    }, [])

    const newsItems = news.filter(news => !news.source.toLowerCase().includes('reuters')).slice(0, 12).map(news => {
        return <NewsCard key={news.id} {...news} />
    })

    return (
        <>
            <Navbar />
            <div className='page-content'>
                <div className="hero-section">
                    <div className="hero-content">
                        <p className="hero-greeting">Welcome back, <span>{username}</span></p>
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
                <div className="news-container">
                    {newsItems}
                </div>
            </div>
        </>
    )
}

export default Home  
