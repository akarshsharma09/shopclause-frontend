import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function DealsOfTheDay() {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await api.get("/products/deals"); // ✅ backend se deals
        setDeals(res.data);
      } catch (err) {
        console.error("Error fetching deals:", err);
      }
    };
    fetchDeals();
  }, []);

  return (
    <div className="mt-6 px-2 md:px-10">
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        Deals of the Day
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {deals.length > 0 ? (
          deals.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)} // ✅ ProductDetail page pe le jao
              className="bg-white p-3 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
            >
              <img
                //src={product.image}
                src={`https://shopclause-backend-production.up.railway.app/uploads/${product.image}`} 
                alt={product.name}
                className="w-full h-32 object-contain mb-2"
              />
              <h3 className="text-sm font-medium text-gray-700 truncate">
                {product.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 line-through">
                  ₹{product.price}
                </span>
                <span className="text-blue-600 font-semibold">
                  ₹{product.deal_price}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No deals available</p>
        )}
      </div>
    </div>
  );
}
