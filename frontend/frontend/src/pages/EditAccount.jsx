import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getAccountDetails, updateAccount } from "../api/account"
import '../styles/EditAccount.css'
import Navbar from "../components/Navbar"

function EditAccount() {
    const { id } = useParams()
    const [name, setName] = useState('')
    const [currency, setCurrency] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        getAccountDetails(id)
            .then(data => {setName(data.name); setCurrency(data.currency);})
                .catch(err => console.log(err))
    }, [])

    function handleSubmit(e) {
        e.preventDefault()
        updateAccount(id, name, currency)
            .catch(err => console.log(err))
        navigate('/accounts')
    }

    return (  
        <>  
            <Navbar />  
            <div className="edit-account-page">  
                <div className="header-container">  
                    <div>  
                        <h1 className="header-title">Edit your Account</h1>  
                        <p className="header-subtitle">Here you can edit your account's details.</p>  
                    </div>  
                </div>
                <form className="edit-form" onSubmit={handleSubmit}>  
                    <div className="form-item">  
                        <label>Account Name</label>  
                        <input 
                            type="text"  
                            className="form-input"  
                            value={name}  
                            onChange={e => setName(e.target.value)}  
                            placeholder="Enter account name"  
                        />  
                    </div>  
                    <div className="form-item">  
                        <label>Currency</label>  
                        <select  
                            className="form-input"  
                            value={currency}  
                            onChange={e => setCurrency(e.target.value)}  
                        >  
                            <option value="">Select Currency</option>  
                            <option value="EUR">EUR</option>  
                            <option value="RON">RON</option>
                            <option value="USD">USD</option> 
                        </select>  
                    </div>   
                    <div className="edit-actions">  
                        <button type="submit" className="btn-save">Save Changes</button>  
                        <Link to="/accounts" className="btn-cancel">Cancel</Link>  
                    </div>  
                </form>  
            </div>  
        </>  
    )  
}

export default EditAccount