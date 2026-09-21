import api from './axios'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'

export async function register(username, email, password, confirm_password) {
    try {
        const response = await api.post('api/auth/register/', {username, email, password, confirm_password})
        return true
    } catch(err) {
        return { error: err.message}
    }
}


export async function login(username, password) {
    try {
        const response =  await api.post('api/token/', {username, password})
        localStorage.setItem(ACCESS_TOKEN, response.data.access)
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh)
        return true
    } catch(err) {
        return { error: err.message}
    }
}