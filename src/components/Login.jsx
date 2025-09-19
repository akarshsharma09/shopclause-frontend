import React, { useState, useEffect } from "react";
import api from "../api/axios"; // ✅ axios instance import
// import { useDispatch } from "react-redux";
// import { setUser } from "../features/authSlice";

const Login = ({ onClose, switchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });

      // Backend pura object bhej raha hai (id, name, email, role, token)
      const { token, ...user } = res.data;

      // Save in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("userUpdated"));
      //console.log("User saved:", user);

      setToast("Login Successful!");
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-600 text-xl font-semibold hover:text-black"
          aria-label="Close login modal"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {/* Toast message */}
        {toast && (
          <div className="mb-3 px-4 py-2 bg-green-500 text-white rounded text-center font-semibold">
            {toast}
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-center text-sm mb-3">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-3 rounded-lg"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <button
            onClick={switchToSignup}
            className="text-green-600 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
