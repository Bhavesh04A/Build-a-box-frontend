import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PRODUCTS from "../data/products";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function BoxHistory() {
  const { token } = useAuth();
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [editBoxId, setEditBoxId] = useState(null);
  const [editBoxName, setEditBoxName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editItems, setEditItems] = useState([]);
  const [editSubType, setEditSubType] = useState("one-time");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setCartItems, setSubscriptionType } = useCart();

  const categories = Array.from(new Set(PRODUCTS.map(p => p.category)));

  useEffect(() => {
    if (token) {
      setLoading(true);
      axios
        .get("/api/box", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setBoxes(res.data))
        .finally(() => setLoading(false));
    }
  }, [token, location.pathname]);

  const handleEdit = (box) => {
    setEditBoxId(box._id);
    setEditBoxName(box.name || "");
    setEditCategory("");
    setEditItems([...box.items]);
    setEditSubType(box.subscriptionType || "one-time");
    setMsg("");
  };

  const handleCategorySelect = (cat) => {
    setEditCategory(cat);
  };

  // ==== हर जगह _id से पहचानें ====
  const handleProductToggle = (prod) => {
    const idx = editItems.findIndex(i => i._id === prod._id);
    if (idx !== -1) {
      setEditItems(editItems.filter(i => i._id !== prod._id));
    } else {
      setEditItems([...editItems, { ...prod, quantity: 1 }]);
    }
  };

  const handleQtyChange = (prodId, qty) => {
    setEditItems(editItems.map(i =>
      i._id === prodId ? { ...i, quantity: Number(qty) } : i
    ));
  };

  const handleRemoveEditItem = (prodId) => {
    setEditItems(editItems.filter(i => i._id !== prodId));
  };

  const handleSubTypeChange = (e) => setEditSubType(e.target.value);

  const handleSave = async () => {
    if (!editBoxName.trim()) {
      setMsg("Box name cannot be empty.");
      setSaving(false);
      return;
    }
    if (editItems.length === 0) {
      setMsg("Please select at least one product.");
      setSaving(false);
      return;
    }
    setSaving(true);
    setMsg("");
    try {
      await axios.put(
        `/api/box/${editBoxId}`,
        {
          name: editBoxName,
          items: editItems,
          subscriptionType: editSubType,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBoxes((prev) =>
        prev.map((b) =>
          b._id === editBoxId
            ? { ...b, name: editBoxName, items: editItems, subscriptionType: editSubType }
            : b
        )
      );
      setMsg("Box updated successfully!");
      setEditBoxId(null);
      setEditCategory("");
      setEditItems([]);
      setEditBoxName("");
    } catch (error) {
      setMsg("Failed to update box.");
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setEditBoxId(null);
    setEditCategory("");
    setEditItems([]);
    setEditBoxName("");
    setMsg("");
  };

  const handleDelete = async (boxId) => {
    if (!window.confirm("Are you sure you want to delete this box?")) return;
    try {
      await axios.delete(`/api/box/${boxId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoxes(boxes.filter(b => b._id !== boxId));
      setMsg("Box deleted successfully.");
    } catch {
      setMsg("Failed to delete box.");
    }
  };

  // Checkout: set cart context and navigate
  const handleCheckout = (items, subscriptionType) => {
    setCartItems(items, subscriptionType);
    setSubscriptionType(subscriptionType);
    navigate("/checkout");
  };

  const productsInThisCategory = editCategory
    ? PRODUCTS.filter(p => p.category === editCategory)
    : [];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Your Boxes</h2>

      {loading && <div className="text-blue-500 mb-4">Loading boxes...</div>}
      {msg && (
        <div className={`mb-4 font-semibold ${msg.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
          {msg}
        </div>
      )}

      {boxes.length === 0 && !loading && (
        <div className="text-center">
          <div className="text-gray-600 mb-4">You have no boxes yet.</div>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
          >
            Create New Box
          </button>
        </div>
      )}

      {boxes.map((box) => (
        <div key={box._id} className="mb-6 p-5 border rounded-lg shadow-sm bg-gray-50">
          {editBoxId === box._id ? (
            <>
              {/* Box Name Input */}
              <div className="mb-4">
                <label className="font-semibold text-blue-600">Box Name:</label>
                <input
                  className="border rounded px-3 py-2 w-full mt-1"
                  value={editBoxName}
                  onChange={e => setEditBoxName(e.target.value)}
                  placeholder="Enter box name"
                  required
                />
              </div>
              {!editCategory ? (
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-blue-600">Select a Category</h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  {editItems.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-2 text-blue-700">Selected Products</h4>
                      <ul className="space-y-1 ml-2">
                        {editItems.map((item, idx) => (
                          <li key={item._id + idx} className="flex justify-between items-center pr-6">
                            <span>
                              {item.name} <span className="text-gray-500">x {item.quantity}</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={e => handleQtyChange(item._id, e.target.value)}
                                className="w-14 border rounded px-2 py-1 text-center"
                                style={{ marginRight: 8 }}
                              />
                              <button
                                onClick={() => handleRemoveEditItem(item._id)}
                                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                title="Remove"
                              >
                                ×
                              </button>
                              <span className="text-blue-600 font-semibold ml-2">₹{item.price}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleCheckout(editItems, editSubType)}
                      className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
                      disabled={editItems.length === 0}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="mb-3 text-xl font-semibold text-blue-600">{editCategory} Products</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {productsInThisCategory.map((prod) => {
                      const selected = editItems.some(i => i._id === prod._id);
                      const quantity = editItems.find(i => i._id === prod._id)?.quantity || 1;
                      return (
                        <div
                          key={prod._id}
                          className={`border rounded p-3 cursor-pointer select-none ${
                            selected ? "bg-blue-200 border-blue-500" : "bg-white border-gray-300"
                          }`}
                          onClick={() => handleProductToggle(prod)}
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-24 object-cover rounded mb-2"
                          />
                          <div className="font-semibold">{prod.name}</div>
                          <div className="text-sm text-gray-600">₹{prod.price}</div>
                          {selected && (
                            <div className="mt-2 flex items-center justify-between">
                              <label className="text-sm font-medium">Qty:</label>
                              <input
                                type="number"
                                min={1}
                                value={quantity}
                                onClick={e => e.stopPropagation()}
                                onChange={e => handleQtyChange(prod._id, e.target.value)}
                                className="w-16 border rounded px-2 py-1 text-center"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {editItems.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-blue-700">Selected Products</h4>
                      <ul className="space-y-1 ml-2">
                        {editItems.map((item, idx) => (
                          <li key={item._id + idx} className="flex justify-between items-center pr-6">
                            <span>
                              {item.name} <span className="text-gray-500">x {item.quantity}</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={e => handleQtyChange(item._id, e.target.value)}
                                className="w-14 border rounded px-2 py-1 text-center"
                                style={{ marginRight: 8 }}
                              />
                              <button
                                onClick={() => handleRemoveEditItem(item._id)}
                                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                title="Remove"
                              >
                                ×
                              </button>
                              <span className="text-blue-600 font-semibold ml-2">₹{item.price}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="font-semibold text-blue-600 mr-3">Subscription Type:</label>
                    <select
                      value={editSubType}
                      onChange={handleSubTypeChange}
                      className="border rounded px-3 py-1"
                    >
                      <option value="one-time">One-time</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <button
                      disabled={saving}
                      onClick={handleSave}
                      className={`bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition font-semibold ${
                        saving ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500 transition font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setEditCategory("")}
                      className="bg-blue-100 text-blue-700 px-5 py-2 rounded hover:bg-blue-200 transition font-semibold"
                    >
                      Back to Categories
                    </button>
                    <button
                      onClick={() => handleCheckout(editItems, editSubType)}
                      className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition font-semibold"
                      disabled={editItems.length === 0}
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* Box Name Display */}
              <div className="font-bold text-lg text-blue-700 mb-1">{box.name}</div>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="font-semibold text-blue-600">Subscription:</span>{" "}
                  <span className="capitalize">{box.subscriptionType}</span>
                </div>
                <div className="text-gray-500 text-xs">
                  {new Date(box.createdAt).toLocaleString()}
                </div>
              </div>
              <ul className="mb-3 space-y-1 ml-4">
                {box.items.map((item, idx) => (
                  <li key={item._id + idx} className="flex justify-between pr-6">
                    <div>
                      <span className="font-medium">{item.name}</span>{" "}
                      <span className="text-gray-500">x {item.quantity}</span>
                    </div>
                    <div className="text-blue-600 font-semibold">₹{item.price}</div>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(box)}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(box._id)}
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 font-semibold"
                >
                  Remove
                </button>
                <button
                  onClick={() => handleCheckout(box.items, box.subscriptionType)}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 font-semibold"
                  disabled={box.items.length === 0}
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
