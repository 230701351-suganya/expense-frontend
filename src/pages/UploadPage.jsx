import { useState } from "react"
import api from "../services/api"

function UploadPage() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [expenseData, setExpenseData] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile)
      setPreviewUrl(imageUrl)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!file) {
      setMessage("Please select a file")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      setLoading(true)
      setMessage("")

      const response = await api.post("/api/expenses/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setExpenseData(response.data)
      setMessage("Upload successful")
    } catch (error) {
      console.log(error)
      setMessage("Upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <h2>Upload Receipt</h2>

      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />

        <button type="submit" className="btn-primary upload-btn">
          Upload
        </button>
      </form>

      {loading && <p>Uploading...</p>}
      {message && <p>{message}</p>}

      {previewUrl && (
        <div className="preview-section">
          <h3>Receipt Preview</h3>
          <img src={previewUrl} alt="Receipt Preview" className="preview-image" />
        </div>
      )}

      {expenseData && (
        <div className="result-section">
          <h3>Extracted Details</h3>

          <div className="details-grid">
            <div className="detail-box">
              <p className="label">Merchant</p>
              <p>{expenseData.merchantName}</p>
            </div>

            <div className="detail-box">
              <p className="label">Date</p>
              <p>{expenseData.date}</p>
            </div>

            <div className="detail-box">
              <p className="label">Amount</p>
              <p>₹ {expenseData.amount}</p>
            </div>

            <div className="detail-box">
              <p className="label">Tax</p>
              <p>{expenseData.tax}</p>
            </div>

            <div className="detail-box">
              <p className="label">Net Amount</p>
              <p>{expenseData.netAmount}</p>
            </div>

            <div className="detail-box">
              <p className="label">Category</p>
              <p>{expenseData.category}</p>
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
              {expenseData.items && expenseData.items.map((item, index) => (
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
    </div>
  )
}

export default UploadPage