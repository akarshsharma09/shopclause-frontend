import React, { useState, useEffect } from "react";
import api from "../api/axios"; // ✅ axios instance import

const Signup = ({ onClose, switchToLogin }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // ✅ Call backend API
      const res = await api.post("/auth/signup", {
        name: fullName,
        email,
        password,
      });

      // response = { token, user }
      const { token, user } = res.data;

      // ✅ Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToast("Signup Successful!");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-600 text-xl font-semibold hover:text-black"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

        {/* Toast */}
        {toast && (
          <div className="mb-3 px-4 py-2 bg-green-500 text-white rounded text-center font-semibold">
            {toast}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center text-sm mb-3">{error}</p>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
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
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-3 rounded-lg"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <button
            onClick={switchToLogin}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
