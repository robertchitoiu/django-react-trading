import api from './axios'

export async function getAccounts() {
    try {
        const response = await api.get('api/accounts/')
        return response.data
    } catch(err) {
        throw(err)
    }
}

export async function createAccount(currency) {
    try {
        const response = await api.post('api/accounts/', { currency })
        return true
    } catch(err) {
        throw(err)
    }
}

export async function updateAccount(id, name, currency) {
    try {
        const response = await api.patch(`api/accounts/${id}/`, { currency, name })
        return true
    } catch(err) {
        throw(err)
    }
}

export async function deleteAccount(id) {
    try {
        const response = await api.delete(`api/accounts/${id}/`)
        return true
    } catch(err) {
        throw(err)
    }
}

export async function getAccountDetails(id) {
    try {
        const response = await api.get(`api/accounts/${id}`)
        return response.data
    } catch(err) {
        throw(err)
    }
}