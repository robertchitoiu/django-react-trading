import { useEffect, useState } from 'react'
import { getUser } from '../api/user'
import Navbar from '../components/Navbar'
import '../styles/MyAccount.css'
import toast from 'react-hot-toast'
import { TOAST_STYLE } from '../constants'
import BalanceChart from '../components/BalanceChart'

function MyAccount() {
    const [user, setUser] = useState({})

    useEffect(() => {
        getUser()
            .then(data => setUser(data))
            .catch(() => toast.error(err.response.data.error, { style: TOAST_STYLE }))
    }, [])

    return (
        <>
            <Navbar />
            <div className="my-account-page">
                <div className="page-header">
                    <h1 className="header-title">My Account</h1>
                    <p className="header-subtitle">Your personal account details.</p>
                </div>

                <div className="page-content">
                    <div className="profile-card">
                        <div className="profile-avatar">
                            {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-info">
                            <div className="profile-field">
                                <span className="field-label">Username</span>
                                <span className="field-value">{user.username || '—'}</span>
                            </div>
                            <div className="profile-field">
                                <span className="field-label">Email</span>
                                <span className="field-value">{user.email || '—'}</span>
                            </div>
                            <div className="profile-field">
                                <span className="field-label">First Name</span>
                                <span className="field-value">{user.first_name || '—'}</span>
                            </div>
                            <div className="profile-field">
                                <span className="field-label">Last Name</span>
                                <span className="field-value">{user.last_name || '—'}</span>
                            </div>
                            <div className="profile-field">
                                <span className="field-label">Member Since</span>
                                <span className="field-value">
                                    {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : '—'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="chart-card">
                        <h3 className="chart-title">Balance History</h3>
                        <BalanceChart />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyAccount  
