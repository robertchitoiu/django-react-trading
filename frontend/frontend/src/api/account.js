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
        await api.post('api/accounts/', { currency })
        return
    } catch(err) {
        throw(err)
    }
}

export async function updateAccount(id, name, currency) {
    try {
        await api.patch(`api/accounts/${id}/`, { currency, name })
        return
    } catch(err) {
        throw(err)
    }
}

export async function deleteAccount(id) {
    try {
        await api.delete(`api/accounts/${id}/`)
        return
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