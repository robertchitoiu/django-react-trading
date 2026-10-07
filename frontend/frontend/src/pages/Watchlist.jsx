import { useEffect, useState } from "react"
import { getWatchlist, removeWatchlistItem } from '../api/watchlist.js'
import toast from "react-hot-toast"
import { TOAST_STYLE, MODAL_STYLE } from "../constants.js"
import Navbar from "../components/Navbar.jsx"
import LoadingComponent from "../components/LoadingComponent.jsx"
import Modal from 'react-modal'

function Watchlist() {
    const [watchlist, setWatchlist] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [itemToDelete, setItemToDelete] = useState()

    useEffect(() => {
        getWatchlist()
            .then(data => {setIsLoading(false); setWatchlist(data)})
            .catch(err => {toast.error(err.response.data.error, {style: TOAST_STYLE}); setIsLoading(false)})
    }, [])

    function handleDelete(id) {
        setShowModal(true)
        setItemToDelete(id)
    }

    async function confirmDelete() {
        try {  
            await removeWatchlistItem(itemToDelete)  
            setWatchlist(prev => prev.filter(item => item.id !== itemToDelete))  
            setShowModal(false)  
            toast.success('Successfully removed', { style: TOAST_STYLE })  
        } catch(err) {  
            toast.error('Failed to remove', { style: TOAST_STYLE })  
        } 
    }

    const watchlistItems = watchlist.map(item => {
        return(
            <div key={item.symbol} className="watchlist-card">  
                <span className="watchlist-symbol">{item.symbol}</span>  
                <span className="watchlist-price">  
                    {item.price ? `$${item.price.toFixed(2)}` : '—'}  
                </span>  
                <span className={`watchlist-change ${item.change >= 0 ? 'positive' : 'negative'}`}>  
                    {item.change >= 0 ? '+' : ''}{item.change?.toFixed(2)}%  
                </span>  
                <button  
                    className="watchlist-remove"  
                    onClick={() => handleDelete(item.id)}  
                >  
                    Remove  
                </button>  
            </div>  
        )
    })


    return(
        <>
            <Navbar />
            <Modal  
                isOpen={showModal}  
                onRequestClose={() => setShowModal(false)}  
                style={MODAL_STYLE}  
            >  
                <h3 className='modal-header'>  
                    Delete Watchlist Item  
                </h3>  
                <p className='modal-subheader'>  
                    Are you sure you want to delete this item? This action cannot be undone.  
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
            <div className="watchlist-page">  
                <div className="header-container">  
                    <div>  
                        <h1 className="header-title">Watchlist</h1>  
                        <p className="header-subtitle">Track your favourite stocks in real time.</p>  
                    </div>  
                </div>
                {isLoading ? (  
                    <LoadingComponent />  
                ) : watchlist.length === 0 ? (  
                    <div className="empty-state">  
                        <p>Your watchlist is empty.</p>  
                        <p>Search for stocks and add them here.</p>  
                    </div>  
                ) : (  
                    <div className="watchlist-list">  
                        {watchlistItems}  
                    </div>  
                )}    
            </div> 
        </>
    )
}

export default Watchlist