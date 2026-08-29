import axios from 'axios'

const api = axios.create({
  baseURL: 'https://proyecto-transporte-escolar.onrender.com',
})

export default api
