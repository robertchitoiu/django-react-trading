import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { getStock } from "../api/stocks"
import toast from "react-hot-toast"
import { TOAST_STYLE } from "../constants"
import '../styles/Stocks.css'
import { createTransaction } from "../api/transactions"
import LoadingComponent from "../components/LoadingComponent"
import Modal from 'react-modal'
import { MODAL_STYLE } from "../constants"
import { getAccounts } from "../api/account"

const POPULAR_STOCKS = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'NVDA', 'META', 'AMZN', 'BTC-USD']

function Stocks() {
    const [symbol, setSymbol] = useState('')
    const [symbolData, setSymbolData] = useState(null)
    const [searchedSymbol, setSearchedSymbol] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [action, setAction] = useState('')
    const [quantity, setQuantity] = useState()
    const [accounts, setAccounts] = useState([])
    const [selectedAccount, setSelectedAccount] = useState({})

    useEffect(() => {
        getAccounts()
            .then(data => setAccounts(data.filter(account => account.is_active)))
                .catch(err => toast.error(err.response.data.error, { style: TOAST_STYLE }))
    }, [])

    function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true)
        if (!symbol) return
        getStock(symbol)
            .then(data => {
                setSymbolData(data)
                setSearchedSymbol(symbol.toUpperCase())
                setIsLoading(false)
            })
            .catch((err) => {
                setSearchedSymbol(symbol.toUpperCase())
                setSymbolData({  
                c: 229.87,    // current price  
                h: 231.45,    // high  
                l: 228.10,    // low  
                o: 229.00,    // open  
                pc: 228.52,   // previous close  
                d: 1.35,      // change  
                dp: 0.59      // percent change  
                })
                toast.error(err.response.data.error, { style: TOAST_STYLE })
                setIsLoading(false)
            })
    }

    function handlePopularClick(s) {
        setSymbol(s)
        getStock(s)
            .then(data => {
                setSymbolData(data)
                setSearchedSymbol(s)
            })
            .catch((err) => toast.error(err.response.data.error, { style: TOAST_STYLE }))
    }

    async function handleBuy() {
        if (!selectedAccount || !quantity) {
            return toast.error('Please fill all fields', { style: TOAST_STYLE })
        }  
        try {  
            await createTransaction(selectedAccount, symbolData.c, quantity, 'buy', searchedSymbol)  
            toast.success('Successfully bought!', { style: TOAST_STYLE })  
            setShowModal(false)  
        } catch (err) {  
            toast.error(err.response.data.error, { style: TOAST_STYLE })  
        }  
    }

    async function handleSell() {
        if (!selectedAccount || !quantity) {
            return toast.error('Please fill all fields', { style: TOAST_STYLE })
        } 
        try {
            await createTransaction(selectedAccount, symbolData.c, quantity, 'sell', symbol)
            toast.success('Successfully sold!', { style: TOAST_STYLE })
        } catch (err) {
            toast.error(err.response.data.error, { style: TOAST_STYLE })
        }
    }

    function openModal(action){
        setShowModal(true)
        setAction(action)
    }

    return (
        <>
            <Navbar />
            <Modal 
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                style={MODAL_STYLE}
            >
                <h3 className='modal-header'>  
                    {action} {symbol}  
                </h3>  
                <p className='modal-subheader'>  
                    Select how much of {symbol} you want to {action.toLowerCase()} and in which account:  
                </p>
                <div className="stock-inputs">
                    <input
                        type="text"
                        className="modal-input"
                        placeholder="Enter quantity (e.g. 1,2,3...)"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                    />
                    <select  
                        className="modal-input"  
                        value={selectedAccount}  
                        onChange={e => setSelectedAccount(e.target.value)}  
                    >  
                        <option value="">Select account</option>  
                        {accounts.map(account => (  
                            <option key={account.id} value={account.id}>  
                                {account.name} — {account.balance} {account.currency}  
                            </option>  
                        ))}  
                    </select>  
                </div>  
                <div className='modal-actions'>  
                    <button className="modal-btn-cancel" onClick={() => setShowModal(false)}>  
                        Cancel  
                    </button>  
                    <button className={action === 'Buy' ? "modal-btn-buy" : "modal-btn-sell"} onClick={action === 'Buy' ? handleBuy : handleSell}>  
                        {action}  
                    </button>  
                </div>
            </Modal>
            <div className="stocks-page">
                <div className="stocks-hero">
                    <h1 className="stocks-title">Search Stocks</h1>
                    <p className="stocks-subtitle">Search for any stock ticker to view real-time data</p>
                    <form className="search-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Enter ticker symbol (e.g. AAPL)"
                            value={symbol}
                            onChange={e => setSymbol(e.target.value.toUpperCase())}
                        />
                        <button type="submit" className="btn-search">Search</button>
                    </form>
                    <div className="popular-stocks">
                        <span className="popular-label">Popular:</span>
                        {POPULAR_STOCKS.map(s => (
                            <button
                                key={s} className="popular-chip" onClick={() => handlePopularClick(s)}>{s}
                            </button>
                        ))}
                    </div>
                    {isLoading && <LoadingComponent />}
                </div>
                {symbolData &&
                    <div className="stocks-content">
                        <div className="stock-result">
                            <div className="stock-header">
                                <h2 className="stock-symbol">{searchedSymbol}</h2>
                                <span className={`stock-change ${symbolData.d >= 0 ? 'positive' : 'negative'}`}>
                                    {symbolData.d >= 0 ? '+' : ''}{symbolData.d?.toFixed(2)} ({symbolData.dp?.toFixed(2)}%)
                                </span>
                            </div>
                            <div className="stock-price">
                                <span className="current-price">${symbolData.c?.toFixed(2)}</span>
                                <span className="price-label">Current Price</span>
                            </div>
                            <div className="stock-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Open</span>
                                    <span className="stat-value">${symbolData.o?.toFixed(2)}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Previous Close</span>
                                    <span className="stat-value">${symbolData.pc?.toFixed(2)}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">High</span>
                                    <span className="stat-value high">${symbolData.h?.toFixed(2)}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Low</span>
                                    <span className="stat-value low">${symbolData.l?.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="stock-actions">
                                <button onClick={() => openModal('Buy')} className="btn-buy">Buy</button>
                                <button onClick={() => openModal('Sell')} className="btn-sell">Sell</button>
                                <button className="btn-watchlist">+ Watchlist</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default Stocks  
