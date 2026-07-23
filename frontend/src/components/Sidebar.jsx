import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Receipt, PlusCircle, Wallet, DollarSign, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/add-expense', label: 'Add Expense', icon: PlusCircle },
  { to: '/income', label: 'Income', icon: DollarSign },
  { to: '/add-income', label: 'Add Income', icon: Wallet },
]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-border flex flex-col">
      <div className="px-6 py-6 border-b border-border">
        <h1 className="text-lg font-bold text-text">
          Expense Tracker <span className="text-purple">.</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition ${
                active
                  ? 'bg-purple text-white font-medium'
                  : 'text-text-muted hover:bg-surface-hover hover:text-text'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-6 border-t border-border">
        <div className="flex items-center justify-between px-2">
          <div>
            <p className="text-text text-sm font-medium">{user?.name}</p>
            <p className="text-text-muted text-xs">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-text-muted hover:text-text transition"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  )
}