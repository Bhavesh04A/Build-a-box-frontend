import { useState, useRef, useEffect } from "react";
import { FiMenu, FiX, FiShoppingBag, FiChevronDown, FiUser, FiLogOut, FiGrid } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCategory } from "../context/CategoryContext";

export default function Navbar() {
  const [showUser, setShowUser] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [userVisible, setUserVisible] = useState(0);
  const [loginVisible, setLoginVisible] = useState(0);

  const userTimeout = useRef();
  const loginTimeout = useRef();

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { search, setSearch, setSelectedCategory, selectedCategory } = useCategory();

  // User menu
  const userMenu = [
    {
      label: "Dashboard",
      icon: <FiGrid />,
      onClick: () => {
        if (user && user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    },
    {
      label: "Logout",
      icon: <FiLogOut />,
      onClick: () => {
        logout();
        navigate("/");
      },
    },
  ];
  useEffect(() => {
    let timers = [];
    if (showUser) {
      setUserVisible(0);
      userMenu.forEach((_, i) => {
        timers.push(setTimeout(() => setUserVisible((v) => v + 1), 60 * (i + 1)));
      });
    } else {
      setUserVisible(0);
    }
    return () => timers.forEach(clearTimeout);
  }, [showUser]);

  // Login menu
  const loginMenu = [
    { label: "Sign Up", onClick: () => navigate("/signup") },
    { label: "Admin Login", onClick: () => navigate("/admin-login") },
    { label: "User Login", onClick: () => navigate("/user-login") },
  ];
  useEffect(() => {
    let timers = [];
    if (showLogin) {
      setLoginVisible(0);
      loginMenu.forEach((_, i) => {
        timers.push(setTimeout(() => setLoginVisible((v) => v + 1), 60 * (i + 1)));
      });
    } else {
      setLoginVisible(0);
    }
    return () => timers.forEach(clearTimeout);
  }, [showLogin]);

  // Dropdown handlers
  const handleUserEnter = () => {
    clearTimeout(userTimeout.current);
    setShowUser(true);
  };
  const handleUserLeave = () => {
    userTimeout.current = setTimeout(() => setShowUser(false), 120);
  };
  const handleLoginEnter = () => {
    clearTimeout(loginTimeout.current);
    setShowLogin(true);
  };
  const handleLoginLeave = () => {
    loginTimeout.current = setTimeout(() => setShowLogin(false), 120);
  };

  // Mobile menu nav links with auto-close
  const navLinksMobile = (
    <>
      <Link
        to="/orders"
        className="relative flex items-center gap-1 font-medium text-[#023047] hover:text-[#1769aa]"
        onClick={() => setMobileMenu(false)}
      >
        <FiShoppingBag size={22} />
        <span>Your Orders</span>
      </Link>
      <Link
        to="/your-boxes"
        className="font-medium text-[#023047] hover:text-[#1769aa]"
        onClick={() => setMobileMenu(false)}
      >
        Your Boxes
      </Link>
      <Link
        to="/about"
        className="font-medium text-[#023047] hover:text-[#1769aa]"
        onClick={() => setMobileMenu(false)}
      >
        About
      </Link>
      <Link
        to="/contact"
        className="font-medium text-[#023047] hover:text-[#1769aa]"
        onClick={() => setMobileMenu(false)}
      >
        Contact
      </Link>
    </>
  );

  // Desktop nav links (no change)
  const navLinks = (
    <>
      <Link to="/orders" className="relative flex items-center gap-1 font-medium text-[#023047] hover:text-[#1769aa]">
        <FiShoppingBag size={22} />
        <span>Your Orders</span>
      </Link>
      <Link to="/your-boxes" className="font-medium text-[#023047] hover:text-[#1769aa]">Your Boxes</Link>
      <Link to="/about" className="font-medium text-[#023047] hover:text-[#1769aa]">About</Link>
      <Link to="/contact" className="font-medium text-[#023047] hover:text-[#1769aa]">Contact</Link>
    </>
  );

  return (
    <nav className="w-full bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 shadow z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-16">
        {/* Logo - Left */}
        <Link
          to="/"
          className="font-bold text-2xl text-[#023047] tracking-wide whitespace-nowrap mr-4"
          onClick={() => {
            setSelectedCategory(null);
            navigate("/");
          }}
        >
          Build-a-Box
        </Link>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden ml-auto text-[#023047]"
          onClick={() => setMobileMenu((prev) => !prev)}
          aria-label="Open Menu"
        >
          {mobileMenu ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex flex-1 items-center justify-between">
          {/* Center: Search Bar */}
          {selectedCategory ? (
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-5 h-10 rounded-full border border-[#43addf] focus:outline-none focus:ring-2 focus:ring-[#43addf] transition bg-white text-[#023047] shadow-sm text-base"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#43addf]">
                  <svg width="20" height="20" fill="none" stroke="currentColor"><path d="M19 19l-4-4m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1"></div>
          )}
          {/* Right Links */}
          <div className="flex items-center gap-6 ml-6">
            {navLinks}
            {/* User/Login */}
            {user ? (
              <div
                className="relative h-full flex items-center"
                onMouseEnter={handleUserEnter}
                onMouseLeave={handleUserLeave}
              >
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded hover:bg-[#e6f1fa] transition text-[#023047] font-medium h-full"
                  onClick={() => setShowUser((prev) => !prev)}
                  aria-expanded={showUser}
                >
                  <FiUser size={20} />
                  <span className="font-semibold">{user.name}</span>
                  <FiChevronDown size={16} />
                </button>
                <div
                  className={`
                    absolute right-0 top-full mt-2 w-44 bg-[#e3f2fd] border border-[#90caf9] shadow-xl rounded-xl z-50
                    transition-all duration-200 ease-out origin-top
                    ${showUser
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"}
                  `}
                >
                  <ul className="py-2">
                    {userMenu.map((item, i) => (
                      <li
                        key={item.label}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#bbdefb] text-[#023047] transition
                          transition-all duration-200
                          ${userVisible > i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                        `}
                        style={{ transitionDelay: `${i * 40 + 60}ms` }}
                        onClick={() => {
                          setShowUser(false);
                          item.onClick();
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div
                className="relative h-full flex items-center"
                onMouseEnter={handleLoginEnter}
                onMouseLeave={handleLoginLeave}
              >
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded hover:bg-[#e6f1fa] transition text-[#023047] font-medium h-full"
                  onClick={() => setShowLogin((prev) => !prev)}
                  aria-expanded={showLogin}
                >
                  <FiUser size={20} />
                  <span>Login</span>
                  <FiChevronDown size={16} />
                </button>
                <div
                  className={`
                    absolute right-0 top-full mt-2 w-48 bg-[#e3f2fd] border border-[#90caf9] shadow-xl rounded-xl z-50
                    transition-all duration-200 ease-out origin-top
                    ${showLogin
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"}
                  `}
                >
                  <ul className="py-2">
                    {loginMenu.map((item, i) => (
                      <li
                        key={item.label}
                        className={`
                          block px-4 py-2 rounded-lg hover:bg-[#bbdefb] text-[#023047] transition
                          transition-all duration-200
                          ${loginVisible > i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                        `}
                        style={{ transitionDelay: `${i * 40 + 60}ms` }}
                        onClick={() => {
                          setShowLogin(false);
                          item.onClick();
                        }}
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-[#e3f2fd] shadow-lg px-4 pb-4 pt-2 space-y-2">
          <div className="flex flex-col gap-3">
            {navLinksMobile}
            {user ? (
              <div className="flex flex-col gap-1 mt-2">
                <span className="font-semibold text-[#023047] flex items-center gap-2"><FiUser />{user.name}</span>
                {userMenu.map((item) => (
                  <button
                    key={item.label}
                    className="flex items-center gap-2 px-2 py-2 rounded hover:bg-[#bbdefb] text-[#023047] transition"
                    onClick={() => {
                      setMobileMenu(false);
                      item.onClick();
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-1 mt-2">
                {loginMenu.map((item) => (
                  <button
                    key={item.label}
                    className="block px-2 py-2 rounded hover:bg-[#bbdefb] text-[#023047] transition"
                    onClick={() => {
                      setMobileMenu(false);
                      item.onClick();
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
