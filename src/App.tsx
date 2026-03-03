import { BrowserRouter, Route, Routes } from "react-router";
import "./styles/index.css";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard.tsx";
import UserManagement from "./pages/UserManagement.tsx";
import VerificationManagement from "./pages/Verification.tsx";
import CommissionPayout from "./pages/CommissionPayout.tsx";
import WalletTransaction from "./pages/WalletTransactions.tsx";
import OfferFestival from "./pages/OfferFestival.tsx";
import CoinManagement from "./pages/CoinManagement.tsx";
import { AdminLayout } from "./layouts/AdminLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute.tsx";
import SecurityPage from "./pages/Security.tsx";
import { Toast } from "./ui/Toasters/Toast.tsx";
function App() {
  return (
    <BrowserRouter>
     <Toast/>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/user-management"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <UserManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/verification"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <VerificationManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/commission-payout"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CommissionPayout />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/wallet-transaction"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <WalletTransaction />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/coin-management"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CoinManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/offer-festival"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <OfferFestival />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/admin/security"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <SecurityPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
