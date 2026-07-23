import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import api from '../api/axios'
import Layout from '../components/Layout'

export default function EditExpense() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const existing = location.state?.expense

  const [form, setForm] = useState({
    title: existing?.title || '',
    amount: existing?.amount || '',
    date: existing?.date || '',
    category: existing?.category || '',
    description: existing?.description || '',
  })
  const [error, setError] = useState('')

  if (!existing) {
    return (
      <Layout>
        <p className="text-text-muted">
          No expense data found. Please go back to{' '}
          <button onClick={() => navigate('/expenses')} className="text-purple underline">
            Expenses
          </button>{' '}
          and click Edit from there.
        </p>
      </Layout>
    )
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.put(`/expenses/${id}`, {
        ...form,
        amount: parseFloat(form.amount),
        userId: existing.userId,
      })
      navigate('/expenses')
    } catch (err) {
      setError(err.response?.data?.amount || err.response?.data?.error || 'Failed to update expense')
    }
  }

  return (
    <Layout>
      <div className="max-w-md">
        <h1 className="text-2xl font-bold text-text mb-6">Edit Expense</h1>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <input
            name="title" placeholder="Title" value={form.title} onChange={handleChange}
            className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-purple"
            required
          />
          <input
            name="amount" type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={handleChange}
            className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-purple"
            required
          />
          <input
            name="date" type="date" value={form.date} onChange={handleChange}
            className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-purple"
            required
          />
          <input
            name="category" placeholder="Category" value={form.category} onChange={handleChange}
            className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-purple"
          />
          <input
            name="description" placeholder="Description" value={form.description} onChange={handleChange}
            className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-purple"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-purple text-white font-semibold rounded-lg py-2.5 hover:opacity-90 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate('/expenses')}
              className="px-5 rounded-lg border border-border text-text-muted hover:text-text transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}