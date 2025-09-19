import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function Settings() {
  const user = useSelector((state) => state.auth.user);

  // Form state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const handleProfileSave = () => {
    // 🔹 Profile save logic
    toast.success("Profile updated successfully!");
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    // 🔹 Password change logic
    toast.success("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Settings</h2>

      {/* Account Info */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Account Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <button
          onClick={handleProfileSave}
          className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition"
        >
          Save Changes
        </button>
      </div>

      {/* Change Password */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Change Password</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
        <button
          onClick={handlePasswordChange}
          className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition"
        >
          Update Password
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={() => handleNotificationChange("email")}
              className="h-4 w-4 accent-orange-500"
            />
            Email Notifications
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifications.sms}
              onChange={() => handleNotificationChange("sms")}
              className="h-4 w-4 accent-orange-500"
            />
            SMS Notifications
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={() => handleNotificationChange("push")}
              className="h-4 w-4 accent-orange-500"
            />
            Push Notifications
          </label>
        </div>
      </div>
    </div>
  );
}
