import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);
      await api.post("/contact", { name, email, subject, message });
      toast.success("Message sent successfully!");
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Contact Us
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Get in Touch</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-600">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Subject"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                rows={5}
                placeholder="Write your message..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 transition"
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Contact Info & Map */}
        <div className="space-y-6">
          {/* Support Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <Mail className="text-orange-400 w-6 h-6" />
              <div>
                <p className="text-gray-600 font-medium">Email</p>
                <p className="text-gray-800 text-sm">support@shopclues.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <Phone className="text-orange-400 w-6 h-6" />
              <div>
                <p className="text-gray-600 font-medium">Phone</p>
                <p className="text-gray-800 text-sm">+91 9876543210</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <MapPin className="text-orange-400 w-6 h-6" />
              <div>
                <p className="text-gray-600 font-medium">Address</p>
                <p className="text-gray-800 text-sm">NRI City, Greater Noida, UP</p>
              </div>
            </div>
          </div>

          {/* Optional Map / Image */}
          <div className="bg-white rounded-xl shadow overflow-hidden h-64">
            <iframe
              title="ShopClues Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.605182839539!2d77.62081481500372!3d28.567234882400004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1c1dc20b3c8b%3A0x4f6b49e6c5d1c9de!2sGreater%20Noida%2C%20UP!5e0!3m2!1sen!2sin!4v1699467890123!5m2!1sen!2sin"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
