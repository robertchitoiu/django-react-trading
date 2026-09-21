import api from './axios'

export async function getTransactions(id) {
    try {
        const response = await api.get(`accounts/${id}/transactions/`)
        return response.data    
    } catch(err) {
        throw(err)
    }
}

export async function createTransaction(accId, amount, type) {
    try {
        const response = await api.post(`accounts/${accId}/transactions/`, {amount, type})
        return true    
    } catch(err) {
        throw(err)
    }
}