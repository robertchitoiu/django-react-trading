import { useEffect, useState } from 'react'  
import { getUser } from '../api/user'  
import Navbar from '../components/Navbar'  
import '../styles/MyAccount.css'
import bg from '../assets/formBackground.png'

function MyAccount() {  
    const [user, setUser] = useState({})

    useEffect(() => {  
        getUser()  
            .then(data => setUser(data))  
            .catch(err => console.log(err))  
    }, [])

    return (  
        <>  
            <Navbar />  
            <div className="my-account-page">
                <div className="my-account-content">
                    <div className="header-container">  
                    <div>  
                        <h1 className="header-title">My Account</h1>  
                        <p className="header-subtitle">Your personal account details.</p>  
                    </div>  
                    </div>
                    <div className="profile-card">  
                        <div className="profile-avatar">  
                            {user.username?.charAt(0).toUpperCase()}  
                        </div>  
                        <div className="profile-info">  
                            <div className="profile-field">  
                                <span className="field-label">Username</span>  
                                <span className="field-value">{user.username}</span>  
                            </div>  
                            <div className="profile-field">  
                                <span className="field-label">Email</span>  
                                <span className="field-value">{user.email}</span>  
                            </div>
                            <div className="profile-field">  
                                <span className="field-label">First Name</span>  
                                <span className="field-value">{user.first_name}</span>  
                            </div>  
                            <div className="profile-field">  
                                <span className="field-label">Last Name</span>  
                                <span className="field-value">{user.last_name}</span>  
                            </div>  
                            <div className="profile-field">  
                                <span className="field-label">Member since</span>  
                                <span className="field-value">  
                                    {new Date(user.date_joined).toLocaleDateString()}  
                                </span>  
                            </div>  
                        </div>  
                    </div>
                </div> 
                <img src={bg} alt='trading-background'></img>   
            </div>
        </>  
    )  
}

export default MyAccount  
