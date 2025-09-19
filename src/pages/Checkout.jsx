import { useState, useEffect } from "react";
import api from "../api/axios";
import { statesAndCities } from "../data/states";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";
import PaymentDropdown from "../components/PaymentDropdown";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { user } = useSelector((state) => state.auth); // 👈 user from redux (id, name, email)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = user?.token || localStorage.getItem("token");

  // 🔹 Check login
  if (!token) {
    toast.error("Please login first");
    navigate("/login");
    return null;
  }

  // State variables
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMode, setPaymentMode] = useState("COD");

  const [cities, setCities] = useState([]);

  // 🔹 Update cities when state changes
  useEffect(() => {
    if (state && statesAndCities[state]) {
      setCities(statesAndCities[state]);
      setCity(statesAndCities[state][0]); // default first city
    } else {
      setCities([]);
      setCity("");
    }
  }, [state]);

  // 🔹 Checkout handler
  const handleCheckout = async (e) => {
    e.preventDefault();

    try {
      const fullAddress = `${address}, ${city}, ${state} - ${pincode}`;

      const { data } = await api.post(
        "/orders/checkout",
        {
          paymentMode,
          address: fullAddress, // backend ka address field
          city,
          state,
          pincode,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      toast.success(" Order placed successfully!"); // ✅ replaced alert

      // clear cart redux
      dispatch(clearCart());

      // go to orders page
      navigate("/orders");
    } catch (error) {
      console.error("Checkout failed:", error.response?.data || error.message);
      toast.error("❌ Failed to place order"); // ✅ replaced alert
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 border rounded-lg shadow mb-8">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>

      <form onSubmit={handleCheckout} className="space-y-4">
        {/* Name & Email (readonly) */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={user?.name || ""}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Street No, Landmark"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium">State</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select State --</option>
            {Object.keys(statesAndCities).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium">City/District</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded px-3 py-2"
            disabled={!cities.length}
          >
            <option value="">-- Select City --</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium">Pincode</label>
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Payment */}
        <PaymentDropdown
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
