// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { addToWishlist } from "../features/wishlistSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export default function ProductDetail({ setIsModalOpen, setShowLogin }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handleAddToWishlist = () => {
    dispatch(addToWishlist(product));
    toast.success(" Added to Wishlist");
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // 🔒 Not logged in → show login modal instead of redirect
      setIsModalOpen(true);
      setShowLogin(true); // ✅ open login form directly
      return;
    }

    try {
      const res = await api.post("/cart", {
        productId: product.id,
        quantity,
      });

      console.log("Cart Response:", res.data);
      toast.success("🛒 Added to Cart"); // ✅ toast instead of alert
      navigate("/cart");
    } catch (err) {
      console.error("Add to Cart Error:", err);
      toast.error("❌ Failed to add to cart"); // ✅ error toast
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!product) return <p className="text-center py-10">Product not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Image */}
      <div className="flex justify-center">
        <img
          // src={
          //   product.image || "https://via.placeholder.com/400x400?text=No+Image"
          // }
          src={`https://shopclause-backend-production.up.railway.app/uploads/${product.image}`} 
          alt={product.name}
          className="w-full max-w-sm h-auto object-contain rounded-lg shadow"
        />
      </div>

      {/* Right: Info */}
      <div>
        <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>

        <p className="text-2xl font-semibold text-blue-600 mb-2">
          ₹{product.price}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
        </p>

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <div className="relative w-16">
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border rounded px-4 py-2 appearance-none pr-2 cursor-pointer"
            >
              {[...Array(5)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            {/* 👇 Custom arrow */}
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>
          <button
            onClick={handleAddToWishlist}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition"
          >
            Add to Wishlist
          </button>
        </div>

        {/* Category */}
        <p className="mt-8 text-gray-600 text-sm">
          Category:{" "}
          <span className="font-medium">{product.Category?.name}</span>
        </p>
      </div>
    </div>
  );
}
