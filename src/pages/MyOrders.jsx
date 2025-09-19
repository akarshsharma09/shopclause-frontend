import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSelector } from "react-redux";
import { Package, Truck, CreditCard } from "lucide-react";

export default function MyOrders() {
  const { token } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders"); // ✅ original working API
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="max-w-full sm:max-w-3xl mx-auto mt-8 px-4 mb-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl shadow-sm">
          <Package className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <p className="text-lg font-medium text-gray-600">
            You have not placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              {/* Order header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    <strong>Order ID:</strong> #{order.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`mt-2 md:mt-0 inline-block px-3 py-1 text-sm font-medium rounded-full ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order details */}
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                <p className="flex items-center gap-2 break-words">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span>
                    Payment:{" "}
                    <strong>
                      {order.paymentMode} ({order.paymentStatus})
                    </strong>
                  </span>
                </p>
                <p className="flex items-start gap-2 break-words">
                  <Truck className="w-5 h-5 text-gray-500 mt-1" />
                  <span className="flex-1">
                    Shipping: <strong>{order.address}</strong>
                  </span>
                </p>
                <p className="text-right ">
                  Total:{" "}
                  <span className="font-bold text-gray-900">
                    ₹{order.totalAmount}
                  </span>
                </p>
              </div>

              {/* Items */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-gray-800">Items:</h3>
                <ul className="space-y-2">
                  {order.OrderItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                    >
                      <span className="text-gray-700">
                        {item.Product.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-gray-900">
                        ₹{item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
