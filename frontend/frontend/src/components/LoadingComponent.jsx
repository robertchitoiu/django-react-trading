import "../styles/Loading.css"

function LoadingComponent() {
    return(
        <div className='loading-container'>
            <div className="spinner"></div>
            <p className="loading-text">Loading...</p>
        </div>
    )
}

export default LoadingComponent