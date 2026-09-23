import Navbar from "../components/Navbar"  
import { getAccounts, updateAccount, createAccount, deleteAccount } from "../api/account"  
import { useEffect, useState } from "react"  
import '../styles/Accounts.css'
import { Link } from "react-router-dom"

function Accounts() {  
    const [accounts, setAccounts] = useState([])

    useEffect(() => {  
        getAccounts()  
            .then(data => setAccounts(data))  
            .catch(err => console.log(err))  
    }, [])

    function handleDelete(id) {
        const confirmed = window.confirm('Are you sure you want to delete this account?')  
        if (!confirmed) return
        deleteAccount(id).catch(err => console.log(err))
        setAccounts(prevAcounts => prevAcounts.map(account => {
            return account.id === id ? {...account, is_active: false} : account
        }))
    }

    const accountsItems = accounts.map(account => {  
        return (  
            <tr key={account.id}>  
                <td>  
                    <div className="account-name">  
                        {account.name}  
                    </div>  
                </td>  
                <td>  
                    <span className="account-balance">  
                        {account.balance} <span className="account-currency">{account.currency}</span>  
                    </span>  
                </td>  
                <td>{account.currency}</td>  
                <td>{new Date(account.created_at).toLocaleDateString()}</td>  
                <td>  
                    <span className={`account-status ${account.is_active ? 'status-active' : 'status-inactive'}`}>  
                        {account.is_active ? 'Active' : 'Inactive'}  
                    </span>  
                </td>  
                <td>  
                    <div className="account-actions">
                        <Link to={`/editAccount/${account.id}`}>
                            <button className="btn-edit" disabled={!account.is_active}>Edit</button>
                        </Link> 
                        <button onClick={() => handleDelete(account.id)} className="btn-delete" disabled={!account.is_active}>Delete</button>  
                    </div>  
                </td>  
            </tr>  
        )  
    })

    return (  
        <>  
            <Navbar />  
            <div className="accounts-page">
                <div className="header-container">  
                    <div>  
                        <h1 className="header-title">Accounts</h1>  
                        <p className="header-subtitle">Here you can manage all your accounts.</p>  
                    </div>  
                    <button className="btn-new-account">+ New Account</button>  
                </div>
                {accounts.length === 0 ? (  
                    <div className="empty-state">  
                        <p>You don't have any accounts yet.</p>  
                        <button className="btn-new-account">Create your first account</button>  
                    </div>  
                ) : (  
                    <table className="table-container">  
                        <thead>  
                            <tr>  
                                <th>Name</th>  
                                <th>Balance</th>  
                                <th>Currency</th>  
                                <th>Creation Date</th>  
                                <th>Status</th>  
                                <th>Actions</th>  
                            </tr>  
                        </thead>  
                        <tbody>  
                            {accountsItems}  
                        </tbody>  
                    </table>  
                )}
            </div>  
        </>  
    )  
}

export default Accounts