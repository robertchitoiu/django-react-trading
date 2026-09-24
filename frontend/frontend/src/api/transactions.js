import api from './axios'

export async function getTransactions(id) {
    try {
        const response = await api.get(`api/accounts/${id}/transactions/`)
        return response.data    
    } catch(err) {
        throw(err)
    }
}

export async function createTransaction(accId, amount, type) {
    try {
        await api.post(`api/accounts/${accId}/transactions/`, {amount, type})
        return    
    } catch(err) {
        throw(err)
    }
}