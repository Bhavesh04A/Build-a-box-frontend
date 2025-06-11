import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiBox } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const { user, token } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // State for orders and boxes
  const [orders, setOrders] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders and boxes on mount
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      axios.get(`${API_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API_URL}/api/box`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([ordersRes, boxesRes]) => {
        setOrders(ordersRes.data || []);
        setBoxes(boxesRes.data || []);
      })
      .catch(() => {
        setOrders([]);
        setBoxes([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Recent activity: last 2 orders + last 2 boxes
  const recentOrders = orders.slice(0, 2).map(order => ({
    type: "order",
    id: order._id,
    name: order.boxName || "Box",
    time: new Date(order.createdAt).toLocaleString()
  }));
  const recentBoxes = boxes.slice(0, 2).map(box => ({
    type: "box",
    id: box._id,
    name: box.name || "Box",
    time: new Date(box.createdAt).toLocaleString()
  }));
  const recentActivity = [...recentOrders, ...recentBoxes]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 4);

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-indigo-50 to-white py-6 px-2 sm:py-8 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-2">
          Welcome, {user?.name || "User"}!
        </h1>
        <p className="text-gray-600 mb-6 sm:mb-8">
          Here's a quick overview of your activity and stats.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div
            className="bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate("/orders")}
          >
            <FiShoppingCart className="text-indigo-600 text-2xl sm:text-3xl mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{orders.length}</div>
            <div className="text-gray-500">Orders</div>
          </div>
          <div
            className="bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate("/your-boxes")}
          >
            <FiBox className="text-green-500 text-2xl sm:text-3xl mb-2" />
            <div className="text-xl sm:text-2xl font-bold">{boxes.length}</div>
            <div className="text-gray-500">Your Boxes</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-8 sm:mb-10">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-indigo-700">Recent Activity</h2>
          {loading && <div className="text-blue-500">Loading...</div>}
          {!loading && recentActivity.length === 0 && (
            <div className="text-gray-500">No recent activity found.</div>
          )}
          <ul>
            {recentActivity.map((item, idx) => (
              <li
                key={item.type + item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 py-2 border-b last:border-b-0"
              >
                <span className={item.type === "order" ? "text-indigo-600" : "text-green-500"} style={{ fontSize: "1.2em" }}>
                  {item.type === "order" ? <FiShoppingCart /> : <FiBox />}
                </span>
                <span className="flex-1 text-sm sm:text-base">
                  {item.type === "order"
                    ? `Ordered box "${item.name}"`
                    : `Created box "${item.name}"`}
                </span>
                <span className="text-gray-400 text-xs sm:text-sm">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold shadow w-full sm:w-auto"
            onClick={() => navigate("/orders")}
          >
            View Orders
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold shadow w-full sm:w-auto"
            onClick={() => navigate("/your-boxes")}
          >
            View Boxes
          </button>
        </div>
      </div>
    </div>
  );
}
