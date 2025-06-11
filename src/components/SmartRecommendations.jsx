import React from "react";

export default function SmartRecommendations({ products, box }) {
  const recommended = products
    .filter(p => !box.some(item => item.id === p.id))
    .slice(0, 3);

  if (recommended.length === 0) return null;

  return (
    <div className="my-8">
      <h3 className="font-bold mb-2 text-lg text-[#1769aa]">Recommended for you</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        {recommended.map(product => (
          <div key={product.id} className="border p-2 rounded w-full sm:w-32 text-center bg-white shadow">
            <img src={product.image} alt={product.name} className="w-16 h-16 mx-auto mb-2" />
            <div className="font-semibold">{product.name}</div>
            <div className="text-blue-700 font-bold">₹{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
