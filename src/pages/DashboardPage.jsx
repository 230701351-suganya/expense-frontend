import { useEffect, useState } from "react"
import api from "../services/api"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

function DashboardPage() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedExpense, setSelectedExpense] = useState(null)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/api/expenses")
      setExpenses(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  )

  const totalReceipts = expenses.length
  const latestExpense = expenses[0]

  const categories = ["All", ...new Set(expenses.map((exp) => exp.category))]

  const filteredExpenses = expenses.filter((exp) => {
    const merchant = exp.merchantName ? exp.merchantName.toLowerCase() : ""
    const matchesSearch = merchant.includes(searchText.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" || exp.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categoryData = Object.values(
    expenses.reduce((acc, exp) => {
      const category = exp.category || "General"

      if (!acc[category]) {
        acc[category] = {
          category: category,
          amount: 0,
        }
      }

      acc[category].amount += Number(exp.amount || 0)

      return acc
    }, {})
  )

  const handleSelectExpense = (expense) => {
    setSelectedExpense(expense)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/expenses/${id}`)

      const updatedExpenses = expenses.filter((exp) => exp.id !== id)
      setExpenses(updatedExpenses)

      if (selectedExpense && selectedExpense.id === id) {
        setSelectedExpense(null)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="page-container">
      <h2>Dashboard</h2>

      {/* SUMMARY */}
      <div className="summary-grid">
        <div className="summary-card">
          <p className="label">Total Expenses</p>
          <h3>₹ {totalExpenses.toFixed(2)}</h3>
        </div>

        <div className="summary-card">
          <p className="label">Total Receipts</p>
          <h3>{totalReceipts}</h3>
        </div>

        <div className="summary-card">
          <p className="label">Latest Expense</p>
          <h3>{latestExpense ? `₹ ${latestExpense.amount}` : "No data"}</h3>
        </div>
      </div>

      {/* FILTER */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by merchant name"
          className="input-box"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="input-box"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* EXPENSE LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredExpenses.length === 0 ? (
        <p>No matching expenses found</p>
      ) : (
        <div>
          {filteredExpenses.map((exp) => (
            <div
              key={exp.id}
              className="expense-card clickable-card"
              onClick={() => handleSelectExpense(exp)}
            >
              <h3>{exp.merchantName}</h3>
              <p>Date: {exp.date}</p>
              <p>Amount: ₹{exp.amount}</p>
              <p>Category: {exp.category}</p>

              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(exp.id)
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* DETAILS PANEL */}
      {selectedExpense && (
        <div className="details-panel">
          <h3>Receipt Details</h3>

          {selectedExpense.blobUrl && (
            <div className="saved-receipt-section">
              <h3>Saved Receipt</h3>
              <img
                src={selectedExpense.blobUrl}
                alt="Saved Receipt"
                className="saved-receipt-image"
              />
            </div>
          )}

          <div className="details-grid">
            <div className="detail-box">
              <p className="label">Merchant</p>
              <p>{selectedExpense.merchantName}</p>
            </div>

            <div className="detail-box">
              <p className="label">Date</p>
              <p>{selectedExpense.date}</p>
            </div>

            <div className="detail-box">
              <p className="label">Amount</p>
              <p>₹ {selectedExpense.amount}</p>
            </div>

            <div className="detail-box">
              <p className="label">Tax</p>
              <p>{selectedExpense.tax}</p>
            </div>

            <div className="detail-box">
              <p className="label">Net Amount</p>
              <p>{selectedExpense.netAmount}</p>
            </div>

            <div className="detail-box">
              <p className="label">Category</p>
              <p>{selectedExpense.category}</p>
            </div>
          </div>

          <h3 className="items-heading">Items</h3>

          <table className="items-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedExpense.items &&
                selectedExpense.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.totalPrice}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔥 CHART AT BOTTOM */}
      <div className="chart-section">
        <h3>Category-wise Expenses</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DashboardPage