import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [subscriptionType, setSubscriptionType] = useState("one-time");
  const [loading, setLoading] = useState(false);
  const [boxName, setBoxName] = useState("");

  useEffect(() => {
    if (token) {
      setLoading(true);
      axios
        .get("/api/cart", {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
          setCartItems(res.data.items || []);
          setSubscriptionType(res.data.subscriptionType || "one-time");
          setBoxName(res.data.boxName || "");
        })
        .catch(() => {
          setCartItems([]);
          setSubscriptionType("one-time");
          setBoxName("");
        })
        .finally(() => setLoading(false));
    } else {
      setCartItems([]);
      setSubscriptionType("one-time");
      setBoxName("");
    }
  }, [token]);

  const updateCartBackend = (newItems, newType = subscriptionType, newBoxName = boxName) => {
    setCartItems(newItems);
    setSubscriptionType(newType);
    setBoxName(newBoxName);
    if (token) {
      axios.put(
        "/api/cart",
        { items: newItems, subscriptionType: newType, boxName: newBoxName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };

  // === सिर्फ _id से पहचानें ===
  const addToCart = item => {
    const exists = cartItems.find(i => i._id === item._id);
    let newItems;
    if (exists) {
      newItems = cartItems.map(i =>
        i._id === item._id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
      );
    } else {
      newItems = [...cartItems, { ...item, quantity: 1 }];
    }
    updateCartBackend(newItems);
  };

  const removeFromCart = _id => {
    const newItems = cartItems.filter(i => i._id !== _id);
    updateCartBackend(newItems);
  };

  const updateQuantity = (_id, quantity) => {
    if (quantity <= 0) return removeFromCart(_id);
    const newItems = cartItems.map(i =>
      i._id === _id ? { ...i, quantity } : i
    );
    updateCartBackend(newItems);
  };

  const clearCart = () => {
    setCartItems([]);
    setSubscriptionType("one-time");
    setBoxName("");
    if (token) {
      axios.put(
        "/api/cart",
        { items: [], subscriptionType: "one-time", boxName: "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };

  // Checkout function: boxName भी भेजें
  const checkout = async (orderDetails = {}) => {
    if (!token) return;
    await axios.post(
      "/api/orders",
      {
        ...orderDetails,
        items: cartItems,
        subscriptionType,
        boxName,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCartItems([]);
    setSubscriptionType("one-time");
    setBoxName("");
    clearCart();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems: updateCartBackend,
        addToCart,
        removeFromCart,
        updateQuantity,
        subscriptionType,
        setSubscriptionType,
        checkout,
        clearCart,
        loading,
        boxName,
        setBoxName,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
