import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; // Naya Import
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart"; // Naya Import
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute" // Naya Import
import AdminOrders from "./pages/AdminOrders"; // Naya Import
import ForgotPassword from "./pages/ForgotPassword"; // Naya Import


function App() {
  return (
    // 1. Sabse pehle saare Context Providers
    <AuthProvider>
      <CartProvider>
        {/* 2. Fir poori app ke liye ek hi BrowserRouter */}
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes - Inhe ProtectedRoute ke andar wrap karein */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forgotpassword"
                  element={
                    
                      <ForgotPassword />
                    
                  }
                />
                // App.jsx mein ye line wapas add karein

                // ... andar Routes mein:
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-orders"
                  element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                {/* <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />   */}
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;