import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/AdminLogin";
import UserLogin from "./pages/UserLogin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { CategoryProvider } from "./context/CategoryContext";
import Checkout from "./pages/Checkout";
import BoxHistory from "./components/BoxHistory";
import Orders from "./pages/Orders";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const location = useLocation();

  return (
    <CategoryProvider>
      <div className="flex flex-col min-h-screen bg-[#f5faff]">
        <Navbar />
        <Toaster position="top-center" />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <About />
                </motion.div>
              } />
              <Route path="/contact" element={
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <Contact />
                </motion.div>
              } />
              <Route path="/orders" element={
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <Orders />
                </motion.div>
              } />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />

              <Route path="/user-login" element={<UserLogin />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/your-boxes"
                element={
                  <ProtectedRoute>
                    <BoxHistory />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </AnimatePresence>
        </main>
        {location.pathname === "/" && <Footer />}
      </div>
    </CategoryProvider>
  );
}

export default App;
