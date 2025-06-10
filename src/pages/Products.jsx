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
    <div>
      <h1>Products</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded">
            <img src={product.image} alt={product.name} className="w-16 h-16 mx-auto mb-2" />
            <div className="text-center">
              <p>{product.name}</p>
              <p>₹{product.price}</p>
              <button
                onClick={() => handleAddToBox(product)}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
      <h2 className="mt-8">Your Box</h2>
      <ul>
        {box.map((item) => (
          <li key={item._id}>
            {item.name} x {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
