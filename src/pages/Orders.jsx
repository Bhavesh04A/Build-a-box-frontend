import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;


export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setOrders(res.data))
      .catch(() => setMsg("Failed to load orders."))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Your Orders</h2>
      {loading && <div className="text-blue-500 mb-4">Loading orders...</div>}
      {msg && <div className="text-red-600 mb-4">{msg}</div>}
      {!loading && orders.length === 0 && (
        <div className="text-gray-600">No orders found.</div>
      )}
      {orders.map(order => (
        <div key={order._id} className="mb-6 p-5 border rounded-lg shadow-sm bg-gray-50">
          <div className="mb-2 flex justify-between">
            <span className="font-semibold text-blue-600">Order ID: {order._id}</span>
            <span className="text-gray-500 text-xs">{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          {/* Box Name */}
          {order.boxName && (
            <div className="mb-2 text-green-700 font-semibold">
              Box Name: {order.boxName}
            </div>
          )}
          <div className="mb-2">Subscription: <span className="capitalize">{order.subscriptionType}</span></div>
          <ul className="mb-2 ml-4">
            {order.items.map((item, idx) => (
              <li key={idx} className="flex justify-between pr-6">
                <span>{item.name} <span className="text-gray-500">x {item.quantity}</span></span>
                <span className="text-blue-600 font-semibold">₹{item.price}</span>
              </li>
            ))}
          </ul>
          <div className="font-bold text-blue-700">Total: ₹{order.total || ""}</div>
        </div>
      ))}
    </div>
  );
}
