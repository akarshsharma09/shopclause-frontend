import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../features/wishlistSlice";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Wishlist({ setIsModalOpen, setShowLogin }) {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🛒 Add to Cart
  const handleAddToCart = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsModalOpen(true);
      setShowLogin(true);
      return;
    }

    try {
      const res = await api.post("/cart", {
        productId: item.id,
        quantity: 1,
      });

      console.log("Cart Response:", res.data);
      toast.success("🛒 Added to Cart");
      navigate("/cart");
    } catch (err) {
      console.error("Add to Cart Error:", err);
      toast.error("❌ Failed to add to cart");
    }
  };

  return (
    <div className="max-w-full sm:max-w-4xl md:max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              {/* Image */}
              <img
                // src={
                //   item.image ||
                //   "https://via.placeholder.com/200x150?text=No+Image"
                // }
                src={`https://shopclause-backend-production.up.railway.app/uploads/${item.image}`} 
                alt={item.name}
                className="w-full h-40 sm:h-44 md:h-48 lg:h-52 object-contain mb-3 cursor-pointer"
                onClick={() => navigate(`/product/${item.id}`)}
              />

              {/* Name */}
              <h3
                className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 cursor-pointer"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                {item.name}
              </h3>

              {/* Price */}
              <p className="text-blue-600 font-semibold mb-3">₹{item.price}</p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                <button
                  onClick={() => dispatch(removeFromWishlist(item.id))}
                  className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 text-sm"
                >
                  Remove
                </button>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
