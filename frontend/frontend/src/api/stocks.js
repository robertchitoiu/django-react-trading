import api from "./axios";

export async function getStock(symbol) {
    try {
        const response = await api.get(`api/stocks/${symbol}/`)
        return response.data
    } catch(err) {
        throw err
    }
}