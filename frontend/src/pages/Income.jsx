import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, TrendingUp } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

export default function Income() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [income, setIncome] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchIncome = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/income/user/${user.userId}`)
      setIncome(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncome()
  }, [user])

  const handleDelete = async (id) => {
    if (!confirm('Delete this income entry?')) return
    try {
      await api.delete(`/income/${id}`)
      fetchIncome()
    } catch (err) {
      console.error(err)
    }
  }

  const total = income.reduce((sum, inc) => sum + inc.amount, 0)

  return (
    <Layout>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-bold text-text mb-6">All Income</h1>

        <div className="bg-surface border border-border rounded-2xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-dim rounded-full blur-3xl" />
          <div className="flex items-center justify-between relative">
            <div>
              <p className="text-text-muted text-sm mb-1">Total Income</p>
              <p className="text-4xl font-bold text-text">₹{total.toFixed(2)}</p>
              <p className="text-text-muted text-xs mt-2">{income.length} {income.length === 1 ? 'entry' : 'entries'}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple flex items-center justify-center">
              <TrendingUp size={26} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <p className="text-text-muted text-sm p-6">Loading...</p>
          ) : income.length === 0 ? (
            <div className="p-12 text-center">
              <Wallet size={32} className="text-text-muted mx-auto mb-3" />
              <p className="text-text-muted text-sm">No income entries yet</p>
            </div>
          ) : (
            income.map((inc) => (
              <div
                key={inc.id}
                className="flex items-center justify-between px-6 py-4 border-b border-border last:border-0 hover:bg-surface-hover transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-dim flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={18} className="text-purple" />
                  </div>
                  <div>
                    <p className="text-text font-medium">{inc.source}</p>
                    <p className="text-text-muted text-xs mt-0.5">{inc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-text font-semibold text-lg">₹{inc.amount.toFixed(2)}</p>
                  <button
                    onClick={() => navigate(`/edit-income/${inc.id}`, { state: { income: inc } })}
                    className="text-purple text-sm hover:opacity-80 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(inc.id)}
                    className="text-red-400 text-sm hover:text-red-300 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}