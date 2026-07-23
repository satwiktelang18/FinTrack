import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import api from '../api/axios'
import Layout from '../components/Layout'

export default function EditIncome() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const existing = location.state?.income

  const [form, setForm] = useState({
    source: existing?.source || '',
    amount: existing?.amount || '',
    date: existing?.date || '',
  })
  const [error, setError] = useState('')

  if (!existing) {
    return (
      <Layout>
        <p className="text-text-muted">
          No income data found. Please go back to{' '}
          <button onClick={() => navigate('/income')} className="text-purple underline">
            Income
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
      await api.put(`/income/${id}`, {
        ...form,
        amount: parseFloat(form.amount),
        userId: existing.userId,
      })
      navigate('/income')
    } catch (err) {
      setError(err.response?.data?.amount || err.response?.data?.error || 'Failed to update income')
    }
  }

  return (
    <Layout>
      <div className="max-w-md">
        <h1 className="text-2xl font-bold text-text mb-6">Edit Income</h1>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <input
            name="source" placeholder="Source" value={form.source} onChange={handleChange}
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
              onClick={() => navigate('/income')}
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