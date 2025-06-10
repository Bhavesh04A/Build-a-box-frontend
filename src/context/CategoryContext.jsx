import { createContext, useContext, useState } from "react";
const CategoryContext = createContext();
export function useCategory() { return useContext(CategoryContext); }
export function CategoryProvider({ children }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory, search, setSearch }}>
      {children}
    </CategoryContext.Provider>
  );
}
