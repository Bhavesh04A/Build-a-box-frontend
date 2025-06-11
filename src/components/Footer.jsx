import { FiFacebook, FiLinkedin, FiTwitter, FiYoutube } from "react-icons/fi";
import { Link } from "react-router-dom";
import categoriesData from "../data/categories";
import { useCategory } from "../context/CategoryContext";

export default function Footer() {
  const { setSelectedCategory } = useCategory();

  // Split categories for 2-column layout
  const mid = Math.ceil(categoriesData.length / 2);
  const catCol1 = categoriesData.slice(0, mid);
  const catCol2 = categoriesData.slice(mid);

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  return (
    <footer className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 text-[#023047] pt-6">
      {/* Social Section */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">You can find us at</h2>
        <div className="flex justify-center gap-5 mb-2">
          <a href="#" className="hover:text-blue-900 transition"><FiFacebook size={28} /></a>
          <a href="#" className="hover:text-blue-900 transition"><FiLinkedin size={28} /></a>
          <a href="#" className="hover:text-blue-900 transition"><FiTwitter size={28} /></a>
          <a href="#" className="hover:text-blue-900 transition"><FiYoutube size={28} /></a>
        </div>
      </div>
      {/* Main Grid */}
      <div className="max-w-6xl mx-auto w-full px-4 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 lg:gap-10 items-start">
          {/* Left: Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <span className="font-bold text-xl mb-1">Build-a-Box</span>
            <span className="text-sm font-medium text-center md:text-left">
              Build Your Perfect Snack Box<br />
              Choose from 100+ snacks and customize your box as you like.
            </span>
          </div>
          {/* Middle: Quick Links */}
          <div className="flex flex-col items-center">
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1 text-center">
              <li>
                <Link to="/" className="hover:underline" onClick={() => {
                  setSelectedCategory(null);
                  setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
                }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline">About Us</Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">Products</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">Contact</Link>
              </li>
            </ul>
          </div>
          {/* Categories Section: 2 columns, compact & centered */}
          <div className="flex flex-col items-center">
            <h3 className="font-semibold mb-2">Categories</h3>
            <div className="flex flex-row gap-4 md:gap-6">
              <ul className="space-y-1 text-center">
                {catCol1.map((cat) => (
                  <li key={cat.name}>
                    <button
                      className="hover:underline hover:text-blue-900 transition bg-transparent outline-none"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCategoryClick(cat.name)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
              <ul className="space-y-1 text-center">
                {catCol2.map((cat) => (
                  <li key={cat.name}>
                    <button
                      className="hover:underline hover:text-blue-900 transition bg-transparent outline-none"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCategoryClick(cat.name)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Right: Contact Us */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-semibold mb-2">Contact Us</h3>
            <div className="text-sm text-center md:text-right">
              123, Snack Street,<br />
              Food City, 110011<br />
              India
            </div>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="text-center text-[#1769aa] text-sm py-3 border-t border-blue-200 mt-2">
        © {new Date().getFullYear()} Build-a-Box. All rights reserved.
      </div>
    </footer>
  );
}
