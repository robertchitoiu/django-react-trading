import { useEffect, useState } from "react"
import { getTransactions } from "../api/transactions"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import '../styles/Transactions.css'

function Transactions() {
    const [transactions, setTransactions] = useState([])
    const { id, name } = useParams()

    useEffect(() => {
        getTransactions(id)
            .then(data => setTransactions(data))
                .catch(err => console.log(err))
    }, [])

    const transactionItems = transactions.map(transaction => {
        return(
             <tr key={transaction.id}>  
                <td style={{color: transaction.type === 'buy' ? '#36f63d' : '#ff4757'}}>{transaction.type}</td>  
                <td>{transaction.amount}</td>  
                <td>{new Date(transaction.date).toLocaleDateString()}</td> 
            </tr>  
        )
    })

    return (
        <>  
            <Navbar />  
            <div className="transactions-page">
                <div className="header-container">  
                    <div>  
                        <h1 className="header-title">Transactions</h1>  
                        <h2 className="header-subtitle">Account: {name}</h2>
                        <p className="header-subtitle">Here you can view all the transaction you have done in the past.</p>  
                    </div>
                </div>
                {transactions.length === 0 ? (  
                    <div className="empty-state">  
                        <p>You don't have any transactions in this account yet.</p>  
                    </div>  
                ) : (  
                    <table className="table-container">  
                        <thead>  
                            <tr>  
                                <th>Type</th>  
                                <th>Amount</th>  
                                <th>Creation Date</th>   
                            </tr>  
                        </thead>  
                        <tbody>  
                            {transactionItems}  
                        </tbody>  
                    </table>  
                )}
            </div>  
        </>
    )
}

export default Transactions