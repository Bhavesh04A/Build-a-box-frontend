import React, { useRef, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import { useCategory } from "../context/CategoryContext";
import categoriesData from "../data/categories";
import SnackBoxBuilder from "../components/SnackBoxBuilder";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } }
};
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 80, damping: 12 } }
};

export default function Home() {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const productsRef = useRef(null);

  const NAVBAR_HEIGHT = 72;

  useEffect(() => {
    if (selectedCategory && productsRef.current) {
      const elementPosition = productsRef.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - NAVBAR_HEIGHT;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HeroSection />
      {!selectedCategory && (
        <div
          id="categories"
          className="max-w-7xl mx-auto w-full px-2 pt-6 pb-0 flex-1"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#023047] mb-6 sm:mb-8 text-center">
            Explore Categories
          </h2>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categoriesData.map((cat) => (
              <motion.button
                key={cat.name}
                variants={cardVariants}
                whileHover={{ scale: 1.07, boxShadow: "0 8px 32px #43addf33" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(cat.name)}
                className="flex flex-col items-center bg-transparent transition cursor-pointer group w-full"
                style={{ minHeight: 120 }}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-lg bg-white overflow-hidden border-2 border-[#43addf] group-hover:border-[#1769aa] transition mb-2 sm:mb-3 flex items-center justify-center">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="font-bold text-[#023047] text-sm sm:text-base md:text-lg mt-1 text-center">
                  {cat.name}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}

      {/* Category selected: SnackBoxBuilder with animation */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            ref={productsRef}
            key={selectedCategory}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            {/* Header: All Categories left, category name center */}
            <div className="max-w-7xl mx-auto pt-4 sm:pt-6 pb-2 flex flex-col sm:flex-row items-center" style={{ minHeight: 48 }}>
              {/* Left */}
              <div className="w-full sm:w-1/3 text-left mb-2 sm:mb-0">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-[#1769aa] font-semibold hover:underline px-2"
                >
                  ← All Categories
                </button>
              </div>
              {/* Center */}
              <div className="w-full sm:w-1/3 flex justify-center">
                <span className="text-[#023047] font-bold text-lg sm:text-xl text-center">
                  {selectedCategory}
                </span>
              </div>
              {/* Right */}
              <div className="w-full sm:w-1/3"></div>
            </div>
            {/* Products grid */}
            <SnackBoxBuilder />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
