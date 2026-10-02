import Navbar from "../components/Navbar"
import { getAccounts, updateAccount, createAccount, deleteAccount } from "../api/account"
import { useEffect, useState } from "react"
import '../styles/Accounts.css'
import { Link } from "react-router-dom"
import toast from 'react-hot-toast'
import { TOAST_STYLE } from '../constants'
import Modal from 'react-modal'
import { MODAL_STYLE } from "../constants"
import "../styles/Modal.css"

function Accounts() {
    const [accounts, setAccounts] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [accountToDelete, setAccountToDelete] = useState()

    useEffect(() => {
        getAccounts()
            .then(data => setAccounts(data))
            .catch(err => toast.error(err.response.data.error, { style: TOAST_STYLE }))
    }, [])

    function handleDelete(id) { 
        setShowModal(true)
        setAccountToDelete(id)
    }

    function confirmDelete() {
        deleteAccount(accountToDelete).catch(err => toast.error(err.response.data.error, { style: TOAST_STYLE }))
        setAccounts(prevAcounts => prevAcounts.map(account => {
            return account.id === accountToDelete ? { ...account, is_active: false } : account
        }))
        setShowModal(false)
        toast.success('Successfully deleted', { style: TOAST_STYLE })
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
                        <Link to={`/transactions/${account.id}/${account.name}`}>
                            <button className="btn-transactions" disabled={!account.is_active}>View Transactions</button>
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
            <Modal  
                isOpen={showModal}  
                onRequestClose={() => setShowModal(false)}  
                style={MODAL_STYLE}  
            >  
                <h3 className='modal-header'>  
                    Delete Account  
                </h3>  
                <p className='modal-subheader'>  
                    Are you sure you want to delete this account? This action cannot be undone.  
                </p>  
                <div className='modal-actions'>  
                    <button className="modal-btn-cancel" onClick={() => setShowModal(false)}>  
                        Cancel  
                    </button>  
                    <button className="modal-btn-delete" onClick={confirmDelete}>  
                        Delete  
                    </button>  
                </div> 
            </Modal>
            <div className="accounts-page">
                <div className="header-container">
                    <div>
                        <h1 className="header-title">Accounts</h1>
                        <p className="header-subtitle">Here you can manage all your accounts.</p>
                    </div>
                    {accounts.length !== 0 &&
                        <Link to='/createAccount'>
                            <button className="btn-new-account">New Account</button>
                        </Link>
                    }
                </div>
                {accounts.length === 0 ? (
                    <div className="empty-state">
                        <Link to='/createAccount'>
                            <button className="btn-new-account">Create your first account</button>
                        </Link>
                        <p>You don't have any accounts yet.</p>
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