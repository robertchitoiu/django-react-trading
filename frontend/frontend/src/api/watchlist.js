import api from "./axios"

async function getWatchlist() {
    try {
        const response = await api.get('api/watchlist/')
        return response.data
    } catch(err) {
        throw err
    }
}

async function createWatchlistItem(symbol) {
    try {
        await api.post('api/watchlist/', symbol)
    } catch(err) {
        throw err
    }
}

async function removeWatchlistItem(id) {
    try {
        await api.delete(`api/watchlist/${id}`)
    } catch(err) {
        throw err
    }
}