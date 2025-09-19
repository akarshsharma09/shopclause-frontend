import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { User } from "lucide-react";
import toast from "react-hot-toast";

const Profile = ({ user, setUser }) => {
  const token = localStorage.getItem("token");

  const [displayName, setDisplayName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || null);

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedUser = res.data;

        setDisplayName(fetchedUser.name);
        setEmail(fetchedUser.email);
        setPhotoURL(fetchedUser.photoURL || null);

        // Update global user state
        if (setUser) setUser(fetchedUser);
        localStorage.setItem("user", JSON.stringify(fetchedUser));
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile.");
      }
    };

    if (token) fetchUser();
  }, [token, setUser]);

  // Update profile (name only)
  const handleProfileUpdate = async () => {
    if (!displayName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.put(
        "/users/profile",
        { name: displayName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = res.data.user;

      // Update local + global state
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
      setDisplayName(updatedUser.name);

      toast.success(res.data.message || "Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.response?.data?.message || "Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-12 pb-16">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

      <div className="flex flex-col items-center mb-4">
        {photoURL ? (
          <img
            src={photoURL}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-2 object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mb-2 bg-gray-100 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Full Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full p-2 bg-gray-100 rounded"
        />
      </div>

      <button
        onClick={handleProfileUpdate}
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white mt-8 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 transition"
        }`}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default Profile;
