import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-white shadow p-4 rounded">
      <img 
      // src={product.image} 
      src={`https://shopclause-backend-production.up.railway.app/uploads/${product.image}`} 
      alt={product.name} className="h-32 mx-auto" />
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-blue-600 font-bold">₹{product.price}</p>

      {/* 🔹 Add to Cart button */}
      <button
        onClick={() => dispatch(addToCart(product))}
        className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}
