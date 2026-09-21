import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState } from "react";
import { jwtDecode } from 'jwt-decode'
import { useEffect } from "react";
import api from "../api/axios";


function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    async function refresh() {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)

        try {
            const response = await api.post('api/token/refresh/', { refresh: refreshToken})
            localStorage.setItem(ACCESS_TOKEN, response.data.access)
            setIsAuthorized(true)
        } catch(err) {
            console.log(err)
            setIsAuthorized(false)
        }
    }
    
    async function auth() {
        const token = localStorage.getItem(ACCESS_TOKEN)

        if (!token) {
            setIsAuthorized(false)
            return
        }

        const decodedToken = jwtDecode(token)
        const expirationDate = decodedToken.exp
        
        if (expirationDate < Date.now() / 1000) {
            await refresh()
        } else {
            setIsAuthorized(true)
        }

    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    return isAuthorized ? children : <Navigate to='/login' />
}

export default ProtectedRoute