import axios from "axios"

const api = axios.create({
  baseURL: "https://unison-carnivore-penpal.ngrok-free.dev",
  headers: {
    "ngrok-skip-browser-warning": "true"
  }
})


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  const isAuthRequest =
    config.url === "/api/auth/login" || config.url === "/api/auth/register"

  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api