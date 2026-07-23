import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Receipt } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import DatePicker from '../components/DatePicker'

export default function AddExpense() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', amount: '', date: '', category: '', description: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/expenses', {
        ...form,
        amount: parseFloat(form.amount),
        userId: user.userId,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.amount || err.response?.data?.error || 'Failed to add expense')
    }
  }

  return (
    <Layout>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold text-text mb-6 w-full max-w-md">Add Expense</h1>

        <div className="bg-surface border border-border rounded-2xl w-full max-w-md overflow-visible">
  <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 flex items-center gap-4 rounded-t-2xl">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Receipt size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">New Expense</p>
              <p className="text-white/80 text-sm">Track where your money goes</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <input
              name="title" placeholder="Title" value={form.title} onChange={handleChange}
              className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-purple-500 transition"
              required
            />
            <input
              name="amount" type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={handleChange}
              className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-purple-500 transition"
              required
            />
            <DatePicker
              value={form.date}
              onChange={(date) => setForm({ ...form, date })}
              borderColor="purple-500"
            />
            <input
              name="category" placeholder="Category (e.g. Food, Housing)" value={form.category} onChange={handleChange}
              className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-purple-500 transition"
            />
            <input
              name="description" placeholder="Description" value={form.description} onChange={handleChange}
              className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-purple-500 transition"
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg py-3 hover:opacity-90 transition"
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}