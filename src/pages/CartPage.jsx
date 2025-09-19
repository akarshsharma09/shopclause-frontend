import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Trash2, ChevronDown } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch cart on load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart");
        setCart(res.data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // ✅ Update quantity
  const handleQuantityChange = async (itemId, quantity) => {
    try {
      await api.put(`/cart/${itemId}`, { quantity });
      setCart((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // ✅ Remove item
  const handleRemove = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      setCart((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // ✅ Total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.Product.price * item.quantity,
    0
  );

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Cart Items */}
          <div className="lg:col-span-2 space-y-4 w-full">
  {cart.map((item) => (
    <div
      key={item.id}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white shadow rounded-lg p-4 w-full"
    >
      {/* Product Image */}
      <img
        // src={item.Product.image || "https://via.placeholder.com/100x100?text=No+Image"}
        src={`https://shopclause-backend-production.up.railway.app/uploads/${item.Product.image}`} 
        alt={item.Product.name}
        className="w-20 h-20 object-contain rounded flex-shrink-0"
      />

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h2 className="font-medium text-lg break-words">{item.Product.name}</h2>
        <p className="text-gray-500 text-sm break-words">
          {item.Product.Category?.name}
        </p>
        <p className="text-blue-600 font-semibold">₹{item.Product.price}</p>
      </div>

      {/* Quantity & Remove Button */}
      <div className="flex items-center gap-4 mt-2 sm:mt-0 flex-shrink-0">
        <div className="relative w-20">
          <select
            value={item.quantity}
            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
            className="w-full border rounded px-3 py-2 appearance-none cursor-pointer"
          >
            {[...Array(5)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
        </div>

        <button
          onClick={() => handleRemove(item.id)}
          className="text-red-500 hover:text-white hover:bg-red-500 rounded p-1"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  ))}
</div>


          {/* Right - Summary */}
          <div className="bg-white shadow rounded-lg p-6 h-fit">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Total Items</span>
              <span>{cart.length}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Total Price</span>
              <span className="font-semibold">₹{totalPrice}</span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
