import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddExpense from './pages/AddExpense'
import AddIncome from './pages/AddIncome'
import Expenses from './pages/Expenses'
import EditExpense from './pages/EditExpense'
import Income from './pages/Income'
import EditIncome from './pages/EditIncome'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-expense"
            element={
              <ProtectedRoute>
                <AddExpense />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-income"
            element={
              <ProtectedRoute>
                <AddIncome />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
  path="/edit-expense/:id"
  element={
    <ProtectedRoute>
      <EditExpense />
    </ProtectedRoute>
  }
/>
        <Route
  path="/income"
  element={
    <ProtectedRoute>
      <Income />
    </ProtectedRoute>
  }
/>
<Route
  path="/edit-income/:id"
  element={
    <ProtectedRoute>
      <EditIncome />
    </ProtectedRoute>
  }
/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App