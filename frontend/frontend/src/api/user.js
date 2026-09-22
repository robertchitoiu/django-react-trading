import api from "./axios";

export async function getUser() {
    try {
        const response = await api.get('api/user/me/')
        return response.data
    } catch(err) {
        throw err
    }
    
}