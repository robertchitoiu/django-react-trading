import api from "./axios"

export async function getNews() {
   try {
      const response = await api.get('/api/news/')
      return response.data
   } catch (err) {
      throw (err)
   }
}