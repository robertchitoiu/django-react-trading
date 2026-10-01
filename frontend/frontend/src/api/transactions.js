import api from './axios'

export async function getTransactions(id) {
    try {
        const response = await api.get(`api/accounts/${id}/transactions/`)
        return response.data
    } catch (err) {
        throw (err)
    }
}

export async function createTransaction(accId, price, quantity, type, symbol) {
    try {
        const response = await api.post(`api/accounts/${accId}/transactions/`, { price, quantity, type, symbol })
        return response.data
    } catch (err) {
        throw (err)
    }
}