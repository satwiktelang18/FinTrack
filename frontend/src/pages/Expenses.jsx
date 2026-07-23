import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'

export default function Expenses() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    direction: 'desc',
    page: 0,
  })

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      const params = { userId: user.userId, page: filters.page, size: 10, sortBy: filters.sortBy, direction: filters.direction }
      if (filters.keyword) params.keyword = filters.keyword
      if (filters.category) params.category = filters.category
      if (filters.startDate) params.startDate = filters.startDate
      if (filters.endDate) params.endDate = filters.endDate

      const res = await api.get('/expenses/search', { params })
      setExpenses(res.data.content)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [filters])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 0 })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return
    try {
      await api.delete(`/expenses/${id}`)
      fetchExpenses()
    } catch (err) {
      console.error(err)
    }
  }

  const goToPage = (newPage) => {
    setFilters({ ...filters, page: newPage })
  }

  return (
    <Layout>
    <div className="min-h-screen bg-bg">
      
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-text mb-6">All Expenses</h1>

        {/* Filters */}
        <div className="bg-surface border border-border rounded-2xl p-5 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            name="keyword" placeholder="Search title..." value={filters.keyword} onChange={handleFilterChange}
            className="bg-bg border border-border rounded-lg px-3 py-2 text-text text-sm placeholder-text-muted focus:outline-none focus:border-accent"
          />
          <input
            name="category" placeholder="Category" value={filters.category} onChange={handleFilterChange}
            className="bg-bg border border-border rounded-lg px-3 py-2 text-text text-sm placeholder-text-muted focus:outline-none focus:border-accent"
          />
          <select
            name="sortBy" value={filters.sortBy} onChange={handleFilterChange}
            className="bg-bg border border-border rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-accent"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="title">Sort by Title</option>
          </select>
          <input
            name="startDate" type="date" value={filters.startDate} onChange={handleFilterChange}
            className="bg-bg border border-border rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-accent"
          />
          <input
            name="endDate" type="date" value={filters.endDate} onChange={handleFilterChange}
            className="bg-bg border border-border rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-accent"
          />
          <select
            name="direction" value={filters.direction} onChange={handleFilterChange}
            className="bg-bg border border-border rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-accent"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {/* List */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <p className="text-text-muted text-sm p-6">Loading...</p>
          ) : expenses.length === 0 ? (
            <p className="text-text-muted text-sm p-6">No expenses found</p>
          ) : (
            expenses.map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between px-6 py-4 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-text font-medium">{exp.title}</p>
                  <p className="text-text-muted text-xs mt-0.5">
                    {exp.category || 'Uncategorized'} • {exp.date}
                    {exp.description && ` • ${exp.description}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
  <p className="text-text font-semibold">₹{exp.amount.toFixed(2)}</p>
  <button
    onClick={() => navigate(`/edit-expense/${exp.id}`, { state: { expense: exp } })}
    className="text-purple text-sm hover:opacity-80 transition"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(exp.id)}
    className="text-red-400 text-sm hover:text-red-300 transition"
  >
    Delete
  </button>
</div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => goToPage(Math.max(0, filters.page - 1))}
              disabled={filters.page === 0}
              className="px-3 py-1.5 rounded-lg border border-border text-text-muted text-sm hover:text-text hover:border-accent transition disabled:opacity-30 disabled:pointer-events-none"
            >
              Previous
            </button>
            <span className="text-text-muted text-sm px-2">
              Page {filters.page + 1} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(filters.page + 1)}
              disabled={filters.page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg border border-border text-text-muted text-sm hover:text-text hover:border-accent transition disabled:opacity-30 disabled:pointer-events-none"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
    </Layout>
  )
}