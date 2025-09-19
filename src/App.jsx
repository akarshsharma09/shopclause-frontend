import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { isTokenExpired } from "./utils/auth";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import ProductDetail from "./pages/ProductDetail";
import MyOrders from "./pages/MyOrders";
import Wishlist from "./pages/Wishlist";
import { Toaster } from "react-hot-toast";
import Settings from "./pages/Settings";
// PrivateRoute component to protect private pages
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [logoutToast, setLogoutToast] = useState("");

  // ✅ Global JWT User State
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Open login modal
  const handleOpenLogin = () => {
    setShowLogin(true);
    setIsModalOpen(true);
  };

  // Logout function
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null); // ✅ clear state also
      setLogoutToast("Logout Successful!");
      setTimeout(() => setLogoutToast(""), 3000);
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  // ✅ Check token expiry on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      handleLogout(); // 🔒 Auto logout if expired
    }
  }, []);

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen flex flex-col font-sans">
        {/* ✅ Logout Toast */}
        {logoutToast && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg z-[9999] flex items-center gap-3 animate-fade-in-out">
            <span className="font-medium">{logoutToast}</span>
            <button
              onClick={() => setLogoutToast("")}
              className="text-white text-lg font-bold leading-none hover:text-gray-200"
            >
              ×
            </button>
          </div>
        )}

        {/* Navbar */}
        <Navbar
          user={user}
          onLoginClick={handleOpenLogin}
          onLogout={handleLogout}
        />

        {/* Routes */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/categories/:categoryId" element={<Products />} />
            <Route path="/settings" element={<Settings />} />

            <Route
              path="/wishlist"
              element={
                <Wishlist
                  setIsModalOpen={setIsModalOpen}
                  setShowLogin={setShowLogin}
                />
              }
            />

            <Route
              path="/product/:productId"
              element={
                <ProductDetail
                  setIsModalOpen={setIsModalOpen}
                  setShowLogin={setShowLogin}
                />
              }
            />

            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  {/* ✅ pass setUser */}
                  <Profile user={user} setUser={setUser} />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-orange-400 to-pink-500 text-white py-4 text-center flex flex-col items-center gap-2">
          <p>© {new Date().getFullYear()} ShopClues. All Rights Reserved.</p>

          {/* Portfolio link */}
          <a
            href="https://akarshcodes.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-gray-200 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l6.16-3.422a12.083 12.083 0 01.84 5.422l-7 4-7-4a12.083 12.083 0 01.84-5.422L12 14z"
              />
            </svg>
            <span className="text-sm font-medium">
              Developed by Akarsh Sharma
            </span>
          </a>
        </footer>

        {/* Login / Signup Modal */}
        {isModalOpen &&
          (showLogin ? (
            <Login
              onClose={() => setIsModalOpen(false)}
              switchToSignup={() => setShowLogin(false)}
              setUser={setUser} // ✅ when login, update global user
            />
          ) : (
            <Signup
              onClose={() => setIsModalOpen(false)}
              switchToLogin={() => setShowLogin(true)}
              setUser={setUser}
            />
          ))}
      </div>
    </Router>
  );
}

export default App;
