import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './components/theme/ThemeProvider'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import UsersWithModals from './pages/UsersWithModals'
import Transfers from './pages/Transfers'
import Agencies from './pages/Agencies'
import Agents from './pages/Agents'
import FeesCommissions from './pages/FeesCommissions'
import Reports from './pages/Reports'
import Security from './pages/Security'
import Settings from './pages/Settings'
import RicashDemo from './pages/RicashDemo'
import RicashFinalDemo from './pages/RicashFinalDemo'
import RicashTest from './pages/RicashTest'
import RicashTableActionsDemo from './pages/RicashTableActionsDemo'
import ExchangeRates from './pages/ExchangeRates'
import Users from './pages/Users'
import Login from './pages/Login'

// Import des pages de détails et d'édition
import AgentDetailsPage from './pages/AgentDetailsPage'
import AgentPerformancePage from './pages/AgentPerformancePage'
import EditAgentPage from './pages/EditAgentPage'
import CreateAgentPage from './pages/CreateAgentPage'
import AgencyDetailsPage from './pages/AgencyDetailsPage'
import EditAgencyPage from './pages/EditAgencyPage'
import CreateAgencyPage from './pages/CreateAgencyPage'
import UserDetailsPage from './pages/UserDetailsPage'
import EditUserPage from './pages/EditUserPage'
import CreateUserPage from './pages/CreateUserPage'
import CreateTransferPage from './pages/CreateTransferPage'
import TransferDetailsPage from './pages/TransferDetailsPage'
import KycValidationPage from './pages/KycValidationPage'
import UserStatusPage from './pages/UserStatusPage'
import BlockUnblockPage from './pages/BlockUnblockPage'
import FeesConfigPage from './pages/FeesConfigPage'
import CreateSecurityAlertPage from './pages/CreateSecurityAlertPage'
import SettingsPage from './pages/SettingsPage'
import CreateRatePage from './pages/CreateRatePage'
import ProfilePage from './pages/ProfilePage'

import './App.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/app" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="users/kyc" element={<Users />} />
              <Route path="users/suspended" element={<Users />} />
             <Route path="users/:id" element={<UserDetailsPage />} />
              <Route path="users/:id/edit" element={<EditUserPage />} />
              <Route path="users/create" element={<CreateUserPage />} />
              <Route path="users/kyc/:id" element={<KycValidationPage />} />
              <Route path="users/:id/status" element={<UserStatusPage />} />
              <Route path="users/:id/block" element={<BlockUnblockPage />} />
              <Route path="transfers" element={<Transfers />} />
              <Route path="transfers/pending" element={<Transfers />} />
              <Route path="transfers/suspicious" element={<Transfers />} />
              <Route path="transfers/create" element={<CreateTransferPage />} />
              <Route path="transfers/:id/details" element={<TransferDetailsPage />} />
              <Route path="agencies" element={<Agencies />} />
              <Route path="agencies/:id/details" element={<AgencyDetailsPage />} />
              <Route path="agencies/:id/edit" element={<EditAgencyPage />} />
              <Route path="agencies/create" element={<CreateAgencyPage />} />
              <Route path="agents" element={<Agents />} />
              <Route path="agents/:id" element={<AgentDetailsPage />} />
{/* <Route path="agents/:id/details" element={<AgentDetailsPage />} /> */}
              <Route path="agents/:id/performance" element={<AgentPerformancePage />} />
              <Route path="agents/:id/edit" element={<EditAgentPage />} />
              <Route path="agents/create" element={<CreateAgentPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="settings/fees" element={<FeesCommissions />} />
              <Route path="settings/fees/config" element={<FeesConfigPage />} />
              <Route path="settings/rates" element={<ExchangeRates />} />
              <Route path="settings/rates/create" element={<CreateRatePage />} />
              <Route path="settings/security" element={<Security />} />
              <Route path="reports" element={<Reports />} />
              <Route path="security" element={<Security />} />
              <Route path="security/alert/create" element={<CreateSecurityAlertPage />} />
              <Route path="ricash-demo" element={<RicashDemo />} />
              <Route path="ricash-final-demo" element={<RicashFinalDemo />} />
              <Route path="ricash-test" element={<RicashTest />} />
              <Route path="ricash-table-actions" element={<RicashTableActionsDemo />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

