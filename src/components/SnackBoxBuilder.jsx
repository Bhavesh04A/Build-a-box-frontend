import { useMemo, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { useCategory } from "../context/CategoryContext";
import { FiX, FiPlus, FiMinus, FiBox } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const SUBSCRIPTION_OPTIONS = [
  { label: "One Time", value: "one-time", discount: 0 },
  { label: "Weekly (3% OFF)", value: "weekly", discount: 0.03 },
  { label: "Monthly (5% OFF)", value: "monthly", discount: 0.05 },
];

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};
const productVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 80, damping: 15 } }
};

export default function SnackBoxBuilder() {
  const { selectedCategory, search } = useCategory();
  const {
    cartItems: box,
    addToCart,
    removeFromCart,
    updateQuantity,
    subscriptionType,
    setSubscriptionType,
    loading,
    clearCart,
  } = useCart();
  const { token } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [msg, setMsg] = useState("");
  const [boxName, setBoxName] = useState("");
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  useEffect(() => {
    const url = selectedCategory
      ? `${API_URL}/api/products?category=${encodeURIComponent(selectedCategory)}`
      : `${API_URL}/api/products`;
    axios.get(url).then(res => setProducts(res.data));
  }, [selectedCategory]);

  // ======= FILTERING =======
  const safeSearch = (search || "").trim().toLowerCase();
  const filteredAvailable = useMemo(() => {
    let filtered = products;
    if (safeSearch) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(safeSearch)
      );
    }
    return filtered;
  }, [products, safeSearch]);

  // ======= Box Controls (सिर्फ _id से काम करें) =======
  const handleAddToBox = (product) => {
    addToCart(product);
  };
  const handleRemoveFromBox = (product) => removeFromCart(product._id);
  const handleIncrease = (product) =>
    updateQuantity(product._id, (product.quantity || 1) + 1);
  const handleDecrease = (product) =>
    updateQuantity(product._id, (product.quantity || 1) - 1);

  const handleClearBox = () => {
    if (typeof clearCart === "function") clearCart();
  };

  const onDragStart = () => setIsDragging(true);
  const onDragEnd = (result) => {
    setIsDragging(false);
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === "available" && destination.droppableId === "box") {
      const productId = draggableId.split("-")[0];
      const product = filteredAvailable.find((p) => String(p._id) === productId);
      if (product) handleAddToBox(product);
    }
  };

  // ==== Price Calculation with Discount ====
  const subtotal = box.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const discountRate =
    SUBSCRIPTION_OPTIONS.find((opt) => opt.value === subscriptionType)?.discount || 0;
  const discount = Math.round(subtotal * discountRate);
  const total = subtotal - discount;

  // ==== Box Create (save) ====
  const handleCreateBox = async () => {
    setMsg("");
    if (!boxName.trim()) {
      setMsg("Please enter a box name.");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/api/box`,
        {
          name: boxName,
          items: box,
          subscriptionType,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMsg("Box created successfully!");
      if (typeof clearCart === "function") clearCart();
      navigate("/your-boxes");
    } catch (err) {
      setMsg("Something went wrong. Please try again.");
    }
  };

  // ==== Checkout: Go to /checkout with context ====
  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f5faff] via-[#e9f3fc] to-[#f7faff] py-6 px-2 sm:py-10 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          {/* Products Grid */}
          <div className="mb-8 sm:mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 text-[#1769aa] tracking-tight drop-shadow-lg">
              <span className="bg-gradient-to-r from-[#43addf] to-[#1769aa] bg-clip-text text-transparent">
               Gallery
              </span>
            </h3>
            <Droppable
              droppableId="available"
              direction="vertical"
              isDropDisabled={false}
            >
              {(provided) => (
                <motion.div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 md:gap-8"
                  style={{ minHeight: 200 }}
                  variants={gridVariants}
                  initial="hidden"
                  animate="visible"
                >
                 <AnimatePresence>
                    {filteredAvailable.map((product, index) => (
                      <Draggable
                        key={`${product._id}-${index}`}
                        draggableId={`${product._id}-${index}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            variants={productVariants}
                            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #43addf33" }}
                            className={`relative flex flex-col items-center bg-white rounded-2xl border border-[#43addf] shadow-md w-full max-w-[140px] h-[110px] sm:h-[140px] mx-auto p-2 sm:p-3 transition-all ${
                              snapshot.isDragging ? "ring-4 ring-[#43addf]/40 scale-105 z-10" : ""
                            }`}
                            style={{
                              aspectRatio: "1/1",
                              minWidth: 90,
                              minHeight: 90,
                              cursor: "grab",
                            }}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 80, damping: 15 }}
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-xl mb-2 pointer-events-none shadow"
                            />
                            <div className="text-center mb-1">
                              <p className="font-extrabold text-[#023047] text-xs sm:text-base">
                                {product.name}
                              </p>
                              <p className="text-[#1769aa] font-semibold text-xs">
                                ₹{product.price}
                              </p>
                            </div>
                            <button
                              onClick={e => {
                                e.preventDefault();
                                handleAddToBox(product);
                              }}
                              className="mt-1 px-2 py-1 sm:px-3 bg-gradient-to-r from-[#43addf] to-[#1769aa] text-white rounded-full hover:scale-105 font-semibold text-xs transition shadow"
                            >
                              Add
                            </button>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </AnimatePresence>
                </motion.div>
              )}
            </Droppable>
          </div>

          {/* Your Box */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center">
            <motion.div
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#43addf] relative pb-6 pt-4 px-3 sm:pb-8 sm:pt-6 sm:px-6"
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
            >
              {/* Box Header with Clear Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
                <div className="flex items-center">
                  <FiBox className="text-[#1769aa] mr-2" size={24} />
                  <h3 className="text-xl sm:text-2xl font-bold text-[#023047] tracking-wide">
                    Your Box
                  </h3>
                </div>
                {box.length > 0 && (
                  <button
                    onClick={handleClearBox}
                    className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition"
                  >
                    Clear Box
                  </button>
                )}
              </div>
             <Droppable droppableId="box" direction="vertical">
                {(provided, snapshot) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 min-h-[90px] sm:min-h-[120px] py-2 transition-all duration-300 ${
                      snapshot.isDraggingOver ? "bg-[#43addf]/10" : ""
                    }`}
                  >
                    {box.length === 0 && (
                      <div className="col-span-full flex flex-col items-center justify-center py-6 sm:py-10">
                        <FiBox className="text-[#a7d7ee] mb-2" size={38} />
                        <span className="text-[#1769aa] font-medium text-base sm:text-lg">
                          Your box is empty. Add some snacks!
                        </span>
                      </div>
                    )}
                    <AnimatePresence>
                      {box.map((product, index) => (
                        <Draggable
                          key={String(product._id)}
                          draggableId={String(product._id)}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ scale: 0.92, opacity: 0, y: 20 }}
                              animate={{ scale: 1, opacity: 1, y: 0 }}
                              exit={{ scale: 0.7, opacity: 0, y: 40 }}
                              transition={{ type: "spring", stiffness: 120, damping: 14 }}
                              className={`relative flex flex-col items-center bg-gradient-to-br from-[#e3f6fd] to-[#b6e0fa] rounded-xl border-2 border-[#43addf] shadow-md w-full max-w-[110px] h-[90px] sm:h-[110px] mx-auto p-2 transition-all
                                ${snapshot.isDragging ? "ring-4 ring-[#43addf]/40 scale-105" : ""}
                              `}
                              style={{ aspectRatio: "1/1", minWidth: 70, minHeight: 70, cursor: "grab" }}
                            >
                              <button
                                onClick={() => handleRemoveFromBox(product)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                title="Remove"
                              >
                                <FiX size={12} />
                              </button>
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg mb-1 pointer-events-none"
                              />
                              <div className="text-center">
                                <p className="font-bold text-[#023047] text-xs">{product.name}</p>
                                <p className="text-[#1769aa] font-semibold text-xs">₹{product.price}</p>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 mt-1">
                                <button
                                  onClick={() => handleDecrease(product)}
                                  className="bg-[#a7d7ee] text-[#023047] rounded-full p-1 hover:bg-[#43addf] hover:text-white"
                                  disabled={product.quantity <= 1}
                                  style={{ width: 16, height: 16 }}
                                >
                                  <FiMinus size={9} />
                                </button>
                                <span className="font-bold text-[#023047] text-xs">{product.quantity}</span>
                                <button
                                  onClick={() => handleIncrease(product)}
                                  className="bg-[#a7d7ee] text-[#023047] rounded-full p-1 hover:bg-[#43addf] hover:text-white"
                                  style={{ width: 16, height: 16 }}
                                >
                                 <FiPlus size={9} />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </AnimatePresence>
                  </motion.div>
                )}
              </Droppable>
              {/* ==== CREATE BOX BUTTON ==== */}
              <div className="text-right mt-4">
                <div className="mb-4">
                    <label className="block font-semibold mb-1">Box Name</label>
                    <input
                      className="border rounded w-full p-2"
                      value={boxName}
                      onChange={e => setBoxName(e.target.value)}
                      placeholder="Enter box name"
                      required
                    />
                </div>
                <button
                  className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition font-semibold"
                  onClick={handleCreateBox}
                  disabled={loading || box.length === 0}
                >
                  {loading ? "Processing..." : "Create Box"}
                </button>
                {msg && <div className="text-green-700 font-semibold mt-2">{msg}</div>}
              </div>
            </motion.div>
          </div>

          {/* Checkout/Price Summary */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center">
            <motion.div
              className="w-full max-w-xl bg-gradient-to-tr from-[#1769aa] via-[#43addf] to-[#a7d7ee] p-4 sm:p-8 rounded-2xl shadow-xl border-2 border-[#1769aa] flex flex-col items-center"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
            >
              <div className="flex items-center mb-4">
                <FiBox className="text-white bg-[#1769aa] rounded-full p-2 mr-3" size={32} />
                <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow">Checkout</h3>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 justify-center">
                {SUBSCRIPTION_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSubscriptionType(option.value)}
                    className={`px-4 py-2 rounded-full font-medium transition ${
                      subscriptionType === option.value
                        ? "bg-white text-[#1769aa] shadow-lg"
                        : "bg-[#1769aa] text-white hover:bg-[#023047]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full">
                <div className="flex justify-between mb-3">
                  <span className="text-[#023047]">Subtotal:</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-[#023047]">Discount:</span>
                  <span className="text-green-600 font-semibold">-₹{discount}</span>
                </div>
                <div className="flex justify-between text-lg sm:text-xl font-bold pt-3 border-t border-blue-200">
                  <span className="text-[#023047]">Total:</span>
                  <span className="text-[#1769aa]">₹{total}</span>
                </div>
                
                <button
                  className="w-full mt-6 bg-gradient-to-r from-[#1769aa] to-[#43addf] text-white py-3 rounded-full font-semibold hover:from-[#023047] hover:to-[#1769aa] transition text-base sm:text-lg shadow"
                  disabled={box.length === 0}
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </motion.div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
