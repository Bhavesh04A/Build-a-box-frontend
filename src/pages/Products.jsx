import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [box, setBox] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/products`).then(res => setProducts(res.data));
  }, []);

  const handleAddToBox = (product) => {
    setBox((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-2 py-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-800 text-center">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-3 sm:p-4 rounded-lg bg-white shadow flex flex-col items-center"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 object-cover rounded"
            />
            <div className="text-center flex-1">
              <p className="font-semibold">{product.name}</p>
              <p className="text-blue-700 font-bold">₹{product.price}</p>
              <button
                onClick={() => handleAddToBox(product)}
                className="mt-2 px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition font-semibold"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
      <h2 className="mt-8 text-lg font-bold text-blue-700">Your Box</h2>
      <ul className="mt-2 space-y-1">
        {box.map((item) => (
          <li key={item._id} className="flex justify-between border-b py-1 text-sm">
            <span>{item.name} x {item.quantity}</span>
            <span className="text-blue-700 font-semibold">₹{item.price * item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
