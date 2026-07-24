import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

const COLORS = ['#8b5cf6', '#3b82f6', '#f97316', '#ec4899', '#22d3ee']

const toLocalDateString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [trend, setTrend] = useState([])
  const [summary, setSummary] = useState(null)
  const [range, setRange] = useState('1M')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/dashboard/${user.userId}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [user])

  useEffect(() => {
    if (!data) return

    if (range === '1M') {
      setSummary({
        totalIncome: data.totalIncome,
        totalExpense: data.totalExpense,
        savings: data.savings,
      })
      fetchDailyTrend()
    } else {
      fetchMonthlyTrend(range === '1Y' ? 12 : 6)
    }
  }, [user, range, data])

  const fetchMonthlyTrend = async (months) => {
    const now = new Date()
    const requests = []
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      requests.push(
        api.get(`/dashboard/${user.userId}`, {
          params: { month: d.getMonth() + 1, year: d.getFullYear() },
        }).then((res) => ({
          label: d.toLocaleString('default', { month: 'short' }),
          fullLabel: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
          expense: res.data.totalExpense,
          income: res.data.totalIncome,
        }))
      )
    }
    const results = await Promise.all(requests)
    setTrend(results)

    const totalIncome = results.reduce((sum, r) => sum + r.income, 0)
    const totalExpense = results.reduce((sum, r) => sum + r.expense, 0)
    setSummary({
      totalIncome,
      totalExpense,
      savings: totalIncome - totalExpense,
    })
  }

  const fetchDailyTrend = async () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const startDate = toLocalDateString(start)
    const endDate = toLocalDateString(end)

    const res = await api.get('/expenses/search', {
      params: { userId: user.userId, startDate, endDate, size: 1000, sortBy: 'date', direction: 'asc' },
    })

    const dailyTotals = {}
    res.data.content.forEach((exp) => {
      dailyTotals[exp.date] = (dailyTotals[exp.date] || 0) + exp.amount
    })

    const days = []
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = toLocalDateString(d)
      days.push({
        label: String(d.getDate()),
        fullLabel: d.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' }),
        expense: dailyTotals[key] || 0,
      })
    }
    setTrend(days)
  }

  if (loading || !summary) {
    return (
      <Layout>
        <p className="text-text-muted">Loading...</p>
      </Layout>
    )
  }

  const chartData = data
    ? Object.entries(data.expenseByCategory).map(([name, value]) => ({ name, value }))
    : []

  const rangeLabel = range === '1M' ? 'This Month' : range === '6M' ? 'Last 6 Months' : 'Last 12 Months'

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-text mb-6">{rangeLabel}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-90">Total Income</p>
            <TrendingUp size={18} />
          </div>
          <p className="text-2xl font-bold mt-2">₹{summary.totalIncome.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-90">Total Expense</p>
            <TrendingDown size={18} />
          </div>
          <p className="text-2xl font-bold mt-2">₹{summary.totalExpense.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-90">Savings</p>
            <Wallet size={18} />
          </div>
          <p className="text-2xl font-bold mt-2">₹{summary.savings.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-text-muted text-sm">Spending Trend</p>
            <p className="text-3xl font-bold text-text mt-1">₹{summary.totalExpense.toFixed(2)}</p>
          </div>
          <div className="flex gap-2">
            {['1M', '6M', '1Y'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                  range === r ? 'bg-purple text-white border-purple' : 'border-border text-text-muted hover:text-text'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div style={{ filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))' }}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#24242e" vertical={false} />
              <XAxis dataKey="label" stroke="#8b88a3" fontSize={12} interval={range === '1M' ? 3 : 0} />
              <YAxis stroke="#8b88a3" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#121218', border: '1px solid #24242e', borderRadius: 8, color: '#fff' }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullLabel || ''}
                formatter={(value) => [`₹${value.toFixed(2)}`, 'Expense']}
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#expenseGradient)"
                dot={{ fill: '#8b5cf6', r: range === '1M' ? 2 : 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-text font-semibold mb-4">Expenses by Category (This Month)</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={85} label>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#121218', border: '1px solid #24242e', borderRadius: 8, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-text-muted text-sm">No expenses yet this month</p>
          )}
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-text font-semibold mb-4">Recent Expenses</h2>
          <div className="space-y-3">
            {data.recentExpenses.length > 0 ? (
              data.recentExpenses.map((exp) => (
                <div key={exp.id} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-text text-sm font-medium">{exp.title}</p>
                    <p className="text-text-muted text-xs">{exp.category} • {exp.date}</p>
                  </div>
                  <p className="text-text font-semibold">₹{exp.amount.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-text-muted text-sm">No recent expenses</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}