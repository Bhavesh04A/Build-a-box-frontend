import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const BoxContext = createContext();

export function useBox() {
  return useContext(BoxContext);
}

export function BoxProvider({ children }) {
  const [box, setBox] = useState(() => {
    try {
      const saved = localStorage.getItem("snackBox");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("snackBox", JSON.stringify(box));
  }, [box]);

  // ==== सिर्फ _id से पहचानें ====
  const handleAddToBox = (product) => {
    setBox((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        toast.success(`${product.name} quantity increased!`);
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`${product.name} added to box!`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromBox = (product) => {
    setBox((prev) => prev.filter((item) => item._id !== product._id));
  };

  const handleIncrease = (product) => {
    setBox((prev) =>
      prev.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrease = (product) => {
    setBox((prev) =>
      prev
        .map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const value = {
    box,
    setBox,
    handleAddToBox,
    handleRemoveFromBox,
    handleIncrease,
    handleDecrease,
  };

  return <BoxContext.Provider value={value}>{children}</BoxContext.Provider>;
}
