import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function AddExpensePage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    merchantName: "",
    date: "",
    amount: "",
    tax: "",
    netAmount: "",
    category: "General",
    status: "MANUAL",
    receiptType: "",
    countryRegion: "",
    taxRate: "",
    items: [],
  })

  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await api.post("/api/expenses", {
        ...formData,
        amount: Number(formData.amount),
      })

      setMessage("Expense added successfully")
      navigate("/dashboard")
    } catch (error) {
      console.log(error)
      setMessage("Failed to add expense")
    }
  }

  return (
    <div className="page-container">
      <h2>Add Expense Manually</h2>

      <form onSubmit={handleSubmit} className="manual-form">
        <input
          type="text"
          name="merchantName"
          placeholder="Merchant Name"
          className="input-box"
          value={formData.merchantName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="date"
          placeholder="Date (example: 16/04/26)"
          className="input-box"
          value={formData.date}
          onChange={handleChange}
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          className="input-box"
          value={formData.amount}
          onChange={handleChange}
        />

        <input
          type="text"
          name="tax"
          placeholder="Tax"
          className="input-box"
          value={formData.tax}
          onChange={handleChange}
        />

        <input
          type="text"
          name="netAmount"
          placeholder="Net Amount"
          className="input-box"
          value={formData.netAmount}
          onChange={handleChange}
        />

        <select
          name="category"
          className="input-box"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="General">General</option>
          <option value="Food">Food</option>
          <option value="Groceries">Groceries</option>
          <option value="Medical">Medical</option>
          <option value="Household">Household</option>
        </select>

        <button type="submit" className="btn-primary">
          Save Expense
        </button>
      </form>

      {message && <p className="message-text">{message}</p>}
    </div>
  )
}

export default AddExpensePage