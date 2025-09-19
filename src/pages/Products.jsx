import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Products() {
  const { categoryId } = useParams(); // categoryId (all ya koi id)
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("All Products");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const search = params.get("search") || "";

        if (categoryId === "all") {
          // ✅ Search across all products
          const res = await api.get("/products", {
            params: { search },
          });
          setProducts(res.data);
          setCategoryName("All Products");
        } else {
          // ✅ Fetch specific category
          const res = await api.get(`/categories/${categoryId}`);
          let categoryProducts = res.data.Products || [];

          // frontend side filter bhi (extra safety)
          if (search) {
            categoryProducts = categoryProducts.filter((p) =>
              p.name.toLowerCase().includes(search.toLowerCase())
            );
          }

          setProducts(categoryProducts);
          setCategoryName(res.data.name);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, location.search]);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">{categoryName}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer"
            >
              <img
                // src={
                //   product.image ||
                //   "https://via.placeholder.com/200x150?text=No+Image"
                // }
                src={`https://shopclause-backend-production.up.railway.app/uploads/${product.image}`} 
                alt={product.name}
                className="w-full h-40 object-contain mb-3"
              />
              <h3 className="text-sm font-medium text-gray-800">
                {product.name}
              </h3>
              <p className="text-blue-600 font-semibold">₹{product.price}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
