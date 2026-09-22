import { useState } from "react"
import { register, login } from "../api/auth"
import { useNavigate } from "react-router-dom"
import '../styles/Form.css'
import bg from '../assets/formBackground.png'

function Form({type}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [email, setEmail] = useState('')

    const navigate = useNavigate()

    const name = type === 'login' ? 'Login' : 'Register'

    async function handleSubmit(e) {
        e.preventDefault()

        if (type === 'register') {
            try {
                await register(username, email, password, confirm)
                navigate('/login')
            } catch (err) {
                alert(err)
            }
        } else {
            try {
                await login(username, password)
                navigate('/')
            } catch(err) {
                alert(err)
            }
        }
    }

    return(
        <div className="form-container">
            <div className="form-side">  
                <form onSubmit={handleSubmit} className="auth-container">
                    <div className="form-title">
                        <h2>{name}</h2>
                        <p>{type === 'login' ? 'Welcome back!' : 'Create your account'}</p>
                    </div>
                    <div className="form-item">
                        <label htmlFor="username-input">Username</label>
                        <input onChange={e => setUsername(e.target.value)} value={username} type='text' className="form-input" id="username-input"></input>
                    </div>
                    {name === 'Register' &&
                        <div className="form-item">
                            <label htmlFor="username-input">Email</label>
                            <input onChange={e => setEmail(e.target.value)} value={email} type='email' className="form-input" id="email-input"></input>
                        </div>
                    }
                    <div className="form-item">
                        <label htmlFor="password-input">Password</label>
                        <input onChange={e => setPassword(e.target.value)} value={password} type='password' className="form-input" id="password-input"></input>
                    </div>
                    {name === 'Register' &&
                        <div className="form-item">
                            <label htmlFor="confirm-input">Confirm Password</label>
                            <input onChange={e => setConfirm(e.target.value)}  value={confirm} type='password' className="form-input" id="confirm-input"></input>
                        </div>
                    }
                    <button type="submit" className="form-button">{name}</button>
                    <p className="form-link">
                        {type === 'login'
                            ? <>Don't have an account? <a href="/register">Register</a></>
                            : <>Already have an account? <a href="/login">Login</a></>
                        }
                    </p>
                </form>
            </div>
            <img src={bg} alt="trading background"></img>
        </div>
    )
}

export default Form