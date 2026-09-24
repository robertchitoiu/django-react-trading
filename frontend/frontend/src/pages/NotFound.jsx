import { Link } from 'react-router-dom'  
import Navbar from '../components/Navbar'  
import '../styles/NotFound.css'

function NotFound() {  
    return (  
        <>  
            <Navbar />  
            <div className="not-found-page">  
                <h1 className="not-found-code">404</h1>  
                <h2 className="not-found-title">Page Not Found</h2>  
                <p className="not-found-subtitle">The page you're looking for doesn't exist or has been moved.</p>  
                <Link to="/" className="not-found-btn">Back to Home</Link>  
            </div>  
        </>  
    )  
}

export default NotFound  
