import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"

function RegisterPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      const response = await api.post("/api/auth/register", formData)
      localStorage.setItem("token", response.data.token)
      setMessage("Registration successful")
      navigate("/dashboard")
    } catch (error) {
      console.log(error)
      setMessage("Registration failed")
    }
  }

  return (
    <div className="page-center">
      <div className="card">
        <h2>Register</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="input-box"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="input-box"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="input-box"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" className="btn-primary">
            Register
          </button>
        </form>

        {message && <p className="message-text">{message}</p>}

        <p className="switch-auth-text">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage