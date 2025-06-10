import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import categories from "../data/categories";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Products fetch
  useEffect(() => {
    const url = selectedCat ? `/api/products?category=${selectedCat}` : "/api/products";
    axios.get(url).then(res => setProducts(res.data));
  }, [selectedCat, editingProduct, showAddModal]);

  // Add Product Form state
  const initialFormState = {
    name: "",
    price: "",
    image: "",
    category: "",
    description: ""
  };
  const [newProduct, setNewProduct] = useState(initialFormState);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-8">
      {/* Header and Add Product Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-blue-600">Products Management</h2>
        <button
          className="bg-blue-400 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Products List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {products.map(prod => (
            <motion.div
              key={prod._id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center relative"
            >
              <img src={prod.image} alt={prod.name} className="h-32 w-full object-cover rounded-lg mb-4" />
              <div className="text-center flex-1">
                <h3 className="font-semibold text-lg mb-1">{prod.name}</h3>
                <p className="text-blue-500 text-xl mb-2">₹{prod.price}</p>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">{prod.category}</span>
              </div>
              <div className="flex flex-row gap-2 mt-2">
              <button
                className="mt-4 bg-blue-400 hover:bg-blue-600 text-white px-4 py-1 rounded"
                onClick={() => setEditingProduct(prod)}
              >
                Edit
              </button>
              <button
                className=" mt-4 bg-red-400 hover:bg-red-600 text-white px-4 py-1 rounded"
                onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this product?")) {
                    await axios.delete(`/api/products/${prod._id}`);
                       setTimeout(async () => {
                        const url = selectedCat ? `/api/products?category=${selectedCat}` : "/api/products";
                        const res = await axios.get(url);
                        setProducts(res.data);
                      }, 200);
                  }
                }}
              >
                Delete
              </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Product Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <form
                className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newProduct.category) {
                    alert("Please select a category");
                    return;
                  }
                  try {
                    await axios.post('/api/products',  {...newProduct, price: Number(newProduct.price) });
                    setShowAddModal(false);
                    setNewProduct(initialFormState);
                  } catch (err) {
                    console.log(err);
                    alert("Failed to add product: " + (err.response?.data?.message || err.message));
                  }
                }}
              >
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Add New Product</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border rounded-lg"
                      value={newProduct.name}
                      onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                      type="number"
                      required
                      className="w-full p-2 border rounded-lg"
                      value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      required
                      className="w-full p-2 border rounded-lg bg-white"
                      value={newProduct.category}
                      onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg"
                      value={newProduct.image}
                      onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      className="w-full p-2 border rounded-lg"
                      rows="3"
                      value={newProduct.description}
                      onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>


      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            categories={categories}
            onClose={() => setEditingProduct(null)}
            onSave={async (updated) => {
              try {
                await axios.put(`/api/products/${updated._id}`, updated);
                setEditingProduct(null);
              } catch (err) {
                alert("Failed to update product");
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// EditProductModal.jsx (component inside same file for simplicity)
function EditProductModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState({ ...product });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <form className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md"
        onSubmit={e => { e.preventDefault(); onSave(form); }}>
        <h2 className="text-xl font-bold mb-4 text-blue-600">Edit Product</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input name="price" value={form.price} type="number" onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white" required>
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option value={cat.name} key={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded-lg" rows="3" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default AdminDashboard;
