import { useState } from "react"
import api from "../services/api"
import { useNavigate, Link } from "react-router-dom"
function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await api.post("/api/auth/login", {
        email: email,
        password: password,
      })

      localStorage.setItem("token", response.data.token)
      setMessage("Login successful")
      navigate("/dashboard")
    } catch (error) {
      setMessage("Login failed")
      console.log(error)
    }
  }

  return (
    <div className="page-center">
      <div className="card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="input-box"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>

        {message && <p className="message-text">{message}</p>}
        <p className="switch-auth-text">
            Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage