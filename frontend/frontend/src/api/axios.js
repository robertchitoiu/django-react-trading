import axios from 'axios'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            const refresh = localStorage.get(REFRESH_TOKEN)
            if (refresh) {
                try {
                    const response = await api.post('/api/token/refresh/', {refresh})
                    localStorage.setItem(ACCESS_TOKEN, response.data.access)
                    error.config.headers.Authorization = `Bearer response.data.access`
                    return api(error.config)

                } catch {
                    localStorage.removeItem(ACCESS_TOKEN)
                    localStorage.removeItem(REFRESH_TOKEN)
                    window.location.href = '/login'
                }
            } else {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api