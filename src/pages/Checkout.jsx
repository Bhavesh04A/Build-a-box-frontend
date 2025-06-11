import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cartItems, subscriptionType, checkout, boxName } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Discount logic
  let discountPercent = 0;
  if (subscriptionType === "monthly") discountPercent = 5;
  else if (subscriptionType === "weekly") discountPercent = 3;

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal - discountAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !address || !phone) {
      setError("Please fill all fields.");
      return;
    }
    setError("");
    setOrderPlaced(true);

    await checkout({
      name,
      address,
      phone,
      payment,
      boxName,
    });
  };

  useEffect(() => {
    if (orderPlaced) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [orderPlaced, navigate]);

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4 text-green-700">Order Placed!</h2>
        <p className="mb-2">Thank you for your order 🎉</p>
        <p className="text-gray-500 text-sm">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-2 py-8 sm:py-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#1769aa]">Checkout</h2>
      {cartItems.length > 0 && (
        <div className="mb-4 bg-blue-50 p-3 sm:p-4 rounded">
          <div className="font-semibold mb-2">Your Items:</div>
          <ul className="mb-2">
            {cartItems.map((item, idx) => (
              <li key={item.id + idx} className="flex justify-between text-sm sm:text-base">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="text-gray-700">Subtotal: ₹{subtotal}</div>
          {discountPercent > 0 && (
            <div className="text-green-700">
              {subscriptionType.charAt(0).toUpperCase() + subscriptionType.slice(1)} subscription discount ({discountPercent}%): -₹{discountAmount}
            </div>
          )}
          <div className="font-bold text-blue-700">Total: ₹{total}</div>
          <div className="text-sm text-gray-600 mb-2">Subscription: {subscriptionType}</div>
          {boxName && (
            <div className="text-sm text-green-700 mb-2">
              <span className="font-semibold">Box Name:</span> {boxName}
            </div>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <div className="mb-3 sm:mb-4">
          <label className="block mb-1 font-semibold">Full Name</label>
          <input
            required
            className="border rounded w-full p-2"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your Name"
          />
        </div>
        <div className="mb-3 sm:mb-4">
          <label className="block mb-1 font-semibold">Shipping Address</label>
          <textarea
            required
            className="border rounded w-full p-2"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Full Address"
          />
        </div>
        <div className="mb-3 sm:mb-4">
          <label className="block mb-1 font-semibold">Phone Number</label>
          <input
            required
            className="border rounded w-full p-2"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Phone Number"
            type="tel"
          />
        </div>
        <div className="mb-3 sm:mb-4">
          <label className="block mb-1 font-semibold">Payment Method</label>
          <select
            className="border rounded w-full p-2"
            value={payment}
            onChange={e => setPayment(e.target.value)}
          >
            <option value="cod">Cash on Delivery</option>
            <option value="card">Credit/Debit Card</option>
            <option value="upi">UPI</option>
          </select>
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#1769aa] to-[#43addf] text-white py-2 sm:py-3 rounded-full font-semibold hover:from-[#023047] hover:to-[#1769aa] transition text-base sm:text-lg shadow"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
