import axios from 'axios'

const api = axios.create({
	baseURL: 'http://localhost:5000/api',
	timeout: 60000,
})

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers = config.headers || {}
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

export const login = (payload) => api.post('/auth/login', payload)
export const register = (payload) => api.post('/auth/register', payload)
export const getFeeds = () => api.get('/feeds')
export const addFeed = (payload) => api.post('/feeds', payload)
export const deleteFeed = (id) => api.delete(`/feeds/${id}`)
export const getArticles = () => api.get('/articles')
export const searchArticles = (query) => api.get(`/articles/search?q=${encodeURIComponent(query)}`)
export const generateSummary = (payload) => api.post('/summary', payload)

export default api
