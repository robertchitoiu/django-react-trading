import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getAccountDetails, updateAccount } from "../api/account"
import '../styles/EditAccount.css'
import Navbar from "../components/Navbar"
import toast from "react-hot-toast"
import { TOAST_STYLE } from "../constants"

function EditAccount() {
    const { id } = useParams()
    const [name, setName] = useState('')
    const [currency, setCurrency] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        getAccountDetails(id)
            .then(data => {setName(data.name); setCurrency(data.currency);})
                .catch(() => toast.error('Failed to load account data!', {style: TOAST_STYLE}))
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        if (!name || !currency) {  
            return toast('Please fill in all fields!', {icon: '⚠️',style: TOAST_STYLE})
        } 

        try {
            await updateAccount(id, name, currency)
            toast.success('Successfully updated!', {style: TOAST_STYLE})
            navigate('/accounts')
        }catch(err) {
            toast.error('Something went wrong!', {style: TOAST_STYLE})
        }        
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