import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.REACT_APP_BLOCKCHAIN_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// TODO убрана проверка на добавление Bearer токена, зачем ?
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem(ACCESS_TOKEN)
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })
