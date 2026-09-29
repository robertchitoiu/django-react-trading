import { useState } from "react"  
import Navbar from "../components/Navbar"  
import { getStock } from "../api/stocks"  
import toast from "react-hot-toast"  
import { TOAST_STYLE } from "../constants"  
import '../styles/Stocks.css'

const POPULAR_STOCKS = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'NVDA', 'META', 'AMZN', 'BTC-USD']

function Stocks() {  
    const [symbol, setSymbol] = useState('')  
    const [symbolData, setSymbolData] = useState(null)  
    const [searchedSymbol, setSearchedSymbol] = useState('')

    function handleSubmit(e) {  
        e.preventDefault()  
        if (!symbol) return  
        getStock(symbol)  
            .then(data => {  
                setSymbolData(data)  
                setSearchedSymbol(symbol.toUpperCase())  
            })  
            .catch(() => toast.error('Stock not found!', { style: TOAST_STYLE }))  
    }

    function handlePopularClick(s) {  
        setSymbol(s)  
        getStock(s)  
            .then(data => {  
                setSymbolData(data)  
                setSearchedSymbol(s)  
            })  
            .catch(() => toast.error('Stock not found!', { style: TOAST_STYLE }))  
    }

    return (  
        <>  
            <Navbar />  
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
                                <button className="btn-buy">Buy</button>  
                                <button className="btn-sell">Sell</button>  
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
